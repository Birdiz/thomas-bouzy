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
   *
   * Both are left out while Thomas has not supplied them, never written ahead
   * of him: such an Achievement is cited on an Offer page, which shows the
   * title and the plain line, and is never one of a Reference's, which shows
   * both facets (`tests/content.spec.ts` holds that, ADR 30).
   */
  approach?: string;
  result?: string;
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
 * One way the interesting kind of system goes wrong, in the words a Client
 * would say it.
 *
 * The section's job is recognition, not taxonomy: a reader who finds his own
 * sentence here qualifies himself, and no summary of a failure mode does that
 * as well as the sentence he has already said out loud. The diagnosis that
 * used to follow each sentence, and the name it opened on, left the home page
 * with the carousel that hid them (ADR 28): the sentence and its link are the
 * whole device. The names stay in the glossary (CONTEXT.md).
 */
export interface FailureMode {
  /** The sentence a client says, in their words, quote marks included. */
  quote: string;
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
  /**
   * In what capacity Thomas did the work: on staff, as an independent, as a
   * volunteer, for a client, as his own product (ADR 28). Read right under the
   * name, before the sector: a reader must not take a salaried post for a
   * client, nor a volunteer project for a paid one.
   */
  nature: string;
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
   * `schema.knowsAbout` term (ADR 12, extended by ADR 14). It may name a
   * price token, `{maxDays}` say, which RESUME fills in (ADR 30).
   */
  plain: string;
  /**
   * The name of the fixed-price first phase, for an Offer sold in two
   * (ADR 19): its price line says « cadrage dès 1 650 € HT », where « première
   * étape à partir de » hid that the step was one of two (ADR 30).
   */
  phase?: string;
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
  /**
   * The slider's label, and a label for each of its options, by id. `notes`,
   * when a dimension has them, says what each option is, one line per option:
   * the estimator shows the chosen one under its slider. A label alone told
   * the reader an express Audit costs 1,400 € and a full one 4,500 €, and not
   * what the difference buys.
   */
  dimensions: Record<
    string,
    {
      label: string;
      options: Record<string, string>;
      notes?: Record<string, string>;
      /**
       * One line under a criterion the reader may not know how to answer,
       * whatever the option: what it measures, and which option to take when
       * unsure (ADR 30).
       */
      help?: string;
    }
  >;
  /** A label for each amount the Offer's table declares. */
  amounts: Partial<Record<AmountId, string>>;
  /** A label for the duration, when the Offer's table has one. */
  duration?: string;
  /**
   * The whole budget, when the Offer's table declares one (`total` in
   * prices.ts), and what it is made of: a price token such as `{maxDays}` is
   * filled in (ADR 30).
   */
  total?: { label: string; note: string };
  /**
   * What a monthly amount is made of, when its combination includes days at
   * the day rate. `{days}` is replaced by that number of days.
   */
  daysIncluded?: string;
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
  /**
   * What a cited Achievement proves for this Offer, when its plain line says
   * something else: the large accounts' onboarding proves nothing a Migration
   * sells, its upgrade without tests does (ADR 30). One Achievement per line,
   * never two merged into one.
   */
  proof?: Partial<Record<AchievementId, string>>;
  faq: { question: string; answer: string }[];
}

/** Labels every Offer page shares. */
export interface OfferPageLabels {
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
  /**
   * Beside a small portrait in the booking block: who answers the call, by
   * name (ADR 30). The About block's « Qui décroche » read, to three owners
   * in three, as "who drops out" (ADR 28).
   */
  who: string;
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
 * Local authorities, public bodies and publicly funded organisations: the
 * Offers, beside what public purchasing asks of a provider, then the proof
 * (ADR 33).
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
    /**
     * Each with the figure its text holds, set large beside it so the proof
     * reads at a glance (ADR 33). The figure repeats the text, never adds to
     * it.
     */
    items: (Titled & { figure: string })[];
  };
  /** Heading over the Offers a public buyer can order. */
  offers: string;
  offerLink: string;
  book: OfferPageLabels['book'];
}

/**
 * Who picks up the phone, in Thomas's voice and at length (ADR 25): the home
 * page's About block is two paragraphs because the home page has no words left
 * (ADR 18), and this page is where the rest goes.
 */
export interface AboutPage {
  meta: {
    title: string;
    description: string;
  };
  /** The page's name in the breadcrumb, the menu's word for it. */
  kicker: string;
  /**
   * The H1: the name and the job title, where it said "Who picks up" (ADR 28).
   * A reader who searches for Thomas, or lands here from a link, learns who he
   * is before how he sounds.
   */
  title: string;
  /** The first sentence, set larger under the H1; also the Open Graph card's line. */
  plain: string;
  paragraphs: Paragraph[];
  book: OfferPageLabels['book'];
}

/**
 * A paragraph of prose: plain text, or text broken around the links it carries,
 * so a name the reader may want to check (Quart de tour) leads to it.
 */
export type Paragraph = string | (string | { href: string; label: string })[];

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
  /**
   * For a Referrer, who buys nothing: an accountant or an integrator whose
   * client has software in trouble (ADR 30). They are not Partners, and are
   * told so by being addressed apart.
   */
  referrers: string;
  book: OfferPageLabels['book'];
}

export interface ResumeContent {
  /** <head> copy. Not shown on the page. */
  meta: {
    title: string;
    description: string;
  };

  /** Strings that exist for assistive technology only. */
  a11y: {
    skipToContent: string;
    languageSwitcher: string;
    switchToOther: string;
    mainNavigation: string;
    /** Names the trail from the home page to the page the reader is on. */
    breadcrumb: string;
    portraitAlt: string;
    /**
     * The name of the link to the other language's home page, on a page that
     * exists in this language only (ADR 28). Written in that other language,
     * like the page it leads to: it says where the link goes, so that nobody
     * expects this page translated.
     */
    otherHome: string;
  };

  nav: {
    /** The home page, first in the breadcrumb of every other page. */
    home: string;
    /** The home page's Offers, prices included: the menu and the breadcrumb say so. */
    offers: string;
    /** The Partners page, in the footer's list of pages. */
    partners: string;
    /** The public-sector page, likewise. */
    publicSector: string;
    work: string;
    /** The About page, from the menu and the footer (ADR 28). */
    about: string;
    /** The header's button: the booking page itself, one click away (ADR 28). */
    contact: string;
  };

  /**
   * The job title, then the promise (ADR 27). Still no years badge and no CV
   * button: those were recruitment furniture (ADR 11). The title is back
   * because a business owner met in person must read on the first screen the
   * title Thomas said to them.
   */
  hero: {
    /** The job title, set small above the H1: "Ingénieur logiciel". */
    role: string;
    /**
     * Where he works, beside the title (ADR 28): the first screen did not say
     * it. A field of its own, so the title stays the one job title.
     */
    region: string;
    /**
     * The promise, rendered in the H1 after the name: short, because it is a
     * title (ADR 27). Held to the plain-line rule, like the blurb.
     */
    title: string;
    /**
     * The subtitle under the H1 (ADR 27, amended by ADR 28): the Workshop in
     * French, where there are Workshops; no promise of one in English. Written
     * for the least technical reader (ADR 14), so it is held to the plain-line
     * rule: no `schema.knowsAbout` term, and short.
     */
    blurb: string;
    /** The primary button: the 30-minute call. */
    ctaBook: string;
    /**
     * The secondary button: to the Workshops section where the locale has one,
     * to the Offers otherwise.
     */
    ctaSecondary: string;
    /**
     * Under the buttons, the proof a reader would otherwise find four screens
     * down (ADR 28). Facts already on the page, each kept whole: work done in a
     * team says so, and two Achievements are never merged into one claim.
     */
    proof: string;
  };

  /**
   * The AI workshops for business owners, the way in (ADR 27). French only:
   * the owners they are for are French and local. Never called a *formation*
   * or a training course: in France that names a regulated framework the
   * workshops do not use. Their format is published, their dates and price are
   * not, and nothing free is announced (ADR 28).
   */
  workshops?: {
    /** The header's link to the section. */
    nav: string;
    kicker: string;
    title: string;
    plain: string;
    /** The three levels, in the order a business owner takes them. */
    levels: readonly [Titled, Titled, Titled];
    /**
     * Why an engineer runs them: he uses AI every day, and knows where it errs.
     * Set beside the title, as the reason to trust the promise (ADR 31's
     * postscript).
     */
    practice: string;
    /** Where the workshops stand: what will be announced, never a date or a price. */
    status: string;
    /** For the owner who wants to hear when the first sessions open: an email. */
    notify: {
      text: string;
      label: string;
      /** The email's subject line. */
      subject: string;
    };
  };

  /**
   * The Client sentences, each linked to the Offer that treats it (ADR 12).
   * The home page sets each at the head of the situation its Offer is in
   * (ADR 31); an Offer page shows its own first.
   */
  failureModes: FailureMode[];

  work: {
    kicker: string;
    title: string;
    intro: string;
    /** Lead-in for `Achievement.plain`. Carries its own colon: French spaces it. */
    labelPlain: string;
    labelApproach: string;
    /**
     * Who the folded Approach is for (ADR 28): a business owner reads the plain
     * line and the result, a technical team opens the rest.
     */
    approachFor: string;
    labelResult: string;
    /** Opens the References past the first few (ADR 31). `{count}` is how many. */
    more: string;
  };
  achievements: Achievement[];
  references: Record<ReferenceId, Reference>;

  about: {
    kicker: string;
    title: string;
    paragraphs: string[];
    /** The link under the paragraphs, to the About page and its longer version. */
    more: string;
    /**
     * The link to LinkedIn, which carries the career: the chronology, the job
     * titles and the stack the page leaves out (ADR 11). It used to follow a
     * question to the reader hiring for a post, and the question went: read by
     * a business owner, it said Thomas was looking for a job (ADR 28).
     */
    careerLink: string;
  };
  languages: LanguageSkill[];
  schema: SchemaOnly;

  /** The home page's Offers section: one card per Offer, each with a "from" price. */
  offersSection: {
    kicker: string;
    title: string;
    /**
     * Right above the situations and their Client sentences, which it turns
     * into questions rather than testimonials: read in a carousel, they were
     * taken for invented quotes (ADR 28).
     */
    question: string;
    /**
     * The situations the Offers are grouped by, in the order of `SITUATIONS`
     * in offers.ts (ADR 30): each a heading the reader answers for themselves.
     * The second carries the sentence of the owner it is for, a Client
     * sentence of the Build's.
     */
    situations: readonly [
      /**
       * Under its title, what the hero used to promise and still sells: the
       * Takeover and the other Offers on a running application (ADR 27). It
       * headed a section of its own until ADR 31.
       */
      { title: string; lead: string },
      { title: string; sentence: string },
      { title: string },
    ];
    /**
     * At the foot of every card, with its arrow: the whole card is the link,
     * and a reader on a phone had nothing to tell them so (ADR 30).
     */
    more: string;
    /**
     * Before each amount's lowest price, the headline first. A plan follows
     * the name of the Offer's first phase (`OfferSummary.phase`): « cadrage
     * dès », « plan dès », « diagnostic dès » (ADR 30).
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
  aboutPage: AboutPage;

  /**
   * The field study's page. French only, like the registry entry (ADR 34);
   * the home page itself while the catalogue is hidden (ADR 35).
   */
  surveyPage?: SurveyPage;

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
    /** The job title, beside the name (ADR 27). */
    role: string;
    /** Accessible name of the list of the site's pages. */
    pages: string;
    legalHeading: string;
    hostedBy: string;
    siretLabel: string;
    vatLabel: string;
    /** Accessible name of the <footer> landmark. */
    landmark: string;
  };
}

/**
 * The field study's page: a line on what it is, the questionnaire, and what
 * happens to the answers (ADR 34). What the study is about, and every word
 * that names a place or a person, comes from the questionnaire the back office
 * serves, never from here; nothing here says how long it takes or how many
 * questions it asks.
 */
export interface SurveyPage {
  meta: { title: string; description: string };
  /** The breadcrumb, the Open Graph card's title. */
  kicker: string;
  title: string;
  plain: string;
  /**
   * Beside the portrait: who asks, by name, and nothing of what he does
   * (ADR 35). The notice says a single person reads the answers; this says who.
   */
  byline: string;
  /** What is collected, who reads it, how long it is kept, how to have it erased. */
  privacy: { title: string; paragraphs: string[] };
  /** The form's interface. Labels, not prose: they are not counted in the page's words. */
  form: SurveyFormLabels;
}

/** Every word of the form's interface; the questions themselves come from the back office. */
export interface SurveyFormLabels {
  /** Accessible name of the form region. */
  name: string;
  loading: string;
  /** No JavaScript: the form cannot run without it. */
  noScript: string;
  /** The questionnaire could not be loaded. */
  unreachable: string;
  retry: string;
  /** The questionnaire is closed or not published (404, 410). */
  closed: string;
  /** `{current}` and `{total}`: steps, never questions. */
  progress: string;
  back: string;
  next: string;
  submit: string;
  sending: string;
  /** The answers could not be sent; they stay on the page. */
  sendFailed: string;
  optional: string;
  selectPlaceholder: string;
  noOpinion: string;
  /** `{count}` characters typed and `{max}`. */
  counter: string;
  /** `{max}` choices at most. */
  maxSelections: string;
  /** Announced when a step has errors. */
  fixErrors: string;
  /**
   * The optional last step. The three boxes are independent, as the back
   * office holds them: the synthesis needs an e-mail and no consent, the
   * meeting needs both, and the consent comes with its notice.
   */
  contact: {
    title: string;
    intro: string;
    wantsSynthesis: string;
    synthesisHelp: string;
    wantsMeeting: string;
    meetingHelp: string;
    contactConsent: string;
    /** Under the consent box: purpose, a single reader, 24 months, erasure on request. */
    notice: string;
    email: string;
    emailHelp: string;
    /** Asked only once the consent box is ticked: the back office keeps them on no other ground. */
    name: string;
    organisation: string;
  };
  thanks: { title: string; text: string };
}
