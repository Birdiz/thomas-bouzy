import { en } from '../../src/content/en.ts';
import { fr } from '../../src/content/fr.ts';
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
const CONTENT = { en, fr } as const;
const OFFER_ROUTES = ROUTES.filter((route) => route.page.id !== 'home');

for (const route of OFFER_ROUTES) {
  const offer = route.page.id as keyof typeof PRICES;
  const t = CONTENT[route.locale];

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
