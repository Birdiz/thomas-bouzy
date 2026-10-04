import type { Range } from '../content/prices.ts';
import { LOCALE_TAG, type Locale } from '../site.ts';

/**
 * Prices are rendered at build time only. The estimator's script copies the
 * strings the static table already carries, so there is exactly one formatter
 * and the slider and the table cannot print the same number two ways.
 */
function euros(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_TAG[locale], {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** "1 500 € – 2 500 €" / "€1,500 – €2,500". */
export function formatEuroRange({ min, max }: Range, locale: Locale): string {
  return min === max ? euros(min, locale) : `${euros(min, locale)} – ${euros(max, locale)}`;
}

/** "1 500 €" / "€1,500". */
export function formatEuros(amount: number, locale: Locale): string {
  return euros(amount, locale);
}

/** "2–4" or "3": the number part of a duration, its unit supplied by the locale. */
export function formatSpan({ min, max }: Range): string {
  return min === max ? String(min) : `${min}–${max}`;
}
