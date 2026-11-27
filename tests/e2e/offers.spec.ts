import type { Page } from '@playwright/test';
import { RESUME } from '../../src/content/index.ts';
import { OFFER_IDS, OFFERS, type OfferId, type SegmentId } from '../../src/content/offers.ts';
import {
  type Combination,
  combinationFor,
  DAY_RATE,
  defaultOption,
  optionCombinations,
  PRICES,
  type PriceTable,
  totalOf,
} from '../../src/content/prices.ts';
import { formatEuroRange, formatEuros } from '../../src/lib/money.ts';
import { homePath, isServed, linkTo, pathOf, ROUTES } from '../../src/routes.ts';
import { CONTACT, LOCALES, OFFERS_PUBLISHED } from '../../src/site.ts';
import { expect, test } from './fixtures.ts';

/**
 * The Offer pages, through the registry: every route whose page is an Offer.
 * What is asserted is what a Client sees — the ranges the price table holds,
 * labelled as an order of magnitude, and a way to book a call that keeps the
 * page on its own origin.
 */
/** Why the catalogue's own tests do not run while it is hidden (ADR 34). */
const HIDDEN = 'The catalogue is hidden while OFFERS_PUBLISHED is false (ADR 34)';

const OFFER_ROUTES = ROUTES.filter((route) =>
  (OFFER_IDS as readonly string[]).includes(route.page.id),
);

/** What a combination prices, as the estimator prints it: its amounts, its weeks, its total. */
function figuresOf(table: PriceTable, combination: Combination | undefined): string {
  if (!combination) return '';
  const total = totalOf(table, combination);
  return JSON.stringify([combination.amounts, combination.weeks, total]);
}

/**
 * Whether a dimension's slider moves any figure, the others set to `options`:
 * the size of an express Audit does not, and its slider is out of the way
 * (ADR 30).
 */
function moves(table: PriceTable, i: number, options: readonly string[]): boolean {
  const dimension = table.dimensions[i];
  if (!dimension) throw new Error(`no dimension ${i}`);
  const prices = dimension.options.map((option) =>
    figuresOf(
      table,
      combinationFor(
        table,
        options.map((value, j) => (j === i ? option : value)),
      ),
    ),
  );
  return new Set(prices).size > 1;
}

for (const route of OFFER_ROUTES) {
  const offer = route.page.id as OfferId;
  const t = RESUME[route.locale];

  test.describe(`${route.path}`, () => {
    test('opens on the Offer, its search heading and its plain line', async ({ page }) => {
      await page.goto(route.path);
      // The H1 carries the words a buyer searches with; the catalogue name is
      // the last step of the breadcrumb above it (ADR 18), which leads back to
      // the Offers without going through the menu.
      await expect(page.locator('h1')).toHaveText(t.offerPages[offer]?.heading ?? '∅');
      const breadcrumb = page.getByRole('navigation', { name: t.a11y.breadcrumb });
      await expect(breadcrumb.locator('[aria-current="page"]')).toHaveText(t.offers[offer].name);
      await expect(breadcrumb.getByRole('link', { name: t.nav.offers })).toHaveAttribute(
        'href',
        `${homePath(route.locale)}#offers`,
      );
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
        // The whole budget, where the headline is only its start (ADR 30).
        const total = combination && totalOf(table, combination);
        if (total) await expect(row).toContainText(formatEuroRange(total, route.locale));
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
        page.locator(`#estimator-${offer}-${dimension.id}`),
      );
      // Each opens on its default: the median case for a criterion the reader
      // may not know, the first option otherwise (ADR 30).
      const opening = table.dimensions.map(defaultOption);
      for (const [i, dimension] of table.dimensions.entries()) {
        const slider = sliders[i];
        if (!slider) throw new Error('missing slider');
        const label = labels.dimensions[dimension.id]?.label ?? dimension.id;
        if (moves(table, i, opening)) {
          await expect(page.getByRole('slider', { name: label })).toHaveCount(1);
          await expect(slider).toHaveAttribute(
            'aria-valuetext',
            labels.dimensions[dimension.id]?.options[opening[i] ?? ''] ?? '',
          );
        } else {
          await expect(slider).toBeHidden();
        }
        // A criterion that explains itself does so under its slider.
        const help = labels.dimensions[dimension.id]?.help;
        if (help) {
          const described = (await slider.getAttribute('aria-describedby')) ?? '';
          await expect(page.locator(`#${described.split(' ')[0]}`)).toHaveText(help);
        }
      }

      // Every combination, reached from the keyboard alone. A slider that
      // moves nothing, given the others, is out of the way and left alone.
      for (const options of optionCombinations(table)) {
        for (const [i, dimension] of table.dimensions.entries()) {
          const slider = sliders[i];
          if (!slider) throw new Error('missing slider');
          const option = options[i] ?? '';
          if (!moves(table, i, options)) {
            await expect(slider, `${options.join(' × ')}: ${dimension.id}`).toBeHidden();
            continue;
          }
          await slider.focus();
          await page.keyboard.press('Home');
          for (let step = 0; step < dimension.options.indexOf(option); step++) {
            await page.keyboard.press('ArrowRight');
          }
          await expect(slider).toHaveAttribute(
            'aria-valuetext',
            labels.dimensions[dimension.id]?.options[option] ?? '',
          );
          // A dimension that explains its options shows the chosen one's note
          // under the slider, and describes the slider with it.
          const note = labels.dimensions[dimension.id]?.notes?.[option];
          if (note) {
            const described = (await slider.getAttribute('aria-describedby')) ?? '';
            await expect(page.locator(`#${described.split(' ').at(-1)}`)).toHaveText(note);
          }
        }

        const combination = combinationFor(table, options);
        for (const amount of table.amounts) {
          const range = combination?.amounts[amount];
          if (!range) throw new Error(`${offer} ${options.join(' ')} has no ${amount}`);
          await expect(result, options.join(' × ')).toContainText(
            formatEuroRange(range, route.locale),
          );
        }
        const total = combination && totalOf(table, combination);
        if (total) {
          await expect(result, options.join(' × ')).toContainText(
            formatEuroRange(total, route.locale),
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

    test('offers the call right under the price, and says who answers it (ADR 30)', async ({
      page,
    }) => {
      await page.goto(route.path);
      // It was three screens below the price on a desktop, five on a phone.
      const price = page.locator('section[aria-labelledby="offer-price"]');
      await expect(price.getByRole('link', { name: t.offerPage.book.cta })).toHaveAttribute(
        'href',
        CONTACT.booking,
      );
      // A name and a face beside the last button; the name says who, so the
      // face is not read out twice.
      const who = page.locator('#book .contact__who');
      await expect(who).toHaveText(t.offerPage.who);
      await expect(who.locator('img')).toHaveAttribute('alt', '');
    });

    test('titles its sections to be read, not scanned (ADR 30)', async ({ page }) => {
      await page.goto(route.path);
      // They were 12px grey capitals, smaller than the text under them.
      for (const heading of await page.locator('main h2.offer__heading').all()) {
        await expect(heading).toHaveCSS('font-size', '24px');
        await expect(heading).toHaveCSS('text-transform', 'none');
      }
    });
  });
}

test('the Audit states that its fee is deducted, and its due diligence variant', async ({
  page,
}) => {
  test.skip(!OFFERS_PUBLISHED, HIDDEN);
  await page.goto('/en/offers/audit/');
  await expect(page.locator('main')).toContainText(/deducted/);
  await expect(page.getByRole('heading', { name: /due diligence/i })).toBeVisible();
});

test.describe('languages on every page but the home page', () => {
  for (const route of ROUTES.filter((candidate) => candidate.page.id !== 'home')) {
    const versions = ROUTES.filter((other) => other.page.id === route.page.id);

    if (versions.length === 1) {
      test(`${route.path} exists in one locale: no alternate, and a way to the other home page`, async ({
        page,
      }) => {
        await page.goto(route.path);
        await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
        // Nothing to switch to, but a reader who came from the other language
        // gets back to it, and the link says it leads to a home page (ADR 28),
        // where this build serves one: the field study alone does not (ADR 35).
        const others = LOCALES.filter(
          (locale) => locale !== route.locale && isServed(homePath(locale)),
        );
        const links = page.locator('.lang-switch a');
        await expect(links).toHaveCount(others.length);
        for (const [i, other] of others.entries()) {
          await expect(links.nth(i)).toHaveAttribute('href', homePath(other));
          await expect(links.nth(i)).toHaveAttribute(
            'aria-label',
            RESUME[route.locale].a11y.otherHome,
          );
          await expect(links.nth(i)).not.toHaveAttribute('aria-current', /.*/);
        }
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
  test.skip(!OFFERS_PUBLISHED, HIDDEN);
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
  test.skip(!OFFERS_PUBLISHED, HIDDEN);
  for (const [path, locale] of [
    ['/offres/renfort-senior/', 'fr'],
    ['/en/offers/reinforcement/', 'en'],
  ] as const) {
    await page.goto(path);
    await expect(page.locator('.offer__day-rate')).toContainText(formatEuros(DAY_RATE, locale));
    // The monthly figure says how many days at that rate it stands for.
    const days = RESUME[locale].offerPages.reinforcement?.estimator.daysIncluded ?? '∅';
    const result = page.getByRole('status');
    await expect(result).toContainText(days.replace('{days}', locale === 'fr' ? '4,3' : '4.3'));
    await page.getByRole('slider').focus();
    await page.keyboard.press('End');
    await expect(result).toContainText(days.replace('{days}', locale === 'fr' ? '17,3' : '17.3'));
  }
});

test('the Partners page offers white label, the day rate and a CV on request only', async ({
  page,
}) => {
  test.skip(!OFFERS_PUBLISHED, HIDDEN);
  const partners = RESUME.fr.partnersPage;
  await page.goto('/partenaires/');
  await expect(page.locator('h1')).toHaveText(partners?.title ?? '∅');
  // What decides sits in one sheet, beside the Offers (ADR 33).
  const sheet = page.getByRole('complementary', { name: partners?.kicker ?? '∅' });
  for (const point of partners?.points ?? []) {
    await expect(sheet.getByRole('heading', { name: point.title })).toBeVisible();
  }
  // The same rate a Client pays (ADR 18), and the sheet opens on it.
  await expect(sheet.locator('.offer__rate')).toContainText(formatEuros(DAY_RATE, 'fr'));
  await expect(sheet.getByRole('link', { name: partners?.book.cta ?? '∅' })).toBeVisible();
  // A Referrer buys nothing, and is addressed apart (ADR 30).
  await expect(page.locator('.offer__referrers')).toHaveText(partners?.referrers ?? '∅');
  await expectDrawnOfferRows(page, 'partners');
});

test('the public-sector page sets what public purchasing asks beside the Offers', async ({
  page,
}) => {
  test.skip(!OFFERS_PUBLISHED, HIDDEN);
  const publicSector = RESUME.fr.publicSectorPage;
  await page.goto('/collectivites/');
  const sheet = page.getByRole('complementary', { name: publicSector?.kicker ?? '∅' });
  for (const point of publicSector?.points ?? []) {
    await expect(sheet.getByRole('heading', { name: point.title })).toBeVisible();
  }
  await expectDrawnOfferRows(page, 'public-sector');
  // Each proof sets its figure large, a figure its own sentence holds, and
  // hidden from a screen reader, which reads it there (ADR 33).
  const items = page.locator('.offer__proof li');
  await expect(items).toHaveCount(publicSector?.proof.items.length ?? -1);
  for (const [i, item] of (publicSector?.proof.items ?? []).entries()) {
    const figure = items.nth(i).locator('.offer__figure');
    await expect(figure).toHaveText(item.figure);
    await expect(figure).toHaveAttribute('aria-hidden', 'true');
  }
});

/**
 * Every Offer of the Segment, as the home page's row (ADR 33): its drawing,
 * decorative, and its name linking to its page. The sheet comes first in the
 * markup, so a phone shows it under the head; a wide screen moves it beside.
 */
async function expectDrawnOfferRows(page: Page, segment: SegmentId) {
  const ids = OFFER_IDS.filter((id) => OFFERS[id].segments.includes(segment));
  const rows = page.locator('.offer__rows .offers__card');
  await expect(rows).toHaveCount(ids.length);
  for (const [i, id] of ids.entries()) {
    const row = rows.nth(i);
    await expect(row).toHaveAttribute('data-offer', id);
    await expect(row.locator('svg.offer-visual')).toHaveAttribute('aria-hidden', 'true');
    await expect(row.locator('.offers__name a')).toHaveAttribute('href', pathOf(id, 'fr') ?? '∅');
  }
  const sheetFirst = await page
    .locator('.offer__split')
    .evaluate((split) => split.firstElementChild?.classList.contains('offer__sheet'));
  expect(sheetFirst).toBe(true);
}
