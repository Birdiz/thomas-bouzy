import { DEFAULT_LOCALE, LOCALES, type Locale } from './site.ts';

/**
 * Every page the site serves, and the locales it exists in.
 *
 * This is the one list. The build generates a route per entry and locale
 * (src/pages/[...path].astro), the language switch and the `hreflang`
 * alternates pair a page with itself in the other locales, the sitemap lists
 * them, and every e2e suite that walks the site iterates over `ROUTES` — so a
 * page is tested the moment it exists, and a page nobody registered is not
 * built at all.
 *
 * A page that exists in one locale only says so by listing one path. It then
 * gets no alternate and no language switch, rather than a link to a page that
 * does not exist.
 */
export type PageId = 'home';

export interface Page {
  id: PageId;
  /** Root-relative path, trailing slash included, in each locale it exists in. */
  paths: Partial<Record<Locale, string>>;
}

export const PAGES: readonly Page[] = [{ id: 'home', paths: { en: '/', fr: '/fr/' } }];

/** One served URL: a page, in one of its locales. */
export interface Route {
  page: Page;
  locale: Locale;
  path: string;
}

/** Every URL the build emits, in registry order, locales in `LOCALES` order. */
export const ROUTES: readonly Route[] = PAGES.flatMap((page) =>
  LOCALES.flatMap((locale) => {
    const path = page.paths[locale];
    return path ? [{ page, locale, path }] : [];
  }),
);

export function getPage(id: PageId): Page {
  const page = PAGES.find((candidate) => candidate.id === id);
  if (!page) throw new Error(`No page "${id}" in the registry`);
  return page;
}

/** Where a page lives in a locale, or undefined if it does not exist there. */
export function pathOf(id: PageId, locale: Locale): string | undefined {
  return getPage(id).paths[locale];
}

/** The home page always exists in every locale; the header and the 404 lean on it. */
export function homePath(locale: Locale): string {
  const path = pathOf('home', locale);
  if (!path) throw new Error(`The home page has no ${locale} path`);
  return path;
}

/**
 * The versions of a page a reader can switch between, in `LOCALES` order.
 *
 * Empty for a page that exists in one locale: one version is not an
 * alternative to anything, and an alternate pointing at a missing page is the
 * dead end the registry exists to prevent.
 */
export function alternatesOf(page: Page): Route[] {
  const versions = ROUTES.filter((route) => route.page.id === page.id);
  return versions.length > 1 ? versions : [];
}

/**
 * The version `x-default` points at: the default locale's when the page has
 * one, otherwise none — a single-locale page carries no alternates at all.
 */
export function defaultAlternateOf(page: Page): Route | undefined {
  return alternatesOf(page).find((route) => route.locale === DEFAULT_LOCALE);
}

/** The route served at a root-relative path, if any. */
export function routeAt(path: string): Route | undefined {
  return ROUTES.find((route) => route.path === path);
}
