import type { SurveyOption, SurveyQuestion } from './types.ts';

export type Random = () => number;

/** Fisher-Yates, with the randomness injected so tests are deterministic. */
function shuffle<T>(items: T[], random: Random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy;
}

/**
 * The order a question's options are shown in. Randomising is not cosmetic:
 * order steers answers. `pinLast` options (« Aucun », « Autre ») stay at the
 * end in their own order. The order shown is never recorded.
 */
export function orderOptions(
  question: SurveyQuestion,
  random: Random = Math.random,
): SurveyOption[] {
  const last = question.options.filter((option) => option.pinLast);
  const first = question.options.filter((option) => !option.pinLast);
  if (!question.randomizeOptions) return [...first, ...last];
  return [...shuffle(first, random), ...last];
}
