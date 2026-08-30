import { describe, expect, it } from 'vitest';
import { en } from '../src/content/en.ts';
import { fr } from '../src/content/fr.ts';

/**
 * The TypeScript contract (src/content/types.ts) already guarantees that both
 * locales carry the same keys — a missing one is a compile error. These tests
 * cover the invariants types cannot express:
 *
 *   - array lengths matching at every depth (6 projects EN, 6 projects FR)
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
      '$.nav.approach',
      '$.nav.about',
      '$.nav.contact',
      '$.hero.availability',
      '$.hero.role',
      '$.hero.blurb',
      '$.hero.ctaWork',
      '$.hero.ctaPdf',
      '$.problem.kicker',
      '$.problem.title',
      '$.problem.paragraphs[0]',
      '$.position.kicker',
      '$.position.title',
      '$.position.intro',
      '$.position.costLabel',
      '$.work.kicker',
      '$.work.title',
      '$.work.intro',
      '$.experience.title',
      '$.concepts[0].gloss',
      '$.concepts[1].label',
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
  it('offers freelance immediately, and never advertises a date already past', () => {
    // The design shipped "from May 2026" / "à partir de mai 2026", stale on
    // arrival. The pitch master gives two availabilities rather than one:
    // freelance now, permanent from September 2026. A date is allowed again —
    // but only while it is still ahead of us, which is what rots otherwise.
    expect(en.hero.availability).toMatch(/freelance now/i);
    expect(fr.hero.availability).toMatch(/freelance imm/i);

    const thisYear = new Date().getFullYear();
    for (const line of [en.hero.availability, fr.hero.availability]) {
      for (const year of line.match(/\b(19|20)\d{2}\b/g) ?? []) {
        expect(Number(year), `${line} names a year already past`).toBeGreaterThanOrEqual(thisYear);
      }
    }
  });

  it('reports the remote track record as 8 years, counting from 2018', () => {
    expect(en.contact.locationLine).toMatch(/8\+? years/);
    expect(fr.contact.locationLine).toMatch(/8 ans/);
    expect(en.contact.locationLine).not.toMatch(/6\+? years/);
    expect(fr.contact.locationLine).not.toMatch(/6 ans/);
  });

  it('gives the location as a region, never narrower', () => {
    // A commune of a few hundred people, beside a name and a job title, is a
    // near-deducible home address. Thomas's call is to stop at the region and
    // not publish the département either: a recruiter needs the timezone and
    // the country, and neither Grandrupt nor the Vosges tells them more.
    for (const content of [en, fr]) {
      expect(content.contact.locationLine).toMatch(/Grand Est, France/);
      const everywhere = [
        content.contact.locationLine,
        content.contact.blurb,
        ...content.about.paragraphs,
      ].join(' ');
      expect(everywhere).not.toMatch(/Grandrupt|Vosges|\(88\)/);
    }
  });

  it('states the three honesty levels as a position, not as a grid', () => {
    // §4.5 of the pitch master is a strict personal rule: "production
    // experience" / "personal projects" / "currently learning", never merged
    // into one undifferentiated list. It used to be carried by the Toolkit
    // grid's group names; the Toolkit is gone, so the rule moved into the
    // Approach section as principle 5 — see docs/adr/0009, postscript 2. It is
    // asserted here rather than left to care, because a rule nobody can see is
    // a rule that quietly stops applying.
    for (const content of [en, fr]) {
      const principle = content.principles.find((p) =>
        /honesty levels|niveaux d'honnêteté/i.test(p.title),
      );
      expect(principle, 'the honesty-levels principle is on the page').toBeDefined();

      const stated = `${principle?.title} ${principle?.text}`;
      expect(stated).toMatch(/[Pp]roduction/);
      expect(stated).toMatch(/personal projects|projets personnels/i);
      expect(stated).toMatch(/currently learning|apprentissage/i);

      // A principle without its price is a slogan; this one's price is the
      // reason it is credible at all.
      expect(principle?.cost.trim().length ?? 0).toBeGreaterThan(0);
    }
  });

  it('keeps the stack visible, and only on the dated Track record chips', () => {
    // Removing the Toolkit made the job chips the page's only stack claim. That
    // is deliberate — a stack attached to an employer and a period says more
    // than a floating grid — but it means the chips are now load-bearing, and
    // dropping one silently removes a technology from the site altogether.
    for (const content of [en, fr]) {
      const chips = content.jobs.flatMap((job) => job.stack);
      expect(chips.length).toBeGreaterThan(0);
      for (const tech of ['PHP', 'Symfony', 'Kubernetes', 'React']) {
        expect(chips.join(' '), `${tech} left the page with the Toolkit`).toMatch(tech);
      }
      // The projects carry prose, not chips: the CV look Thomas rejected.
      for (const project of content.projects) {
        expect(project).not.toHaveProperty('stack');
      }
    }
  });

  it('states the blockchain scope boundary on the on-chain project itself', () => {
    // §3.9: SDK integration and transaction operation, no smart contract
    // authoring. Volunteering the limit is what makes the rest credible, so it
    // belongs in the card body — not in a footnote, and not omitted.
    for (const content of [en, fr]) {
      // Selected on the card's own prose now: the stack chips it used to be
      // found by went with the rest of the chips.
      const onChain = content.projects.find((project) =>
        /Solana|Meteora/.test(`${project.context} ${project.approach}`),
      );
      expect(onChain, 'the on-chain project card is present').toBeDefined();
      expect(`${onChain?.approach} ${onChain?.result}`).toMatch(
        /no smart contract authoring|pas d'écriture de smart contracts/,
      );
    }
  });

  it('claims no technology the reference CVs do not', () => {
    // MongoDB rode the file for months on a misremembered Kiss The Bride
    // stack — it was MariaDB, and MongoDB appears nowhere in twelve years.
    // The attribution had grown a rule of its own before being traced back,
    // which is exactly why an unverifiable line is worth a test and not care.
    for (const content of [en, fr]) {
      for (const [path, text] of walkStrings(content)) {
        expect(text, `MongoDB claimed at ${path}`).not.toMatch(/MongoDB/);
      }
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
