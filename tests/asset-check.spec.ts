import { spawnSync } from 'node:child_process';
import { readFileSync, renameSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { OG_CARDS } from '../src/lib/og.ts';
import { ROUTES } from '../src/routes.ts';
import { LEGAL } from '../src/site.ts';

/**
 * The asset check is the build's last word on whether the site may ship, so
 * what it decides is asserted from the outside: run it as CI runs it, and read
 * its exit status. Nothing about how it reaches the decision is tested here.
 */
function runAssetCheck(env: Record<string, string>) {
  const { SITE_INDEXABLE: _indexable, SITE_STRICT: _strict, ...inherited } = process.env;
  const result = spawnSync(process.execPath, ['scripts/check-assets.mjs'], {
    env: { ...inherited, ...env },
    encoding: 'utf8',
  });
  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

describe('the indexing guard (ADR 16)', () => {
  it('is exercised against an incomplete legal notice', () => {
    // Both cases below only mean something while LEGAL is empty, which it is
    // until registration. Once it is complete this test has to change with it.
    expect(LEGAL.isComplete).toBe(false);
  });

  it('fails the check when the site is made indexable without a publisher', () => {
    const { status, output } = runAssetCheck({ SITE_INDEXABLE: 'true' });
    expect(status, output).not.toBe(0);
    expect(output).toMatch(/SITE_INDEXABLE/);
    expect(output).toMatch(/legal notice/i);
  });

  it('lets an incomplete legal notice pass while the site is not indexable', () => {
    const { status, output } = runAssetCheck({});
    expect(status, output).toBe(0);
  });
});

describe('the Open Graph cards (issue #30)', () => {
  // Each case takes something away from the working tree, runs the check, and
  // puts it back whatever happens.
  const card = OG_CARDS.find((candidate) => candidate.src.endsWith('-audit.png'));
  if (!card) throw new Error('No Audit card in OG_CARDS');
  const file = `public${card.src}`;

  it('gives every route a card of its own', () => {
    expect(new Set(OG_CARDS.map((candidate) => candidate.src)).size).toBe(ROUTES.length);
  });

  it('fails the check when a route has no card', () => {
    renameSync(file, `${file}.away`);
    try {
      const { status, output } = runAssetCheck({});
      expect(status, output).not.toBe(0);
      expect(output).toContain(`missing ${file}`);
    } finally {
      renameSync(`${file}.away`, file);
    }
  });

  it('fails the check when a card was drawn from words its page no longer says', () => {
    const manifest = 'scripts/og-manifest.json';
    const recorded = readFileSync(manifest, 'utf8');
    writeFileSync(manifest, JSON.stringify({ ...JSON.parse(recorded), [card.src]: 'stale' }));
    try {
      const { status, output } = runAssetCheck({});
      expect(status, output).not.toBe(0);
      expect(output).toMatch(new RegExp(`${file} no longer matches`));
    } finally {
      writeFileSync(manifest, recorded);
    }
  });
});
