/**
 * The shape of a survey as the back office serves it (GET
 * /api/surveys/{slug}) and the shape of the answers posted back. Ported from
 * Thomas's own survey engine, with the same wire format: the back office
 * validates the answers again against the same rules, and the two must agree.
 *
 * The answer keys (`options`, `texte`, `echelle`, `sansAvis`, `booleen`) are
 * the API contract, kept as the engine names them.
 */

export type QuestionType =
  | 'single'
  | 'multi'
  | 'scale'
  | 'text'
  | 'select'
  | 'boolean'
  | 'single_with_text';

export type SurveyStatus = 'draft' | 'published' | 'closed';

/** Shown only when the answer to `question` is one of `in`: one condition, never a rule engine. */
export interface DisplayCondition {
  question: string;
  in: string[];
}

export interface SurveyOption {
  value: string;
  label: string;
  exclusive?: boolean;
  pinLast?: boolean;
  revealsText?: boolean;
  textMaxlength?: number | null;
  textHelp?: string | null;
}

export interface SurveyQuestion {
  code: string;
  type: QuestionType;
  label: string;
  help?: string | null;
  required: boolean;
  randomizeOptions?: boolean;
  maxSelections?: number | null;
  maxlength?: number | null;
  scaleMin?: number | null;
  scaleMax?: number | null;
  anchorMin?: string | null;
  anchorMax?: string | null;
  allowNoOpinion?: boolean;
  noOpinionLabel?: string | null;
  displayGroup?: string | null;
  displayIf?: DisplayCondition | null;
  options: SurveyOption[];
}

export interface SurveySection {
  code: string;
  title: string;
  displayIf?: DisplayCondition | null;
  questions: SurveyQuestion[];
}

export interface SurveyIntro {
  heading?: string;
  body?: string[];
}

export interface SurveyStructure {
  slug: string;
  title: string;
  locale?: string;
  version?: number;
  status: SurveyStatus;
  opensAt?: string | null;
  closesAt?: string | null;
  estimatedMinutes?: number | null;
  intro: SurveyIntro;
  sections: SurveySection[];
}

/** The answer to one question: one object rather than a union, since it travels as JSON. */
export interface Answer {
  options?: string[];
  texte?: string;
  echelle?: number;
  sansAvis?: boolean;
  booleen?: boolean;
}

/** Keyed by question code (`A1`, `B4`…). */
export type Answers = Record<string, Answer>;

/** The optional last step: who to call back, if they say so. */
export interface SurveyContact {
  name?: string;
  organisation?: string;
  role?: string;
  email?: string;
  phone?: string;
  wantsMeeting: boolean;
  contactConsent: boolean;
}
