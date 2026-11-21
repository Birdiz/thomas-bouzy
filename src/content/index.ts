import { withFrenchSpacing } from '../lib/french-spacing.ts';
import { fillPrices } from '../lib/price-tokens.ts';
import type { PageId } from '../routes.ts';
import type { Locale } from '../site.ts';
import { en } from './en.ts';
import { fr } from './fr.ts';
import type { ResumeContent } from './types.ts';

/**
 * Fills in the price tokens of every Offer's plain line: « Je rejoins votre
 * équipe 1 à {maxDays} jours par semaine » is read on the home page's cards,
 * on the Offer's page, in its Open Graph card and in its structured data, and
 * filling it here fills it everywhere (ADR 30).
 */
function withOfferPrices(content: ResumeContent, locale: Locale): ResumeContent {
  const offers = Object.fromEntries(
    Object.entries(content.offers).map(([id, offer]) => [
      id,
      { ...offer, plain: fillPrices(offer.plain, locale) },
    ]),
  ) as ResumeContent['offers'];
  return { ...content, offers };
}

/** The content as the pages read it: the French with its unbreakable spaces, every price filled in. */
export const RESUME: Record<Locale, ResumeContent> = {
  fr: withOfferPrices(withFrenchSpacing(fr), 'fr'),
  en: withOfferPrices(en, 'en'),
};

/**
 * The part of a locale's content that one page renders, or undefined when that
 * locale has none for it.
 *
 * This is what lets the parity test follow the registry instead of the whole
 * module: a page declared in both locales must have the same shape in both,
 * and a page declared in one locale only is exempt from the other.
 */
export function contentOfPage(locale: Locale, id: PageId): unknown {
  // The Offer pages and the other pages are their own; everything else in the
  // module is the home page and the chrome every page shares.
  const { offerPages, partnersPage, publicSectorPage, aboutPage, ...home } = RESUME[locale];
  if (id === 'home') return home;
  if (id === 'about') return aboutPage;
  if (id === 'partners') return partnersPage;
  if (id === 'public-sector') return publicSectorPage;
  return offerPages[id];
}

export type { ResumeContent } from './types.ts';
