import type { OfferId } from './content/offers.ts';
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
export type PageId = 'home' | OfferId | 'partners';

export interface Page {
  id: PageId;
  /** Root-relative path, trailing slash included, in each locale it exists in. */
  paths: Partial<Record<Locale, string>>;
}

/**
 * Offer pages live under /offres/ and /en/offers/ (ADR 15). Each locale has its
 * own slug, so that a French page is found by the French words for it.
 */
export const PAGES: readonly Page[] = [
  { id: 'home', paths: { fr: '/', en: '/en/' } },
  { id: 'audit', paths: { fr: '/offres/audit/', en: '/en/offers/audit/' } },
  // French only: its Segments, the orphan app and Partners, are French and local.
  { id: 'takeover', paths: { fr: '/offres/reprise-et-maintenance/' } },
  { id: 'migration', paths: { fr: '/offres/migration/', en: '/en/offers/migration/' } },
  { id: 'reliability', paths: { fr: '/offres/fiabilisation/', en: '/en/offers/reliability/' } },
  { id: 'scaling', paths: { fr: '/offres/tenue-en-charge/', en: '/en/offers/scaling/' } },
  { id: 'build', paths: { fr: '/offres/creation-sur-mesure/', en: '/en/offers/build/' } },
  {
    id: 'reinforcement',
    paths: { fr: '/offres/renfort-senior/', en: '/en/offers/reinforcement/' },
  },
  // Agencies and IT services firms: French, like the Segment (ADR 14).
  { id: 'partners', paths: { fr: '/partenaires/' } },
];

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

/** Where a link to a page goes from a page in `locale`, and in which language it lands. */
export interface PageLink {
  href: string;
  /** Set when the link lands in another language than the page it is on. */
  hreflang?: Locale;
}

/**
 * A link to a page from a page in `locale`: its version in that locale, or its
 * version in the default locale when it has none — the Takeover and the
 * Partners page exist in French only (ADR 15), and are still linked from the
 * English home page.
 */
export function linkTo(id: PageId, locale: Locale): PageLink {
  const here = pathOf(id, locale);
  if (here) return { href: here };
  const fallback = pathOf(id, DEFAULT_LOCALE);
  if (!fallback) throw new Error(`${id} exists in neither ${locale} nor ${DEFAULT_LOCALE}`);
  return { href: fallback, hreflang: DEFAULT_LOCALE };
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
