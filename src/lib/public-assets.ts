import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const publicDir = fileURLToPath(new URL('../../public/', import.meta.url));

/**
 * True when a root-relative path (e.g. `/assets/cv-thomas-bouzy-en.pdf`) is
 * present in public/.
 *
 * The site is fully static, so this runs at build time only. Components use it
 * to skip a download button rather than ship a link to a 404;
 * `scripts/check-assets.mjs` turns the same absence into a CI failure, so a
 * missing asset is loud in the pipeline and silent for the visitor.
 */
export function publicAssetExists(rootRelativePath: string): boolean {
  const clean = rootRelativePath.replace(/^\/+/, '');
  return existsSync(join(publicDir, clean));
}
