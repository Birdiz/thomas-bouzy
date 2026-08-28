#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
/**
 * Copies the woff2 faces we actually use from @fontsource into public/fonts/.
 *
 * The design system's styles.css pulls Caprasimo + Figtree straight from
 * fonts.googleapis.com. Self-hosting removes a render-blocking third-party
 * request on the critical path and stops every visitor's browser from calling
 * Google. @fontsource stays the dependency that versions the files; this script
 * is how they get into the build.
 *
 *   node scripts/sync-fonts.mjs          copy
 *   node scripts/sync-fonts.mjs --check  fail if public/fonts is out of date
 */
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dest = join(root, 'public', 'fonts');

/** Only the faces referenced by src/styles/fonts.css. */
const FACES = [
  '@fontsource/caprasimo/files/caprasimo-latin-400-normal.woff2',
  '@fontsource/caprasimo/files/caprasimo-latin-ext-400-normal.woff2',
  '@fontsource/figtree/files/figtree-latin-400-normal.woff2',
  '@fontsource/figtree/files/figtree-latin-ext-400-normal.woff2',
  '@fontsource/figtree/files/figtree-latin-700-normal.woff2',
  '@fontsource/figtree/files/figtree-latin-ext-700-normal.woff2',
];

/**
 * Resolved the way Node resolves, rather than assumed to sit at <root>/node_modules:
 * a git worktree, a workspace or a hoisted install all put it somewhere else, and
 * the old join() reported every face as stale instead of saying it could not find them.
 */
const require = createRequire(import.meta.url);
const resolveFace = (face) => require.resolve(face);

const digest = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const checkOnly = process.argv.includes('--check');
const stale = [];

mkdirSync(dest, { recursive: true });

for (const face of FACES) {
  const from = resolveFace(face);
  const name = face.split('/').pop();
  const to = join(dest, name);

  if (checkOnly) {
    let same = false;
    try {
      same = digest(from) === digest(to);
    } catch {
      same = false;
    }
    if (!same) stale.push(name);
  } else {
    copyFileSync(from, to);
  }
}

if (checkOnly) {
  if (stale.length > 0) {
    console.error(`public/fonts is out of date: ${stale.join(', ')}`);
    console.error('Run: npm run fonts');
    process.exit(1);
  }
  console.log(`public/fonts up to date (${FACES.length} faces).`);
} else {
  console.log(`Copied ${FACES.length} faces into public/fonts/.`);
}
