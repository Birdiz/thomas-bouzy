import type { AchievementId, OfferId, ReferenceId } from './offers.ts';
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
  /**
   * Two facets, not three. A third, "Context", repeated the plain line above
   * it, and two read better than three on a phone (ADR 18).
   */
  approach: string;
  result: string;
  /**
   * Where the work can be seen for oneself, when it is public: the releases of
   * a personal project, say. A proof a reader can check beats one they must take
   * on trust.
   */
  link?: {
    href: string;
    label: string;
  };
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
  /**
   * The one Offer that treats it (CONTEXT.md: *treated by*). The quote links
   * to that Offer's page, and the page opens on the quote — which is what
   * turns the section from illustration into a way in (ADR 12, ADR 14).
   */
  offer: OfferId;
}

/**
 * A client or a context, in one row: who, in what field, and the one line
 * worth remembering. The Achievements done there open underneath.
 */
export interface Reference {
  name: string;
  sector: string;
  period: string;
  headline: string;
}

/**
 * Not rendered: BaseLayout feeds `knowsLanguage` on the Person schema from it.
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
 * Every locale carries every Offer, even one whose page exists in one
 * language only, because the home page shows every card in both — the
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

/** A titled item: one deliverable, or one point. */
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
 * One line of "not the right choice when". When it names another Offer, `{offer}`
 * in the text is where that Offer's name goes, as a link to its page: the
 * qualification the reader is doing is also the site's internal linking.
 */
export interface Redirect {
  text: string;
  offer?: OfferId;
}

/**
 * One Offer's page, in the section order of ADR 18. Its name and plain line are
 * the Offer's `OfferSummary`; its Achievements are cited in offers.ts.
 */
export interface OfferPage {
  meta: {
    title: string;
    description: string;
  };
  /**
   * The H1. Distinct from the Offer's catalogue name, which stays the kicker and
   * the card title: the name is the glossary's, the heading carries the words
   * a buyer searches with (ADR 18).
   */
  heading: string;
  /** The price section's heading: the question the buyer is actually asking. */
  priceHeading: string;
  /**
   * Client sentences this Offer answers beyond those of the Failure modes it
   * treats — the page shows those first, from `failureModes`, so a sentence is
   * written once. In the Client's words and quote marks.
   */
  sentences: string[];
  /**
   * What the Client receives, in the order they receive it. The steps used to
   * be a section of their own and repeated this one (ADR 18).
   */
  delivered: Titled[];
  /** A variant of the Offer worth naming on its page, e.g. the Due diligence. */
  variant?: Titled;
  estimator: EstimatorLabels;
  /**
   * The commercial rules this page governs, stated where they apply (ADR 17):
   * the Audit's fee deducted from what follows, the two phases of a Migration…
   */
  rules: string[];
  /**
   * Words around the published day rate, for the pages that show it. The
   * amount itself is DAY_RATE in prices.ts, never a copy.
   */
  dayRate?: {
    label: string;
    /** What follows the rate: the cap on days a week. */
    note: string;
  };
  notTheRightChoice: Redirect[];
  faq: { question: string; answer: string }[];
}

/** Labels every Offer page shares. */
export interface OfferPageLabels {
  kicker: string;
  sentences: string;
  delivered: string;
  /** Says what the numbers are: an order of magnitude, never a quote. */
  disclaimer: string;
  /** Caption of the static table of every range. */
  tableCaption: string;
  excludingVat: string;
  perMonth: string;
  weekOne: string;
  weekMany: string;
  notTheRightChoice: string;
  achievements: string;
  faq: string;
  book: {
    kicker: string;
    title: string;
    text: string;
    cta: string;
    /** Lead-in to the email address, for those who would rather write. */
    orWrite: string;
    /**
     * Names the Service area. `{towns}` is replaced by SITE.serviceArea, so the
     * towns are listed in one place.
     */
    serviceArea: string;
  };
}

/**
 * The page for agencies and IT services firms (ADR 14): they buy from Thomas
 * for their own client. French only, like the Segment.
 */
/**
 * Local authorities, public bodies and publicly funded organisations: what
 * public purchasing asks of a provider, then the proof, then the Offers.
 */
export interface PublicSectorPage {
  meta: {
    title: string;
    description: string;
  };
  kicker: string;
  title: string;
  plain: string;
  /** Simple purchasing, reversibility, accessibility, hosting. */
  points: Titled[];
  proof: {
    heading: string;
    items: Titled[];
  };
  /** Heading over the Offers a public buyer can order. */
  offers: string;
  offerLink: string;
  book: OfferPageLabels['book'];
}

export interface PartnersPage {
  meta: {
    title: string;
    description: string;
  };
  kicker: string;
  title: string;
  plain: string;
  /** White label, the Partner's conventions, the CV on request. */
  points: Titled[];
  /** Words around DAY_RATE, which the page reads from prices.ts. */
  dayRate: {
    label: string;
    note: string;
  };
  /** Heading over the Offers a Partner can bring Thomas into. */
  offers: string;
  /** Where each Offer card links: "See the offer". */
  offerLink: string;
  book: OfferPageLabels['book'];
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
    offers: string;
    /** The Partners page, in the footer's list of pages. */
    partners: string;
    /** The public-sector page, likewise. */
    publicSector: string;
    work: string;
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
   */
  hero: {
    /**
     * The promise, rendered in the H1 after the name, as two lines: the break
     * is part of the wording, so it is written here rather than left to the
     * browser. Held to the plain-line rule, like the blurb.
     */
    title: readonly [string, string];
    /**
     * Written for the least technical reader (ADR 14), so it is held to the
     * plain-line rule: no `schema.knowsAbout` term, and short.
     */
    blurb: string;
    /** The hero's one button, to the Offers section. */
    ctaOffers: string;
  };

  /** Opens the page on what breaks, before anything about who fixes it. */
  problem: {
    kicker: string;
    title: string;
    /**
     * Under the Failure modes, for the Client who cannot yet name theirs:
     * the Audit treats none of them, and is the way in for all.
     */
    audit: {
      text: string;
      cta: string;
    };
    /**
     * The sentences pass one at a time, like a train of thought. Labels for
     * the controls: the pause toggle, and each sentence's own button, where
     * `{n}` is its number.
     */
    pause: string;
    goTo: string;
  };
  failureModes: FailureMode[];

  work: {
    kicker: string;
    title: string;
    intro: string;
    /** Lead-in for `Achievement.plain`. Carries its own colon: French spaces it. */
    labelPlain: string;
    labelApproach: string;
    labelResult: string;
  };
  achievements: Achievement[];
  references: Record<ReferenceId, Reference>;

  about: {
    kicker: string;
    title: string;
    paragraphs: string[];
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
  languages: LanguageSkill[];
  schema: SchemaOnly;

  /** The home page's Offers section: one card per Offer, each with a "from" price. */
  offersSection: {
    kicker: string;
    title: string;
    /**
     * The Offers as the life of an application: three stages in order, the
     * second holding two Offers side by side, then the Offers that run
     * alongside all three. See `JOURNEY` in OffersSection.astro.
     */
    stages: readonly [string, string, string];
    alongside: string;
    /**
     * Before each amount's lowest price, the headline first. A Migration's
     * headline is its plan, not the whole Migration, and the card says so.
     */
    from: Record<AmountId, string>;
    /** Between the headline and the amount that follows it: "2 000 €, then 350 € / month". */
    followedBy: string;
    /** The badge on the Entry offer's card: the way in for every Segment. */
    start: string;
    /**
     * Said after a link to a page that exists only in French, from a page in
     * another language. Never shown on a French page.
     */
    inFrench: string;
    /**
     * Halfway down the page, for the reader who already knows: the booking
     * link, so they need not scroll on to Contact.
     */
    book: { text: string; cta: string };
    partners: string;
    partnersLink: string;
    publicSector: string;
    publicSectorLink: string;
  };

  /** Every Offer's name and plain line, wherever the Offer is mentioned. */
  offers: Record<OfferId, OfferSummary>;
  offerPage: OfferPageLabels;
  /**
   * The Offer pages that exist in this locale. Which ones must exist is the
   * registry's call (src/routes.ts); the parity test holds the two together.
   */
  offerPages: Partial<Record<OfferId, OfferPage>>;
  /** Exists only in the locales the registry declares the Partners page in. */
  partnersPage?: PartnersPage;
  publicSectorPage?: PublicSectorPage;

  contact: {
    kicker: string;
    title: string;
    blurb: string;
    /** The booking link, first of the ways to reach Thomas. */
    cta: string;
    /** Lead-in to the secondary ways in: email, phone, LinkedIn. */
    orReach: string;
    revealPhone: string;
    /** `{towns}` is replaced by SITE.serviceArea, as on the Offer pages. */
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
