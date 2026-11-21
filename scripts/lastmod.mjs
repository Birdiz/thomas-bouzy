#!/usr/bin/env node
/**
 * The sitemap's <lastmod>: the day each page's text last changed, rather than
 * the hour of the build (ADR 28). A build stamped every page with the same
 * date on every deploy, and a crawler learns to ignore a date that always
 * says "now".
 *
 * What counts is what a reader reads: the text of the page's <main>, without
 * its markup, its scripts, or the header and footer every page shares. Its
 * hash is recorded with the date in scripts/lastmod.json, which is committed:
 *
 *   npm run build && npm run lastmod
 *
 * dates today every page whose text changed since it was last recorded. The
 * sitemap prints a page's date only while the hash still matches the built
 * page (astro.config.mjs), so a page changed without running this goes out
 * with no <lastmod> rather than a wrong one, and the e2e suite fails on it
 * (tests/e2e/links.spec.ts).
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

/** Where each page's date and text hash are recorded: next to the scripts, not served. */
export const LASTMOD_MANIFEST = join(root, 'scripts/lastmod.json');

/** The built page served at a root-relative path, trailing slash included. */
const builtPage = (path) => join(root, 'dist', path, 'index.html');

/** What a reader reads on a built page: the text of its <main>, whitespace collapsed. */
export function textOf(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';
  return main
    .replace(/<(script|style|template)\b[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const hashOf = (text) => createHash('sha256').update(text).digest('hex');

/** The hash of a built page's text, or undefined when the page is not built. */
function builtHash(path) {
  const file = builtPage(path);
  return existsSync(file) ? hashOf(textOf(readFileSync(file, 'utf8'))) : undefined;
}

export function readManifest() {
  return existsSync(LASTMOD_MANIFEST) ? JSON.parse(readFileSync(LASTMOD_MANIFEST, 'utf8')) : {};
}

/**
 * The day a built page's text last changed, as recorded: undefined when it
 * changed again since, or was never recorded. A missing date is a true
 * statement; a stale one is not.
 */
export function lastmodOf(path, manifest = readManifest()) {
  const entry = manifest[path];
  return entry && entry.hash === builtHash(path) ? entry.date : undefined;
}

// npm run lastmod: record today against every page whose text changed.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { ROUTES } = await import('../src/routes.ts');
  const { SITE } = await import('../src/site.ts');
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: SITE.timezone }).format(new Date());
  const before = readManifest();
  const after = {};
  for (const { path } of ROUTES) {
    const hash = builtHash(path);
    if (!hash) {
      console.error(`${path} is not in dist/: run npm run build first.`);
      process.exit(1);
    }
    const unchanged = before[path]?.hash === hash;
    after[path] = unchanged ? before[path] : { date: today, hash };
    if (!unchanged) console.log(`${path}: changed, dated ${today}`);
  }
  writeFileSync(LASTMOD_MANIFEST, `${JSON.stringify(after, null, 2)}\n`);
}
