/** U+00A0: a word space that never breaks. */
export const NO_BREAK_SPACE = ' ';
/** U+202F: a thin space that never breaks. */
export const NARROW_NO_BREAK_SPACE = ' ';

/**
 * Makes the spaces French typography attaches to punctuation unbreakable, so
 * that a line never starts with `?` or `»`.
 *
 * The copy is typed with ordinary spaces, which nobody can see are wrong; the
 * fix lives here so that it is applied to every French string on its way to
 * the page, and the next sentence written cannot forget it. The widths follow
 * the Imprimerie nationale: a thin space before `;`, `?` and `!`, a word space
 * before `:` and inside the guillemets.
 */
export function frenchSpacing(text: string): string {
  return text
    .replace(/ ([;?!])/g, `${NARROW_NO_BREAK_SPACE}$1`)
    .replace(/ ([:»])/g, `${NO_BREAK_SPACE}$1`)
    .replace(/« /g, `«${NO_BREAK_SPACE}`);
}

/** Applies {@link frenchSpacing} to every string in a content tree. */
export function withFrenchSpacing<T>(content: T): T {
  if (typeof content === 'string') return frenchSpacing(content) as T;
  if (Array.isArray(content)) return content.map(withFrenchSpacing) as T;
  if (content && typeof content === 'object') {
    return Object.fromEntries(
      Object.entries(content).map(([key, value]) => [key, withFrenchSpacing(value)]),
    ) as T;
  }
  return content;
}
