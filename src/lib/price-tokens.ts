import { AUDIT_CREDIT, DAY_RATE, EVOLUTION_DAYS, MAX_DAYS_PER_WEEK } from '../content/prices.ts';
import type { Locale } from '../site.ts';
import { formatEuros } from './money.ts';

/**
 * The prices prose is allowed to mention, by name. A sentence that states an
 * amount says `{credit}` or `{dayRate}` and gets the number from prices.ts at
 * build time, so changing a price stays one edit (ADR 17) and the prose can
 * never quote a stale one.
 */
function tokens(locale: Locale): Record<string, string> {
  const days = Object.values(EVOLUTION_DAYS);
  const number = new Intl.NumberFormat(locale);
  const to = locale === 'fr' ? 'à' : 'to';
  return {
    credit: formatEuros(AUDIT_CREDIT, locale),
    dayRate: formatEuros(DAY_RATE, locale),
    maxDays: String(MAX_DAYS_PER_WEEK),
    evolutionDays: `${number.format(Math.min(...days))} ${to} ${number.format(Math.max(...days))}`,
  };
}

/** Replaces every `{token}` prices.ts can answer; throws on one it cannot. */
export function fillPrices(text: string, locale: Locale): string {
  const values = tokens(locale);
  return text.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = values[name];
    if (value === undefined) throw new Error(`No price is called ${match}: "${text}"`);
    return value;
  });
}
