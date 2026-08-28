import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import type { Result } from 'axe-core';
import { expect, test } from './fixtures.ts';

const PATHS = ['/', '/fr/'] as const;

/** A failure message that names the offending elements, not just the rule. */
function describe(violations: Result[]): string[] {
  return violations.flatMap((v) =>
    v.nodes.map(
      (node) =>
        `${v.id} (${v.impact}) @ ${node.target.join(' ')}\n    ${(node.failureSummary ?? v.help)
          .split('\n')
          .join('\n    ')}`,
    ),
  );
}

// Panels fade in with `animation: tb-in`. Axe samples colours the instant it
// runs, so mid-fade frames would read as contrast failures no visitor ever
// sees. The suite runs under reduced motion (see playwright.config.ts) and
// settle() waits out whatever is still running, so the audit sees the end state.

/** Wait for every finite animation to finish (the ambient loops never do). */
async function settle(page: Page) {
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => a.effect?.getComputedTiming().iterations !== Number.POSITIVE_INFINITY)
        .map((a) => a.finished.catch(() => undefined)),
    ),
  );
}

for (const path of PATHS) {
  test(`${path} has no serious or critical accessibility violations`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('h1')).toBeVisible();
    await settle(page);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );

    expect(describe(blocking)).toEqual([]);
  });

  test(`${path} stays accessible with every disclosure open`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => {
      for (const details of document.querySelectorAll('details')) details.open = true;
    });
    await page.getByRole('button', { name: /Show phone number|Afficher le numéro/ }).click();
    await settle(page);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );

    expect(describe(blocking)).toEqual([]);
  });
}
