import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Absolute path of public/.
 *
 * Resolved from the build's working directory, deliberately NOT from
 * `import.meta.url`: Vite bundles this module into dist/.prerender/chunks/, so
 * a relative walk from the module lands in dist/public/ and every lookup
 * quietly answers "missing". That shipped a page with no CV download buttons
 * while both PDFs sat correctly in public/assets/.
 *
 * The sentinel below turns a wrong working directory into a build failure
 * rather than a silently emptier page.
 */
const publicDir = join(process.cwd(), 'public');

// The directory itself is the sentinel: dist/public/ — where the old
// import.meta.url walk landed — never exists. Naming a file here would just
// move the trap (removing public/robots.txt once broke the build this way).
if (!statSync(publicDir, { throwIfNoEntry: false })?.isDirectory()) {
  throw new Error(
    `public/ not found at ${publicDir}. publicAssetExists() resolves from the working ` +
      'directory, so the build has to run from the project root.',
  );
}

/**
 * True when a root-relative path (e.g. `/assets/cv-thomas-bouzy-en.pdf`) is
 * present in public/.
 *
 * The site is fully static, so this runs at build time only. Components use it
 * to skip a download button rather than ship a link to a 404;
 * `scripts/check-assets.mjs` turns the same absence into a CI warning, and
 * tests/e2e/links.spec.ts fails if a file that *is* present goes unlinked.
 */
export function publicAssetExists(rootRelativePath: string): boolean {
  const clean = rootRelativePath.replace(/^\/+/, '');
  return existsSync(join(publicDir, clean));
}
