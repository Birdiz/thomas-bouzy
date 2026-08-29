import { expect, test } from './fixtures.ts';

/**
 * A performance budget on the inputs, rather than a Lighthouse score.
 *
 * Lighthouse's own CLI drags in ten known vulnerabilities through its
 * chrome-launcher stack, and its performance score in a CI container is noisy
 * enough to be ignored within a month. These numbers are deterministic and fail
 * for a reason you can act on: someone added a library, re-added the Google
 * Fonts @import, or shipped an unoptimised image.
 *
 * Sizes are uncompressed; the wire is roughly a quarter of this after brotli.
 *
 * Re-measured on 2026-08-29, after the content was rebased on the pitch master
 * (two more project cards, four more Socios bullets, two more stat tiles):
 *   document  35.7 kB (EN) / 37.6 kB (FR)      css 25.3 kB
 *   external js 0 (nothing is external)        inline js 364 B
 *   fonts 43.6 kB (four faces)                 images 13.4 kB      6 requests
 * On the wire that FR document is 8.9 kB brotli — the growth is prose, and
 * prose compresses. The document limit moved 34 kB → 42 kB to match, keeping
 * the same ~4 kB of headroom the original left: about one more project card.
 *
 * The limit is raised only for content the résumé actually gained. It is not a
 * dial to turn when a library or an unoptimised asset pushes a number over —
 * that is the failure this file exists to produce.
 */
const BUDGET = {
  documentBytes: 42_000,
  cssBytes: 34_000,
  externalJsBytes: 4_000,
  inlineJsBytes: 2_000,
  fontBytes: 60_000,
  requests: 12,
} as const;

for (const path of ['/', '/fr/'] as const) {
  test(`${path} stays within the performance budget`, async ({ page }) => {
    const sizes = { document: 0, css: 0, js: 0, font: 0, image: 0, other: 0 };
    let requests = 0;

    // Measured from the body, not from `content-length`.
    //
    // scripts/serve-dist.mjs omits content-length on anything it compresses, and
    // Chromium always asks for brotli — so the header was absent on exactly the
    // three payloads this budget exists to watch. `document`, `css` and `js`
    // summed to zero and the assertions below passed no matter what shipped.
    // `response.body()` returns the decoded bytes, which is the unit the numbers
    // above are written in.
    const measured: Promise<void>[] = [];

    page.on('response', (response) => {
      if (!response.url().startsWith('http://localhost')) return;
      requests += 1;
      measured.push(
        (async () => {
          const type = response.headers()['content-type'] ?? '';
          let length: number;
          try {
            length = (await response.body()).length;
          } catch {
            return; // redirects and aborted requests carry no body
          }

          if (type.startsWith('text/html')) sizes.document += length;
          else if (type.startsWith('text/css')) sizes.css += length;
          else if (type.includes('javascript')) sizes.js += length;
          else if (type.startsWith('font/')) sizes.font += length;
          else if (type.startsWith('image/')) sizes.image += length;
          else sizes.other += length;
        })(),
      );
    });

    await page.goto(path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await Promise.all(measured);

    const inlineJs = await page.evaluate(() =>
      [...document.querySelectorAll('script:not([src])')]
        .filter((s) => s.getAttribute('type') !== 'application/ld+json')
        .reduce((total, s) => total + s.textContent.length, 0),
    );

    const report = { ...sizes, inlineJs, requests };
    expect(sizes.document, `document too large: ${JSON.stringify(report)}`).toBeLessThanOrEqual(
      BUDGET.documentBytes,
    );
    expect(sizes.css, `css too large: ${JSON.stringify(report)}`).toBeLessThanOrEqual(
      BUDGET.cssBytes,
    );
    expect(sizes.js, `external js too large: ${JSON.stringify(report)}`).toBeLessThanOrEqual(
      BUDGET.externalJsBytes,
    );
    expect(inlineJs, `inline js too large: ${JSON.stringify(report)}`).toBeLessThanOrEqual(
      BUDGET.inlineJsBytes,
    );
    expect(sizes.font, `fonts too large: ${JSON.stringify(report)}`).toBeLessThanOrEqual(
      BUDGET.fontBytes,
    );
    expect(requests, `too many requests: ${JSON.stringify(report)}`).toBeLessThanOrEqual(
      BUDGET.requests,
    );
  });
}

test('renders without a single blocking third-party request', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const stylesheets = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].map((l) => l.href),
  );
  for (const href of stylesheets) {
    expect(new URL(href).host).toMatch(/^localhost/);
  }
});
