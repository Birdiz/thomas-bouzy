import type {
  Answers,
  DisplayCondition,
  SurveyQuestion,
  SurveySection,
  SurveyStructure,
} from './types.ts';

/**
 * A condition always reads the OPTIONS chosen at another question: free text
 * and scales drive no display, on purpose.
 */
export function conditionMet(
  condition: DisplayCondition | null | undefined,
  answers: Answers,
): boolean {
  if (!condition) return true;
  const chosen = answers[condition.question]?.options ?? [];
  return chosen.some((value) => condition.in.includes(value));
}

/** The sections a respondent sees given their answers so far, each with its visible questions. */
export function visibleSections(structure: SurveyStructure, answers: Answers): SurveySection[] {
  return structure.sections
    .filter((section) => conditionMet(section.displayIf, answers))
    .map((section) => ({
      ...section,
      questions: section.questions.filter((question) => conditionMet(question.displayIf, answers)),
    }))
    .filter((section) => section.questions.length > 0);
}

export function visibleQuestions(structure: SurveyStructure, answers: Answers): SurveyQuestion[] {
  return visibleSections(structure, answers).flatMap((section) => section.questions);
}

/**
 * Display grouping: a question with `displayGroup` sits with the question it
 * names, so that a question and its follow-up are not split apart.
 */
export function groupForDisplay(questions: SurveyQuestion[]): SurveyQuestion[][] {
  const groups: SurveyQuestion[][] = [];
  for (const question of questions) {
    const host = question.displayGroup
      ? groups.find((group) => group.some((other) => other.code === question.displayGroup))
      : undefined;
    if (host) host.push(question);
    else groups.push([question]);
  }
  return groups;
}

/**
 * The answers of visible questions only. Hidden answers are neither sent nor
 * allowed to block progress; removing one can hide another, hence the loop.
 */
export function keepVisibleAnswers(structure: SurveyStructure, answers: Answers): Answers {
  let kept = answers;
  for (let pass = 0; pass <= structure.sections.length; pass++) {
    const visible = new Set(visibleQuestions(structure, kept).map((question) => question.code));
    const filtered = Object.fromEntries(Object.entries(kept).filter(([code]) => visible.has(code)));
    if (Object.keys(filtered).length === Object.keys(kept).length) return filtered;
    kept = filtered;
  }
  return kept;
}
