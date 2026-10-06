import type { OfferId } from './offers.ts';

/**
 * Every price the site publishes, in one typed table (ADR 17).
 *
 * The static table on each Offer page, the estimator that turns it into
 * sliders, the "from" price on the home page's Offer cards and the day rate on
 * the Partners page all read from here, so none of them can disagree with
 * another, and changing a price is one edit.
 *
 * Amounts are euros excluding VAT. Nothing here has a locale: both languages
 * show the same numbers by construction, and each locale module supplies only
 * the words around them.
 *
 * The amounts were rebased on a single 550 € day rate on 5 October 2026 (ADR 18),
 * and are revisited with the business.
 */

/** A range, in euros excluding VAT — or in weeks, for a duration. */
export interface Range {
  min: number;
  max: number;
}

/**
 * What a combination prices. Each Offer declares which of these it uses.
 *
 * - `fee`: the price of a bounded piece of work, paid once.
 * - `setup`: the one-off start of something that then runs monthly.
 * - `monthly`: a recurring amount, per month.
 * - `plan`: the fixed-price first phase of a two-phase Offer.
 */
export type AmountId = 'fee' | 'setup' | 'monthly' | 'plan';

/** Which amounts recur every month; every other amount is paid once. */
export function isMonthly(amount: AmountId): boolean {
  return amount === 'monthly';
}

/** What a combination's duration measures, in weeks. */
export type DurationId = 'delivery' | 'setup' | 'execution';

/** One axis of the estimator: a slider, with its options in slider order. */
export interface Dimension {
  id: string;
  options: readonly string[];
}

/** The ranges for one choice of option on every dimension. */
export interface Combination {
  /** One option id per dimension, in dimension order. */
  options: readonly string[];
  amounts: Partial<Record<AmountId, Range>>;
  /**
   * Days of work at the day rate that the monthly amount includes. The
   * estimator says so under it, so a plan that jumps from 400 € to 1,500 € a
   * month shows where the difference goes.
   */
  daysIncluded?: number;
  weeks?: Range;
}

export interface PriceTable {
  dimensions: readonly Dimension[];
  /** The amounts every combination carries, in display order. The first is the headline. */
  amounts: readonly AmountId[];
  /** Present when every combination carries a duration. */
  duration?: DurationId;
  combinations: readonly Combination[];
}

/**
 * The day rate (ADR 18): one figure, the same for a Client and for a Partner.
 *
 * Above the regional generalists, below Paris: rates in France follow the
 * nearest big city, and Thomas's is Nancy or Strasbourg, not Paris. One figure
 * rather than a range, because a range is read from its low end, and a Partner
 * cannot build a margin on a number that moves.
 */
export const DAY_RATE = 550;

/** Days a week Thomas sells, to any one Client or in total. */
export const MAX_DAYS_PER_WEEK = 4;

/**
 * The Entry offer's price: one figure, whatever the size (ADR 18). The express
 * Audit is bounded in time, about two and a half days, not in scope.
 */
export const AUDIT_EXPRESS_FEE = 1400;

/**
 * What any Audit credits against the Engagement that follows it. Capped at the
 * express fee: uncapped, a full Audit would wipe out a Takeover's set-up.
 */
export const AUDIT_CREDIT = AUDIT_EXPRESS_FEE;

/** Days of change each month in an Evolution plan, by application size. */
export const EVOLUTION_DAYS = { small: 2, medium: 2.5, large: 3 } as const;

/** Billable days in a month of `daysPerWeek`: 52 weeks over 12 months. */
const WEEKS_PER_MONTH = 52 / 12;

/** Rounded to the nearest 50 €: an order of magnitude, not an invoice line. */
function monthlyAtDayRate(daysPerWeek: number): Range {
  const amount = Math.round((DAY_RATE * daysPerWeek * WEEKS_PER_MONTH) / 50) * 50;
  return { min: amount, max: amount };
}

const range = (min: number, max: number): Range => ({ min, max });

/** Watch plans are priced on the market for keeping an application healthy, not on days. */
const watch = { small: range(350, 450), medium: range(450, 550), large: range(550, 700) };

/** An Evolution plan: its Watch plan, plus its days of change at the day rate. */
function evolution(size: keyof typeof EVOLUTION_DAYS): Range {
  const days = EVOLUTION_DAYS[size];
  return range(watch[size].min + days * DAY_RATE, watch[size].max + days * DAY_RATE);
}

const express = range(AUDIT_EXPRESS_FEE, AUDIT_EXPRESS_FEE);

export const PRICES: Record<OfferId, PriceTable> = {
  // Each price below is an effort in days at the day rate, rounded, except the
  // express Audit (a fixed fee) and the Watch plans (a market price).
  audit: {
    dimensions: [
      { id: 'size', options: ['small', 'medium', 'large'] },
      { id: 'depth', options: ['express', 'full'] },
    ],
    amounts: ['fee'],
    duration: 'delivery',
    combinations: [
      { options: ['small', 'express'], amounts: { fee: express }, weeks: range(1, 1) },
      // 8–9 days.
      { options: ['small', 'full'], amounts: { fee: range(4500, 5000) }, weeks: range(3, 3) },
      { options: ['medium', 'express'], amounts: { fee: express }, weeks: range(1, 1) },
      // 10–11 days.
      { options: ['medium', 'full'], amounts: { fee: range(5500, 6000) }, weeks: range(3, 4) },
      { options: ['large', 'express'], amounts: { fee: express }, weeks: range(1, 1) },
      // 14–16 days: in practice the Due diligence.
      { options: ['large', 'full'], amounts: { fee: range(8000, 9000) }, weeks: range(4, 6) },
    ],
  },

  // A Watch set-up puts a smoke-test net on the critical paths; an Evolution
  // set-up puts the full net under the application, because it will change.
  takeover: {
    dimensions: [
      { id: 'size', options: ['small', 'medium', 'large'] },
      { id: 'plan', options: ['watch', 'evolution'] },
    ],
    amounts: ['setup', 'monthly'],
    duration: 'setup',
    combinations: [
      {
        options: ['small', 'watch'],
        amounts: { setup: range(2000, 3000), monthly: watch.small },
        weeks: range(1, 2),
      },
      {
        options: ['small', 'evolution'],
        amounts: {
          setup: range(3000, 4500),
          monthly: evolution('small'),
        },
        daysIncluded: EVOLUTION_DAYS.small,
        weeks: range(2, 3),
      },
      {
        options: ['medium', 'watch'],
        amounts: { setup: range(3000, 4500), monthly: watch.medium },
        weeks: range(2, 3),
      },
      {
        options: ['medium', 'evolution'],
        amounts: {
          setup: range(4500, 7000),
          monthly: evolution('medium'),
        },
        daysIncluded: EVOLUTION_DAYS.medium,
        weeks: range(3, 5),
      },
      {
        options: ['large', 'watch'],
        amounts: { setup: range(4500, 6500), monthly: watch.large },
        weeks: range(3, 5),
      },
      {
        options: ['large', 'evolution'],
        amounts: {
          setup: range(7000, 9000),
          monthly: evolution('large'),
        },
        daysIncluded: EVOLUTION_DAYS.large,
        weeks: range(5, 8),
      },
    ],
  },

  // The plan is the fixed-price first phase; execution is billed by the day
  // alongside the Client's team, so what the sliders move is its duration —
  // and test coverage moves it most, which is the point of having it as a
  // slider at all.
  migration: {
    dimensions: [
      { id: 'gap', options: ['one', 'two', 'three-plus'] },
      { id: 'coverage', options: ['good', 'partial', 'none'] },
    ],
    amounts: ['plan'],
    duration: 'execution',
    combinations: [
      { options: ['one', 'good'], amounts: { plan: range(2000, 2500) }, weeks: range(2, 4) },
      { options: ['one', 'partial'], amounts: { plan: range(2200, 2800) }, weeks: range(3, 6) },
      { options: ['one', 'none'], amounts: { plan: range(2500, 3200) }, weeks: range(6, 10) },
      { options: ['two', 'good'], amounts: { plan: range(2300, 2900) }, weeks: range(4, 6) },
      { options: ['two', 'partial'], amounts: { plan: range(2600, 3300) }, weeks: range(6, 10) },
      { options: ['two', 'none'], amounts: { plan: range(3000, 3600) }, weeks: range(10, 16) },
      {
        options: ['three-plus', 'good'],
        amounts: { plan: range(2700, 3300) },
        weeks: range(6, 10),
      },
      {
        options: ['three-plus', 'partial'],
        amounts: { plan: range(3000, 3700) },
        weeks: range(10, 16),
      },
      {
        options: ['three-plus', 'none'],
        amounts: { plan: range(3400, 4000) },
        weeks: range(16, 24),
      },
    ],
  },

  reliability: {
    dimensions: [{ id: 'flows', options: ['few', 'some', 'many'] }],
    amounts: ['fee'],
    duration: 'delivery',
    combinations: [
      // 6–10, 11–17 and 18–28 days.
      { options: ['few'], amounts: { fee: range(3500, 5500) }, weeks: range(2, 4) },
      { options: ['some'], amounts: { fee: range(6000, 9500) }, weeks: range(4, 6) },
      { options: ['many'], amounts: { fee: range(10000, 15000) }, weeks: range(6, 10) },
    ],
  },

  // Shaped like the Migration: the load diagnosis is the fixed-price first
  // phase, and the corrections are billed by the day, so the sliders move the
  // diagnosis and the duration. Observability is the teaching slider: without
  // metrics, finding the bottleneck costs more (ADR 19).
  scaling: {
    dimensions: [
      { id: 'services', options: ['one', 'some', 'many'] },
      { id: 'observability', options: ['good', 'partial', 'none'] },
    ],
    amounts: ['plan'],
    duration: 'execution',
    combinations: [
      // 4–5, 5–6 and 6–7 days.
      { options: ['one', 'good'], amounts: { plan: range(2200, 2750) }, weeks: range(2, 4) },
      { options: ['one', 'partial'], amounts: { plan: range(2750, 3300) }, weeks: range(3, 5) },
      { options: ['one', 'none'], amounts: { plan: range(3300, 3850) }, weeks: range(4, 6) },
      // 6–7, 7–8 and 8–10 days.
      { options: ['some', 'good'], amounts: { plan: range(3300, 3850) }, weeks: range(4, 6) },
      { options: ['some', 'partial'], amounts: { plan: range(3850, 4400) }, weeks: range(5, 8) },
      { options: ['some', 'none'], amounts: { plan: range(4400, 5500) }, weeks: range(6, 10) },
      // 9–10, 10–12 and 12–14 days.
      { options: ['many', 'good'], amounts: { plan: range(4950, 5500) }, weeks: range(6, 10) },
      { options: ['many', 'partial'], amounts: { plan: range(5500, 6600) }, weeks: range(8, 12) },
      { options: ['many', 'none'], amounts: { plan: range(6600, 7700) }, weeks: range(10, 16) },
    ],
  },

  // Shaped like the Migration too: the framing is the fixed-price first phase,
  // ending in a walking skeleton, and the build is billed by the day. Each
  // system to connect has its own rules, failures and delays, which is where
  // a build overruns: the integrations slider says so (ADR 19).
  build: {
    dimensions: [
      { id: 'size', options: ['small', 'medium', 'large'] },
      { id: 'integrations', options: ['none', 'few', 'many'] },
    ],
    amounts: ['plan'],
    duration: 'execution',
    combinations: [
      // 3–4, 4–5 and 5–6 days.
      { options: ['small', 'none'], amounts: { plan: range(1650, 2200) }, weeks: range(3, 5) },
      { options: ['small', 'few'], amounts: { plan: range(2200, 2750) }, weeks: range(4, 6) },
      { options: ['small', 'many'], amounts: { plan: range(2750, 3300) }, weeks: range(5, 8) },
      // 5–6, 6–8 and 8–10 days.
      { options: ['medium', 'none'], amounts: { plan: range(2750, 3300) }, weeks: range(6, 10) },
      { options: ['medium', 'few'], amounts: { plan: range(3300, 4400) }, weeks: range(8, 12) },
      { options: ['medium', 'many'], amounts: { plan: range(4400, 5500) }, weeks: range(10, 16) },
      // 8–10, 10–12 and 12–15 days.
      { options: ['large', 'none'], amounts: { plan: range(4400, 5500) }, weeks: range(10, 16) },
      { options: ['large', 'few'], amounts: { plan: range(5500, 6600) }, weeks: range(14, 20) },
      { options: ['large', 'many'], amounts: { plan: range(6600, 8250) }, weeks: range(18, 28) },
    ],
  },

  reinforcement: {
    dimensions: [
      {
        id: 'days',
        options: Array.from({ length: MAX_DAYS_PER_WEEK }, (_, i) => String(i + 1)),
      },
    ],
    amounts: ['monthly'],
    combinations: Array.from({ length: MAX_DAYS_PER_WEEK }, (_, i) => ({
      options: [String(i + 1)],
      amounts: { monthly: monthlyAtDayRate(i + 1) },
    })),
  },
};

/** Every combination of options a table's dimensions allow, in slider order. */
export function optionCombinations(table: PriceTable): string[][] {
  return table.dimensions.reduce<string[][]>(
    (combinations, dimension) =>
      combinations.flatMap((prefix) => dimension.options.map((option) => [...prefix, option])),
    [[]],
  );
}

/** The combination a choice of options selects, if the table has it. */
export function combinationFor(
  table: PriceTable,
  options: readonly string[],
): Combination | undefined {
  return table.combinations.find(
    (combination) =>
      combination.options.length === options.length &&
      combination.options.every((option, i) => option === options[i]),
  );
}

/**
 * The lowest price of every amount an Offer charges, headline first: a
 * Takeover's set-up, then its monthly plan. Showing the headline alone made a
 * Takeover read as a one-off 2,000 € (ADR 20).
 */
export function fromPrices(id: OfferId): { amount: AmountId; min: number }[] {
  const table = PRICES[id];
  if (table.amounts.length === 0) throw new Error(`${id} declares no amount`);
  return table.amounts.map((amount) => ({
    amount,
    min: Math.min(
      ...table.combinations.map((combination) => combination.amounts[amount]?.min ?? Infinity),
    ),
  }));
}

/** The lowest headline amount an Offer is sold for: the first "from" on its card. */
export function fromPrice(id: OfferId): { amount: AmountId; min: number } {
  const [headline] = fromPrices(id);
  if (!headline) throw new Error(`${id} declares no amount`);
  return headline;
}
