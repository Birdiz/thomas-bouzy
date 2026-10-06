import { ogCard, ogImageAlt } from '../../src/lib/og.ts';
import { ROUTES } from '../../src/routes.ts';
import { expect, test } from './fixtures.ts';

/**
 * Every route's Open Graph card, as LinkedIn fetches it (issue #30). The link
 * check skips `og:image`, which is absolute to the canonical domain and so
 * never same-origin under test: this suite follows its path instead.
 */

/** Width and height from a PNG's IHDR chunk, which always comes first. */
function pngSize(body: Buffer) {
  expect(body.subarray(1, 4).toString('ascii')).toBe('PNG');
  return { width: body.readUInt32BE(16), height: body.readUInt32BE(20) };
}

for (const route of ROUTES) {
  test(`${route.path} shares its own 1200×630 card`, async ({ page, request }) => {
    await page.goto(route.path);
    const content = (property: string) =>
      page.locator(`meta[property="${property}"]`).getAttribute('content');

    const image = new URL((await content('og:image')) ?? '');
    const card = ogCard(route);
    expect(image.pathname).toBe(card.src);

    const response = await request.get(image.pathname);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toMatch(/^image\/png/);
    expect(pngSize(await response.body())).toEqual({ width: 1200, height: 630 });
    expect(await content('og:image:width')).toBe('1200');
    expect(await content('og:image:height')).toBe('630');

    // The alt is the card's words, in the page's language.
    expect(await content('og:image:alt')).toBe(ogImageAlt(card));
  });
}
