import type { Locale } from '../site.ts';
import { en } from './en.ts';
import { fr } from './fr.ts';
import type { ResumeContent } from './types.ts';

export const RESUME: Record<Locale, ResumeContent> = { en, fr };

export type { ResumeContent } from './types.ts';
