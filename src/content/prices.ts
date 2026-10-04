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
 * The amounts are provisional. They reach the site through content review, not
 * through this file's comments, and are revisited with the business.
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
 * The published day rate (ADR 17). The low end is for long, full-time
 * Engagements. Reinforcement is priced from it, and the Partners page shows it.
 */
export const DAY_RATE: Range = { min: 600, max: 750 };

/** Billable days in a month of `daysPerWeek`: 52 weeks over 12 months. */
const WEEKS_PER_MONTH = 52 / 12;

/** Rounded to the nearest 50 €: an order of magnitude, not an invoice line. */
function monthlyAtDayRate(daysPerWeek: number): Range {
  const round = (amount: number) => Math.round(amount / 50) * 50;
  return {
    min: round(DAY_RATE.min * daysPerWeek * WEEKS_PER_MONTH),
    max: round(DAY_RATE.max * daysPerWeek * WEEKS_PER_MONTH),
  };
}

const range = (min: number, max: number): Range => ({ min, max });

export const PRICES: Record<OfferId, PriceTable> = {
  audit: {
    dimensions: [
      { id: 'size', options: ['small', 'medium', 'large'] },
      { id: 'depth', options: ['express', 'full'] },
    ],
    amounts: ['fee'],
    duration: 'delivery',
    combinations: [
      { options: ['small', 'express'], amounts: { fee: range(1500, 1800) }, weeks: range(1, 1) },
      { options: ['small', 'full'], amounts: { fee: range(5000, 5800) }, weeks: range(3, 3) },
      { options: ['medium', 'express'], amounts: { fee: range(1800, 2200) }, weeks: range(1, 2) },
      { options: ['medium', 'full'], amounts: { fee: range(5800, 6600) }, weeks: range(3, 4) },
      { options: ['large', 'express'], amounts: { fee: range(2200, 2500) }, weeks: range(2, 2) },
      { options: ['large', 'full'], amounts: { fee: range(6600, 7500) }, weeks: range(4, 5) },
    ],
  },

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
        amounts: { setup: range(3500, 5000), monthly: range(350, 450) },
        weeks: range(2, 3),
      },
      {
        options: ['small', 'evolution'],
        amounts: { setup: range(3500, 5000), monthly: range(1400, 1800) },
        weeks: range(2, 3),
      },
      {
        options: ['medium', 'watch'],
        amounts: { setup: range(5000, 7500), monthly: range(450, 550) },
        weeks: range(3, 5),
      },
      {
        options: ['medium', 'evolution'],
        amounts: { setup: range(5000, 7500), monthly: range(1800, 2300) },
        weeks: range(3, 5),
      },
      {
        options: ['large', 'watch'],
        amounts: { setup: range(7500, 10000), monthly: range(550, 700) },
        weeks: range(5, 8),
      },
      {
        options: ['large', 'evolution'],
        amounts: { setup: range(7500, 10000), monthly: range(2300, 2800) },
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
      { options: ['few'], amounts: { fee: range(4000, 7000) }, weeks: range(2, 4) },
      { options: ['some'], amounts: { fee: range(7000, 12000) }, weeks: range(4, 6) },
      { options: ['many'], amounts: { fee: range(12000, 20000) }, weeks: range(6, 10) },
    ],
  },

  reinforcement: {
    dimensions: [{ id: 'days', options: ['1', '2', '3', '4', '5'] }],
    amounts: ['monthly'],
    combinations: ['1', '2', '3', '4', '5'].map((days) => ({
      options: [days],
      amounts: { monthly: monthlyAtDayRate(Number(days)) },
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

/** The lowest headline amount an Offer is sold for: the "from" on its card. */
export function fromPrice(id: OfferId): { amount: AmountId; min: number } {
  const table = PRICES[id];
  const [amount] = table.amounts;
  if (!amount) throw new Error(`${id} declares no amount`);
  const min = Math.min(
    ...table.combinations.map((combination) => combination.amounts[amount]?.min ?? Infinity),
  );
  return { amount, min };
}
