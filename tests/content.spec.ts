import { describe, expect, it } from 'vitest';
import { en } from '../src/content/en.ts';
import { fr } from '../src/content/fr.ts';
import { contentOfPage, type ResumeContent } from '../src/content/index.ts';
import { OFFER_IDS, OFFERS } from '../src/content/offers.ts';
import { combinationFor, DAY_RATE, optionCombinations, PRICES } from '../src/content/prices.ts';
import { PAGES } from '../src/routes.ts';
import { LOCALES } from '../src/site.ts';

/**
 * The TypeScript contract (src/content/types.ts) already guarantees that both
 * locales carry the same keys — a missing one is a compile error. These tests
 * cover the invariants types cannot express:
 *
 *   - array lengths matching at every depth (7 achievements EN, 7 FR)
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
  // Parity follows the registry (src/routes.ts), not the whole module: French
  // is the site's language and English exists where it sells (ADR 15).
  for (const page of PAGES) {
    const declared = LOCALES.filter((locale) => page.paths[locale] !== undefined);

    it(`has content for ${page.id} in exactly the locales it is declared in`, () => {
      for (const locale of LOCALES) {
        const content = contentOfPage(locale, page.id);
        if (declared.includes(locale)) {
          expect(content, `${page.id} is declared in ${locale} but has no content`).toBeDefined();
        } else {
          expect(content, `${page.id} has ${locale} content but no ${locale} page`).toBeUndefined();
        }
      }
    });

    if (declared.length > 1) {
      it(`has the same structure and array lengths for ${page.id} in both locales`, () => {
        expect(shapeOf(contentOfPage('fr', page.id))).toEqual(
          shapeOf(contentOfPage('en', page.id)),
        );
      });
    }
  }

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
      '$.hero.ctaOffers',
      '$.offersSection.title',
      '$.offersSection.intro',
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
      '$.work.labelPlain',
      '$.failureModes[0].quote',
      '$.failureModes[0].text',
      '$.achievements[0].plain',
      '$.offerPages.audit.concepts[0].gloss',
      '$.offerPages.migration.concepts[0].label',
      '$.about.title',
      '$.about.paragraphs[0]',
      '$.about.careerLine',
      '$.about.careerLink',
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
    // About, as the line that points a Recruiter at LinkedIn.
    //
    // "Available now" went too: it is not true before the business is
    // registered, and nothing on the page could make it so (ADR 14).
    expect(en.hero.availability).toMatch(/first engagements in preparation/i);
    expect(fr.hero.availability).toMatch(/premières missions en préparation/i);

    for (const line of [en.hero.availability, fr.hero.availability]) {
      expect(line.trim().length, 'the availability line is blank').toBeGreaterThan(0);
      expect(line.match(/\b(19|20)\d{2}\b/), `${line} names a year that will go stale`).toBeNull();
      expect(line, `${line} still claims immediate availability`).not.toMatch(
        /available now|disponible imm/i,
      );
    }
  });

  it('names the salaried route once, and points it at LinkedIn', () => {
    // Chantier A took the chronology, the job title, the years badge and the
    // stack off the page and left them to the CV; the postscript to ADR 11
    // took the CV off the site too. That only holds if a Recruiter is still
    // told where the career is — otherwise the removal is a dead end rather
    // than a move.
    for (const content of [en, fr]) {
      expect(content.about.careerLink).toMatch(/LinkedIn/);
      // Never from the hero again: the download used to sit in the first
      // viewport as an equal alternative to the work itself.
      expect(Object.values(content.hero).join(' ')).not.toMatch(/CV|PDF|LinkedIn/);
    }
  });

  it('references no CV file anywhere', () => {
    // The PDFs printed the personal mobile and the home commune that the page
    // withholds (ADR 5), and they are gone from public/. A Partner gets a CV on
    // request, by email: saying so is fine, linking a file is not.
    for (const content of [en, fr]) {
      for (const [path, text] of walkStrings(content)) {
        expect(text, `a CV file is referenced at ${path}`).not.toMatch(/\.pdf\b|\/assets\/cv/i);
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
    // so each was moved into the achievement card or the principle whose subject it
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

  it('states the blockchain scope boundary on the on-chain achievement itself', () => {
    // §3.9: SDK integration and transaction operation, no smart contract
    // authoring. Volunteering the limit is what makes the rest credible, so it
    // belongs in the card body — not in a footnote, and not omitted.
    for (const content of [en, fr]) {
      // Selected on the card's own prose now: the stack chips it used to be
      // found by went with the rest of the chips.
      const onChain = content.achievements.find((achievement) =>
        /Solana|Meteora/.test(`${achievement.context} ${achievement.approach}`),
      );
      expect(onChain, 'the on-chain achievement card is present').toBeDefined();
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

describe('Chantier C — the mirror', () => {
  it("leads each failure mode with the client's own sentence", () => {
    // The four modes were well written and addressed to a peer: "Double
    // execution", "A balance nobody can explain". The section's job is
    // recognition, not taxonomy — a reader who finds a sentence he has already
    // said out loud qualifies himself, and no summary does that as well.
    //
    // So the quote is the heading. It is asserted to actually be quoted,
    // because an unquoted first-person line reads as Thomas speaking, which
    // inverts the whole device.
    const marks: Record<'en' | 'fr', [string, string]> = {
      en: ['\u201c', '\u201d'],
      fr: ['\u00ab', '\u00bb'],
    };
    for (const [locale, content] of [
      ['en', en],
      ['fr', fr],
    ] as const) {
      const [open, close] = marks[locale];
      expect(content.failureModes).toHaveLength(4);
      for (const mode of content.failureModes) {
        expect(mode.quote.startsWith(open), `${locale}: ${mode.quote} is not quoted`).toBe(true);
        expect(mode.quote.endsWith(close), `${locale}: ${mode.quote} is not quoted`).toBe(true);
      }
    }
  });

  it('keeps the failure mode names the headings used to carry', () => {
    // The mirror replaced four labels that named a thing. The names are worth
    // keeping — they are the vocabulary the rest of the page argues in — so
    // each one now opens the diagnosis it used to title. This test is what
    // stops the rewrite from having quietly cost them.
    //
    // ADR 14 rewrote the four for the least technical reader: the orphan app
    // arrived, and "double execution" moved to the Reliability page, where the
    // Critical-systems reader looks for it (asserted with that page).
    const names: [RegExp, RegExp][] = [
      [/^The orphan application\./, /^L'application orpheline\./],
      [/^The migration that never happens\./, /^La migration qui n'arrive jamais\./],
      [/^The discrepancy nobody can explain\./, /^L'écart que personne ne sait expliquer\./],
      [/^Defects found by users\./, /^Les défauts trouvés par les utilisateurs\./],
    ];
    names.forEach(([enPattern, frPattern], i) => {
      expect(en.failureModes[i]?.text, `EN mode ${i} lost its name`).toMatch(enPattern);
      expect(fr.failureModes[i]?.text, `FR mode ${i} lost its name`).toMatch(frPattern);
    });
  });

  it('opens every achievement card in plain language, naming no technology', () => {
    // "In plain terms:" was Thomas's own device, used on the on-chain card and
    // nowhere else — one card in six. Generalising it as a habit is how it got
    // to one in six; generalising it as a field with a rule is what holds.
    //
    // The rule: the line says what the work was before any word a reader has to
    // learn. `schema.knowsAbout` is exactly the list of words this page teaches,
    // so it doubles as the blocklist and maintains itself.
    for (const [locale, content] of [
      ['en', en],
      ['fr', fr],
    ] as const) {
      expect(content.work.labelPlain.trim().endsWith(':')).toBe(true);

      for (const achievement of content.achievements) {
        expect(
          achievement.plain.trim().length,
          `${locale}: ${achievement.title} has no plain line`,
        ).toBeGreaterThan(0);

        // A lede, not a fourth facet. The context paragraph is where the detail
        // goes; this line has one job and loses it at four clauses.
        expect(
          achievement.plain.length,
          `${locale}: the plain line on ${achievement.title} is a paragraph`,
        ).toBeLessThan(160);

        for (const tech of content.schema.knowsAbout) {
          expect(
            achievement.plain,
            `${locale}: ${achievement.title} explains itself with ${tech}`,
          ).not.toContain(tech);
        }
      }
    }
  });

  it('names the work Achievements, and stops counting them in the heading', () => {
    // The glossary's term is Achievement (CONTEXT.md). The heading used to say
    // "six", which was true until the industrial ERP arrived; a count in a
    // heading is a number the next card makes wrong.
    for (const content of [en, fr]) {
      expect(content.work.title).not.toMatch(/\b(six|seven|sept|\d+)\b/i);
      expect(
        content.achievements.some((achievement) => achievement.org === 'Quadra Informatique'),
        'the industrial ERP Achievement is on the page',
      ).toBe(true);
    }
  });

  it('carries the plain-terms marker in the label, never inline in the prose', () => {
    // It used to be the first two words of one context paragraph. Now the
    // component renders it, so a second copy inside the content would print it
    // twice — and the card that has it inline is the card that stops being
    // rewritable without noticing.
    for (const [locale, content] of [
      ['en', en],
      ['fr', fr],
    ] as const) {
      for (const achievement of content.achievements) {
        const body = `${achievement.plain} ${achievement.context} ${achievement.approach} ${achievement.result}`;
        expect(body, `${locale}: ${achievement.title} still says it inline`).not.toMatch(
          /In plain terms|En clair/i,
        );
      }
    }
  });
});

describe('Offers and the price table (ADR 17)', () => {
  it('has a price table for every Offer, and nothing else', () => {
    expect(Object.keys(PRICES).sort()).toEqual([...OFFER_IDS].sort());
  });

  for (const offer of OFFER_IDS) {
    it(`prices every option combination of the ${offer} once, with ordered ranges`, () => {
      const table = PRICES[offer];
      expect(table.dimensions.length).toBeGreaterThan(0);
      expect(table.amounts.length).toBeGreaterThan(0);

      const expected = optionCombinations(table).map((options) => options.join(' × '));
      const actual = table.combinations.map((combination) => combination.options.join(' × '));
      expect([...actual].sort(), `${offer}: combinations`).toEqual([...expected].sort());

      for (const combination of table.combinations) {
        const name = `${offer} ${combination.options.join(' × ')}`;
        for (const amount of table.amounts) {
          const range = combination.amounts[amount];
          expect(range, `${name} has no ${amount}`).toBeDefined();
          expect(range?.min ?? 0, `${name} ${amount}`).toBeGreaterThan(0);
          expect(range?.min ?? 1, `${name} ${amount}: min above max`).toBeLessThanOrEqual(
            range?.max ?? 0,
          );
        }
        expect(Object.keys(combination.amounts).sort(), `${name}: undeclared amount`).toEqual(
          [...table.amounts].sort(),
        );
        if (table.duration) {
          expect(combination.weeks, `${name} has no duration`).toBeDefined();
          expect(combination.weeks?.min ?? 1).toBeLessThanOrEqual(combination.weeks?.max ?? 0);
        } else {
          expect(combination.weeks, `${name}: a duration the table does not declare`).toBe(
            undefined,
          );
        }
      }
    });
  }

  it('cites only Achievements that exist, in every locale', () => {
    for (const [locale, content] of [
      ['en', en],
      ['fr', fr],
    ] as const) {
      const ids = content.achievements.map((achievement) => achievement.id);
      for (const offer of OFFER_IDS) {
        for (const cited of OFFERS[offer].achievements) {
          expect(ids, `${locale}: ${offer} cites ${cited}`).toContain(cited);
        }
      }
    }
  });

  it('names each Achievement the same way in both locales', () => {
    // The ids are how an Offer cites proof in any language; parity checks the
    // shape, this checks they line up.
    expect(fr.achievements.map((a) => a.id)).toEqual(en.achievements.map((a) => a.id));
    expect(new Set(en.achievements.map((a) => a.id)).size).toBe(en.achievements.length);
  });

  it('opens every Offer in plain language, naming no technology', () => {
    // ADR 12's rule, extended by ADR 14 to the Offers: the plain line is what
    // the least technical reader reads first, so it names nothing to learn.
    for (const [locale, content] of [
      ['en', en],
      ['fr', fr],
    ] as const) {
      for (const offer of OFFER_IDS) {
        const { name, plain } = content.offers[offer];
        expect(plain.length, `${locale}: ${name}'s plain line is a paragraph`).toBeLessThan(160);
        for (const tech of content.schema.knowsAbout) {
          expect(plain, `${locale}: ${name} explains itself with ${tech}`).not.toContain(tech);
        }
      }
    }
  });

  it("labels every slider, option, amount and duration an Offer's table declares", () => {
    for (const [locale, content] of [
      ['en', en],
      ['fr', fr],
    ] as const) {
      for (const offer of OFFER_IDS) {
        const pages: ResumeContent['offerPages'] = content.offerPages;
        const page = pages[offer];
        if (!page) continue;
        const table = PRICES[offer];
        for (const dimension of table.dimensions) {
          const labels = page.estimator.dimensions[dimension.id];
          expect(labels?.label, `${locale}: ${offer} ${dimension.id} has no label`).toBeTruthy();
          for (const option of dimension.options) {
            expect(
              labels?.options[option],
              `${locale}: ${offer} ${dimension.id}=${option} has no label`,
            ).toBeTruthy();
          }
        }
        for (const amount of table.amounts) {
          expect(page.estimator.amounts[amount], `${locale}: ${offer} ${amount}`).toBeTruthy();
        }
        expect(Boolean(page.estimator.duration), `${locale}: ${offer} duration label`).toBe(
          Boolean(table.duration),
        );
      }
    }
  });

  it("quotes every Offer page's Client sentences", () => {
    const marks = { en: ['“', '”'], fr: ['«', '»'] } as const;
    for (const [locale, content] of [
      ['en', en],
      ['fr', fr],
    ] as const) {
      const [open, close] = marks[locale];
      for (const [offer, page] of Object.entries(content.offerPages)) {
        const treated = content.failureModes.filter((mode) => mode.offer === offer);
        expect(
          treated.length + page.sentences.length,
          `${locale}: ${offer} answers no sentence`,
        ).toBeGreaterThan(0);
        for (const sentence of page.sentences) {
          expect(sentence.startsWith(open) && sentence.endsWith(close), sentence).toBe(true);
        }
      }
    }
  });

  it("states the Audit's commercial rule and its due diligence variant", () => {
    expect(en.offerPages.audit?.rules.join(' ')).toMatch(/deducted/);
    expect(fr.offerPages.audit?.rules.join(' ')).toMatch(/déduit/);
    expect(en.offerPages.audit?.variant?.title).toMatch(/due diligence/i);
    expect(fr.offerPages.audit?.variant?.title).toMatch(/due diligence/i);
  });
});

describe('what each Offer page has to say (ADR 17)', () => {
  const pagesOf = (content: ResumeContent) => content.offerPages;

  it('starts a Takeover with the test safety net, and presents both plans', () => {
    const takeover = pagesOf(fr).takeover;
    expect(takeover, 'the Takeover page exists in French').toBeDefined();
    expect(pagesOf(en).takeover, 'the Takeover is French only').toBeUndefined();
    expect(takeover?.steps[0]?.title).toMatch(/filet de tests/i);
    expect(takeover?.rules.join(' ')).toMatch(/filet de tests/i);
    const delivered = takeover?.delivered.map((item) => item.title).join(' ') ?? '';
    expect(delivered).toMatch(/Veille/);
    expect(delivered).toMatch(/Évolution/);
    expect(PRICES.takeover.amounts).toEqual(['setup', 'monthly']);
    expect(OFFERS.takeover.achievements).toContain('industrial-erp');
  });

  it('sells a Migration in two phases, priced by version gap and test coverage', () => {
    expect(PRICES.migration.dimensions.map((d) => d.id)).toEqual(['gap', 'coverage']);
    expect(pagesOf(en).migration?.rules.join(' ')).toMatch(/two phases/);
    expect(pagesOf(fr).migration?.rules.join(' ')).toMatch(/deux phases/);
    // The plan is the fixed-price first phase: one range, inside the published one.
    for (const combination of PRICES.migration.combinations) {
      expect(combination.amounts.plan?.min).toBeGreaterThanOrEqual(2000);
      expect(combination.amounts.plan?.max).toBeLessThanOrEqual(4000);
    }
  });

  it('addresses double execution on the Reliability page, with one slider', () => {
    expect(PRICES.reliability.dimensions).toHaveLength(1);
    for (const content of [en, fr]) {
      const page = pagesOf(content).reliability;
      const everywhere = [...walkStrings(page)].map(([, text]) => text).join(' ');
      expect(everywhere).toMatch(/double execution|double exécution/i);
    }
  });

  it('publishes a 600–750 € day rate, and Reinforcement is priced from it', () => {
    expect(DAY_RATE).toEqual({ min: 600, max: 750 });
    expect(PRICES.reinforcement.dimensions.map((d) => d.id)).toEqual(['days']);
    const oneDay = combinationFor(PRICES.reinforcement, ['1'])?.amounts.monthly;
    // "from about 2,600 a month at one day a week"
    expect(oneDay?.min).toBe(2600);
    for (const content of [en, fr]) {
      expect(pagesOf(content).reinforcement?.dayRate).toBeDefined();
    }
  });

  it('states the capacity rule as a rule, never as a state that could go stale', () => {
    // "Two Clients at a time, never more" (ADR 17) — a rule cannot expire; a
    // "currently available" or a date can, like the line ADR 11 removed.
    expect(pagesOf(en).reinforcement?.rules.join(' ')).toMatch(
      /two clients at a time, never more/i,
    );
    expect(pagesOf(fr).reinforcement?.rules.join(' ')).toMatch(
      /deux clients à la fois, jamais plus/i,
    );
    for (const content of [en, fr]) {
      const page = pagesOf(content).reinforcement;
      const everywhere = [...walkStrings(page)].map(([, text]) => text).join(' ');
      expect(everywhere).not.toMatch(/\b(19|20)\d{2}\b/);
      expect(everywhere).not.toMatch(/available|disponible|currently|actuellement|complet/i);
    }
  });

  it('puts each Concept on the Offer ADR 14 moves it to', () => {
    const expected: Record<string, [string, string][]> = {
      audit: [
        ['Footprint', 'Empreinte'],
        ['Build-vs-buy', 'Build-vs-buy'],
      ],
      migration: [['Invisible redesign', 'Refonte invisible']],
      reliability: [['Traceable', 'Traçable']],
      reinforcement: [
        ['Shared service', 'Service partagé'],
        ['Handover', 'Transmission'],
      ],
    };
    for (const [offer, labels] of Object.entries(expected)) {
      const id = offer as keyof ResumeContent['offerPages'];
      expect(pagesOf(en)[id]?.concepts.map((c) => c.label)).toEqual(labels.map(([e]) => e));
      expect(pagesOf(fr)[id]?.concepts.map((c) => c.label)).toEqual(labels.map(([, f]) => f));
    }
  });
});

describe('the Partners page (ADR 14)', () => {
  it('exists in French only', () => {
    expect(fr.partnersPage).toBeDefined();
    expect((en as ResumeContent).partnersPage).toBeUndefined();
  });

  it("accepts white label, follows the Partner's conventions, and sends the CV on request", () => {
    const titles = fr.partnersPage.points.map((point) => point.title).join(' ');
    expect(titles).toMatch(/marque blanche/i);
    expect(titles).toMatch(/conventions/i);
    expect(titles).toMatch(/CV sur demande/i);
  });

  it('opens in plain language, naming no technology', () => {
    // Its plain line is a lede like an Offer's, so ADR 12's rule holds here too.
    const { plain } = fr.partnersPage;
    expect(plain.length).toBeLessThan(160);
    for (const tech of fr.schema.knowsAbout) {
      expect(plain, `the Partners page explains itself with ${tech}`).not.toContain(tech);
    }
  });

  it('carries no copy of the day rate: it is read from the price table', () => {
    for (const [path, text] of walkStrings(fr.partnersPage)) {
      expect(text, `a price is copied at ${path}`).not.toMatch(
        new RegExp(`\\b(${DAY_RATE.min}|${DAY_RATE.max})\\b`),
      );
    }
  });
});

describe('the home page, written for the least technical reader (ADR 14)', () => {
  it('holds the hero to the plain-line rule', () => {
    for (const [locale, content] of [
      ['en', en],
      ['fr', fr],
    ] as const) {
      const hero = Object.values(content.hero).join(' ');
      expect(content.hero.blurb.length, `${locale}: the hero is a paragraph`).toBeLessThan(160);
      for (const tech of content.schema.knowsAbout) {
        expect(hero, `${locale}: the hero says ${tech}`).not.toContain(tech);
      }
    }
  });

  it('names no job title in the title or the description', () => {
    // They were the SERP identity of a résumé (ADR 11 left them on purpose);
    // a site that sells Offers is found by what it sells.
    for (const content of [en, fr]) {
      for (const text of [content.meta.title, content.meta.description]) {
        expect(text).not.toMatch(/engineer|ingénieur|architect|developer|développeur/i);
      }
    }
  });
});

describe('each Failure mode is treated by one Offer (ADR 14)', () => {
  it('references exactly one existing Offer, the one ADR 14 names', () => {
    for (const [locale, content] of [
      ['en', en],
      ['fr', fr],
    ] as const) {
      for (const mode of content.failureModes) {
        expect(OFFER_IDS, `${locale}: ${mode.quote}`).toContain(mode.offer);
        // An existing Offer has a page, in some locale.
        expect(
          PAGES.find((page) => page.id === mode.offer),
          `${locale}: ${mode.offer} has no page`,
        ).toBeDefined();
      }
      expect(content.failureModes.map((mode) => mode.offer)).toEqual([
        'takeover',
        'migration',
        'reliability',
        'reliability',
      ]);
    }
  });

  it('leaves the Audit treating none: it is the way in for all four', () => {
    for (const content of [en, fr] as ResumeContent[]) {
      expect(content.failureModes.some((mode) => mode.offer === 'audit')).toBe(false);
      expect(content.problem.audit.cta.trim().length).toBeGreaterThan(0);
    }
  });

  it('attaches each Concept to exactly one Offer, and none to the home page', () => {
    for (const content of [en, fr] as ResumeContent[]) {
      const labels = Object.values(content.offerPages).flatMap((page) =>
        page.concepts.map((concept) => concept.label),
      );
      expect(labels).toHaveLength(6);
      expect(new Set(labels).size, 'a Concept is on two Offers').toBe(labels.length);
      expect('concepts' in content, 'the home page still carries Concepts').toBe(false);
    }
  });
});
