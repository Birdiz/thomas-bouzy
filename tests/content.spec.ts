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
    // Language-neutral strings (technology names, periods, company names) are
    // legitimately identical, so we assert on the prose only.
    const mustDiffer = [
      '$.meta.title',
      '$.meta.description',
      '$.nav.work',
      '$.nav.approach',
      '$.nav.about',
      '$.nav.contact',
      '$.hero.availability',
      '$.hero.blurb',
      '$.hero.ctaWork',
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
      '$.concepts[0].gloss',
      '$.concepts[1].label',
      '$.about.title',
      '$.about.paragraphs[0]',
      '$.about.cvLine',
      '$.about.cvCta',
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
  it('states availability without a date that can rot', () => {
    // Three versions of this line have gone stale in place: the design's "from
    // May 2026", then "permanent roles from September 2026" — asserted to be
    // in the future, and one day from not being, on a page whose own thesis is
    // that what is not instrumented is not reliable.
    //
    // The banner now carries no date at all, which is why this test no longer
    // compares one against the clock: a line with nothing to expire cannot be
    // caught late. The permanent-role half went with it — it is stated once, in
    // About, beside the CV that carries the salaried track record.
    expect(en.hero.availability).toMatch(/available now/i);
    expect(fr.hero.availability).toMatch(/disponible imm/i);

    for (const line of [en.hero.availability, fr.hero.availability]) {
      expect(line.match(/\b(19|20)\d{2}\b/), `${line} names a year that will go stale`).toBeNull();
    }
  });

  it('names the salaried route once, and points it at the PDF', () => {
    // Chantier A took the chronology, the job title, the years badge and the
    // stack off the page and left them to the CV. That only holds if the CV is
    // still reachable and still framed as the thing someone hiring reads —
    // otherwise the removal is a deletion rather than a move.
    expect(en.about.cvLine).toMatch(/CV/);
    expect(fr.about.cvLine).toMatch(/CV/);

    for (const content of [en, fr]) {
      // Never from the hero again: the download used to sit in the first
      // viewport as an equal alternative to the work itself.
      expect(Object.values(content.hero).join(' ')).not.toMatch(/CV|PDF/);
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

  it('claims no technology the page does not state', () => {
    // The Person schema's `knowsAbout` used to be derived from the Track
    // record's stack chips, so it could only ever name a technology a reader
    // could see. Chantier A took the chips with the rest of the CV grammar, and
    // the list is now written by hand in `schema.knowsAbout` — which is exactly
    // where a structured-data claim starts drifting away from the page.
    //
    // So the derivation becomes an assertion: every term must appear verbatim
    // in a string the page renders. Same rule the missing `worksFor` was fixed
    // under — a schema that claims more than the page says is a wrong claim,
    // and a wrong one is worse than a missing one.
    for (const [locale, content] of [
      ['en', en],
      ['fr', fr],
    ] as const) {
      const rendered = [...walkStrings(content)]
        .filter(([path]) => !path.startsWith('$.schema.'))
        .map(([, text]) => text)
        .join(' ');

      expect(content.schema.knowsAbout.length).toBeGreaterThan(0);
      for (const tech of content.schema.knowsAbout) {
        expect(rendered, `${locale}: the schema claims ${tech}, the page never says it`).toContain(
          tech,
        );
      }
    }
  });

  it('states the leadership scope as it actually was', () => {
    // Both reference CVs carried "up to 6 developers, QA, PO" for months. It
    // was two teams and six people — five developers and a QA — and the PO was
    // never in scope. The inflated version is the one a reader would probe, so
    // the corrected one is asserted rather than trusted to stay.
    //
    // It used to live in a Track record bullet. Chantier A removed that section,
    // and this is one of the four facts that existed nowhere else on the page —
    // it moved to the mentoring entry whose actual subject it is.
    for (const content of [en, fr]) {
      const everywhere = [...walkStrings(content)].map(([, text]) => text).join(' ');
      expect(everywhere).toMatch(/five developers|cinq développeurs/);
      expect(everywhere, 'the old inflated headcount is back').not.toMatch(
        /6 (developers|développeurs)/,
      );
    }
  });

  it('keeps the measurements that only the Track record used to carry', () => {
    // Chantier A deleted the Track record. Four of its facts appeared nowhere
    // else, and a measurement does not survive being replaced by a download —
    // so each was moved into the project card or the principle whose subject it
    // already was. This is the test that says so: it fails if a rewrite of any
    // of those hosts quietly drops what it inherited.
    const survivors: [string, RegExp, RegExp][] = [
      ['platform scale', /1\.5M\+ active users/, /1,5 million d'utilisateurs actifs/],
      ['load peaks', /10,000–20,000 users/, /10 000 à 20 000 utilisateurs/],
      ['observability tooling', /OpenTelemetry and Datadog/, /OpenTelemetry et Datadog/],
      ['incident command', /through Rootly/, /via Rootly/],
    ];
    for (const [what, enPattern, frPattern] of survivors) {
      const enText = [...walkStrings(en)].map(([, text]) => text).join(' ');
      const frText = [...walkStrings(fr)].map(([, text]) => text).join(' ');
      expect(enText, `EN lost ${what} with the Track record`).toMatch(enPattern);
      expect(frText, `FR lost ${what} with the Track record`).toMatch(frPattern);
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
