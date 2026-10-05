import type { ResumeContent } from '../content/index.ts';
import type { OfferId } from '../content/offers.ts';
import { fromPrices, isMonthly } from '../content/prices.ts';
import type { Locale } from '../site.ts';
import { formatEuros } from './money.ts';

/**
 * What an Offer costs at the least, every amount it charges included:
 * "à partir de 2 000 € HT, puis 350 € / mois HT". The home page's cards and
 * the top of each Offer page print the same line, so they cannot disagree.
 */
export function fromLine(id: OfferId, locale: Locale, t: ResumeContent): string {
  const { from, followedBy } = t.offersSection;
  const { perMonth, excludingVat } = t.offerPage;
  return fromPrices(id)
    .map(({ amount, min }, i) => {
      // Non-breaking: "350 € / mois HT" is one price, and must not wrap inside.
      const price = [formatEuros(min, locale), isMonthly(amount) && perMonth, excludingVat]
        .filter(Boolean)
        .join(' ')
        .replaceAll(' ', '\u00a0');
      return i === 0 ? `${from[amount]} ${price}` : `${followedBy} ${price}`;
    })
    .join(', ');
}
