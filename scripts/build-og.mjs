#!/usr/bin/env node
/**
 * Renders public/og.png (1200×630) and public/apple-touch-icon.png.
 *
 * The card wears the LinkedIn cover (docs/adr/0013): the slate ground, the
 * ridge with its terracotta rim and glow, a short accent rule, the name in
 * Spectral. The ridge is read from src/art/ridge.ts, the same data the hero
 * draws, so the card and the page show one mountain.
 *
 * What it does not take from the cover is the words. The cover is a LinkedIn
 * headline — a job title and a stack list — and ADR 11 took exactly that off
 * this site. The card says what the hero says: the client's problem first.
 *
 * Drawn in a real browser rather than composited by sharp, because sharp's SVG
 * text goes through fontconfig and would not find the self-hosted faces. The
 * output is committed, so `npm run build` never needs a browser; re-run
 * `npm run og` after changing the copy, the ridge or the palette.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { RIDGE_GLOW, RIDGE_LAYERS, RIDGE_RIM, RIDGE_VIEWBOX } from '../src/art/ridge.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const asDataUri = (file) =>
  `data:font/woff2;base64,${readFileSync(join(root, 'public/fonts', file)).toString('base64')}`;

const { width: RW, height: RH } = RIDGE_VIEWBOX;
const RIDGE = `<svg class="ridge" viewBox="0 0 ${RW} ${RH}" preserveAspectRatio="none">
  <defs>
    <radialGradient id="glow" cx="0.28" cy="0.3" r="0.35">
      <stop offset="0" stop-color="${RIDGE_GLOW}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="${RIDGE_GLOW}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${RW}" height="${RH}" fill="url(#glow)"/>
  ${RIDGE_LAYERS.map(({ d, fill }, i) =>
    i === 0
      ? `<path d="${d}" fill="${fill}" stroke="${RIDGE_RIM}" stroke-opacity="0.6" stroke-width="2"/>`
      : `<path d="${d}" fill="${fill}"/>`,
  ).join('')}
</svg>`;

const CARD = `<!doctype html><meta charset="utf-8"><style>
  @font-face { font-family: Figtree; src: url('${asDataUri('figtree-latin-400-normal.woff2')}') format('woff2'); }
  @font-face { font-family: Spectral; font-weight: 500; src: url('${asDataUri('spectral-latin-500-normal.woff2')}') format('woff2'); }
  @font-face { font-family: 'JetBrains Mono'; src: url('${asDataUri('jetbrains-mono-latin-400-normal.woff2')}') format('woff2'); }
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px; background: #0e1418; color: #eef2f3;
    font-family: Figtree, sans-serif; position: relative; overflow: hidden;
  }
  .ridge {
    position: absolute; left: 0; bottom: 0; width: 640px; height: 400px;
    -webkit-mask-image: linear-gradient(to right, #000 70%, transparent 98%);
            mask-image: linear-gradient(to right, #000 70%, transparent 98%);
  }
  .stack { position: absolute; left: 560px; right: 72px; top: 0; bottom: 0;
    display: flex; flex-direction: column; justify-content: center; }
  .rule { width: 64px; height: 3px; background: #c8785e; margin-bottom: 34px; }
  h1 { font-family: Spectral, serif; font-weight: 500; font-size: 84px; line-height: 1; letter-spacing: -0.01em; }
  .line { font-size: 30px; line-height: 1.35; color: #c9d3d8; margin-top: 28px; max-width: 24ch; }
  .foot { margin-top: 40px; font-family: 'JetBrains Mono', monospace; font-size: 17px;
    letter-spacing: .16em; text-transform: uppercase; color: #d4876c; }
</style>
${RIDGE}
<div class="stack">
  <div class="rule"></div>
  <h1>Thomas Bouzy</h1>
  <p class="line">Je reprends, fiabilise et fais évoluer vos applications métier.</p>
  <p class="foot">Freelance PHP/Symfony</p>
</div>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.setContent(CARD, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot({ type: 'png' });
await browser.close();

// The card is a handful of flat colours and one soft glow — a palette PNG is
// close to identical and a fraction of the size. Chromium's screenshot is truecolour, so
// this step is what keeps og.png off the performance budget.
const optimised = await sharp(png).png({ palette: true, quality: 90, effort: 10 }).toBuffer();
writeFileSync(join(root, 'public/og.png'), optimised);
console.log(
  `Wrote public/og.png (1200×630, ${(optimised.length / 1024).toFixed(1)} kB, was ${(png.length / 1024).toFixed(1)} kB truecolour)`,
);

// The touch icon is plain shapes, so sharp can rasterise the favicon directly.
await sharp(join(root, 'public/favicon.svg'))
  .resize(180, 180)
  .png()
  .toFile(join(root, 'public/apple-touch-icon.png'));
console.log('Wrote public/apple-touch-icon.png (180×180)');
