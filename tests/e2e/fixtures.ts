import { test as base } from '@playwright/test';

export type MotionPreference = 'reduce' | 'no-preference';

/**
 * Playwright 1.62's `use: { reducedMotion }` option does not reach the page —
 * `matchMedia('(prefers-reduced-motion: reduce)')` still reports false — while
 * `page.emulateMedia()` works. This fixture applies it explicitly.
 *
 * The default is `reduce`, because `html { scroll-behavior: smooth }` makes
 * programmatic scrolling animate: Playwright would hit-test a click point the
 * page has not finished moving to, and clicks land on whatever is passing
 * underneath. Reduced motion switches scrolling to `auto` — a code path we ship
 * anyway. Tests that care about the default motion opt back in with
 * `test.use({ motion: 'no-preference' })`.
 */
export const test = base.extend<{ motion: MotionPreference }>({
  motion: ['reduce', { option: true }],
  page: async ({ page, motion }, use) => {
    await page.emulateMedia({ reducedMotion: motion });
    await use(page);
  },
});

export { expect } from '@playwright/test';
