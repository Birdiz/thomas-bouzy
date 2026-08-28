/**
 * Single source of truth for everything that is site-wide rather than content.
 *
 * The domain below is a placeholder until the custom domain is registered.
 * Changing it here updates: canonical URLs, hreflang, sitemap, JSON-LD and
 * `public/CNAME` (kept in sync by `npm run check:cname`).
 */
export const SITE = {
  domain: 'thomasbouzy.dev',
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
