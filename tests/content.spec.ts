import { describe, expect, it } from 'vitest';
import { en } from '../src/content/en.ts';
import { fr } from '../src/content/fr.ts';

/**
 * The TypeScript contract (src/content/types.ts) already guarantees that both
 * locales carry the same keys — a missing one is a compile error. These tests
 * cover the invariants types cannot express:
 *
 *   - array lengths matching at every depth (5 projects EN, 5 projects FR)
 *   - no empty or whitespace-only strings
 *   - the sections that must actually be translated, are
 *   - the content corrections we made against the design are still in place
 */

type Shape = string | Shape[] | { [key: string]: Shape };

/** Reduces a value to its structure: strings collapse, arrays keep their length. */
function shapeOf(value: unknown, path = '$'): Shape {
  if (typeof value === 'string') return 'string';
  if (Array.isArray(value)) return value.map((item, i) => shapeOf(item, `${path}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, val]) => [key, shapeOf(val, `${path}.${key}`)]),
    );
  }
  throw new Error(`Unsupported content value at ${path}: ${typeof value}`);
}

/** Every string in the tree, keyed by its dotted path. */
function walkStrings(value: unknown, path = '$', out = new Map<string, string>()) {
  if (typeof value === 'string') {
    out.set(path, value);
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => {
      walkStrings(item, `${path}[${i}]`, out);
    });
  } else if (value && typeof value === 'object') {
    for (const [key, val] of Object.entries(value)) walkStrings(val, `${path}.${key}`, out);
  }
  return out;
}

describe('EN/FR parity', () => {
  it('has the same structure and array lengths in both locales', () => {
    expect(shapeOf(fr)).toEqual(shapeOf(en));
  });

  it('has no empty or whitespace-only strings', () => {
    for (const [locale, content] of [
      ['en', en],
      ['fr', fr],
    ] as const) {
      const blank = [...walkStrings(content)]
        .filter(([, text]) => text.trim().length === 0)
        .map(([path]) => `${locale}:${path}`);
      expect(blank).toEqual([]);
    }
  });

  it('actually translates the prose, rather than copying English through', () => {
    // Language-neutral strings (tech stacks, periods, company names, the "12" of
    // "12 years") are legitimately identical, so we assert on the prose only.
    const mustDiffer = [
      '$.meta.title',
      '$.meta.description',
      '$.nav.work',
      '$.nav.experience',
      '$.nav.skills',
      '$.nav.about',
      '$.nav.contact',
      '$.hero.availability',
      '$.hero.role',
      '$.hero.blurb',
      '$.hero.ctaWork',
      '$.hero.ctaPdf',
      '$.work.kicker',
      '$.work.title',
      '$.work.intro',
      '$.experience.title',
      '$.skillsSection.title',
      '$.about.title',
      '$.about.paragraphs[0]',
      '$.contact.title',
      '$.contact.blurb',
      '$.contact.revealPhone',
    ];
    const enStrings = walkStrings(en);
    const frStrings = walkStrings(fr);

    const identical = mustDiffer.filter((path) => {
      const a = enStrings.get(path);
      const b = frStrings.get(path);
      expect(a, `missing EN string at ${path}`).toBeDefined();
      expect(b, `missing FR string at ${path}`).toBeDefined();
      return a === b;
    });
    expect(identical).toEqual([]);
  });
});

describe('content corrections applied against the design', () => {
  it('states availability as immediate, not a date that has already passed', () => {
    expect(en.hero.availability).toMatch(/available now/i);
    expect(fr.hero.availability).toMatch(/disponible imm/i);
    // The design shipped "from May 2026" / "à partir de mai 2026".
    expect(en.hero.availability).not.toMatch(/2026/);
    expect(fr.hero.availability).not.toMatch(/2026/);
  });

  it('reports the remote track record as 8 years, counting from 2018', () => {
    expect(en.contact.locationLine).toMatch(/8\+? years/);
    expect(fr.contact.locationLine).toMatch(/8 ans/);
    expect(en.contact.locationLine).not.toMatch(/6\+? years/);
    expect(fr.contact.locationLine).not.toMatch(/6 ans/);
  });

  it('gives the location as a region, not a commune', () => {
    // A village name plus a name and a job title is a near-deducible address.
    for (const content of [en, fr]) {
      expect(content.contact.locationLine).toMatch(/Grand Est, France/);
      expect(content.contact.locationLine).not.toMatch(/Grandrupt|\(88\)/);
      expect(content.contact.blurb).not.toMatch(/Grandrupt/);
    }
  });

  it('never inlines the phone number in content', () => {
    // It reaches the page encoded, through RevealPhone.astro. If it ever leaks
    // into a content string it would be served in the HTML source again.
    for (const content of [en, fr]) {
      for (const [path, text] of walkStrings(content)) {
        expect(text.replace(/\s/g, ''), `phone digits found at ${path}`).not.toMatch(
          /(\+33|0)6321345/,
        );
      }
    }
  });
});
