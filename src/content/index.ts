import { withFrenchSpacing } from '../lib/french-spacing.ts';
import type { PageId } from '../routes.ts';
import type { Locale } from '../site.ts';
import { en } from './en.ts';
import { fr } from './fr.ts';
import type { ResumeContent } from './types.ts';

/** The content as the pages read it: the French with its unbreakable spaces. */
export const RESUME: Record<Locale, ResumeContent> = { fr: withFrenchSpacing(fr), en };

/**
 * The part of a locale's content that one page renders, or undefined when that
 * locale has none for it.
 *
 * This is what lets the parity test follow the registry instead of the whole
 * module: a page declared in both locales must have the same shape in both,
 * and a page declared in one locale only is exempt from the other.
 */
export function contentOfPage(locale: Locale, id: PageId): unknown {
  // The Offer pages are their own pages; everything else in the module is the
  // home page and the chrome every page shares.
  const { offerPages, partnersPage, ...home } = RESUME[locale];
  if (id === 'home') return home;
  if (id === 'partners') return partnersPage;
  return offerPages[id];
}

export type { ResumeContent } from './types.ts';
