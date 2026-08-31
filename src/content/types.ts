/**
 * The résumé content contract.
 *
 * Both locales are plain TypeScript modules declared `satisfies ResumeContent`,
 * so a missing or misspelled key is a compile error caught by `astro check` —
 * no runtime validation layer needed for content authored in-repo.
 *
 * What types cannot express (array lengths matching across locales, empty
 * strings, malformed URLs) is enforced by tests/content.spec.ts.
 */

/**
 * One named capability, at the top of the page.
 *
 * This replaced a grid of six figures. The figures answered "how much" to a
 * reader who had not yet been told "of what" — and read as a CV's numbers.
 * A proof line briefly survived underneath, carrying the measurement; it went
 * the same way and for the same reason. A ratio from one engagement does not
 * travel: the concept is the part that does, and the measurements sit in the
 * project cards and the principles, where they have a context.
 */
export interface Concept {
  /** One or two words. A named concept, never a skill label. */
  label: string;
  gloss: string;
}

export interface Project {
  title: string;
  org: string;
  period: string;
  context: string;
  approach: string;
  result: string;
}

/** One way the interesting kind of system goes wrong. */
export interface FailureMode {
  label: string;
  text: string;
}

/**
 * A position, and what holding it costs. The cost is the half that convinces.
 *
 * Principle 5 carries the pitch master's three-honesty-levels rule, which used
 * to live in the Toolkit grid. Stating it as a position one holds — at a price
 * — says more than a grid of tags ever did. See docs/adr/0009, postscript 2.
 */
export interface Principle {
  title: string;
  text: string;
  cost: string;
}

export interface MentoringEntry {
  year: string;
  text: string;
}

/**
 * Not rendered. The About aside shows the mentoring card alone, as the canvas
 * does — see docs/design-deltas.md entry 24. This survives it because
 * BaseLayout feeds `knowsLanguage` on the Person schema from it, which is a
 * different surface from the page and was not part of that decision.
 */
export interface LanguageSkill {
  name: string;
  level: string;
}

/**
 * Structured data only, never rendered — the other half of the same idea as
 * `LanguageSkill` above.
 *
 * Both fields used to be derived from the page: `jobTitle` from the hero's
 * role line, `knowsAbout` from the stack chips on the Track record. Chantier A
 * took the job title and the Track record off the page, and a derivation with
 * no source is not a derivation. Stating them here keeps the schema honest in
 * the one way that matters: `tests/content.spec.ts` asserts that every
 * `knowsAbout` term appears verbatim in a string the page actually renders, so
 * the schema cannot drift into claiming more than the page says. That is the
 * same rule the missing `worksFor` was fixed under — a wrong claim is worse
 * than a missing one.
 */
export interface SchemaOnly {
  jobTitle: string;
  knowsAbout: string[];
}

export interface ResumeContent {
  /** <head> copy. Not shown on the page. */
  meta: {
    title: string;
    description: string;
    ogImageAlt: string;
  };

  /** Strings that exist for assistive technology only. */
  a11y: {
    skipToContent: string;
    languageSwitcher: string;
    switchToOther: string;
    mainNavigation: string;
    portraitAlt: string;
  };

  nav: {
    work: string;
    approach: string;
    about: string;
    contact: string;
  };

  /**
   * No job title, no years badge, no CV button.
   *
   * All three were recruitment furniture on a page that sells engagements: a
   * title answers "what post does he hold", a years count answers "is he senior
   * enough to hire", and the CV button offered the salaried route as an equal
   * alternative to the work itself, in the first viewport. The chronology, the
   * titles and the stack now live in the PDF alone, reached once from the About
   * section — see `about.cvLine`.
   *
   * `availability` carries no date. It said "permanent roles from September
   * 2026" on a page whose own thesis is that what is not instrumented is not
   * reliable, and it was one day from expiring.
   */
  hero: {
    availability: string;
    blurb: string;
    ctaWork: string;
  };

  concepts: Concept[];

  /** Opens the page on what breaks, before anything about who fixes it. */
  problem: {
    kicker: string;
    title: string;
    paragraphs: string[];
  };
  failureModes: FailureMode[];

  /** The section a résumé never has: an argued opinion, with its price. */
  position: {
    kicker: string;
    title: string;
    intro: string;
    costLabel: string;
  };
  principles: Principle[];

  work: {
    kicker: string;
    title: string;
    intro: string;
    labelContext: string;
    labelApproach: string;
    labelResult: string;
  };
  projects: Project[];

  about: {
    kicker: string;
    title: string;
    paragraphs: string[];
    mentoringKicker: string;
    /**
     * The salaried route, stated once and at the end.
     *
     * It is the only thing the Track record carried that the page could not
     * absorb: a chronology, job titles and a stack are what someone hiring for
     * a post reads, and they are all in the PDF. Saying so here keeps that door
     * open without letting it compete with the work — which is what it did from
     * the hero.
     */
    cvLine: string;
    cvCta: string;
  };
  mentoring: MentoringEntry[];
  languages: LanguageSkill[];
  schema: SchemaOnly;

  contact: {
    kicker: string;
    title: string;
    blurb: string;
    revealPhone: string;
    locationLine: string;
  };

  /**
   * The site footer. Labels only — the publisher's own details live in
   * `LEGAL` in site.ts, because they are facts about the business rather
   * than content to translate.
   */
  footer: {
    legalHeading: string;
    hostedBy: string;
    siretLabel: string;
    vatLabel: string;
    /** Accessible name of the <footer> landmark. */
    landmark: string;
  };
}
