/**
 * The visit count: page views and clicks through to the booking page, counted
 * on the server and written to the log once a day (ADR 29).
 *
 * Every request already reaches scripts/serve-dist.mjs, which decides what it
 * is — a person reading a page, a click on "book a call", a program — and tells
 * this module. This module only counts, and keeps nothing that could single a
 * visitor out: page paths and numbers. No IP address, no user agent, no
 * identifier, no cookie, and no time of visit finer than the day, so that no
 * line can be laid next to a booking in cal.com to say who read what.
 *
 * It is a module of its own so that the counting can be tested against a clock
 * the test controls. The production image copies it next to the server.
 */

/** Days and times are Paris's: the log is read by someone who lives there. */
const TIME_ZONE = 'Europe/Paris';

/**
 * Distinct keys one tally may hold. Past it, a new key is counted under OTHER:
 * a scanner trying a thousand paths grows neither the memory nor the line.
 */
const MAX_KEYS = 40;
const OTHER = '(other)';

/**
 * A path answered 404 is kept only when it looks like an address of this site.
 * Anything else — an `@`, an encoded payload, a long probe — is counted under
 * OTHER, so a path cannot carry what a visitor typed about themselves into the
 * log.
 */
const PLAIN_PATH = /^\/[a-z0-9\-._/]{0,63}$/;

/** Words that programs put in their user agent and browsers never do. */
const PROGRAM =
  /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|embedly|scan|monitor|archiv|validator|inspection/i;

/**
 * Whether a request comes from a program rather than a person reading:
 * crawlers, link previews in chat apps, monitors, scripts.
 *
 * Every browser in use announces itself as `Mozilla/5.0 (…)`, and the programs
 * that borrow the prefix name themselves after it (`Googlebot`, `LinkedInBot`,
 * `HeadlessChrome`). A heuristic, and the counts say so: they are a person's
 * requests as far as a user agent can tell.
 *
 * The user agent is read to set this one flag and goes no further: it is never
 * counted, logged or kept.
 *
 * @param {string | undefined} userAgent
 */
export function isBot(userAgent = '') {
  return !userAgent.startsWith('Mozilla/5.0 (') || PROGRAM.test(userAgent);
}

/**
 * The path of the page a request came from, when it came from this site.
 *
 * Browsers send the full address only between pages of the same origin (the
 * site's `strict-origin-when-cross-origin` referrer policy): the path is then
 * one of our own pages, which says nothing about the visitor. Another site's
 * address is never returned, and never kept.
 *
 * @param {string | undefined} referer the request's Referer header
 * @param {string | undefined} host the request's Host header
 * @returns {string | null} null when the request did not come from this site
 */
export function referringPath(referer, host) {
  if (!referer || !host) return null;
  let url;
  try {
    url = new URL(referer);
  } catch {
    return null;
  }
  return url.host === host.toLowerCase() ? url.pathname : null;
}

const DATE = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
const CLOCK = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/**
 * @param {Intl.DateTimeFormat} format
 * @param {Date} at
 */
function fieldsOf(format, at) {
  /** @type {Record<string, string>} */
  const fields = {};
  for (const { type, value } of format.formatToParts(at)) fields[type] = value;
  return fields;
}

/**
 * The Paris date of an instant, as YYYY-MM-DD. Assembled from parts rather than
 * read off a locale's short format, which ICU has changed under our feet before.
 *
 * @param {Date} at
 */
export function dayOf(at) {
  const { year, month, day } = fieldsOf(DATE, at);
  return `${year}-${month}-${day}`;
}

/** @param {Date} at the Paris time of day, as HH:MM */
function clockOf(at) {
  const { hour, minute } = fieldsOf(CLOCK, at);
  return `${hour}:${minute}`;
}

/**
 * @typedef {Map<string, number>} Counts
 *
 * @typedef {object} Tally
 * @property {string} day      the Paris date it counts, YYYY-MM-DD
 * @property {string} from     when counting started that day, HH:MM Paris time
 * @property {Counts} views    page views, by page
 * @property {Counts} arrivals page views that did not come from another page of the site
 * @property {Counts} bookings clicks through to the booking page, by the page they came from
 * @property {Counts} notFound pages asked for and answered 404, by path
 * @property {number} bots     requests from programs that would otherwise have been counted
 */

/**
 * @param {string} day
 * @param {string} from
 * @returns {Tally}
 */
function open(day, from) {
  return {
    day,
    from,
    views: new Map(),
    arrivals: new Map(),
    bookings: new Map(),
    notFound: new Map(),
    bots: 0,
  };
}

/** @param {Counts} counts */
const total = (counts) => [...counts.values()].reduce((sum, n) => sum + n, 0);

/**
 * @param {number} n
 * @param {string} noun
 */
const count = (n, noun) => `${n} ${noun}${n === 1 ? '' : 's'}`;

/** Largest first: the line is read by eye. @param {Counts} counts */
const ranked = (counts) => Object.fromEntries([...counts].sort(([, a], [, b]) => b - a));

/**
 * @param {Counts} counts
 * @param {string} key
 */
function bump(counts, key) {
  const slot = counts.has(key) || counts.size < MAX_KEYS ? key : OTHER;
  counts.set(slot, (counts.get(slot) ?? 0) + 1);
}

/**
 * One tally per Paris day, written as a single JSON line when the day ends and
 * when the process stops. Railway parses a JSON line: `message` is what its log
 * explorer shows, and every other field can be filtered on, `@event:visits`.
 *
 * @param {object} [options]
 * @param {() => Date} [options.now] the clock; tests pass their own
 * @param {(line: string) => void} [options.log] where a day's line goes
 */
export function createVisitCount({ now = () => new Date(), log = console.log } = {}) {
  const started = now();
  let tally = open(dayOf(started), clockOf(started));

  /** @param {string} to when this tally stops, HH:MM Paris time */
  function write(to) {
    const { day, from, views, arrivals, bookings, notFound, bots } = tally;
    const totals = {
      arrivals: total(arrivals),
      views: total(views),
      bookings: total(bookings),
      notFound: total(notFound),
      bots,
    };
    log(
      JSON.stringify({
        level: 'info',
        message:
          `Visits on ${day}, ${from}–${to}: ${count(totals.arrivals, 'arrival')}, ` +
          `${count(totals.views, 'page view')}, ${count(totals.bookings, 'booking click')} ` +
          `(${totals.notFound} not found, ${bots} from bots)`,
        event: 'visits',
        day,
        from,
        to,
        ...totals,
        viewsByPage: ranked(views),
        arrivalsByPage: ranked(arrivals),
        bookingsByPage: ranked(bookings),
        notFoundByPath: ranked(notFound),
      }),
    );
  }

  /**
   * Closes the day once Paris has moved on to the next one. Run before every
   * count, so a view at 00:00:05 lands on the right day even if the minute
   * timer has not fired yet.
   */
  function roll() {
    const day = dayOf(now());
    if (day === tally.day) return;
    write('24:00');
    tally = open(day, '00:00');
  }

  return {
    /**
     * A person reading a page.
     *
     * @param {string} path the page, as the server spells it
     * @param {boolean} arrival true when they did not come from another page of the site
     */
    view(path, arrival) {
      roll();
      bump(tally.views, path);
      if (arrival) bump(tally.arrivals, path);
    },

    /**
     * A click through to the booking page.
     *
     * @param {string} from the page it came from, or a label in parentheses
     */
    booking(from) {
      roll();
      bump(tally.bookings, from);
    },

    /** @param {string} path a page asked for and answered 404 */
    notFound(path) {
      roll();
      bump(tally.notFound, PLAIN_PATH.test(path) ? path : OTHER);
    },

    /** A program, where a person would have been counted. */
    bot() {
      roll();
      tally.bots += 1;
    },

    /** Closes the day if it is over. The server runs it every minute. */
    tick() {
      roll();
    },

    /** Writes the day so far, before the process goes away. */
    flush() {
      roll();
      const at = now();
      write(clockOf(at));
      tally = open(dayOf(at), clockOf(at));
    },
  };
}
