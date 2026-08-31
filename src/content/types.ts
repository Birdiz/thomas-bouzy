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
 * travel: the concept is the part that does, and the measurements still sit in
 * the project cards and the Track record bullets, where they have a context.
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

export interface Job {
  period: string;
  duration: string;
  place: string;
  title: string;
  company: string;
  summary: string;
  bullets: string[];
  stack: string[];
}

export interface EarlierRole {
  period: string;
  title: string;
  org: string;
  text: string;
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
    experience: string;
    about: string;
    contact: string;
  };

  hero: {
    availability: string;
    role: string;
    blurb: string;
    yearsCount: string;
    yearsLabel: string;
    ctaWork: string;
    ctaPdf: string;
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

  experience: {
    kicker: string;
    title: string;
    earlierShow: string;
    earlierHide: string;
  };
  jobs: Job[];
  earlier: EarlierRole[];

  about: {
    kicker: string;
    title: string;
    paragraphs: string[];
    mentoringKicker: string;
  };
  mentoring: MentoringEntry[];
  languages: LanguageSkill[];

  contact: {
    kicker: string;
    title: string;
    blurb: string;
    revealPhone: string;
    pdfLabel: string;
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
