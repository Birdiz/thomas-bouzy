import { RESUME } from '../../src/content/index.ts';
import type { OfferId } from '../../src/content/offers.ts';
import { combinationFor, optionCombinations, PRICES } from '../../src/content/prices.ts';
import { formatEuroRange } from '../../src/lib/money.ts';
import { ROUTES } from '../../src/routes.ts';
import { CONTACT } from '../../src/site.ts';
import { expect, test } from './fixtures.ts';

/**
 * The Offer pages, through the registry: every route whose page is an Offer.
 * What is asserted is what a Client sees — the ranges the price table holds,
 * labelled as an order of magnitude, and a way to book a call that keeps the
 * page on its own origin.
 */
const OFFER_ROUTES = ROUTES.filter((route) => route.page.id !== 'home');

for (const route of OFFER_ROUTES) {
  const offer = route.page.id as OfferId;
  const t = RESUME[route.locale];

  test.describe(`${route.path}`, () => {
    test('opens on the Offer and its plain line', async ({ page }) => {
      await page.goto(route.path);
      await expect(page.locator('h1')).toHaveText(t.offers[offer].name);
      await expect(page.getByText(t.offers[offer].plain)).toBeVisible();
    });

    test('shows every range the price table holds, as an order of magnitude', async ({ page }) => {
      await page.goto(route.path);
      const table = PRICES[offer];
      const rows = page.locator('.estimator__table tbody tr');
      await expect(rows).toHaveCount(optionCombinations(table).length);

      for (const options of optionCombinations(table)) {
        const row = page.locator(`.estimator__table tbody tr[data-options="${options.join(' ')}"]`);
        const combination = combinationFor(table, options);
        for (const amount of table.amounts) {
          const range = combination?.amounts[amount];
          if (!range) throw new Error(`${offer} ${options.join(' ')} has no ${amount}`);
          await expect(row).toContainText(formatEuroRange(range, route.locale));
        }
      }

      await expect(page.locator('.estimator__disclaimer')).toHaveText(t.offerPage.disclaimer);
    });

    test('turns the table into labelled sliders that show every range it holds', async ({
      page,
    }) => {
      await page.goto(route.path);
      const table = PRICES[offer];
      const labels = t.offerPages[offer]?.estimator;
      if (!labels) throw new Error(`${route.path} has no estimator labels`);

      // The table it replaces is gone, the result is announced.
      await expect(page.locator('[data-estimator-table]')).toBeHidden();
      const result = page.getByRole('status');
      await expect(result).toHaveCount(1);

      const sliders = table.dimensions.map((dimension) =>
        page.getByRole('slider', { name: labels.dimensions[dimension.id]?.label ?? dimension.id }),
      );
      for (const slider of sliders) await expect(slider).toHaveCount(1);

      // Every combination, reached from the keyboard alone.
      for (const options of optionCombinations(table)) {
        for (const [i, dimension] of table.dimensions.entries()) {
          const slider = sliders[i];
          if (!slider) throw new Error('missing slider');
          const option = options[i] ?? '';
          await slider.focus();
          await page.keyboard.press('Home');
          for (let step = 0; step < dimension.options.indexOf(option); step++) {
            await page.keyboard.press('ArrowRight');
          }
          await expect(slider).toHaveAttribute(
            'aria-valuetext',
            labels.dimensions[dimension.id]?.options[option] ?? '',
          );
        }

        const combination = combinationFor(table, options);
        for (const amount of table.amounts) {
          const range = combination?.amounts[amount];
          if (!range) throw new Error(`${offer} ${options.join(' ')} has no ${amount}`);
          await expect(result, options.join(' × ')).toContainText(
            formatEuroRange(range, route.locale),
          );
        }
      }
    });

    test('keeps every range, and leaves no dead control, without JavaScript', async ({
      browser,
    }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(route.path);
      await expect(page.getByRole('slider')).toHaveCount(0);
      await expect(page.locator('[data-estimator-table]')).toBeVisible();
      await expect(page.locator('.estimator__table tbody tr')).toHaveCount(
        optionCombinations(PRICES[offer]).length,
      );
      await context.close();
    });

    test('books the call through a plain outbound link', async ({ page }) => {
      await page.goto(route.path);
      const book = page.locator('#book').getByRole('link', { name: t.offerPage.book.cta });
      await expect(book).toHaveAttribute('href', CONTACT.booking);
      await expect(page.locator('iframe')).toHaveCount(0);
    });
  });
}

test('the Audit states that its fee is deducted, and its due diligence variant', async ({
  page,
}) => {
  await page.goto('/en/offers/audit/');
  await expect(page.locator('main')).toContainText(/deducted/);
  await expect(page.getByRole('heading', { name: /due diligence/i })).toBeVisible();
});
