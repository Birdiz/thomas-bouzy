/**
 * Single source of truth for everything that is site-wide rather than content.
 *
 * Two environment variables drive deployment, both read at BUILD time because
 * everything derived from them is baked into the static output:
 *
 *   SITE_DOMAIN     the hostname the site is served from
 *   SITE_INDEXABLE  whether that hostname is the canonical one
 *
 * `scripts/check-assets.mjs` fails a production build that leaves SITE_DOMAIN
 * unset, so the placeholder below can only ever be a development convenience.
 */
export const SITE = {
  /**
   * Where the site is served from. Everything derived from it — canonical URLs,
   * hreflang, the sitemap, robots.txt, the JSON-LD — follows automatically.
   *
   * `SITE_DOMAIN` at build time wins, which is how Railway passes its own
   * hostname (the same variable name the Caddyfile of the other projects uses).
   * The fallback is a placeholder for local development only: a production
   * build without SITE_DOMAIN is a build error, not a site quietly pointing its
   * canonical URLs at a domain that does not resolve.
   */
  domain: process.env.SITE_DOMAIN?.trim() || 'thomasbouzy.dev',

  /**
   * True only on the canonical deployment.
   *
   * While the site lives on a temporary *.up.railway.app hostname it must not
   * be indexed: whatever Google learns about that host becomes a duplicate of
   * the real domain the day it lands, and a brand-new site has no authority to
   * spend on a redirect-and-reindex cycle. False therefore means robots.txt
   * disallows everything, the pages carry `<meta name="robots" content="noindex">`
   * and the server adds `X-Robots-Tag`.
   *
   * Set SITE_INDEXABLE=true on the service once SITE_DOMAIN is the real domain.
   */
  get indexable(): boolean {
    return /^(1|true|yes)$/i.test((process.env.SITE_INDEXABLE ?? '').trim());
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
  email: 'birdiz@proton.me',
  /** Never rendered into the HTML source — see components/RevealPhone.astro. */
  phoneE164: '+33632134547',
  phoneDisplay: '06 32 13 45 47',
  linkedin: 'https://www.linkedin.com/in/thomas-bouzy',
  /* Same handle as the contact address, which is the point: `birdiz` reads as
     a pseudonym on its own, and as an identity once the profile it belongs to
     is one click away. */
  github: 'https://github.com/Birdiz',
} as const;

/**
 * Publisher identity, for the legal notice in the footer.
 *
 * French law requires a site published in a professional capacity to name its
 * publisher and its host. None of it can be guessed from the repository, so the
 * fields start empty and `isComplete` gates the block: an incomplete legal
 * notice is worse than none — it reads as an unfinished site, which is the one
 * signal an independent cannot afford. Fill these in and the block appears.
 *
 * `SITE.region` deliberately publishes a region and not a locality; a legal
 * notice needs the registered address, so publishing one is a decision to take
 * knowingly rather than a field to fill because it is there.
 */
export const LEGAL = {
  /** Registered name. For a sole trader, usually the person's own name. */
  businessName: '',
  /** e.g. 'Entrepreneur individuel', 'EURL', 'SASU'. */
  legalForm: '',
  siret: '',
  /** Either a VAT number, or the exemption wording (art. 293 B du CGI). */
  vat: '',
  /** Registered address, on one line. */
  address: '',
  /** Named because the law requires the host to be identifiable. */
  host: {
    name: 'Railway Corp.',
    url: 'https://railway.com',
    /** Left to verify rather than guessed: a wrong address is not a notice. */
    address: '',
  },
  get isComplete(): boolean {
    return Boolean(
      this.businessName && this.legalForm && this.siret && this.address && this.host.address,
    );
  },
};

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
