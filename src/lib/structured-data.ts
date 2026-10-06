import { RESUME } from '../content/index.ts';
import { OFFER_IDS, type OfferId } from '../content/offers.ts';
import { DAY_RATE, isMonthly, PRICES } from '../content/prices.ts';
import { homePath, type PageId, type Route } from '../routes.ts';
import { absoluteUrl, CONTACT, LEGAL, LOCALE_TAG, LOCALES, type Locale, SITE } from '../site.ts';
import { breadcrumbOf } from './breadcrumb.ts';

/**
 * The JSON-LD each page carries: one `@graph` that says what the page is,
 * without asserting anything that does not exist yet (ADR 18, issue #29).
 *
 * None of it ever names a telephone: the number is behind a click on the page,
 * and repeating it here would hand it straight back to any crawler (ADR 5).
 */

const WEBSITE_ID = `${SITE.origin}/#website`;
const PERSON_ID = `${SITE.origin}/#person`;
const BUSINESS_ID = `${SITE.origin}/#business`;

/** What the graph needs to know of the publisher: `LEGAL` in site.ts, in production. */
export interface Publisher {
  businessName: string;
  siret: string;
  isComplete: boolean;
}

export interface GraphOptions {
  /** Defaults to `LEGAL`; the tests pass a registered one. */
  legal?: Publisher;
  /** Root-relative URL of the optimised portrait, for the Person on the home page. */
  portrait?: string | undefined;
}

const ref = (id: string) => ({ '@id': id });

/**
 * The page's whole graph. Every page carries the WebSite; the home page adds
 * the person it is about, every other page the Service it sells. The business
 * appears at registration only, and from then on it is what provides the
 * Services, as the footer's legal block appears on the same condition.
 */
export function pageGraph(route: Route, { legal = LEGAL, portrait }: GraphOptions = {}) {
  const provider = legal.isComplete ? BUSINESS_ID : PERSON_ID;
  const nodes =
    route.page.id === 'home' ? homeNodes(route, portrait) : serviceNodes(route, provider);
  return {
    '@context': 'https://schema.org',
    '@graph': [website(provider), ...nodes, ...(legal.isComplete ? [business(legal)] : [])],
  };
}

/** What lets search show the site's name, now that the Offer pages' titles no longer carry it. */
function website(publisher: string) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: absoluteUrl('/'),
    name: SITE.author,
    inLanguage: LOCALES.map((locale) => LOCALE_TAG[locale]),
    publisher: ref(publisher),
  };
}

/**
 * The ProfilePage Google documents for pages *about* a person, and the Person
 * it is about: the page and its subject are two things, and conflating them is
 * why so many profile pages get no entity out of their markup.
 */
function homeNodes(route: Route, portrait: string | undefined) {
  const t = RESUME[route.locale];
  const url = absoluteUrl(route.path);
  return [
    {
      '@type': 'ProfilePage',
      '@id': url,
      url,
      name: t.meta.title,
      description: t.meta.description,
      inLanguage: LOCALE_TAG[route.locale],
      isPartOf: ref(WEBSITE_ID),
      mainEntity: ref(PERSON_ID),
    },
    person(route.locale, portrait),
  ];
}

function person(locale: Locale, portrait: string | undefined) {
  const t = RESUME[locale];
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE.author,
    givenName: 'Thomas',
    familyName: 'Bouzy',
    jobTitle: t.schema.jobTitle,
    description: t.meta.description,
    url: absoluteUrl(homePath(locale)),
    // The portrait, not the Open Graph card: a card with his name on it is not a picture of him.
    ...(portrait && { image: absoluteUrl(portrait) }),
    email: `mailto:${CONTACT.email}`,
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Grand Est',
      addressCountry: 'FR',
    },
    sameAs: [CONTACT.linkedin, CONTACT.github],
    knowsLanguage: t.languages.map((l) => l.name),
    /* The Toolkit grid went first, then the Track record's stack chips went with
       chantier A, so this stopped being derivable from anything on the page and
       is stated in the content instead. The rule it was derived under survives
       and is now a test: `tests/content.spec.ts` asserts every term below
       appears verbatim in a string the page renders, so the schema can only ever
       claim a technology a reader can find. Same reason `worksFor` is absent. */
    knowsAbout: t.schema.knowsAbout,
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Université de Reims Champagne-Ardenne',
    },
    /* No worksFor. It used to be derived from jobs[0], which is the *most recent*
       job, not necessarily a current one — so the schema went on telling crawlers
       and ATS parsers that he still worked at an employer the visible page says he
       left. A Person schema with no employer is accurate for someone working for
       himself; a wrong one is worse than a missing one. */
  };
}

/**
 * At registration only. The business number and the region, never a street
 * address: the registered one is a domiciliation address, and the notice in
 * the footer is where the law wants it (ADR 16).
 */
function business(legal: Publisher) {
  return {
    '@type': 'ProfessionalService',
    '@id': BUSINESS_ID,
    name: legal.businessName,
    url: absoluteUrl('/'),
    identifier: { '@type': 'PropertyValue', propertyID: 'SIRET', value: legal.siret },
    founder: ref(PERSON_ID),
    address: { '@type': 'PostalAddress', addressRegion: 'Grand Est', addressCountry: 'FR' },
    areaServed: areaServed('service-area', 'fr'),
  };
}

/** What a page other than the home page is called, and what it sells. */
function describe(route: Route) {
  const { page, locale, path } = route;
  const t = RESUME[locale];
  if (page.id === 'home') throw new Error('The home page sells no Service');
  if (page.id === 'partners' || page.id === 'public-sector') {
    const content = page.id === 'partners' ? t.partnersPage : t.publicSectorPage;
    if (!content) throw new Error(`${path}: no ${locale} content for the ${page.id} page`);
    return {
      meta: content.meta,
      name: content.title,
      plain: content.plain,
      heading: content.title,
    };
  }
  const content = t.offerPages[page.id];
  if (!content) throw new Error(`${path}: no ${locale} content for the ${page.id} Offer`);
  const summary = t.offers[page.id];
  return { meta: content.meta, name: summary.name, plain: summary.plain, heading: content.heading };
}

/**
 * An Offer page, or the Partners or public-sector page: the WebPage, the trail
 * to it, and the Service it sells, which is a thing of its own and not the
 * page. The Person is restated by reference, so the provider resolves on the
 * page that names it.
 */
function serviceNodes(route: Route, provider: string) {
  const { page, locale } = route;
  const url = absoluteUrl(route.path);
  const { meta, name, plain, heading } = describe(route);
  const offers = priceSpecifications(page.id);

  return [
    {
      '@type': 'WebPage',
      '@id': url,
      url,
      name: meta.title,
      description: meta.description,
      inLanguage: LOCALE_TAG[locale],
      isPartOf: ref(WEBSITE_ID),
      breadcrumb: ref(`${url}#breadcrumb`),
      mainEntity: ref(`${url}#service`),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: breadcrumbOf(route).map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: crumb.name,
        item: absoluteUrl(crumb.href),
      })),
    },
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      url,
      name,
      description: plain,
      // The H1: the words a buyer searches with (ADR 18).
      serviceType: heading,
      inLanguage: LOCALE_TAG[locale],
      provider: ref(provider),
      areaServed: areaServed(REACH[page.id as ServicePageId], locale),
      ...(offers.length > 0 && {
        offers: {
          '@type': 'Offer',
          url,
          priceCurrency: 'EUR',
          priceSpecification: offers,
        },
      }),
    },
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: SITE.author,
      url: absoluteUrl(homePath(locale)),
    },
  ];
}

type ServicePageId = Exclude<PageId, 'home'>;

/**
 * Where each page's Service is bought in person, in the Service area, or from
 * anywhere in France. A page added to the registry does not compile until it
 * says which.
 *
 * - The Audit and the Takeover sell to the local owner of an orphan
 *   application, who expects someone at the door.
 * - The Build's local buyer is the business running on a shared spreadsheet
 *   (ADR 19), and local authorities buy from someone they can meet.
 * - The rest is bought by Critical-systems Clients and Partners, remote.
 */
const REACH: Record<ServicePageId, 'service-area' | 'country'> = {
  audit: 'service-area',
  takeover: 'service-area',
  build: 'service-area',
  'public-sector': 'service-area',
  migration: 'country',
  reliability: 'country',
  scaling: 'country',
  reinforcement: 'country',
  partners: 'country',
};

/** The towns first when the Offer is local, then France; an English reader is anywhere in the EU. */
function areaServed(reach: 'service-area' | 'country', locale: Locale) {
  const france = { '@type': 'Country', name: 'FR' };
  if (locale === 'en') return [france, { '@type': 'AdministrativeArea', name: 'EU' }];
  const towns = reach === 'service-area' ? SITE.serviceArea : [];
  return [...towns.map((town) => ({ '@type': 'City', name: town })), france];
}

function isOffer(id: PageId): id is OfferId {
  return (OFFER_IDS as readonly string[]).includes(id);
}

/** Prices are excluding VAT, which stays true whatever the VAT regime (ADR 18). */
const EXCLUDING_VAT = { priceCurrency: 'EUR', valueAddedTaxIncluded: false } as const;

/** The day rate, as UN/CEFACT spells a day. */
const dayRate = () => ({
  '@type': 'UnitPriceSpecification',
  price: DAY_RATE,
  unitCode: 'DAY',
  ...EXCLUDING_VAT,
});

/**
 * Every amount an Offer charges, as the range its price table spans: read from
 * prices.ts, never typed, like every other price the site prints (ADR 17).
 *
 * A plan is the fixed-price first phase of an Offer whose second phase is
 * billed by the day, and a Reinforcement is days at the rate, so those carry
 * the day rate too: a Migration's plan on its own would read as its whole
 * price. The Partners page's one price is the day rate. The public-sector page
 * sells the Offers, each priced on its own page.
 */
function priceSpecifications(id: PageId) {
  if (id === 'partners') return [dayRate()];
  if (!isOffer(id)) return [];

  const table = PRICES[id];
  const amounts = table.amounts.map((amount) => {
    const ranges = table.combinations.flatMap((combination) => combination.amounts[amount] ?? []);
    return {
      '@type': isMonthly(amount) ? 'UnitPriceSpecification' : 'PriceSpecification',
      minPrice: Math.min(...ranges.map((range) => range.min)),
      maxPrice: Math.max(...ranges.map((range) => range.max)),
      ...(isMonthly(amount) && { unitCode: 'MON' }),
      ...EXCLUDING_VAT,
    };
  });
  const byTheDay = table.amounts.includes('plan') || id === 'reinforcement';
  return byTheDay ? [...amounts, dayRate()] : amounts;
}
