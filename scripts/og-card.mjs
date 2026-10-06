/**
 * The Open Graph card's template, shared by the script that draws the cards
 * (build-og.mjs) and the check that they are current (check-assets.mjs).
 *
 * The card wears the LinkedIn cover (docs/adr/0013): the slate ground, the
 * ridge with its terracotta rim and glow, a short accent rule, the title in
 * Figtree 600, as the site sets it (docs/adr/0021). The ridge is read from
 * src/art/ridge.ts, the same data the hero draws, so the card and the page show
 * one mountain.
 *
 * What it does not take from the cover is the words. The cover is a LinkedIn
 * headline, a job title and a stack list, and ADR 11 took exactly that off this
 * site. Each card says what its page says first: the hero's promise on the home
 * page, the Offer's plain line on an Offer page (src/lib/og.ts).
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RIDGE_GLOW, RIDGE_LAYERS, RIDGE_RIM, RIDGE_VIEWBOX } from '../src/art/ridge.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Where the record of what each card was drawn from lives: next to the scripts, not served. */
export const OG_MANIFEST = join(root, 'scripts/og-manifest.json');

const asDataUri = (file) =>
  `data:font/woff2;base64,${readFileSync(join(root, 'public/fonts', file)).toString('base64')}`;

const escapeHtml = (text) =>
  text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

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

/**
 * The page the browser screenshots, at 1200×630. A line too long for the card
 * is set smaller by the script that draws it, never cut: the public-sector
 * page's plain line is twice an Offer's.
 */
export function cardHtml(card) {
  return `<!doctype html><meta charset="utf-8"><style>
  @font-face { font-family: Figtree; src: url('${asDataUri('figtree-latin-400-normal.woff2')}') format('woff2'); }
  @font-face { font-family: Figtree; font-weight: 600; src: url('${asDataUri('figtree-latin-600-normal.woff2')}') format('woff2'); }
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
  .stack { position: absolute; left: 560px; right: 72px; top: 56px; bottom: 56px;
    display: flex; flex-direction: column; justify-content: center; }
  .rule { width: 64px; height: 3px; background: #ac6d67; margin-bottom: 34px; flex: none; }
  h1 { font-weight: 600; font-size: 64px; line-height: 1.05; letter-spacing: -0.02em; }
  .home h1 { font-size: 84px; line-height: 1; }
  .line { font-size: 30px; line-height: 1.35; color: #c9d3d8; margin-top: 28px; max-width: 24ch; }
  .foot { margin-top: 40px; font-family: 'JetBrains Mono', monospace; font-size: 17px;
    letter-spacing: .16em; text-transform: uppercase; color: #c3827b; }
</style>
<body class="${card.home ? 'home' : 'offer'}">
${RIDGE}
<div class="stack">
  <div class="rule"></div>
  <h1>${escapeHtml(card.title)}</h1>
  <p class="line">${escapeHtml(card.line)}</p>
  <p class="foot">${escapeHtml(card.foot)}</p>
</div>
</body>`;
}

/** What a card was drawn from: its template, its fonts, its ridge and its words. */
export function cardHash(card) {
  return createHash('sha256').update(cardHtml(card)).digest('hex');
}
