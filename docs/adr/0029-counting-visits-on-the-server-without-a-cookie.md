# 29. Counting visits on the server, without a cookie

- Status: accepted, implemented 2026-11-20
- Date: 2026-11-20
- Amends [ADR 7](0007-serving-the-site-ourselves-on-railway.md), whose server now
  counts and redirects, and
  [ADR 17](0017-offer-pages-public-prices-and-the-estimator.md), whose booking
  link now goes through that server

## Context

The site measured nothing. The marketing audit of 19 November 2026 could read
the site but never watch anyone read it, and it asked one question of a
measurement: how many readers book a call, and from which page. It set the
terms: no consent banner, no personal data. The site's own decisions add two
more: no request leaves the origin and no script is added to a page
([ADR 6](0006-budget-tests-instead-of-lighthouse-ci.md), ADR 17), and the
runtime carries no dependency (ADR 7). A third-party analytics tag breaks all
four.

The server sees only what Cloudflare forwards, so Cloudflare was measured
first, on 20 November 2026:

- HTML is held at the edge but revalidated with the server on every request
  (`cf-cache-status: REVALIDATED`): every request that reaches Cloudflare
  reaches the server.
- The browser is another matter. The zone's Browser Cache TTL, at its default
  of four hours, rewrites the server's `max-age=0, must-revalidate` into
  `max-age=14400`. Cloudflare documents that it replaces any lower `max-age`,
  and says nothing about `no-cache`. A browser that fetched a page in the last
  four hours shows it again without asking anyone.
- Redirects and 404s carry `no-store`. Cloudflare leaves that header alone and
  stores nothing (`cf-cache-status: BYPASS`).

The audit also found four addresses answering 404: `/offres/`, `/ateliers/`,
`/tarifs/` and `/contact/`.

## Decision

**The server counts, and nothing else does.** `scripts/serve-dist.mjs` decides
what a request is; `scripts/visit-count.mjs` keeps the tally. The runtime image
copies both, and ADR 7 still holds: Node built-ins only, no `node_modules`.

**Every booking button goes through `/rdv/`.** `CONTACT.booking` in
`src/site.ts` is now `/rdv/`, so every button that books a call links there
without a component changing. The server counts the click, then answers with a
302 to `https://cal.com/thomas-bouzy/30min` and `no-store`: neither Cloudflare
nor the browser can answer the next click in the server's place. The query
string is not passed on. It is still a plain link, never an embed (ADR 17).

**What is counted**, among GET requests sent to the site's own name:

| Count | What it is |
| --- | --- |
| Page views | A page of the build answered 200 or 304, by page |
| Arrivals | The page views that did not come from another page of the site (no same-origin `Referer`), by page. Every visit starts with one, so they stand in for visits without an identifier |
| Booking clicks | Requests for `/rdv/`, by the page they came from: `(direct)` without a `Referer` (typed, a QR code, an app, a browser that withholds it), `(external)` from another site |
| Not found | Navigations (`Accept: text/html`) answered 404, by path |
| Bots | Requests from programs that would otherwise have been counted |

**What is not counted:** requests under another name (localhost, the e2e suite,
Railway's healthcheck, which comes in under its own), `HEAD` (link checkers,
monitors), prefetches (`Sec-Purpose: prefetch`, a guess at a page nobody has
opened yet), assets, and `404.html` asked for by name. A request is a program's
when its user agent does not begin with `Mozilla/5.0 (`, which every browser in
use sends, or when it names itself a bot, a crawler, a preview or a headless
browser. That is a heuristic, and the line says "from bots" rather than
claiming more.

**What is kept: one line a day, and nothing per visit.** The tally lives in
memory. It is written as one JSON line at midnight, Paris time, and whenever
the process stops: a deploy's SIGTERM, Ctrl-C, a crash. The line holds the day,
the hours it covers, the totals and the counts by page. No IP address, no user
agent, no identifier, no cookie, no local storage, no script, no fingerprint,
and no time of visit finer than the day. Not even one line per request:
Railway stamps every log line to the millisecond, and on a site with a few
visits a day, a click logged at 10:04 sits right next to the call booked in
cal.com at 10:06.

- The `Referer` is read to tell an arrival from a move between pages, and to
  name the page a booking click came from. Only paths of this site's pages are
  kept; another site's address is never written.
- The user agent is read to set the bot flag, and goes no further.
- A path answered 404 is kept only when it reads like an address of the site
  (lowercase letters, digits, `-._/`, 64 characters at most). Anything else, an
  `@` among them, is counted as `(other)`, and no count holds more than 40
  distinct paths.

**Page views: the server counts the requests that reach it, and the caching
stays as it is.** Two other methods were weighed:

- *A beacon*, an image or a `navigator.sendBeacon` fired by every page, would
  see every view, cached or not. It adds a request to every page for measuring
  alone and a script or a tag to every layout, against the inline budget
  (ADR 6). It is also what the EDPB reads as "gaining access" to the terminal:
  information a page makes the browser send (Guidelines 2/2023 on the technical
  scope of Art. 5(3) of the ePrivacy Directive).
- *`no-cache` on HTML*, so that browsers revalidate on every view: Cloudflare
  does not document whether its Browser Cache TTL leaves it alone, and the gain
  would be a round trip added to every page, to count views of a page the
  reader already has.

What a page view therefore means: **a page fetched by a browser that had not
fetched it in the last four hours**, reloads included. A reader going from the
home page to an offer, back home and to the offer again in one morning counts
two views, not four. For the question asked, how many people read and how many
book, that is the better unit. It rests on a Cloudflare setting: set the
Browser Cache TTL to "Respect Existing Headers" and the server's `max-age=0`
reaches browsers. Every view is then counted, moves between pages included,
and a deploy reaches every reader at once, which ADR 7 intended all along.
Booking clicks are exact either way.

**Why it needs no consent.** Checked on 20 November 2026 against the CNIL's
guidelines on cookies and other trackers (délibération n° 2020-091 of
17 September 2020) and its recommendation (délibération n° 2020-092,
consolidated on 16 January 2026):

1. Article 82 of the loi Informatique et Libertés governs storing information
   in a user's terminal and reading information already stored there (§9):
   cookies, local storage, fingerprinting, identifiers of the system or the
   device (§13), whether or not the data are personal (§14). The count writes
   nothing to the terminal and reads nothing stored there. It uses what any
   browser sends to fetch any page, and keeps paths and numbers.
2. Read broadly, the way the EDPB reads "gaining access", it is still exempt.
   The CNIL holds audience measurement strictly necessary to running a site,
   and so free of consent (§50), on conditions (§51) that this meets one by
   one: a purpose limited to measuring this site's audience, for its publisher
   alone; no following a person across sites or apps, since there is no
   identifier to follow; anonymous statistics only, counts per day and page;
   nothing cross-referenced with other processing and nothing passed to a third
   party, since the line goes to the host's log and nowhere else.
3. Audience measurement that processes personal data falls under the GDPR
   (§52). This one keeps none: the IP address, the indirect identifier a request
   carries (§15), is never read by the count.
4. The recommendation adds good practice (§5): inform users, for instance in
   the privacy policy; keep trackers 13 months at most; keep what is collected
   25 months at most; review both periodically. It also notes that article 82
   itself does not require that information. The site has no privacy policy
   yet: one sentence belongs in it, or in the legal notice
   ([ADR 16](0016-the-legal-notice-and-a-number-meant-to-be-public.md)), when it
   is written. There is no tracker to expire, and Railway keeps logs 7 days on
   the Hobby plan and 30 days on Pro.

The CNIL's page on audience measurement tools (updated 4 July 2025) states the
same conditions. This is a reading of the texts, not a lawyer's opinion.

**Five addresses get a shortcut** to the section of the home page that answers
them: `/offres/` and `/tarifs/` to `/#offers` (the prices are on the offer
cards), `/ateliers/` to `/#workshops`, `/contact/` to `/#contact`, and
`/en/offers/` to `/en/#offers`. The last was not on the audit's list: it is the
parent of the English offer pages, the same dead end as `/offres/`. None of
them is in `src/routes.ts`. They answer 301 with `no-store`, like every other
redirect here, and before the canonical-spelling redirect, so `/offres` or
`/fr/offres/` take one hop. A query string is kept, ahead of the fragment. The
day the Workshops get a page of their own
([ADR 27](0027-software-engineer-and-the-workshops-as-the-way-in.md)), their
line goes.

## How to read the numbers

1. In Railway, open the **Observability** tab of the project. Its Log Explorer
   searches the whole environment, across deployments.
2. Filter on `@event:visits`. Each line reads like this: `Visits on
   2026-11-21, 00:00–24:00: 12 arrivals, 31 page views, 2 booking clicks (3 not
   found, 40 from bots)`.
3. A deploy or a restart splits a day into several lines, each giving the hours
   it covers: add them up. A gap between the end of one line and the start of
   the next is time the server was not running.
4. Open a line for the counts by page: `viewsByPage`, `arrivalsByPage`,
   `bookingsByPage` (the page each click came from) and `notFoundByPath`.
5. The ratio the audit asked for is **booking clicks ÷ arrivals**, over a week
   or a month: one day is too few visits to mean anything. A booking click is a
   click; cal.com says how many became calls.
6. Railway keeps logs 7 days on the Hobby plan and 30 days on Pro, so copy the
   lines out once a week. The CLI reads one deployment at a time, the latest by
   default, or the one whose ID it is given:
   `railway logs --since 1w --filter "@event:visits" --json`.

What the numbers cannot say: who, for how long, which section of a page, or a
page read again within four hours in the same browser. A browser that
withholds the `Referer` turns each of its views into an arrival. A program
that borrows a browser's user agent counts as a person.

## Consequences

- The site has its first audience figures, for no extra request, byte or
  banner.
- Every booking button is counted as long as it uses `CONTACT.booking`; one
  written with the cal.com address by hand would not be. The e2e link check
  skips the hop instead of following it to cal.com, and `serving.spec.ts`
  asserts where it leads.
- The server is no longer stateless: the day so far lives in memory, and a
  process killed outright, out of memory for instance, loses it. Acceptable for
  a trend; it would not be for an invoice.
- The server handles SIGTERM itself: it writes the day, stops taking requests
  and gives the ones in flight two seconds.
- With more than one replica, each would write its own lines: add them up.
- `tests/visit-count.spec.ts` holds the tally to a clock it moves (midnight in
  Paris, in winter and in summer time), runs the server against a site of its
  own to check what is counted and that no address or user agent reaches the
  log, and checks that the runtime image copies every module the server
  imports.
