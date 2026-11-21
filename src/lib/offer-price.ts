import type { ResumeContent } from '../content/index.ts';
import type { OfferId } from '../content/offers.ts';
import { fromPrices, isMonthly } from '../content/prices.ts';
import type { Locale } from '../site.ts';
import { formatEuros } from './money.ts';

/**
 * What an Offer costs at the least, every amount it charges included:
 * "à partir de 2 000 € HT, puis 350 € / mois HT". The home page's cards and
 * the top of each Offer page print the same line, so they cannot disagree.
 * An Offer sold in two phases names the first before its price, « cadrage dès
 * 1 650 € HT »: it is a step, not the whole (ADR 30).
 */
export function fromLine(id: OfferId, locale: Locale, t: ResumeContent): string {
  const { from, followedBy } = t.offersSection;
  const { perMonth, excludingVat } = t.offerPage;
  const { phase } = t.offers[id];
  return fromPrices(id)
    .map(({ amount, min }, i) => {
      // Non-breaking: "350 € / mois HT" is one price, and must not wrap inside.
      const price = [formatEuros(min, locale), isMonthly(amount) && perMonth, excludingVat]
        .filter(Boolean)
        .join(' ')
        .replaceAll(' ', '\u00a0');
      if (i > 0) return `${followedBy} ${price}`;
      if (amount !== 'plan') return `${from[amount]} ${price}`;
      if (!phase) throw new Error(`${id} is sold in two phases, and its first has no name`);
      return `${phase} ${from.plan} ${price}`;
    })
    .join(', ');
}
