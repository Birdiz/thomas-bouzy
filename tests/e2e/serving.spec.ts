import { spawn } from 'node:child_process';
import { expect, test } from './fixtures.ts';

/**
 * scripts/serve-dist.mjs is what the container runs, so what it puts on the
 * wire is part of the deliverable — not a test harness detail. GitHub Pages
 * would have supplied caching and compression; a process on Railway supplies
 * whatever we wrote, which is why these are asserted.
 */

const SECURITY_HEADERS = [
  'content-security-policy',
  'x-content-type-options',
  'x-frame-options',
  'referrer-policy',
  'permissions-policy',
  'cross-origin-opener-policy',
  'cross-origin-resource-policy',
  'strict-transport-security',
];

test('sends the security headers on every response', async ({ request }) => {
  for (const path of ['/', '/fr/', '/does-not-exist']) {
    const headers = (await request.get(path)).headers();
    for (const name of SECURITY_HEADERS) {
      expect(headers[name], `${name} missing on ${path}`).toBeTruthy();
    }
    expect(headers['x-content-type-options']).toBe('nosniff');
  }
});

test('pins every inline script in the CSP instead of allowing unsafe-inline', async ({
  page,
  request,
}) => {
  const csp = (await request.get('/')).headers()['content-security-policy'] ?? '';
  // Both script-src and style-src are hash-only: no 'unsafe-inline' anywhere.
  expect(csp).not.toContain("'unsafe-inline'");
  expect(csp).toMatch(/script-src 'self' 'sha256-/);
  expect(csp).toMatch(/style-src 'self' 'sha256-/);
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("base-uri 'none'");

  // And the policy must not break the page it protects.
  const violations: string[] = [];
  page.on('console', (m) => {
    if (/content security policy|refused to/i.test(m.text())) violations.push(m.text());
  });
  page.on('pageerror', (e) => violations.push(`pageerror: ${e.message}`));

  await page.goto('/');
  await page.getByRole('button', { name: 'Show phone number' }).click();
  await expect(page.getByRole('link', { name: '06 32 13 45 47' })).toBeVisible();
  expect(violations).toEqual([]);
});

test('compresses text and leaves already-packed formats alone', async ({ request }) => {
  for (const path of ['/', '/fr/']) {
    const headers = (await request.get(path)).headers();
    expect(headers['content-encoding'], `${path} not compressed`).toMatch(/br|gzip/);
    expect(headers.vary).toContain('Accept-Encoding');
  }
  // A PDF is already compressed; re-encoding it only burns CPU.
  const pdf = (await request.get('/assets/cv-thomas-bouzy-en.pdf')).headers();
  expect(pdf['content-encoding']).toBeUndefined();
});

test('caches fingerprinted assets hard and HTML not at all', async ({ page, request }) => {
  await page.goto('/');
  const hashed = await page.evaluate(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="stylesheet"]');
    return link ? new URL(link.href).pathname : null;
  });

  const html = (await request.get('/')).headers()['cache-control'];
  expect(html).toContain('must-revalidate');

  if (hashed?.startsWith('/_astro/')) {
    expect((await request.get(hashed)).headers()['cache-control']).toContain('immutable');
  }
  const font = (await request.get('/fonts/figtree-latin-700-normal.woff2')).headers();
  expect(font['cache-control']).toContain('immutable');
});

test('serves a real 404 page, with a 404 status', async ({ page, request }) => {
  const response = await request.get('/definitely-not-a-page');
  expect(response.status()).toBe(404);
  expect(response.headers()['content-type']).toContain('text/html');
  expect(response.headers()['cache-control']).toContain('no-store');

  await page.goto('/definitely-not-a-page');
  await expect(page.getByRole('heading', { name: 'Nothing here' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to the résumé' })).toBeVisible();
});

test('refuses to serve anything outside the site root', async ({ request }) => {
  for (const path of ['/../package.json', '/..%2Fpackage.json', '/%2e%2e/package.json']) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect([404, 400], `${path} returned ${response.status()}`).toContain(response.status());
  }
});

test('answers a malformed URL with 400 and keeps serving', async ({ request }) => {
  // `GET /%` used to end the deploy. decodeURIComponent threw inside an async
  // handler, Node saw an unhandled rejection and exited; Railway's restart
  // policy then had three tries before giving up. The status matters less than
  // the line after the loop: the process is still there.
  for (const path of ['/%', '/%zz', '/%E0%A4%A', '/fr/%%']) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), `${path} returned ${response.status()}`).toBe(400);
  }

  expect((await request.get('/')).status()).toBe(200);
});

test('serves one URL per page, and 301s the other spellings', async ({ baseURL, request }) => {
  const redirects: Record<string, string> = {
    '/index.html': '/',
    '/fr': '/fr/',
    '/fr/index.html': '/fr/',
    '/fr//': '/fr/',
    '//fr/': '/fr/',
    '///': '/',
  };

  for (const [from, to] of Object.entries(redirects)) {
    // Absolute, not relative: a path starting with `//` is a protocol-relative
    // URL to any URL parser, so `request.get('//fr/')` would resolve to the host
    // `fr`. That is the same trap the server itself had to stop falling into.
    const response = await request.get(`${baseURL}${from}`, { maxRedirects: 0 });
    expect(response.status(), `${from} was not redirected`).toBe(301);

    const target = new URL(response.headers().location ?? '', baseURL);
    expect(target.pathname).toBe(to);

    // One hop, not a chain: the target must answer, not redirect again.
    const followed = await request.get(target.href, { maxRedirects: 0 });
    expect(followed.status(), `${from} -> ${to} redirected again`).toBe(200);
  }

  // The canonical spellings still answer directly.
  for (const path of ['/', '/fr/']) {
    expect((await request.get(path, { maxRedirects: 0 })).status()).toBe(200);
  }
});

test('keeps the query string across a normalising redirect', async ({ request }) => {
  const response = await request.get('/fr?utm_source=x', { maxRedirects: 0 });
  expect(response.status()).toBe(301);
  expect(response.headers().location).toContain('/fr/?utm_source=x');
});

test('revalidates with a 304 instead of resending the document', async ({ request }) => {
  const first = await request.get('/');
  const etag = first.headers().etag ?? '';
  const lastModified = first.headers()['last-modified'] ?? '';
  expect(etag, 'no ETag to revalidate against').toBeTruthy();

  const byEtag = await request.get('/', { headers: { 'If-None-Match': etag } });
  expect(byEtag.status()).toBe(304);
  expect((await byEtag.body()).length).toBe(0);

  const byDate = await request.get('/', { headers: { 'If-Modified-Since': lastModified } });
  expect(byDate.status()).toBe(304);

  // A stale validator still gets the document.
  const stale = await request.get('/', { headers: { 'If-None-Match': '"stale"' } });
  expect(stale.status()).toBe(200);
});

test('gives each encoding its own strong validator', async ({ request }) => {
  // Weak validators are correct HTTP for one-tag-per-file, and useless behind a
  // CDN: Cloudflare drops them, so nothing revalidates and every repeat view
  // refetches the document. One strong tag per representation is both more
  // correct and something a CDN carries.
  const tagFor = async (encoding: string) =>
    (await request.get('/', { headers: { 'Accept-Encoding': encoding } })).headers().etag;

  const [identity, gzip, brotli] = await Promise.all([
    tagFor('identity'),
    tagFor('gzip'),
    tagFor('br'),
  ]);

  for (const [name, tag] of [
    ['identity', identity],
    ['gzip', gzip],
    ['br', brotli],
  ] as const) {
    expect(tag, `${name} has no ETag`).toBeTruthy();
    expect(tag, `${name} ETag is weak`).not.toMatch(/^W\//);
  }
  expect(new Set([identity, gzip, brotli]).size, 'encodings share one ETag').toBe(3);

  // And each one still revalidates against its own representation.
  const revalidated = await request.get('/', {
    headers: { 'Accept-Encoding': 'br', 'If-None-Match': brotli ?? '' },
  });
  expect(revalidated.status()).toBe(304);
});

/**
 * Runs a second copy of the server with SITE_INDEXABLE=true and hands its
 * origin to `body`.
 *
 * The suite's own server is built without the flag, which is the state the site
 * deploys in today — so every response there carries `noindex, nofollow` and an
 * assertion about PDFs would pass whether or not the rule exists. That is the
 * failure docs/adr/0006 already recorded once: an assertion satisfied by a
 * missing measurement is not a test. The guarantee only becomes observable in
 * the state the site is heading for, so the test creates it.
 */
async function withIndexableServer(workerIndex: number, body: (origin: string) => Promise<void>) {
  const port = 4400 + workerIndex;
  const server = spawn('node', ['scripts/serve-dist.mjs', '--port', String(port)], {
    env: { ...process.env, SITE_INDEXABLE: 'true', PORT: String(port) },
    stdio: 'ignore',
  });
  try {
    const origin = `http://localhost:${port}`;
    const deadline = Date.now() + 20_000;
    for (;;) {
      try {
        await fetch(origin, { signal: AbortSignal.timeout(1_000) });
        break;
      } catch {
        if (Date.now() > deadline) throw new Error(`indexable server never came up on ${port}`);
        await new Promise((r) => setTimeout(r, 100));
      }
    }
    await body(origin);
  } finally {
    server.kill('SIGTERM');
  }
}

test('keeps the CV PDFs out of the index even once the site is indexable', async () => {
  // The PDFs carry a phone number and a street-level location that the page
  // deliberately withholds — the number never reaches the HTML source at all
  // (docs/adr/0005). A crawler does not "download" a PDF, it GETs it like any
  // document, and search engines extract the text: indexed, the CV would make
  // both answerable by a search query. See docs/design-deltas.md.
  await withIndexableServer(test.info().workerIndex, async (origin) => {
    // The flag really is on: the page itself is now indexable.
    const page = await fetch(`${origin}/`);
    expect(page.status).toBe(200);
    expect(page.headers.get('x-robots-tag')).toBeNull();

    for (const locale of ['en', 'fr']) {
      const pdf = await fetch(`${origin}/assets/cv-thomas-bouzy-${locale}.pdf`);
      expect(pdf.status).toBe(200);
      expect(pdf.headers.get('content-type')).toBe('application/pdf');
      expect(
        pdf.headers.get('x-robots-tag'),
        `cv-thomas-bouzy-${locale}.pdf is indexable`,
      ).toContain('noindex');
    }
  });
});

test('tells crawlers to stay away while the hostname is not the canonical one', async ({
  request,
}) => {
  // The e2e suite builds without SITE_INDEXABLE, which is the state the site
  // deploys in until the custom domain is live — so this asserts the guard is
  // wired end to end: header, robots.txt and the page itself.
  expect((await request.get('/')).headers()['x-robots-tag']).toBe('noindex, nofollow');

  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('Disallow: /');

  for (const path of ['/', '/fr/']) {
    expect(await (await request.get(path)).text()).toContain('name="robots" content="noindex');
  }
});

test('answers methods it does not implement with 405', async ({ request }) => {
  const response = await request.post('/');
  expect(response.status()).toBe(405);
  expect(response.headers().allow).toBe('GET, HEAD');
});
