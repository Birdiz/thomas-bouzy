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
 *
 * A number keeps its groups together with a thin space, the one Intl puts in
 * the prices: « 1 000 membres » broke between 1 and 000. Only thousands are
 * joined, a group of one to three digits then groups of exactly three, so a
 * phone number or a year beside a number stays as typed.
 */
export function frenchSpacing(text: string): string {
  return text
    .replace(/(?<!\d)\d{1,3}(?: \d{3})+(?!\d)/g, (number) =>
      number.replaceAll(' ', NARROW_NO_BREAK_SPACE),
    )
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
