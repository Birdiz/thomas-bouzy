import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { en } from '../src/content/en.ts';
import { fr } from '../src/content/fr.ts';
import { contentOfPage, RESUME, type ResumeContent } from '../src/content/index.ts';
import { ENTRY_OFFER, OFFER_IDS, OFFERS, REFERENCES, SITUATIONS } from '../src/content/offers.ts';
import {
  AUDIT_CREDIT,
  AUDIT_EXPRESS_FEE,
  combinationFor,
  DAY_RATE,
  defaultOption,
  fromPrice,
  MAX_DAYS_PER_WEEK,
  optionCombinations,
  PRICES,
  totalOf,
} from '../src/content/prices.ts';
import { frenchSpacing } from '../src/lib/french-spacing.ts';
import { fromLine } from '../src/lib/offer-price.ts';
import { fillPrices } from '../src/lib/price-tokens.ts';
import { PAGES } from '../src/routes.ts';
import { LOCALES, OFFERS_PUBLISHED } from '../src/site.ts';

/**
 * The TypeScript contract (src/content/types.ts) already guarantees that both
 * locales carry the same keys — a missing one is a compile error. These tests
 * cover the invariants types cannot express:
 *
 *   - array lengths matching at every depth (9 achievements EN, 9 FR)
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

/**
 * The home page's French-only sections, left out of the comparison: the
 * Workshops are for French owners and exist in French only (ADR 27), as the
 * Partners page does, and so does the field study (ADR 34). Their own tests
 * below hold them to that.
 */
function withoutFrenchOnly(content: unknown): unknown {
  if (!content || typeof content !== 'object' || !('workshops' in content)) return content;
  const { workshops: _, fieldStudy, ...rest } = content as Record<string, unknown>;
  const { survey: _survey, ...study } = (fieldStudy ?? {}) as Record<string, unknown>;
  return { ...rest, fieldStudy: study };
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
        expect(shapeOf(withoutFrenchOnly(contentOfPage('fr', page.id)))).toEqual(
          shapeOf(withoutFrenchOnly(contentOfPage('en', page.id))),
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
      '$.nav.about',
      '$.nav.contact',
      '$.hero.title',
      '$.hero.blurb',
      '$.hero.role',
      '$.hero.region',
      '$.hero.ctaSecondary',
      '$.hero.proof',
      '$.offersSection.title',
      '$.offersSection.question',
      '$.offersSection.situations[0].lead',
      '$.work.kicker',
      '$.work.title',
      '$.work.intro',
      '$.references.socios.headline',
      '$.work.labelPlain',
      '$.failureModes[0].quote',
      '$.achievements[0].plain',
      '$.offerPages.audit.heading',
      '$.offerPages.audit.priceHeading',
      '$.about.title',
      '$.about.paragraphs[0]',
      '$.about.careerLink',
      '$.contact.title',
      '$.contact.blurb',
      '$.contact.cta',
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

describe('French typography', () => {
  // A plain space before `?` lets the browser wrap the mark onto a line of its
  // own: the home page's Problem title ended on a lone "?" at 1280px. fr.ts is
  // typed with plain spaces; src/lib/french-spacing.ts makes them unbreakable
  // on the way to the page.
  it('never leaves a plain space before ? : ; ! » or after « in the French the pages read', () => {
    const breakable = [...walkStrings(RESUME.fr)]
      .filter(([, text]) => / [?:;!»]|« /.test(text))
      .map(([path, text]) => `${path}: ${text}`);
    expect(breakable).toEqual([]);
  });

  it('says vous to the reader, never tu', () => {
    // ADR 26 reversed ADR 24's tu. A rebase from the voice brief, which still
    // says tu, is the likeliest way for it to come back. Imperatives
    // ("réserve") slip past a pronoun check; the pronouns and possessives do not.
    const TU =
      /(?<![\p{L}'’-])(?:tu|toi|ton|ta|tes|te|t['’](?=\p{L}))(?![\p{L}'’])|-(?:toi|tu)(?!\p{L})/iu;
    const tutoie = [...walkStrings(fr)]
      .filter(([, text]) => TU.test(text))
      .map(([path, text]) => `${path}: ${text}`);
    expect(tutoie).toEqual([]);
  });

  it('gives the French to the pages through RESUME only', () => {
    // A page that imported fr.ts itself would get the plain spaces back.
    const sources = readdirSync('src', { recursive: true, encoding: 'utf8' })
      .filter((file) => /\.(ts|astro)$/.test(file) && file !== 'content/index.ts')
      .filter((file) => /from '[^']*\/fr\.ts'/.test(readFileSync(`src/${file}`, 'utf8')));
    expect(sources).toEqual([]);
  });

  it('uses a thin space before ; ? ! and a word space before : and inside guillemets', () => {
    expect(frenchSpacing('« Et ça ; et ça ? Oui ! Enfin : non. »')).toBe(
      '«\u00a0Et ça\u202f; et ça\u202f? Oui\u202f! Enfin\u00a0: non.\u00a0»',
    );
  });

  it('keeps a number in one piece, with the thin space Intl puts in prices', () => {
    // « plus de 1 000 membres » broke between 1 and 000 on a phone.
    expect(frenchSpacing('31 273 associations, plus de 1 000 membres, 1 234 567 lignes')).toBe(
      '31 273 associations, plus de 1 000 membres, 1 234 567 lignes',
    );
    expect(new Intl.NumberFormat('fr-FR').format(1000)).toBe('1 000');
    // Only thousands: a phone number, a year beside a number, a range stay as typed.
    for (const text of ['06 32 13 45 47', 'en 2019 300 personnes', '1 à 4 jours', '12 3456']) {
      expect(frenchSpacing(text)).toBe(text);
    }
  });
});

describe('content corrections applied against the design', () => {
  it('points to the career on LinkedIn, and asks no reader whether they are hiring', () => {
    // Chantier A took the chronology, the job title, the years badge and the
    // stack off the page and left them to the CV; the postscript to ADR 11
    // took the CV off the site too. That only holds if a reader is still told
    // where the career is — otherwise the removal is a dead end rather than a
    // move.
    for (const content of [en, fr]) {
      expect(content.about.careerLink).toMatch(/LinkedIn/);
      // Never from the hero again: the download used to sit in the first
      // viewport as an equal alternative to the work itself.
      expect(Object.values(content.hero).join(' ')).not.toMatch(/CV|PDF|LinkedIn/);
      // ADR 28: "En poste plutôt qu'en mission ?" read, to a business owner
      // buying continuity, as Thomas looking for a job.
      expect('careerLine' in content.about).toBe(false);
      for (const [path, text] of walkStrings(content)) {
        expect(text, `a question to a recruiter at ${path}`).not.toMatch(
          /plutôt qu'en mission|rather than contracting/i,
        );
      }
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
    // On the About page since the contact line became a promise to come
    // (ADR 28); the Reinforcement's FAQ says it too.
    const about = (content: ResumeContent) => JSON.stringify(content.aboutPage.paragraphs);
    expect(about(en)).toMatch(/for eight years/);
    expect(about(fr)).toMatch(/depuis huit ans/);
    expect(about(en)).not.toMatch(/six years/);
    expect(about(fr)).not.toMatch(/six ans/);
  });

  it('gives the location as a region, never narrower', () => {
    // Thomas's call is to stop at the region and not publish the département:
    // a recruiter needs the timezone and the country, and neither tells them
    // more. The first screen names the region (ADR 28).
    //
    // The name is checked by hash, so that the repository, which is public,
    // does not publish what the page withholds.
    const WITHHELD = new Set(['813fda261f058093793ac9cf52f4f99613455fe90500724565653bf06c01dc76']);
    const hashOf = (word: string) => createHash('sha256').update(word).digest('hex');
    expect(fr.hero.region).toBe('Grand Est');
    expect(en.hero.region).toMatch(/France/);
    for (const content of [en, fr]) {
      const everywhere = [...walkStrings(content)].map(([, text]) => text).join(' ');
      const words = everywhere.toLowerCase().match(/\p{L}+/gu) ?? [];
      expect(words.filter((word) => WITHHELD.has(hashOf(word)))).toEqual([]);
      // Nor a département number, the way "Grand Est (NN)" would give it.
      expect(everywhere).not.toMatch(/\(\d{2}\)/);
    }
  });

  it('applies the three honesty levels to the Achievements themselves', () => {
    // §4.5 of the pitch master is a strict personal rule: "production
    // experience" / "personal projects" / "currently learning", never merged
    // into one undifferentiated list. It was carried by the Toolkit grid, then
    // stated as a principle (ADR 9, postscript 2). ADR 20 gave that principle's
    // place to one a Client buys on, and the rule is now held where it applies:
    // a card that was not salaried production work says what it was in its
    // byline (ADR 19 records the open-data tool as client work).
    for (const content of [en, fr]) {
      const byline = (id: string) =>
        content.achievements.find((achievement) => achievement.id === id)?.org ?? '';
      expect(byline('open-data-directories')).toMatch(/for a client|pour un client/i);
      expect(byline('codebase-audit')).toMatch(/volunteer|bénévolat/i);
      expect(byline('staircase-calculator')).toMatch(/personal product|produit personnel/i);
      expect(byline('village-website')).toMatch(/volunteer|bénévolat/i);
    }
  });

  it('says under every Reference in what capacity the work was done', () => {
    // ADR 28 (D7): the salaried posts went unlabelled beside a labelled
    // volunteer project, so a post could be read as a client. Each one now
    // says what it was, as Thomas confirmed it.
    for (const content of [en, fr]) {
      for (const [id, reference] of Object.entries(content.references)) {
        expect(reference.nature.trim(), `${id} says nothing of its nature`).not.toBe('');
      }
    }
    expect(fr.references.socios.nature).toBe('En poste');
    expect(fr.references.arcelormittal.nature).toMatch(/^En poste chez Quadra Informatique$/);
    expect(fr.references['kiss-the-bride'].nature).toBe("En mission d'indépendant");
    expect(fr.references['civic-tech'].nature).toBe('Bénévolat');
    expect(fr.references.grandrupt.nature).toBe('Bénévolat');
    expect(fr.references['open-data'].nature).toBe('Pour un client');
    expect(fr.references['quart-de-tour'].nature).toBe('Produit personnel');
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

  it('keeps the measurements that only the Track record used to carry', () => {
    // Chantier A deleted the Track record. Four of its facts appeared nowhere
    // else, and a measurement does not survive being replaced by a download —
    // so each was moved into the achievement card whose subject it already was. This is the test that says so: it fails if a rewrite of any
    // of those hosts quietly drops what it inherited.
    const survivors: [string, RegExp, RegExp][] = [
      ['platform scale', /1\.5 million users/, /1,5 million d'utilisateurs/],
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
        /Solana|Meteora/.test(achievement.approach ?? ''),
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
      expect(content.failureModes).toHaveLength(5);
      for (const mode of content.failureModes) {
        expect(mode.quote.startsWith(open), `${locale}: ${mode.quote} is not quoted`).toBe(true);
        expect(mode.quote.endsWith(close), `${locale}: ${mode.quote} is not quoted`).toBe(true);
      }
    }
  });

  it('lets each Client sentence stand alone, with the Offer that treats it', () => {
    // ADR 28: the diagnosis under each sentence, and the name it opened on,
    // left the home page with the carousel that hid them from most readers.
    // The sentence is the whole device, its Offer's row beside it (ADR 32);
    // the names stay in the glossary (CONTEXT.md). The one technical word left
    // among them went too.
    for (const content of [en, fr]) {
      for (const mode of content.failureModes) {
        expect(Object.keys(mode).sort(), mode.quote).toEqual(['offer', 'quote']);
      }
    }
    expect(fr.failureModes.map((mode) => mode.quote).join(' ')).not.toMatch(/montée de version/);
    expect(fr.offersSection.question).toMatch(/\?$/);
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

        // A lede, not a third facet. The approach and the result are where the
        // detail goes; this line has one job and loses it at four clauses.
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
      const erp = content.achievements.find(
        (achievement) => achievement.org === 'Quadra Informatique',
      );
      expect(erp, 'the industrial ERP Achievement is on the page').toBeDefined();
      // The only proof the orphan-app Segment has. It carried no fact until
      // ADR 20; the plants it ran in are the fact, and must not be lost.
      expect(`${erp?.title} ${erp?.result}`).toMatch(/ArcelorMittal/);
    }
  });

  it('carries the plain-terms marker in the label, never inline in the prose', () => {
    // It used to be the first two words of one card's prose. Now the
    // component renders it, so a second copy inside the content would print it
    // twice — and the card that has it inline is the card that stops being
    // rewritable without noticing.
    for (const [locale, content] of [
      ['en', en],
      ['fr', fr],
    ] as const) {
      for (const achievement of content.achievements) {
        const body = `${achievement.plain} ${achievement.approach} ${achievement.result}`;
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
            // Notes are all or nothing: a slider that explains two options of three
            // leaves the reader guessing at the third.
            if (labels?.notes) {
              expect(
                labels.notes[option],
                `${locale}: ${offer} ${dimension.id}=${option} has no note`,
              ).toBeTruthy();
            }
          }
        }
        for (const amount of table.amounts) {
          expect(page.estimator.amounts[amount], `${locale}: ${offer} ${amount}`).toBeTruthy();
        }
        expect(Boolean(page.estimator.duration), `${locale}: ${offer} duration label`).toBe(
          Boolean(table.duration),
        );
        expect(Boolean(page.estimator.total), `${locale}: ${offer} total label`).toBe(
          Boolean(table.total),
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
    expect(fr.offerPages.audit?.rules.join(' ')).toMatch(/dédui[st]/);
    // The credit is the express fee, read from the price table: uncapped, a
    // full Audit would wipe out a Takeover's set-up (ADR 18).
    expect(AUDIT_CREDIT).toBe(AUDIT_EXPRESS_FEE);
    // Depth first, and explained: the express fee is the same whatever the
    // size, so a size slider first moved nothing, and Express against Full
    // said what each cost and not what each was.
    expect(PRICES.audit.dimensions.map((d) => d.id)).toEqual(['depth', 'size']);
    for (const content of [en, fr]) {
      expect(
        Object.keys(content.offerPages.audit?.estimator.dimensions.depth?.notes ?? {}),
      ).toEqual(['express', 'full']);
    }
    for (const content of [en, fr]) {
      expect(content.offerPages.audit?.rules.join(' ')).toContain('{credit}');
    }
    expect(en.offerPages.audit?.variant?.title).toMatch(/due diligence/i);
    expect(fr.offerPages.audit?.variant?.title).toMatch(/due diligence/i);
  });
});

describe('the Offers by situation, and what their cards say (ADR 30)', () => {
  it('puts every Offer in one situation, the Entry offer first', () => {
    const grouped = SITUATIONS.flat();
    expect([...grouped].sort()).toEqual([...OFFER_IDS].sort());
    expect(new Set(grouped).size).toBe(grouped.length);
    expect(SITUATIONS[0]?.[0]).toBe(ENTRY_OFFER);
    for (const content of [en, fr]) {
      expect(content.offersSection.situations).toHaveLength(SITUATIONS.length);
    }
  });

  it("leaves the technical team's Offers last, and sells every other to an orphan application", () => {
    // The groups follow the Segments in offers.ts: a business owner with an
    // orphan application reads four Offers, not seven.
    const team = SITUATIONS[SITUATIONS.length - 1] ?? [];
    for (const offer of team) {
      expect(OFFERS[offer].segments, offer).not.toContain('orphan-app');
    }
    for (const offer of SITUATIONS.slice(0, -1).flat()) {
      expect(OFFERS[offer].segments, offer).toContain('orphan-app');
    }
  });

  it("gives a missing tool its owner's sentence, quoted", () => {
    const [, missing] = fr.offersSection.situations;
    expect(missing.sentence).toMatch(/^« .*Excel\. »$/);
    const [, missingEn] = en.offersSection.situations;
    expect(missingEn.sentence).toMatch(/^“.*”$/);
  });

  it('names the step a two-phase Offer starts with, and its price from the table', () => {
    // « Première étape à partir de » hid that the step was one of two.
    for (const [locale, content] of [
      ['en', en],
      ['fr', fr],
    ] as const) {
      const offers: ResumeContent['offers'] = content.offers;
      for (const offer of OFFER_IDS) {
        const twoPhases = PRICES[offer].amounts[0] === 'plan';
        expect(Boolean(offers[offer].phase), `${locale}: ${offer}`).toBe(twoPhases);
      }
      expect(content.offersSection.from.plan).not.toMatch(/étape|step/);
    }
    const nbsp = (text: string) => text.replaceAll(' ', '\u00a0');
    expect(fromLine('build', 'fr', RESUME.fr)).toBe(
      `cadrage dès ${nbsp(`${fromPrice('build').min.toLocaleString('fr-FR')} € HT`)}`,
    );
    expect(fromLine('migration', 'fr', RESUME.fr)).toMatch(/^plan dès /);
    expect(fromLine('scaling', 'fr', RESUME.fr)).toMatch(/^diagnostic dès /);
  });

  it("fills in the prices an Offer's plain line names", () => {
    // « 1 à {maxDays} jours » reaches the card, the page, the share card and
    // the structured data through RESUME.
    expect(fr.offers.reinforcement.plain).toContain('{maxDays}');
    for (const locale of LOCALES) {
      for (const offer of OFFER_IDS) {
        expect(RESUME[locale].offers[offer].plain, `${locale}: ${offer}`).not.toMatch(/\{\w+\}/);
      }
      expect(RESUME[locale].offers.reinforcement.plain).toContain(String(MAX_DAYS_PER_WEEK));
    }
  });

  it('keeps an Achievement without its facets off the References, where they are read', () => {
    // An Achievement Thomas has not yet described in full is cited on an Offer
    // page only, which shows its title and plain line (ADR 30).
    for (const content of [en, fr]) {
      for (const reference of REFERENCES) {
        for (const id of reference.achievements) {
          const achievement = content.achievements.find((candidate) => candidate.id === id);
          expect(achievement?.approach, `${reference.id}: ${id}`).toBeTruthy();
          expect(achievement?.result, `${reference.id}: ${id}`).toBeTruthy();
        }
      }
    }
  });
});

describe('what each Offer page has to say (ADR 17)', () => {
  const pagesOf = (content: ResumeContent) => content.offerPages;

  it('starts a Takeover with the test safety net, and presents both plans', () => {
    const takeover = pagesOf(fr).takeover;
    expect(takeover, 'the Takeover page exists in French').toBeDefined();
    expect(pagesOf(en).takeover, 'the Takeover is French only').toBeUndefined();
    // The deliverables are listed in the order the Client receives them, and
    // the first states the rule: the net before any change. The rules no
    // longer repeat it; the page said it four times (ADR 30).
    expect(takeover?.delivered[0]?.title).toMatch(/filet de tests/i);
    expect(takeover?.delivered[0]?.text).toMatch(/avant toute modification/);
    const delivered = takeover?.delivered.map((item) => item.title).join(' ') ?? '';
    expect(delivered).toMatch(/Veille/);
    expect(delivered).toMatch(/Évolution/);
    expect(PRICES.takeover.amounts).toEqual(['setup', 'monthly']);
    expect(OFFERS.takeover.achievements).toContain('industrial-erp');
  });

  it("caps a Takeover month's incidents, prices what goes beyond, and credits the Audit", () => {
    const takeover = pagesOf(fr).takeover;
    // Half a day of incidents a month, not half a day each (ADR 18).
    expect(takeover?.delivered[3]?.text).toMatch(/jusqu'à une demi-journée d'incidents/);
    expect(takeover?.delivered[3]?.text).not.toMatch(/chacun/);
    // Three rules, not five (ADR 30): what each plan's tests cover, what goes
    // beyond the plan, and the Audit's credit.
    expect(takeover?.rules).toHaveLength(3);
    const rules = takeover?.rules.join(' ') ?? '';
    expect(rules).toMatch(/Évolution, toute l'application/);
    expect(rules).toContain('{dayRate}');
    expect(rules).toMatch(/ne se reportent pas/);
    expect(rules).toContain('{credit}');
  });

  it('answers what an owner left by a provider asks, with the facts Thomas gave (ADR 30)', () => {
    const answers = Object.fromEntries(
      (pagesOf(fr).takeover?.faq ?? []).map((entry) => [entry.question, entry.answer]),
    );
    expect(answers['Et quand ça plante ?']).toMatch(/sous 48 heures ouvrées/);
    expect(answers['Et quand ça plante ?']).toMatch(/Pas d'astreinte la nuit ni le week-end/);
    expect(answers['Et pendant vos congés ?']).toMatch(/un mois avant/);
    expect(answers["Faut-il récupérer le code auprès de l'ancien prestataire ?"]).toMatch(
      /sur le serveur et dans les sauvegardes/,
    );
    // Not confirmed: whether a Build replaces an Access or WinDev tool. The
    // sentence stays as Thomas wrote it until he says (ADR 30).
    expect(answers['Est-ce de la TMA ? Pour quelles technologies ?']).toMatch(
      /Pas de WinDev ni d'Access\.$/,
    );
  });

  it('shows the first year of a Takeover, set-up and twelve months', () => {
    expect(PRICES.takeover.total).toBe('firstYear');
    const first = combinationFor(PRICES.takeover, ['small', 'watch']);
    if (!first) throw new Error('no small Watch Takeover');
    // The audit's figure: 2,000 € of set-up, then twelve months from 350 €.
    expect(totalOf(PRICES.takeover, first)).toEqual({ min: 6200, max: 8400 });
  });

  it('shows what an Evolution month is made of: its Watch month, plus days at the day rate', () => {
    for (const size of ['small', 'medium', 'large']) {
      const watch = combinationFor(PRICES.takeover, [size, 'watch']);
      const evolution = combinationFor(PRICES.takeover, [size, 'evolution']);
      const days = evolution?.daysIncluded ?? 0;
      expect(watch?.daysIncluded).toBeUndefined();
      expect(days).toBeGreaterThan(0);
      expect(evolution?.amounts.monthly).toEqual({
        min: (watch?.amounts.monthly?.min ?? 0) + days * DAY_RATE,
        max: (watch?.amounts.monthly?.max ?? 0) + days * DAY_RATE,
      });
    }
    expect(pagesOf(fr).takeover?.estimator.daysIncluded).toContain('{days}');
  });

  it('shows the whole budget of a two-phase Offer, and ends its first phase on a written ceiling', () => {
    // The first phase alone was 12 to 33 % of the budget a reader would end up
    // paying (ADR 30). The total adds the second phase's weeks at the day rate,
    // four days a week at most: the ceiling the Build's FAQ taught.
    for (const offer of OFFER_IDS) {
      const table = PRICES[offer];
      const twoPhases = table.amounts[0] === 'plan' && table.duration === 'execution';
      expect(table.total, offer).toBe(
        twoPhases ? 'phases' : offer === 'takeover' ? 'firstYear' : undefined,
      );
    }
    const build = combinationFor(PRICES.build, ['small', 'none']);
    if (!build) throw new Error('no small Build');
    expect(totalOf(PRICES.build, build)).toEqual({ min: 8250, max: 13200 });
    for (const combination of PRICES.migration.combinations) {
      const total = totalOf(PRICES.migration, combination);
      const plan = combination.amounts.plan;
      const weeks = combination.weeks;
      expect(total?.min).toBe((plan?.min ?? 0) + (weeks?.min ?? 0) * MAX_DAYS_PER_WEEK * DAY_RATE);
      expect(total?.max).toBe((plan?.max ?? 0) + (weeks?.max ?? 0) * MAX_DAYS_PER_WEEK * DAY_RATE);
    }
    for (const offer of ['migration', 'scaling', 'build'] as const) {
      expect(pagesOf(fr)[offer]?.rules.join(' '), offer).toMatch(/plafond écrit/);
      expect(pagesOf(en)[offer]?.rules.join(' '), offer).toMatch(/written ceiling/);
    }
    // « Au plus » belongs to the days the total is computed on, not to the
    // total's name (ADR 30, postscript): the label states no limit, the note does.
    for (const offer of ['migration', 'scaling', 'build'] as const) {
      const total = {
        fr: pagesOf(fr)[offer]?.estimator.total,
        en: pagesOf(en)[offer]?.estimator.total,
      };
      expect(total.fr?.label, offer).not.toMatch(/au plus/);
      expect(total.fr?.note, offer).toMatch(/\{maxDays\} jours par semaine au plus\.$/);
      expect(total.en?.label, offer).not.toMatch(/at most/);
      expect(total.en?.note, offer).toMatch(/\{maxDays\} days a week at most\.$/);
    }
  });

  it('opens a technical criterion on its median case, and says how to answer it', () => {
    // Opened on the cheapest case, the estimator gave the lowest price to the
    // reader who did not know their coverage (ADR 30).
    for (const offer of OFFER_IDS) {
      for (const dimension of PRICES[offer].dimensions) {
        expect(dimension.options, `${offer} ${dimension.id}`).toContain(defaultOption(dimension));
      }
    }
    for (const [offer, id] of [
      ['migration', 'coverage'],
      ['scaling', 'observability'],
    ] as const) {
      const dimension = PRICES[offer].dimensions.find((candidate) => candidate.id === id);
      expect(dimension && defaultOption(dimension), `${offer} ${id}`).toBe('partial');
      expect(pagesOf(fr)[offer]?.estimator.dimensions[id]?.help).toMatch(
        /Vous ne savez pas \? Choisissez « Aucune » : c'est l'estimation haute\.$/,
      );
      expect(pagesOf(en)[offer]?.estimator.dimensions[id]?.help).toMatch(/Not sure\?/);
    }
  });

  it('proves each Offer with a line of its own, one Achievement at a time (ADR 30)', () => {
    for (const content of [en, fr]) {
      for (const [offer, page] of Object.entries(pagesOf(content))) {
        for (const id of Object.keys(page.proof ?? {})) {
          expect(
            OFFERS[offer as keyof typeof OFFERS].achievements,
            `${offer} proves ${id}`,
          ).toContain(id);
        }
      }
    }
    // The audit of someone else's code, alone: the API redesign proved nothing
    // an audit sells.
    expect(OFFERS.audit.achievements).toEqual(['codebase-audit']);
    expect(pagesOf(fr).migration?.proof?.['enterprise-onboarding']).toMatch(
      /deux versions majeures sans jamais l'arrêter/,
    );
    expect(pagesOf(fr).scaling?.proof?.['wallet-event-sourcing']).toMatch(
      /1 000 transactions par minute/,
    );
    // The application Socios.com bought is Thomas's own work: a Takeover's proof.
    expect(OFFERS.takeover.achievements).toContain('acquired-app-migration');
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
    // The FAQ says test coverage weighs more than the version gap: from good
    // coverage to none moves the plan and the execution more than from one
    // major version to three or more, at either end of the other slider.
    const figures = (gap: string, coverage: string) => {
      const combination = combinationFor(PRICES.migration, [gap, coverage]);
      return [
        combination?.amounts.plan?.min ?? 0,
        combination?.amounts.plan?.max ?? 0,
        combination?.weeks?.min ?? 0,
        combination?.weeks?.max ?? 0,
      ];
    };
    const step = (from: number[], to: number[]) => to.map((value, i) => value - (from[i] ?? 0));
    for (const [gap, coverage] of [
      ['one', 'good'],
      ['three-plus', 'none'],
    ] as const) {
      const byCoverage = step(figures(gap, 'good'), figures(gap, 'none'));
      const byGap = step(figures('one', coverage), figures('three-plus', coverage));
      for (const [i, moved] of byCoverage.entries()) {
        expect(moved).toBeGreaterThan(byGap[i] ?? 0);
      }
    }
  });

  it('sells Scaling in two phases, load test first, priced by services and monitoring', () => {
    // ADR 19: a load test that reproduces the peak comes before any change, as
    // the test safety net does for a Takeover; and without metrics, finding the
    // bottleneck costs more, which is what the second slider teaches.
    expect(PRICES.scaling.dimensions.map((d) => d.id)).toEqual(['services', 'observability']);
    expect(PRICES.scaling.amounts).toEqual(['plan']);
    expect(pagesOf(en).scaling?.rules.join(' ')).toMatch(/two phases/);
    expect(pagesOf(fr).scaling?.rules.join(' ')).toMatch(/deux phases/);
    expect(pagesOf(en).scaling?.rules.join(' ')).toMatch(/load test that reproduces the peak/);
    expect(pagesOf(fr).scaling?.rules.join(' ')).toMatch(/tir de charge qui reproduit le pic/);
    // Less monitoring never costs less.
    for (const services of ['one', 'some', 'many']) {
      const plans = ['good', 'partial', 'none'].map(
        (observability) =>
          combinationFor(PRICES.scaling, [services, observability])?.amounts.plan?.min ?? 0,
      );
      expect(plans, services).toEqual([...plans].sort((a, b) => a - b));
    }
  });

  it('sells a Build in two phases, priced by size and systems to connect', () => {
    expect(PRICES.build.dimensions.map((d) => d.id)).toEqual(['size', 'integrations']);
    expect(PRICES.build.amounts).toEqual(['plan']);
    expect(pagesOf(en).build?.rules.join(' ')).toMatch(/two phases/);
    expect(pagesOf(fr).build?.rules.join(' ')).toMatch(/deux phases/);
    // The estimator prices phase 1 and gives phase 2 in weeks: the FAQ says
    // what a week of build costs, so the weeks can be read in euros (ADR 20).
    for (const content of [en, fr]) {
      const answers = pagesOf(content)
        .build?.faq.map((entry) => entry.answer)
        .join(' ');
      expect(answers).toContain('{dayRate}');
      expect(answers).toContain('{maxDays}');
    }
    // More systems to connect never costs less.
    for (const size of ['small', 'medium', 'large']) {
      const plans = ['none', 'few', 'many'].map(
        (integrations) =>
          combinationFor(PRICES.build, [size, integrations])?.amounts.plan?.min ?? 0,
      );
      expect(plans, size).toEqual([...plans].sort((a, b) => a - b));
    }
  });

  it('never sells a Build as the rewrite of a running system', () => {
    // ADR 19: without this rule, the Offer contradicts a site whose hero says
    // "without rewriting everything". The page states the rule, and never uses
    // the words that would sell the opposite.
    expect(pagesOf(en).build?.rules.join(' ')).toMatch(/never replaces a running system/);
    expect(pagesOf(fr).build?.rules.join(' ')).toMatch(/ne remplace jamais un système qui tourne/);
    for (const content of [en, fr]) {
      const page = [...walkStrings(pagesOf(content).build)].map(([, text]) => text).join(' ');
      expect(page).not.toMatch(/rewrit|refonte|réécri|from scratch/i);
    }
  });

  it('keeps the words of a distributed system off the Scaling plain line', () => {
    // They are for the technical buyer, in the body and the metadata (ADR 19).
    for (const content of [en, fr]) {
      expect(content.offers.scaling.plain).not.toMatch(
        /distribu|resilien|résilien|availab|disponib/i,
      );
      const body = [...walkStrings(pagesOf(content).scaling)].map(([, text]) => text).join(' ');
      expect(body).toMatch(/distributed system|système distribué/);
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

  it('publishes one day rate, for a Client and a Partner alike, and prices Reinforcement from it', () => {
    // One figure, not a range: a range is read from its low end, and a Partner
    // cannot build a margin on a number that moves (ADR 18).
    expect(DAY_RATE).toBe(550);
    expect(PRICES.reinforcement.dimensions.map((d) => d.id)).toEqual(['days']);
    const oneDay = combinationFor(PRICES.reinforcement, ['1'])?.amounts.monthly;
    // "about 2,400 a month at one day a week"
    expect(oneDay).toEqual({ min: 2400, max: 2400 });
    // Each month says how many days it stands for, within the 50 € rounding.
    for (const combination of PRICES.reinforcement.combinations) {
      const days = combination.daysIncluded ?? 0;
      expect(Math.abs((combination.amounts.monthly?.min ?? 0) - days * DAY_RATE)).toBeLessThan(50);
    }
    expect(combinationFor(PRICES.reinforcement, ['1'])?.daysIncluded).toBe(4.3);
    for (const content of [en, fr]) {
      expect(pagesOf(content).reinforcement?.dayRate).toBeDefined();
      expect(pagesOf(content).reinforcement?.estimator.daysIncluded).toContain('{days}');
    }
  });

  it('sells at most four days a week, as a rule that cannot go stale', () => {
    // The only capacity statement left (ADR 18). "Two clients at a time" went:
    // a Watch plan took a whole place for a few hundred euros a month. A rule
    // cannot expire; a "currently available" or a date can, like the line ADR
    // 11 removed.
    expect(MAX_DAYS_PER_WEEK).toBe(4);
    expect(PRICES.reinforcement.dimensions[0]?.options).toEqual(['1', '2', '3', '4']);
    for (const content of [en, fr]) {
      const page = pagesOf(content).reinforcement;
      expect(page?.rules.join(' ')).toContain('{maxDays}');
      const everywhere = [...walkStrings(page)].map(([, text]) => text).join(' ');
      expect(everywhere).not.toMatch(/two clients|deux clients/i);
      expect(everywhere).not.toMatch(/\b(19|20)\d{2}\b/);
      expect(everywhere).not.toMatch(/available|disponible|currently|actuellement|complet/i);
    }
    expect(fr.partnersPage.dayRate.note).toContain('{maxDays}');
  });

  it('links each "not the right choice" line to the Offer it names, and only then', () => {
    // The reader's qualification is also the site's internal linking: a line
    // that sends them elsewhere links there (ADR 18).
    for (const [locale, content] of [
      ['en', en],
      ['fr', fr],
    ] as const) {
      for (const [offer, page] of Object.entries(pagesOf(content))) {
        for (const line of page.notTheRightChoice) {
          const where = `${locale}: ${offer}: ${line.text}`;
          expect(line.text.includes('{offer}'), where).toBe(line.offer !== undefined);
          expect(line.text.split('{offer}').length, where).toBeLessThanOrEqual(2);
          expect(line.offer, where).not.toBe(offer);
          if (line.offer) {
            expect(
              PAGES.some((registered) => registered.id === line.offer),
              where,
            ).toBe(true);
          }
        }
      }
    }
  });

  it('quotes no price in prose: every amount comes from the price table', () => {
    // A number typed into a sentence is a second copy of a price that goes
    // stale the day prices.ts changes. Prose names the price instead.
    const amounts = new Set(
      [DAY_RATE, AUDIT_EXPRESS_FEE].flatMap((amount) => [
        String(amount),
        amount.toLocaleString('fr-FR'),
        amount.toLocaleString('en-GB'),
      ]),
    );
    for (const [locale, content] of [
      ['en', en],
      ['fr', fr],
    ] as const) {
      for (const [offer, page] of Object.entries(pagesOf(content))) {
        for (const [path, text] of walkStrings(page)) {
          if (path.startsWith('$.estimator')) continue;
          for (const amount of amounts) {
            expect(text, `${locale}: ${offer}${path.slice(1)} quotes ${amount}`).not.toContain(
              amount,
            );
          }
          // And every name it uses is one the price table can answer.
          if (!/\{(offer|towns)\}/.test(text)) {
            expect(
              () => fillPrices(text, locale),
              `${locale}: ${offer}${path.slice(1)}`,
            ).not.toThrow();
          }
        }
      }
    }
  });
});

describe('the AI workshops (ADR 27, ADR 28)', () => {
  it('exist in French only, with their format and never a price or a date', () => {
    expect(fr.workshops).toBeDefined();
    expect((en as ResumeContent).workshops).toBeUndefined();
    expect(fr.workshops.levels).toHaveLength(3);
    // The group's size is written in words, so a digit still means a price or
    // a date, and neither is published before the business is registered.
    for (const [path, text] of walkStrings(fr.workshops)) {
      expect(text, `a price or a date at ${path}`).not.toMatch(/€|\d/);
    }
  });

  it('say what an owner takes away, and announce nothing free', () => {
    const w = fr.workshops;
    // Three of the four facts Thomas confirmed (ADR 28): a small group, a day
    // at the owner's premises with a written note, and his own use. The rule
    // on data waits for the Workshops' own page (ADR 31's postscript).
    expect(w.levels[0].text).toMatch(/six à huit/);
    expect(w.levels[1].text).toMatch(/écrit/);
    expect(w.practice).toMatch(/chaque jour/);
    // "Accompagnement" is one of the words the voice never uses; the third
    // level is a follow-up.
    expect(w.levels[2].title).toBe('Un suivi');
    for (const [path, text] of walkStrings(w)) {
      expect(text, `${path}`).not.toMatch(/accompagn/i);
      // The call is free; a free session is never announced (D2, D3): that is
      // a question for a lawyer, not for the site.
      if (path !== '$.cta') expect(text, `${path}`).not.toMatch(/gratuit/i);
    }
  });

  it('are never called a formation or a training course, anywhere', () => {
    // In France a *formation* is a regulated framework the workshops do not
    // use. "Information" and "formé" are other words.
    for (const [locale, content] of [
      ['en', en],
      ['fr', fr],
    ] as const) {
      for (const [path, text] of walkStrings(content)) {
        expect(text, `${locale}:${path}`).not.toMatch(/\bformations?\b|\btraining\b/i);
      }
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

  it("promises to follow the Partner's stack whatever it is, naming no technology", () => {
    // A Partner's mission can be in any language: naming one turns the others away.
    for (const point of fr.partnersPage.points) {
      for (const tech of fr.schema.knowsAbout) {
        expect(`${point.title} ${point.text}`, `"${point.title}" names ${tech}`).not.toContain(
          tech,
        );
      }
    }
  });

  it('speaks apart to a Referrer, who buys nothing (ADR 30)', () => {
    expect(fr.partnersPage.referrers).toMatch(/^Cabinet comptable, intégrateur \?/);
  });

  it('carries no copy of the day rate: it is read from the price table', () => {
    for (const [path, text] of walkStrings(fr.partnersPage)) {
      expect(text, `a price is copied at ${path}`).not.toMatch(new RegExp(`\\b${DAY_RATE}\\b`));
    }
  });
});

describe('the home page, written for the least technical reader (ADR 14)', () => {
  it('proves the hero with facts kept whole, and says team work was team work (ADR 28)', () => {
    // A first draft of this line merged two Achievements into one claim; the
    // ERP and the traceable money were team work, and claiming either alone
    // would be the same mistake.
    expect(fr.hero.proof).toMatch(/dans l'équipe/);
    expect(en.hero.proof).toMatch(/on the team/);
    for (const content of [en, fr]) {
      expect(content.hero.proof).not.toMatch(/\d+ ans|\d+ years/);
      expect(content.hero.proof.length, 'the proof is a line, not a paragraph').toBeLessThan(260);
    }
  });

  it('promises a workshop only where there are workshops (ADR 28)', () => {
    expect(fr.hero.blurb).toMatch(/atelier/);
    expect(en.hero.blurb).not.toMatch(/\bAI\b|workshop/i);
  });

  it('keeps the words the voice never uses off every French page', () => {
    // From the brief that defines the voice (ADR 24). "Sur mesure" is the
    // Build's name, and nothing else. The Offer pages, the Partners and the
    // public sector joined home and About when « accompagné » was found on the
    // public-sector page (ADR 30).
    const NEVER = /passionn|\bexperts?\b|\bsolutions?\b|accompagn|innovant|de A à Z|360°|synergie/i;
    for (const { id } of PAGES.filter((page) => page.paths.fr)) {
      for (const [path, text] of walkStrings(contentOfPage('fr', id))) {
        expect(text, `${id} ${path}`).not.toMatch(NEVER);
        expect(text.replaceAll('Création sur mesure', ''), `${id} ${path}`).not.toMatch(
          /sur mesure/i,
        );
      }
    }
  });

  it('calls the software an owner runs a logiciel on the pages an owner reads (ADR 30)', () => {
    // An owner says « notre logiciel », never « application ». The Takeover's
    // and the Build's meta, for search, and the Takeover's estimator, whose
    // words the audit kept, are left as they are. The home page has no such
    // exception: its promise (the problem title until ADR 31, now the first
    // situation's lead) and description said « applications métier » until
    // Thomas chose « logiciels métier » (ADR 27, postscript).
    for (const id of ['home', 'takeover', 'build'] as const) {
      for (const [path, text] of walkStrings(contentOfPage('fr', id))) {
        if (id !== 'home' && /^\$\.(meta|estimator)\b/.test(path)) continue;
        expect(text, `${id} ${path}`).not.toMatch(/applications? métier/);
      }
    }
  });

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

  it('names the one job title, and no other, wherever the site says who Thomas is', () => {
    // ADR 27: the title a business owner hears in person is the one they read
    // on the first screen, in the tab, under a shared link and in search. It
    // replaced "fullstack", which ADR 22 had made the identity.
    for (const [content, title] of [
      [fr, 'Ingénieur logiciel'],
      [en, 'Software engineer'],
    ] as const) {
      expect(content.hero.role).toBe(title);
      expect(content.schema.jobTitle).toBe(title);
      expect(content.footer.role).toBe(title);
      expect(content.meta.title).toContain(title);
      expect(content.meta.description.toLowerCase()).toContain(title.toLowerCase());
      for (const [path, text] of walkStrings(content)) {
        expect(text, `"fullstack" is back at ${path}`).not.toMatch(/full[\s-]?stack/i);
        expect(text, `a former job title is back at ${path}`).not.toMatch(
          /d[ée]veloppeur (fullstack|freelance)|freelance developer/i,
        );
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
        'scaling',
      ]);
    }
  });

  it('leaves the Audit treating none: it is the way in for all of them', () => {
    for (const content of [en, fr] as ResumeContent[]) {
      expect(content.failureModes.some((mode) => mode.offer === 'audit')).toBe(false);
      // Nor the Build: the reader who wants something built is not suffering a
      // failure (ADR 19).
      expect(content.failureModes.some((mode) => mode.offer === 'build')).toBe(false);
      // The Entry offer's card says so in place of the band that used to
      // follow the sentences (ADR 31).
      expect(content.offersSection.start.trim().length).toBeGreaterThan(0);
    }
  });

  it('carries no Concepts, on the home page or on an Offer page', () => {
    // ADR 14 moved them from the home page to the Offers; ADR 18 took them off
    // the site. Under the H1 of the Entry offer, two words of vocabulary were
    // the grid ADR 14 removed, in miniature.
    for (const content of [en, fr] as ResumeContent[]) {
      expect('concepts' in content).toBe(false);
      for (const page of Object.values(content.offerPages)) {
        expect('concepts' in page).toBe(false);
      }
    }
  });
});

describe('a site short enough to be read (ADR 18)', () => {
  // The copy was cut by half on 5 October 2026: the home page was thirteen
  // minutes of reading for a reader who gives it thirty seconds. A ceiling
  // nobody checks grows back, as ADR 6 says of bytes; this is the same rule
  // for words. Counted: what the page renders as prose, not its <head>, its
  // assistive-only strings, its structured data or its price labels.
  // The home page's ceiling rose from 1,200 to 1,400 with the Workshops
  // section, the way in, and the old promise moved into the problem (ADR 27).
  // It came down to 1,320 when the problem section, the Audit band, the
  // second booking box and half of "Who picks up" left the page (ADR 31): a
  // ceiling left where it was invites the words back. The count includes the
  // Achievements folded under the References, which the page still serves.
  // The field study's page has its own ceiling, its form's labels left out: they
  // are an interface, not prose (ADR 34).
  const BUDGET: Record<string, number> = { home: 1320, partners: 220, survey: 260 };
  const OFFER_BUDGET = 400;
  const NOT_PROSE = /^\$\.(meta|a11y|schema|languages|footer|estimator|offerPage|offers|form)\b/;

  /**
   * The home page renders either the catalogue or the field study, never both
   * (ADR 34): it is held to the words of the half it shows.
   */
  const rendered = (id: string, content: unknown) => {
    if (id !== 'home' || !content || typeof content !== 'object') return content;
    const {
      fieldStudy,
      workshops: _w,
      offersSection: _o,
      failureModes: _f,
      ...rest
    } = content as Record<string, unknown>;
    const { fieldStudy: _hidden, ...catalogue } = content as Record<string, unknown>;
    return OFFERS_PUBLISHED ? catalogue : { ...rest, fieldStudy };
  };

  const wordsOf = (content: unknown) =>
    [...walkStrings(content)]
      .filter(([path]) => !NOT_PROSE.test(path))
      .reduce((sum, [, text]) => sum + text.split(/\s+/).filter(Boolean).length, 0);

  it('counts the same words whether the French spaces break or not', () => {
    // The budgets were set on plain spaces; `\s` also matches U+00A0 and
    // U+202F, so the unbreakable ones neither add nor merge a word.
    expect(wordsOf(RESUME.fr)).toBe(wordsOf(fr));
  });

  for (const page of PAGES) {
    for (const locale of LOCALES) {
      if (!page.paths[locale]) continue;
      const budget = BUDGET[page.id] ?? OFFER_BUDGET;
      it(`keeps ${page.id} (${locale}) under ${budget} words`, () => {
        expect(wordsOf(rendered(page.id, contentOfPage(locale, page.id)))).toBeLessThanOrEqual(
          budget,
        );
      });
    }
  }
});
