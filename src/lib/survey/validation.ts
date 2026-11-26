import type { Answer, Answers, SurveyQuestion, SurveyStructure } from './types.ts';
import { keepVisibleAnswers, visibleQuestions } from './visibility.ts';

export interface ValidationResult {
  /** French messages, keyed by question code. */
  errors: Record<string, string>;
  /** Cleaned answers: hidden questions dropped, stray fields removed, duplicates merged. This is what is sent. */
  answers: Answers;
}

const DEFAULT_TEXT_MAXLENGTH = 1000;

export function isEmpty(question: SurveyQuestion, answer: Answer | undefined): boolean {
  if (!answer) return true;
  switch (question.type) {
    case 'text':
      return !answer.texte?.trim();
    case 'scale':
      return !answer.sansAvis && typeof answer.echelle !== 'number';
    case 'boolean':
      return answer.booleen !== true;
    default:
      return (answer.options ?? []).length === 0;
  }
}

function validateOptions(
  question: SurveyQuestion,
  chosen: string[],
): { error?: string; values: string[] } {
  const known = new Set(question.options.map((option) => option.value));
  const values = [...new Set(chosen)];
  const unknown = values.find((value) => !known.has(value));
  if (unknown) return { error: `Réponse inconnue : « ${unknown} ».`, values: [] };

  if (question.type !== 'multi') {
    if (values.length > 1) return { error: 'Une seule réponse est possible.', values: [] };
    return { values };
  }

  const max = question.maxSelections ?? undefined;
  if (max && values.length > max) {
    return { error: `${max} réponse${max > 1 ? 's' : ''} au maximum.`, values: [] };
  }
  const exclusive = question.options.find(
    (option) => option.exclusive && values.includes(option.value),
  );
  if (exclusive && values.length > 1) {
    return { error: `« ${exclusive.label} » ne se combine avec aucune autre réponse.`, values: [] };
  }
  return { values };
}

function validateText(
  text: string | undefined,
  maxlength: number | null | undefined,
): { error?: string; text?: string } {
  const clean = text?.trim();
  if (!clean) return {};
  const limit = maxlength ?? DEFAULT_TEXT_MAXLENGTH;
  if (clean.length > limit) return { error: `${limit} caractères au maximum.` };
  return { text: clean };
}

function validateQuestion(
  question: SurveyQuestion,
  answer: Answer,
): { error?: string; answer: Answer } {
  switch (question.type) {
    case 'text': {
      const { error, text } = validateText(answer.texte, question.maxlength);
      return { ...(error && { error }), answer: text ? { texte: text } : {} };
    }
    case 'boolean':
      return { answer: { booleen: answer.booleen === true } };
    case 'scale': {
      if (answer.sansAvis) {
        if (!question.allowNoOpinion) {
          return { error: '« Sans avis » n’est pas proposé ici.', answer: {} };
        }
        return { answer: { sansAvis: true } };
      }
      if (typeof answer.echelle !== 'number') return { answer: {} };
      const min = question.scaleMin ?? 1;
      const max = question.scaleMax ?? 5;
      if (!Number.isInteger(answer.echelle) || answer.echelle < min || answer.echelle > max) {
        return { error: `Choisissez une valeur entre ${min} et ${max}.`, answer: {} };
      }
      return { answer: { echelle: answer.echelle } };
    }
    case 'single_with_text': {
      const { error, values } = validateOptions(question, answer.options ?? []);
      if (error) return { error, answer: {} };
      const picked = question.options.find((option) => option.value === values[0]);
      if (!picked?.revealsText) return { answer: values.length ? { options: values } : {} };
      const text = validateText(answer.texte, picked.textMaxlength);
      if (text.error) return { error: text.error, answer: {} };
      return { answer: { options: values, ...(text.text ? { texte: text.text } : {}) } };
    }
    default: {
      const { error, values } = validateOptions(question, answer.options ?? []);
      if (error) return { error, answer: {} };
      return { answer: values.length ? { options: values } : {} };
    }
  }
}

/**
 * Validates answers against the structure. Run in the browser to block
 * progress, and run again by the back office before it stores anything: the
 * first is a comfort, the second is the one that protects.
 *
 * `scope` limits the check to some questions (the current step) while the
 * visibility still follows every answer given.
 */
export function validateAnswers(
  structure: SurveyStructure,
  raw: Answers,
  scope?: ReadonlySet<string>,
): ValidationResult {
  const candidates = keepVisibleAnswers(structure, raw);
  const errors: Record<string, string> = {};
  const answers: Answers = {};

  for (const question of visibleQuestions(structure, candidates)) {
    if (scope && !scope.has(question.code)) continue;
    const answer = candidates[question.code];
    if (isEmpty(question, answer)) {
      if (question.required) errors[question.code] = 'Cette question est obligatoire.';
      continue;
    }
    const result = validateQuestion(question, answer ?? {});
    if (result.error) {
      errors[question.code] = result.error;
      continue;
    }
    if (Object.keys(result.answer).length > 0) answers[question.code] = result.answer;
  }

  return { errors, answers };
}
