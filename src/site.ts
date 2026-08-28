/**
 * Single source of truth for everything that is site-wide rather than content.
 *
 * The domain below is a placeholder until the custom domain is registered.
 * Changing it here updates: canonical URLs, hreflang, sitemap, JSON-LD and
 * `public/CNAME` (kept in sync by `npm run check:cname`).
 */
export const SITE = {
  /**
   * Where the site is served from. Everything derived from it — canonical URLs,
   * hreflang, the sitemap, robots.txt, the JSON-LD — follows automatically.
   *
   * `SITE_DOMAIN` at build time wins, which is how Railway passes its own
   * hostname (the same variable name the Caddyfile of the other projects uses).
   * The fallback is a placeholder, and a placeholder never deploys.
   */
  domain: process.env.SITE_DOMAIN?.trim() || 'thomasbouzy.dev',

  /**
   * True once the domain above actually resolves to this site. GitHub Pages
   * reads public/CNAME and then serves at that hostname and nowhere else, so
   * deploying against a placeholder yields a site reachable from no address.
   * Setting SITE_DOMAIN counts as confirming it.
   */
  get domainConfirmed(): boolean {
    return Boolean(process.env.SITE_DOMAIN?.trim());
  },
  get origin(): string {
    return `https://${this.domain}`;
  },
  author: 'Thomas Bouzy',
  /** Region only — the design's full locality is deliberately not published. */
  region: 'Grand Est, France',
  timezone: 'Europe/Paris',
} as const;

export const CONTACT = {
  email: 'tom.bouzy@gmail.com',
  /** Never rendered into the HTML source — see components/RevealPhone.astro. */
  phoneE164: '+33632134547',
  phoneDisplay: '06 32 13 45 47',
  linkedin: 'https://www.linkedin.com/in/thomas-bouzy',
} as const;

export const LOCALES = ['en', 'fr'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** Root-relative path of a locale's home page. */
export const LOCALE_PATH: Record<Locale, string> = {
  en: '/',
  fr: '/fr/',
};

/** BCP 47 tag used for `<html lang>` and `hreflang`. */
export const LOCALE_TAG: Record<Locale, string> = {
  en: 'en',
  fr: 'fr',
};

export const LOCALE_LABEL: Record<Locale, string> = {
  en: 'EN',
  fr: 'FR',
};

/** Language name in that language — the accessible name of the switch links. */
export const LOCALE_ENDONYM: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
};

export function absoluteUrl(path: string): string {
  return new URL(path, SITE.origin).href;
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'fr' : 'en';
}

/** Where each locale's CV PDF lives in public/, and what it downloads as. */
export const CV = {
  path(locale: Locale): string {
    return `/assets/cv-thomas-bouzy-${locale}.pdf`;
  },
  downloadName(locale: Locale): string {
    return `Thomas-Bouzy-CV-${locale.toUpperCase()}.pdf`;
  },
} as const;
