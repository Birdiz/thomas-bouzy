#!/usr/bin/env node
/**
 * Guards the things a build cannot catch: files referenced by the site that are
 * not in the repo, and configuration that has drifted out of sync.
 *
 * Two tiers:
 *   ERROR   — inconsistency or a missing file the page always references.
 *             Fails the build.
 *   PENDING — content Thomas still has to supply (CV PDFs, portrait). The site
 *             degrades on purpose rather than shipping a dead link, so this
 *             reports loudly and exits 0.
 */
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { SITE } from '../src/site.ts';

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
  'public/og.png',
];
for (const file of required) {
  if (!existsSync(path(file))) errors.push(`missing ${file}`);
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

// robots.txt is generated from SITE (src/pages/robots.txt.ts), so it cannot
// drift. Indexing follows SITE_INDEXABLE; say out loud which way it is set,
// because shipping a noindex by accident is a silent and expensive mistake.
console.log(
  SITE.indexable
    ? `Indexable: ${SITE.origin} is served to crawlers.`
    : `NOT indexable (SITE_INDEXABLE unset): robots.txt disallows all, pages carry noindex.`,
);

// Content still to come.
for (const locale of ['en', 'fr']) {
  const cv = `public/assets/cv-thomas-bouzy-${locale}.pdf`;
  if (!existsSync(path(cv))) {
    pending.push(`${cv} — the ${locale.toUpperCase()} download button is hidden until this lands`);
  }
}
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
  // Hero.astro matches on the name, so nothing complained.
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
