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
  'referrer-policy',
  'permissions-policy',
  'cross-origin-opener-policy',
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
  expect(csp).not.toContain("'unsafe-inline' 'sha256"); // script-src must be hash-only
  expect(csp).toMatch(/script-src 'self' 'sha256-/);
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
  const font = (await request.get('/fonts/caprasimo-latin-400-normal.woff2')).headers();
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

test('answers methods it does not implement with 405', async ({ request }) => {
  const response = await request.post('/');
  expect(response.status()).toBe(405);
  expect(response.headers().allow).toBe('GET, HEAD');
});
