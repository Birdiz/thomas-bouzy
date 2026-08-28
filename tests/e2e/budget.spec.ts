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
 * Sizes are uncompressed; the wire is roughly a quarter of this after gzip.
 */
const BUDGET = {
  documentBytes: 34_000,
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

    page.on('response', async (response) => {
      if (!response.url().startsWith('http://localhost')) return;
      requests += 1;
      const type = response.headers()['content-type'] ?? '';
      const length = Number(response.headers()['content-length'] ?? 0);

      if (type.startsWith('text/html')) sizes.document += length;
      else if (type.startsWith('text/css')) sizes.css += length;
      else if (type.includes('javascript')) sizes.js += length;
      else if (type.startsWith('font/')) sizes.font += length;
      else if (type.startsWith('image/')) sizes.image += length;
      else sizes.other += length;
    });

    await page.goto(path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

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
