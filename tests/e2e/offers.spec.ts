import { RESUME } from '../../src/content/index.ts';
import { OFFER_IDS, type OfferId } from '../../src/content/offers.ts';
import { combinationFor, DAY_RATE, optionCombinations, PRICES } from '../../src/content/prices.ts';
import { formatEuroRange, formatEuros } from '../../src/lib/money.ts';
import { linkTo, ROUTES } from '../../src/routes.ts';
import { CONTACT } from '../../src/site.ts';
import { expect, test } from './fixtures.ts';

/**
 * The Offer pages, through the registry: every route whose page is an Offer.
 * What is asserted is what a Client sees — the ranges the price table holds,
 * labelled as an order of magnitude, and a way to book a call that keeps the
 * page on its own origin.
 */
const OFFER_ROUTES = ROUTES.filter((route) =>
  (OFFER_IDS as readonly string[]).includes(route.page.id),
);

for (const route of OFFER_ROUTES) {
  const offer = route.page.id as OfferId;
  const t = RESUME[route.locale];

  test.describe(`${route.path}`, () => {
    test('opens on the Offer, its search heading and its plain line', async ({ page }) => {
      await page.goto(route.path);
      // The H1 carries the words a buyer searches with; the catalogue name is
      // the kicker above it (ADR 18).
      await expect(page.locator('h1')).toHaveText(t.offerPages[offer]?.heading ?? '∅');
      await expect(page.locator('.offer__head .kicker')).toContainText(t.offers[offer].name);
      await expect(page.getByText(t.offers[offer].plain)).toBeVisible();
    });

    test('links each "not the right choice" line to the Offer it names', async ({ page }) => {
      await page.goto(route.path);
      const lines = t.offerPages[offer]?.notTheRightChoice ?? [];
      const links = page.locator('.offer__fit-list a');
      const named = lines.filter((line) => line.offer);
      await expect(links).toHaveCount(named.length);
      for (const [i, line] of named.entries()) {
        if (!line.offer) continue;
        await expect(links.nth(i)).toHaveAttribute('href', linkTo(line.offer, route.locale).href);
        await expect(links.nth(i)).toHaveText(t.offers[line.offer].name);
      }
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

test.describe('languages on every page but the home page', () => {
  for (const route of ROUTES.filter((candidate) => candidate.page.id !== 'home')) {
    const versions = ROUTES.filter((other) => other.page.id === route.page.id);

    if (versions.length === 1) {
      test(`${route.path} exists in one locale: no alternate, no switch`, async ({ page }) => {
        await page.goto(route.path);
        await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
        await expect(page.locator('.lang-switch')).toHaveCount(0);
      });
    } else {
      test(`${route.path} switches to itself in the other language`, async ({ page }) => {
        for (const other of versions.filter((version) => version.locale !== route.locale)) {
          await page.goto(route.path);
          await page.locator(`.lang-switch a[hreflang="${other.locale}"]`).click();
          await expect(page).toHaveURL(new RegExp(`${other.path}$`));
        }
      });
    }
  }
});

test('the Takeover starts with the test safety net and is proven by the industrial ERP', async ({
  page,
}) => {
  const takeover = RESUME.fr.offerPages.takeover;
  const erp = RESUME.fr.achievements.find((achievement) => achievement.id === 'industrial-erp');
  await page.goto('/offres/reprise-et-maintenance/');
  await expect(page.locator('.offer__delivered > li').first()).toContainText(
    takeover?.delivered[0]?.title ?? '∅',
  );
  await expect(page.getByRole('heading', { name: erp?.title ?? '∅' })).toBeVisible();
  // Two figures for every combination: the set-up, then the monthly plan.
  const result = page.getByRole('status');
  await expect(result).toContainText(takeover?.estimator.amounts.setup ?? '∅');
  await expect(result).toContainText(takeover?.estimator.amounts.monthly ?? '∅');
  // An Evolution month says what it adds to a Watch month.
  const detail = (takeover?.estimator.daysIncluded ?? '∅').replace('{days}', '2');
  await expect(result).not.toContainText(detail);
  await page
    .getByRole('slider', { name: takeover?.estimator.dimensions.plan?.label ?? '∅' })
    .focus();
  await page.keyboard.press('End');
  await expect(result).toContainText(detail);
});

test('Reinforcement shows the day rate the price table holds', async ({ page }) => {
  for (const [path, locale] of [
    ['/offres/renfort-senior/', 'fr'],
    ['/en/offers/reinforcement/', 'en'],
  ] as const) {
    await page.goto(path);
    await expect(page.locator('.offer__day-rate')).toContainText(formatEuros(DAY_RATE, locale));
  }
});

test('the Partners page offers white label, the day rate and a CV on request only', async ({
  page,
}) => {
  const partners = RESUME.fr.partnersPage;
  await page.goto('/partenaires/');
  await expect(page.locator('h1')).toHaveText(partners?.title ?? '∅');
  for (const point of partners?.points ?? []) {
    await expect(page.getByRole('heading', { name: point.title })).toBeVisible();
  }
  // The same rate a Client pays (ADR 18).
  await expect(page.locator('.offer__day-rate')).toContainText(formatEuros(DAY_RATE, 'fr'));
  // Each Offer a Partner can bring Thomas into, linked to its page.
  await expect(page.locator('.offer__card-link')).not.toHaveCount(0);
  for (const href of await page
    .locator('.offer__card-link')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')))) {
    expect(ROUTES.map((route) => route.path)).toContain(href);
  }
});
