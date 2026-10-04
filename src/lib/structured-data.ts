import { RESUME } from '../content/index.ts';
import { homePath, type Route } from '../routes.ts';
import { absoluteUrl, CONTACT, LOCALE_TAG, type Locale, SITE } from '../site.ts';

/**
 * The JSON-LD each kind of page carries. None of it ever names a telephone:
 * the number is behind a click on the page, and repeating it here would hand
 * it straight back to any crawler (docs/adr/0005).
 */

const PERSON_ID = `${SITE.origin}/#person`;

/**
 * Person schema for rich results, wrapped in the ProfilePage that Google
 * documents for pages *about* a person — the page and its subject are two
 * things, and conflating them is why so many profile pages get no entity out of
 * their markup.
 */
function person(locale: Locale) {
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
    image: absoluteUrl('/og.png'),
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

export function profilePage(route: Route, title: string, description: string) {
  const url = absoluteUrl(route.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': url,
    url,
    name: title,
    description,
    inLanguage: LOCALE_TAG[route.locale],
    mainEntity: person(route.locale),
  };
}

/**
 * An Offer, as the Service it is. The provider is the same Person entity the
 * home page describes, referenced by id rather than restated.
 */
export function service(
  route: Route,
  name: string,
  description: string,
  areaServed: readonly string[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': absoluteUrl(route.path),
    url: absoluteUrl(route.path),
    name,
    description,
    inLanguage: LOCALE_TAG[route.locale],
    provider: {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: SITE.author,
      url: absoluteUrl(homePath(route.locale)),
    },
    areaServed: areaServed.map((city) => ({ '@type': 'City', name: city })),
  };
}
