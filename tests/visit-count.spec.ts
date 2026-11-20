import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { type IncomingHttpHeaders, request } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createVisitCount, isBot, referringPath } from '../scripts/visit-count.mjs';
import { CONTACT } from '../src/site.ts';

/**
 * The visit count (ADR 29). The tally is tested against a clock the test
 * moves; the server is run as Railway runs it, against a small site of its
 * own, and read from the outside: requests in, the line it logs on shutdown.
 */

/** One day's line, as Railway receives it. */
interface VisitsLine {
  level: string;
  message: string;
  event: string;
  day: string;
  from: string;
  to: string;
  arrivals: number;
  views: number;
  bookings: number;
  notFound: number;
  bots: number;
  viewsByPage: Record<string, number>;
  arrivalsByPage: Record<string, number>;
  bookingsByPage: Record<string, number>;
  notFoundByPath: Record<string, number>;
}

/** A tally on a clock the test sets, and the lines it writes. */
function countFrom(start: string) {
  let clock = new Date(start);
  const lines: VisitsLine[] = [];
  const visits = createVisitCount({
    now: () => clock,
    log: (line) => lines.push(JSON.parse(line)),
  });
  const at = (instant: string) => {
    clock = new Date(instant);
  };
  return { visits, lines, at };
}

describe('the daily tally', () => {
  it('writes one line for the Paris day, holding paths and numbers and nothing else', () => {
    const { visits, lines, at } = countFrom('2026-11-21T09:00:00Z'); // 10:00 in Paris
    visits.view('/', true);
    visits.view('/offres/audit/', false);
    visits.view('/offres/audit/', true);
    visits.booking('/offres/audit/');
    visits.booking('(direct)');
    visits.notFound('/tarifs/');
    visits.bot();
    expect(lines).toEqual([]);

    at('2026-11-21T23:00:30Z'); // 00:00:30 on the 22nd, in Paris
    visits.tick();
    // toEqual, not toMatchObject: a field added to the line, an address or a
    // user agent, fails here before it reaches a log.
    expect(lines).toEqual([
      {
        level: 'info',
        message:
          'Visits on 2026-11-21, 10:00–24:00: 2 arrivals, 3 page views, 2 booking clicks (1 not found, 1 from bots)',
        event: 'visits',
        day: '2026-11-21',
        from: '10:00',
        to: '24:00',
        arrivals: 2,
        views: 3,
        bookings: 2,
        notFound: 1,
        bots: 1,
        viewsByPage: { '/offres/audit/': 2, '/': 1 },
        arrivalsByPage: { '/': 1, '/offres/audit/': 1 },
        bookingsByPage: { '/offres/audit/': 1, '(direct)': 1 },
        notFoundByPath: { '/tarifs/': 1 },
      },
    ]);
  });

  it("closes the day at Paris's midnight, in winter time and in summer time", () => {
    for (const [lastMinute, midnight, day, next] of [
      ['2026-11-21T22:59:00Z', '2026-11-21T23:00:00Z', '2026-11-21', '2026-11-22'],
      ['2026-07-01T21:59:00Z', '2026-07-01T22:00:00Z', '2026-07-01', '2026-07-02'],
    ] as const) {
      const { visits, lines, at } = countFrom(lastMinute);
      visits.view('/', true);
      at(midnight);
      // No tick in between: the view rolls the day over itself.
      visits.view('/a-propos/', true);
      visits.flush();
      expect(lines).toMatchObject([
        { day, from: '23:59', to: '24:00', viewsByPage: { '/': 1 } },
        { day: next, from: '00:00', to: '00:00', viewsByPage: { '/a-propos/': 1 } },
      ]);
    }
  });

  it('writes a line for a day nobody visited, so that silence never reads as a crash', () => {
    const { visits, lines, at } = countFrom('2026-11-21T12:00:00Z');
    at('2026-11-22T12:00:00Z');
    visits.tick();
    expect(lines).toMatchObject([{ day: '2026-11-21', arrivals: 0, views: 0, bookings: 0 }]);
  });

  it('writes the day so far when the process stops, then counts afresh', () => {
    const { visits, lines, at } = countFrom('2026-11-21T08:15:00Z'); // 09:15 in Paris
    visits.booking('/');
    at('2026-11-21T14:42:00Z');
    visits.flush();
    visits.view('/', true);
    at('2026-11-21T15:00:00Z');
    visits.flush();
    expect(lines).toMatchObject([
      { day: '2026-11-21', from: '09:15', to: '15:42', bookings: 1, views: 0 },
      { day: '2026-11-21', from: '15:42', to: '16:00', bookings: 0, views: 1 },
    ]);
  });

  it('keeps a path answered 404 only when it reads like an address of this site', () => {
    const { visits, lines } = countFrom('2026-11-21T09:00:00Z');
    visits.notFound('/tarifs/');
    visits.notFound('/prenom.nom@example.com/');
    visits.notFound(`/${'a'.repeat(80)}/`);
    visits.notFound('/%3Cscript%3E/');
    visits.flush();
    expect(lines[0]?.notFoundByPath).toEqual({ '/tarifs/': 1, '(other)': 3 });
  });

  it('caps the paths it holds, and still counts every request', () => {
    const { visits, lines } = countFrom('2026-11-21T09:00:00Z');
    for (let i = 0; i < 100; i += 1) visits.notFound(`/probe-${i}/`);
    visits.flush();
    const kept = lines[0]?.notFoundByPath ?? {};
    expect(Object.keys(kept)).toHaveLength(41);
    expect(kept['(other)']).toBe(60);
    expect(lines[0]?.notFound).toBe(100);
  });
});

describe('telling people from programs', () => {
  it.each([
    [
      'Chrome on Windows',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    ],
    [
      'Safari on an iPhone',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1',
    ],
    ['Firefox on Linux', 'Mozilla/5.0 (X11; Linux x86_64; rv:132.0) Gecko/20100101 Firefox/132.0'],
    [
      "LinkedIn's in-app browser",
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [LinkedInApp]/9.30.1234',
    ],
  ])('counts %s as a person', (_name, userAgent) => {
    expect(isBot(userAgent)).toBe(false);
  });

  it.each([
    ['Googlebot', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'],
    [
      "LinkedIn's link preview",
      'LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)',
    ],
    [
      "Facebook's link preview",
      'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    ],
    ["WhatsApp's link preview", 'WhatsApp/2.24.21.80 A'],
    ["Slack's link preview", 'Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)'],
    [
      'headless Chrome',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/130.0.0.0 Safari/537.36',
    ],
    ['curl', 'curl/8.7.1'],
    ['no user agent at all', ''],
  ])('counts %s as a program', (_name, userAgent) => {
    expect(isBot(userAgent)).toBe(true);
  });
});

describe('where a request came from', () => {
  it('names the page of this site it came from', () => {
    expect(
      referringPath('https://thomasbouzy.dev/offres/audit/?utm_source=x', 'thomasbouzy.dev'),
    ).toBe('/offres/audit/');
  });

  it('names nothing else: another site, another port, a malformed header, none', () => {
    expect(referringPath('https://www.linkedin.com/feed/', 'thomasbouzy.dev')).toBeNull();
    expect(referringPath('http://localhost:4322/', 'localhost:4323')).toBeNull();
    expect(referringPath('not a url', 'thomasbouzy.dev')).toBeNull();
    expect(referringPath(undefined, 'thomasbouzy.dev')).toBeNull();
  });
});

describe('the server', () => {
  /** The name the server counts under; a request sent to any other is not a visit. */
  const DOMAIN = 'site.example';
  const BROWSER =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

  let root = '';

  beforeAll(() => {
    root = mkdtempSync(join(tmpdir(), 'visit-count-'));
    for (const [file, title] of [
      ['index.html', 'Accueil'],
      ['offres/audit/index.html', 'Audit'],
      ['en/index.html', 'Home'],
      ['404.html', 'Rien ici'],
    ] as const) {
      mkdirSync(dirname(join(root, file)), { recursive: true });
      writeFileSync(join(root, file), `<!doctype html><title>${title}</title><h1>${title}</h1>`);
    }
  });

  afterAll(() => {
    rmSync(root, { recursive: true, force: true });
  });

  interface Server {
    port: number;
    /** Stops it as Railway does, with SIGTERM, and returns everything it printed. */
    stop(): Promise<string>;
  }

  function serve(): Promise<Server> {
    const child = spawn(process.execPath, ['scripts/serve-dist.mjs', '--root', root], {
      env: { ...process.env, PORT: '0', HOST: '127.0.0.1', SITE_DOMAIN: DOMAIN },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (chunk: string) => {
      output += chunk;
    });
    const closed = new Promise<string>((resolve) => child.on('close', () => resolve(output)));

    return new Promise((resolve, reject) => {
      child.stdout.on('data', (chunk: string) => {
        output += chunk;
        const port = /on http:\/\/127\.0\.0\.1:(\d+)/.exec(output)?.[1];
        if (port) {
          resolve({
            port: Number(port),
            stop: () => {
              child.kill('SIGTERM');
              return closed;
            },
          });
        }
      });
      closed.then(() => reject(new Error(`The server stopped before listening:\n${output}`)));
    });
  }

  interface Answer {
    status: number;
    headers: IncomingHttpHeaders;
  }

  /** A request as a browser sends it to the site, unless the headers say otherwise. */
  function ask(
    server: Server,
    path: string,
    headers: Record<string, string> = {},
    method = 'GET',
  ): Promise<Answer> {
    return new Promise((resolve, reject) => {
      const outgoing = request(
        {
          host: '127.0.0.1',
          port: server.port,
          path,
          method,
          headers: { host: DOMAIN, 'user-agent': BROWSER, accept: 'text/html', ...headers },
        },
        (response) => {
          response.resume();
          response.on('end', () =>
            resolve({ status: response.statusCode ?? 0, headers: response.headers }),
          );
        },
      );
      outgoing.on('error', reject);
      outgoing.end();
    });
  }

  /** The one line the server logged for the day. */
  function visitsLine(output: string): VisitsLine {
    const lines = output.split('\n').filter((line) => line.includes('"event":"visits"'));
    expect(lines, output).toHaveLength(1);
    return JSON.parse(lines[0] ?? '{}');
  }

  it('sends the booking link on to cal.com, never from a cache, and counts the click', async () => {
    const server = await serve();
    const answer = await ask(server, CONTACT.booking);
    expect(answer.status).toBe(302);
    expect(answer.headers.location).toBe('https://cal.com/thomas-bouzy/30min');
    expect(answer.headers['cache-control']).toBe('no-store');
    expect(visitsLine(await server.stop())).toMatchObject({
      bookings: 1,
      bookingsByPage: { '(direct)': 1 },
    });
  });

  it('counts views, arrivals, booking clicks by page and dead ends, and programs apart', async () => {
    const server = await serve();
    const from = (path: string) => ({ referer: `http://${DOMAIN}${path}` });
    const elsewhere = { referer: 'https://www.linkedin.com/' };

    await ask(server, '/');
    await ask(server, '/offres/audit/', from('/'));
    await ask(server, '/en/', elsewhere);
    await ask(server, CONTACT.booking, from('/offres/audit/'));
    await ask(server, CONTACT.booking);
    await ask(server, CONTACT.booking, elsewhere);
    await ask(server, '/nulle-part/');
    await ask(server, '/', { 'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' });
    await ask(server, CONTACT.booking, { 'user-agent': 'curl/8.7.1' });

    // None of these is a visit.
    await ask(server, '/', { host: 'localhost' });
    await ask(server, '/', { host: 'healthcheck.railway.app' });
    await ask(server, '/', {}, 'HEAD');
    await ask(server, '/offres/audit/', { 'sec-purpose': 'prefetch' });
    await ask(server, '/404.html');
    await ask(server, '/favicon.ico', { accept: 'image/*' });

    expect(visitsLine(await server.stop())).toMatchObject({
      arrivals: 2,
      views: 3,
      bookings: 3,
      notFound: 1,
      bots: 2,
      viewsByPage: { '/': 1, '/offres/audit/': 1, '/en/': 1 },
      arrivalsByPage: { '/': 1, '/en/': 1 },
      bookingsByPage: { '/offres/audit/': 1, '(direct)': 1, '(external)': 1 },
      notFoundByPath: { '/nulle-part/': 1 },
    });
  });

  it('counts a revalidation as a view: the visitor is looking at the page', async () => {
    const server = await serve();
    const first = await ask(server, '/');
    const again = await ask(server, '/', { 'if-none-match': String(first.headers.etag) });
    expect(again.status).toBe(304);
    expect(visitsLine(await server.stop())).toMatchObject({ views: 2, arrivals: 2 });
  });

  it('keeps no address and no user agent', async () => {
    const server = await serve();
    const forwarded = {
      'x-forwarded-for': '203.0.113.7',
      'cf-connecting-ip': '203.0.113.7',
      'x-real-ip': '203.0.113.7',
    };
    await ask(server, '/', forwarded);
    await ask(server, CONTACT.booking, forwarded);
    const output = await server.stop();
    expect(visitsLine(output)).toMatchObject({ views: 1, bookings: 1 });
    expect(output).not.toContain('203.0.113');
    expect(output).not.toContain('Chrome/130');
  });

  it('ships every module it imports in the runtime image', () => {
    // The runtime stage copies files one by one (ADR 7). A module left out
    // would pass every test here and crash the container on start.
    const source = readFileSync('scripts/serve-dist.mjs', 'utf8');
    const dockerfile = readFileSync('Dockerfile', 'utf8');
    const modules = [...source.matchAll(/from '\.\/([^']+)'/g)].map((match) => match[1]);
    expect(modules).toContain('visit-count.mjs');
    for (const name of modules) {
      expect(dockerfile, `${name} is not copied`).toContain(
        `/app/scripts/${name} ./scripts/${name}`,
      );
    }
  });
});
