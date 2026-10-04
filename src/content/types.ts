import type { AchievementId, OfferId } from './offers.ts';
import type { AmountId } from './prices.ts';

/**
 * The content contract.
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
 * Achievement cards and the principles, where they have a context.
 */
export interface Concept {
  /** One or two words. A named concept, never a skill label. */
  label: string;
  gloss: string;
}

/**
 * Past work Thomas actually did, shown as proof of a capability. It is never
 * itself for sale: an Achievement proves what an Offer sells (CONTEXT.md).
 */
export interface Achievement {
  /** Language-neutral, and the same in every locale: how an Offer cites it. */
  id: AchievementId;
  title: string;
  org: string;
  period: string;
  /**
   * One sentence saying what the work was, before any word that has to be
   * learned. Rendered above the three facets, under the `work.labelPlain`
   * lead-in.
   *
   * The rule is Thomas's own: the on-chain card opened "In plain terms: a
   * service that places and readjusts money on markets by itself" and then went
   * technical, and it was the only card of six that did. Chantier C generalised
   * it — a field rather than a habit, because a habit applied once in six is
   * how it got here. `tests/content.spec.ts` holds the line by failing when a
   * plain line names a technology.
   */
  plain: string;
  context: string;
  approach: string;
  result: string;
}

/**
 * One way the interesting kind of system goes wrong — stated twice.
 *
 * The section's job is recognition, not taxonomy: a reader who finds his own
 * sentence here qualifies himself, and no summary of a failure mode does that
 * as well as the sentence he has already said out loud. So the client's words
 * lead and the diagnosis follows, rather than the reverse — which is how these
 * four read until Chantier C, well written but addressed to a peer.
 *
 * The names the headings used to carry ("Double execution", "A balance nobody
 * can explain") are not lost: each now opens the diagnosis it titled.
 */
export interface FailureMode {
  /** The sentence a client says, in their words, quote marks included. */
  quote: string;
  /** What it actually is, in mine. Opens by naming the failure mode. */
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

/**
 * What every mention of an Offer needs: its name and its plain line.
 *
 * Every locale carries all five, even for an Offer whose page exists in one
 * language only, because the home page shows all five cards in both — the
 * Takeover's English card links to its French page.
 */
export interface OfferSummary {
  name: string;
  /**
   * One sentence saying what the Offer does for the Client, before any word
   * that has to be learned. Held to the same rule as `Achievement.plain`: no
   * `schema.knowsAbout` term (ADR 12, extended by ADR 14).
   */
  plain: string;
}

/** A titled item: one deliverable, or one step. */
export interface Titled {
  title: string;
  text: string;
}

/**
 * The words around one Offer's prices. The numbers themselves are in
 * prices.ts, which carries no locale; `tests/content.spec.ts` checks that every
 * dimension, option and amount the table declares has a label here.
 */
export interface EstimatorLabels {
  /** The slider's label, and a label for each of its options, by id. */
  dimensions: Record<string, { label: string; options: Record<string, string> }>;
  /** A label for each amount the Offer's table declares. */
  amounts: Partial<Record<AmountId, string>>;
  /** A label for the duration, when the Offer's table has one. */
  duration?: string;
}

/**
 * One Offer's page, in the section order of ADR 17. Its name and plain line are
 * the Offer's `OfferSummary`; its Achievements are cited in offers.ts.
 */
export interface OfferPage {
  meta: {
    title: string;
    description: string;
  };
  /**
   * The Client sentences this Offer answers, in the Client's words and quote
   * marks, like a Failure mode's.
   */
  sentences: string[];
  /** The Concepts this Offer carries (ADR 14). May be empty. */
  concepts: Concept[];
  delivered: Titled[];
  /** A variant of the Offer worth naming on its page, e.g. the Due diligence. */
  variant?: Titled;
  steps: Titled[];
  estimator: EstimatorLabels;
  /**
   * The commercial rules this page governs, stated where they apply (ADR 17):
   * the Audit's fee deducted from what follows, the two phases of a Migration…
   */
  rules: string[];
  goodChoice: string[];
  notTheRightChoice: string[];
  faq: { question: string; answer: string }[];
}

/** Labels every Offer page shares. */
export interface OfferPageLabels {
  kicker: string;
  sentences: string;
  delivered: string;
  steps: string;
  price: string;
  /** Says what the numbers are: an order of magnitude, never a quote. */
  disclaimer: string;
  /** Caption of the static table of every range. */
  tableCaption: string;
  excludingVat: string;
  perMonth: string;
  weekOne: string;
  weekMany: string;
  fit: string;
  goodChoice: string;
  notTheRightChoice: string;
  achievements: string;
  faq: string;
  concepts: string;
  book: {
    kicker: string;
    title: string;
    text: string;
    cta: string;
    /** Lead-in to the email address, for those who would rather write. */
    orWrite: string;
  };
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
   * alternative to the work itself, in the first viewport. The career is on
   * LinkedIn, reached once from the About section — see `about.careerLine`.
   *
   * `availability` carries no date. It said "permanent roles from September
   * 2026" on a page whose own thesis is that what is not instrumented is not
   * reliable, and it was one day from expiring. Then it said "available now",
   * which is not true of a business that is not registered yet: it says that
   * first engagements are in preparation, which stays true until it is not
   * needed (ADR 14).
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
    /** Lead-in for `Achievement.plain`. Carries its own colon: French spaces it. */
    labelPlain: string;
    labelContext: string;
    labelApproach: string;
    labelResult: string;
  };
  achievements: Achievement[];

  about: {
    kicker: string;
    title: string;
    paragraphs: string[];
    mentoringKicker: string;
    /**
     * The salaried route, stated once and at the end, as one line whose last
     * words link to LinkedIn.
     *
     * A chronology, job titles and a stack are what someone hiring for a post
     * reads. They used to be in a CV download here; the PDF left the site
     * (ADR 11, postscript) and LinkedIn carries them. Saying so keeps that door
     * open without letting it compete with the work.
     */
    careerLine: string;
    /** The link text, to the LinkedIn profile. */
    careerLink: string;
  };
  mentoring: MentoringEntry[];
  languages: LanguageSkill[];
  schema: SchemaOnly;

  /** Every Offer's name and plain line, wherever the Offer is mentioned. */
  offers: Record<OfferId, OfferSummary>;
  offerPage: OfferPageLabels;
  /**
   * The Offer pages that exist in this locale. Which ones must exist is the
   * registry's call (src/routes.ts); the parity test holds the two together.
   */
  offerPages: Partial<Record<OfferId, OfferPage>>;

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
