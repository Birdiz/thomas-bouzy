#!/usr/bin/env node
/**
 * Renders public/og.png (1200×630) and public/apple-touch-icon.png.
 *
 * The card is drawn in a real browser rather than composited by sharp, because
 * it is typeset in Caprasimo — sharp's SVG text goes through fontconfig and
 * would not find the self-hosted face. The output is committed, so `npm run
 * build` never needs a browser; re-run `npm run og` after changing the copy or
 * the palette.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const asDataUri = (file) =>
  `data:font/woff2;base64,${readFileSync(join(root, 'public/fonts', file)).toString('base64')}`;

const CARD = `<!doctype html><meta charset="utf-8"><style>
  @font-face { font-family: Caprasimo; src: url('${asDataUri('caprasimo-latin-400-normal.woff2')}') format('woff2'); }
  @font-face { font-family: Figtree; src: url('${asDataUri('figtree-latin-400-normal.woff2')}') format('woff2'); }
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px; background: #f5ead8; color: #201e1d;
    font-family: Figtree, sans-serif; position: relative; overflow: hidden;
    padding: 84px 92px; display: flex; flex-direction: column; justify-content: center;
  }
  .blob { position: absolute; border-radius: 999px; }
  .blob--olive { width: 420px; height: 420px; background: #e1eecc; right: -110px; top: -90px; }
  .blob--terracotta { width: 260px; height: 260px; background: #ffe1d0; right: 120px; bottom: -120px; }
  .stack { position: relative; }
  .pill {
    display: inline-flex; align-items: center; gap: 12px; padding: 10px 24px 10px 18px;
    border-radius: 999px; background: #f0fae1; color: #3d472b; font-size: 22px; margin-bottom: 34px;
  }
  .dot { width: 12px; height: 12px; border-radius: 999px; background: #728157; }
  h1 { font-family: Caprasimo, serif; font-size: 104px; line-height: .96; letter-spacing: -.02em; }
  .role { font-family: Caprasimo, serif; font-size: 34px; color: #8c491a; margin-top: 24px; max-width: 30ch; line-height: 1.25; }
  .foot { display: flex; gap: 14px; margin-top: 44px; }
  .tag { font-size: 20px; padding: 8px 20px; border-radius: 999px; background: #f9f4ed; color: #474238; }
</style>
<div class="blob blob--olive"></div>
<div class="blob blob--terracotta"></div>
<div class="stack">
  <div class="pill"><span class="dot"></span>Available now — full-time &amp; freelance</div>
  <h1>Thomas Bouzy</h1>
  <p class="role">Senior Software Engineer — architecture &amp; technical leadership</p>
  <div class="foot">
    <span class="tag">12 years</span>
    <span class="tag">PHP · Symfony</span>
    <span class="tag">DDD · Event Sourcing</span>
    <span class="tag">AWS · Kubernetes</span>
  </div>
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

writeFileSync(join(root, 'public/og.png'), png);
console.log('Wrote public/og.png (1200×630)');

// The touch icon is plain shapes, so sharp can rasterise the favicon directly.
await sharp(join(root, 'public/favicon.svg'))
  .resize(180, 180)
  .png()
  .toFile(join(root, 'public/apple-touch-icon.png'));
console.log('Wrote public/apple-touch-icon.png (180×180)');
