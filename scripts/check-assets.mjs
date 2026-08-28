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
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
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
  'public/CNAME',
];
for (const file of required) {
  if (!existsSync(path(file))) errors.push(`missing ${file}`);
}

// CNAME, robots.txt and SITE.domain must agree, or canonical URLs and the
// sitemap point somewhere GitHub Pages does not serve.
if (existsSync(path('public/CNAME')) && !process.env.SITE_DOMAIN) {
  const cname = readFileSync(path('public/CNAME'), 'utf8').trim();
  if (cname !== SITE.domain) {
    errors.push(`public/CNAME is "${cname}" but SITE.domain is "${SITE.domain}"`);
  }
}
// robots.txt is generated from SITE (src/pages/robots.txt.ts), so it cannot
// drift. public/CNAME is static and GitHub Pages-specific: it only has to agree
// with SITE.domain when no SITE_DOMAIN override is in play.

// Content still to come.
for (const locale of ['en', 'fr']) {
  const cv = `public/assets/cv-thomas-bouzy-${locale}.pdf`;
  if (!existsSync(path(cv))) {
    pending.push(`${cv} — the ${locale.toUpperCase()} download button is hidden until this lands`);
  }
}
const assetsDir = path('src/assets');
const hasPortrait =
  existsSync(assetsDir) &&
  readdirSync(assetsDir).some((f) => /^portrait\.(jpe?g|png|webp|avif)$/i.test(f));
if (!hasPortrait) {
  pending.push(
    'src/assets/portrait.{jpg,png,webp,avif} — the hero shows a placeholder until this lands',
  );
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
