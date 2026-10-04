import { expect, test } from './fixtures.ts';

const PATHS = ['/', '/fr/'] as const;

/** Every same-origin URL the page asks the browser to fetch or offers to open. */
async function collectUrls(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const urls = new Set<string>();
    const add = (value: string | null) => {
      if (!value) return;
      const url = new URL(value, location.href);
      if (url.origin !== location.origin) return;
      urls.add(url.pathname + url.search);
    };

    for (const el of document.querySelectorAll<HTMLAnchorElement>('a[href]')) {
      if (/^(mailto|tel):/i.test(el.getAttribute('href') ?? '')) continue;
      add(el.getAttribute('href'));
    }
    for (const el of document.querySelectorAll('link[href]')) add(el.getAttribute('href'));
    for (const el of document.querySelectorAll('script[src], img[src]'))
      add(el.getAttribute('src'));
    for (const el of document.querySelectorAll('img[srcset], source[srcset]')) {
      for (const part of (el.getAttribute('srcset') ?? '').split(',')) {
        add(part.trim().split(/\s+/)[0] ?? null);
      }
    }
    add(document.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? null);
    return [...urls];
  });
}

for (const path of PATHS) {
  test(`every link and asset referenced by ${path} resolves`, async ({ page, request }) => {
    await page.goto(path);
    const urls = await collectUrls(page);
    expect(urls.length).toBeGreaterThan(5);

    const broken: string[] = [];
    for (const url of urls) {
      // A bare fragment is the current document.
      const target = url.startsWith('#') ? path : url;
      const response = await request.get(target);
      if (!response.ok()) broken.push(`${url} -> ${response.status()}`);
    }
    expect(broken, `${path} references URLs that do not resolve`).toEqual([]);
  });
}

test('fonts are served from this origin, never from Google', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (req) => {
    const host = new URL(req.url()).host;
    if (host && !host.startsWith('localhost')) external.push(req.url());
  });

  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);

  // The design system's styles.css @imports fonts.googleapis.com. Self-hosting
  // is both a performance and a privacy decision — assert it stays that way.
  expect(external).toEqual([]);
  const woff2 = await page.evaluate(
    () => performance.getEntriesByType('resource').filter((e) => e.name.endsWith('.woff2')).length,
  );
  expect(woff2).toBeGreaterThan(0);
});

test('links no PDF, and the CV paths are gone', async ({ page, request }) => {
  // The CV left the site (ADR 11, postscript): LinkedIn carries the career, and
  // the PDF printed what the page withholds. A 404 here is the point, not a
  // broken link — nothing may point at these paths again.
  for (const locale of ['en', 'fr'] as const) {
    const response = await request.get(`/assets/cv-thomas-bouzy-${locale}.pdf`);
    expect(response.status()).toBe(404);
  }
  for (const path of PATHS) {
    await page.goto(path);
    await expect(page.locator('a[href$=".pdf"], a[download]')).toHaveCount(0);
  }
});

test('the sitemap lists both locales', async ({ request }) => {
  const index = await request.get('/sitemap-index.xml');
  expect(index.status()).toBe(200);

  const body = await (await request.get('/sitemap-0.xml')).text();
  expect(body).toMatch(/<loc>https:\/\/[^<]*\/<\/loc>/);
  expect(body).toMatch(/<loc>https:\/\/[^<]*\/fr\/<\/loc>/);
});

test('references no insecure absolute URL', async ({ request }) => {
  // The invariant that `upgrade-insecure-requests` would otherwise stand in for:
  // nothing on the page points at http://, so there is no mixed content to fix.
  // See the CSP comment in scripts/serve-dist.mjs.
  for (const path of ['/', '/fr/', '/404.html'] as const) {
    const html = await (await request.get(path)).text();
    const insecure = [...html.matchAll(/["'(](http:\/\/[^"')\s]+)/g)].map((m) => m[1]);
    expect(insecure, `${path} references an insecure URL`).toEqual([]);
  }
});
