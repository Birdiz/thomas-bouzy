import type { PageId } from '../routes.ts';
import type { Locale } from '../site.ts';
import { en } from './en.ts';
import { fr } from './fr.ts';
import type { ResumeContent } from './types.ts';

export const RESUME: Record<Locale, ResumeContent> = { fr, en };

/**
 * The part of a locale's content that one page renders, or undefined when that
 * locale has none for it.
 *
 * This is what lets the parity test follow the registry instead of the whole
 * module: a page declared in both locales must have the same shape in both,
 * and a page declared in one locale only is exempt from the other.
 */
export function contentOfPage(locale: Locale, id: PageId): unknown {
  const content = RESUME[locale];
  switch (id) {
    case 'home':
      return content;
  }
}

export type { ResumeContent } from './types.ts';
