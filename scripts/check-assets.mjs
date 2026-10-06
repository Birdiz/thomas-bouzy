#!/usr/bin/env node
/**
 * Guards the things a build cannot catch: files referenced by the site that are
 * not in the repo, and configuration that has drifted out of sync.
 *
 * Two tiers:
 *   ERROR   — inconsistency or a missing file the page always references.
 *             Fails the build.
 *   PENDING — content Thomas still has to supply (the portrait). The site
 *             degrades on purpose rather than shipping an empty circle, so
 *             this reports loudly and exits 0.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { OG_CARDS } from '../src/lib/og.ts';
import { LEGAL, SITE } from '../src/site.ts';
import { cardHash, OG_MANIFEST } from './og-card.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = (...p) => join(root, ...p);
const errors = [];
const pending = [];

const required = [
  // Git does not track empty directories, so src/assets/ only survives a clone
  // because of the README inside it — and the docs tell Thomas to drop the
  // portrait there. Without this, that instruction silently points nowhere.
  'src/assets/README.md',
  'public/favicon.svg',
  'public/apple-touch-icon.png',
];
for (const file of required) {
  if (!existsSync(path(file))) errors.push(`missing ${file}`);
}

// Every route's Open Graph card (src/lib/og.ts): LinkedIn shows it under every
// shared link, and a page pointing og:image at a missing file shows nothing.
// The cards are drawn by a browser and committed, so the build cannot redraw
// one; what it can tell is that a card was drawn from words its page no longer
// says, which a buyer would read on LinkedIn as the site contradicting itself.
const drawnFrom = existsSync(OG_MANIFEST) ? JSON.parse(readFileSync(OG_MANIFEST, 'utf8')) : {};
for (const card of OG_CARDS) {
  const file = `public${card.src}`;
  if (!existsSync(path(file))) {
    errors.push(`missing ${file}: run npm run og`);
    continue;
  }
  const { width, height } = await sharp(path(file)).metadata();
  if (width !== 1200 || height !== 630) {
    errors.push(`${file} is ${width}×${height}, not the 1200×630 og:image declares`);
  }
  if (drawnFrom[card.src] !== cardHash(card)) {
    errors.push(
      `${file} no longer matches its page's words or the card's template: run npm run og`,
    );
  }
}

// A deployment build must name its own hostname. Without this, a missing or
// renamed SITE_DOMAIN still produces a *successful* build whose canonical URLs,
// hreflang, sitemap and JSON-LD all point at the placeholder — a site that
// tells every crawler it lives at an address that does not resolve. The
// Dockerfile sets SITE_STRICT, so this only ever bites a real deployment.
if (process.env.SITE_STRICT === '1' && !process.env.SITE_DOMAIN?.trim()) {
  errors.push(
    'SITE_DOMAIN is empty in a deployment build — canonical URLs, hreflang, the ' +
      `sitemap and the JSON-LD would all point at the placeholder "${SITE.domain}"`,
  );
}

// An indexed commercial site with no identified publisher is a defect, not a
// pending item (ADR 16): the law asks a professional site to name its
// publisher, and LEGAL in src/site.ts stays empty until the business is
// registered. So making the site indexable is refused until the notice is
// complete — it circulates by link until then.
if (SITE.indexable && !LEGAL.isComplete) {
  const missing = [
    ['businessName', LEGAL.businessName],
    ['legalForm', LEGAL.legalForm],
    ['siret', LEGAL.siret],
    ['address', LEGAL.address],
    ['host.address', LEGAL.host.address],
  ]
    .filter(([, value]) => !value)
    .map(([field]) => field);
  errors.push(
    'SITE_INDEXABLE is true but the legal notice is incomplete (LEGAL in src/site.ts is ' +
      `missing ${missing.join(', ')}). An indexed site has to name its publisher; ` +
      'unset SITE_INDEXABLE or complete LEGAL — see docs/adr/0016.',
  );
}

// robots.txt is generated from SITE (src/pages/robots.txt.ts), so it cannot
// drift. Indexing follows SITE_INDEXABLE; say out loud which way it is set,
// because shipping a noindex by accident is a silent and expensive mistake.
console.log(
  SITE.indexable
    ? `Indexable: ${SITE.origin} is served to crawlers.`
    : `NOT indexable (SITE_INDEXABLE unset): crawlers may read the pages, and every page carries noindex.`,
);

// Content still to come.
const assetsDir = path('src/assets');
const portrait = existsSync(assetsDir)
  ? readdirSync(assetsDir).find((f) => /^portrait\.(jpe?g|png|webp|avif)$/i.test(f))
  : undefined;

if (!portrait) {
  pending.push(
    'src/assets/portrait.{jpg,png,webp,avif} — the hero shows a placeholder until this lands',
  );
} else {
  // Largest width Hero.astro asks for: a 290 CSS px box at DPR 2. A source
  // narrower than this is upscaled, and the `width={580}` in the markup is a
  // claim the file cannot back.
  const WIDEST = 580;
  const { width, height, format } = await sharp(path('src/assets', portrait)).metadata();

  // The file that shipped was called portrait.jpg and was a PNG. The glob in
  // src/lib/portrait.ts matches on the name, so nothing complained.
  const claimed = portrait.split('.').pop().toLowerCase();
  const actual = format === 'jpeg' ? 'jpg' : format;
  if (actual !== claimed && !(actual === 'jpg' && claimed === 'jpeg')) {
    errors.push(`src/assets/${portrait} is actually a ${format}, not a ${claimed}`);
  }

  if (width < WIDEST || height < WIDEST) {
    pending.push(
      `src/assets/${portrait} is ${width}×${height} — the hero asks for ${WIDEST}×${WIDEST}, ` +
        'so the largest variant is upscaled. A bigger source is the only fix.',
    );
  }
}

const inCi = Boolean(process.env.CI);
const annotate = (level, message) =>
  console.log(inCi ? `::${level}::${message}` : `${level.toUpperCase()}: ${message}`);

for (const message of pending) annotate('warning', message);
for (const message of errors) annotate('error', message);

if (errors.length > 0) {
  console.error(`\n${errors.length} asset error(s). Build is not shippable.`);
  process.exit(1);
}
console.log(
  pending.length > 0
    ? `\nAssets consistent. ${pending.length} item(s) still pending — see warnings above.`
    : '\nAll assets present and consistent.',
);
