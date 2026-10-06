import { RESUME } from '../content/index.ts';
import { homePath, type Route } from '../routes.ts';

/** One step of a trail: what the page is called, and where it is. */
export interface Crumb {
  name: string;
  href: string;
}

/**
 * Where a page sits, from the home page to the page itself. The visible
 * breadcrumb and the BreadcrumbList in the JSON-LD both read it, so the two
 * cannot name a step differently or point it somewhere else.
 *
 * Empty for the home page: every trail starts there.
 */
export function breadcrumbOf(route: Route): Crumb[] {
  const { page, locale, path } = route;
  const t = RESUME[locale];
  if (page.id === 'home') return [];

  const home = { name: t.nav.home, href: homePath(locale) };
  if (page.id === 'partners' || page.id === 'public-sector') {
    const content = page.id === 'partners' ? t.partnersPage : t.publicSectorPage;
    if (!content) throw new Error(`${path}: no ${locale} content for the ${page.id} page`);
    return [home, { name: content.kicker, href: path }];
  }

  // An Offer sits under the Offers, which live on the home page.
  return [
    home,
    { name: t.nav.offers, href: `${homePath(locale)}#offers` },
    { name: t.offers[page.id].name, href: path },
  ];
}
