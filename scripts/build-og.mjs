#!/usr/bin/env node
/**
 * Renders one Open Graph card per route into public/og/ (1200×630), and
 * public/apple-touch-icon.png.
 *
 * Which cards, and what each says, is src/lib/og.ts; how they look is
 * scripts/og-card.mjs. Alongside the images it records what each was drawn
 * from in scripts/og-manifest.json, so that `npm run assets:check` can tell a
 * card that no longer matches its page.
 *
 * Drawn in a real browser rather than composited by sharp, because sharp's SVG
 * text goes through fontconfig and would not find the self-hosted faces. The
 * output is committed, so `npm run build` never needs a browser; re-run
 * `npm run og` after changing a card's copy, the ridge or the palette.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { OG_CARDS } from '../src/lib/og.ts';
import { cardHash, cardHtml, OG_MANIFEST } from './og-card.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public/og');
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});

const manifest = {};
for (const card of OG_CARDS) {
  await page.setContent(cardHtml(card), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  // A line that does not fit is set smaller, a pixel at a time, rather than
  // overflowing the card or being cut.
  await page.evaluate(() => {
    const stack = document.querySelector('.stack');
    const line = document.querySelector('.line');
    let size = Number.parseFloat(getComputedStyle(line).fontSize);
    while (stack.scrollHeight > stack.clientHeight && size > 20) {
      size -= 1;
      line.style.fontSize = `${size}px`;
    }
  });
  const png = await page.screenshot({ type: 'png' });

  // The card is a handful of flat colours and one soft glow: a palette PNG is
  // close to identical and a fraction of the size of Chromium's truecolour one.
  const optimised = await sharp(png).png({ palette: true, quality: 90, effort: 10 }).toBuffer();
  const file = join(root, 'public', card.src);
  writeFileSync(file, optimised);
  manifest[card.src] = cardHash(card);
  console.log(`Wrote public${card.src} (${(optimised.length / 1024).toFixed(1)} kB)`);
}
await browser.close();

// A card for a route that no longer exists is not served by anything: drop it.
const current = new Set(OG_CARDS.map((card) => card.src));
for (const file of readdirSync(outDir)) {
  if (!current.has(`/og/${file}`)) {
    rmSync(join(outDir, file));
    console.log(`Removed public/og/${file}`);
  }
}
writeFileSync(OG_MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

// The touch icon is plain shapes, so sharp can rasterise the favicon directly.
await sharp(join(root, 'public/favicon.svg'))
  .resize(180, 180)
  .png()
  .toFile(join(root, 'public/apple-touch-icon.png'));
console.log('Wrote public/apple-touch-icon.png (180×180)');
