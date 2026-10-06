import { RESUME } from '../content/index.ts';
import { ROUTES, type Route } from '../routes.ts';
import { SITE } from '../site.ts';

/**
 * The Open Graph card of each route: what LinkedIn shows under a shared link,
 * next to `og:title`. LinkedIn is the main channel until the site is indexed
 * (ADR 16), so each page gets a card of its own instead of the home page's.
 *
 * One card per route, drawn from one template by `npm run og`
 * (scripts/build-og.mjs) and committed under public/og/. The layout reads the
 * same cards to point `og:image` at the page's own, and `npm run assets:check`
 * fails when one is missing or was drawn from copy that has since changed.
 */
export interface OgCard {
  /** Root-relative URL of the image, which is also its path under public/. */
  src: string;
  /** The page's name: the person's on the home page, the Offer's catalogue name elsewhere. */
  title: string;
  /** The line under it: the hero's promise, or the Offer's plain line. */
  line: string;
  /** The signature at the foot. */
  foot: string;
  /** The home page sets its title larger: it is a name, not a heading. */
  home: boolean;
}

export function ogCard(route: Route): OgCard {
  const { page, locale, path } = route;
  const t = RESUME[locale];
  const src = `/og/${locale}-${page.id}.png`;

  if (page.id === 'home') {
    return {
      src,
      title: SITE.author,
      line: t.hero.title.join(' '),
      foot: 'Freelance PHP/Symfony',
      home: true,
    };
  }

  const foot = `${SITE.author} · Freelance PHP/Symfony`;
  if (page.id === 'partners' || page.id === 'public-sector') {
    const content = page.id === 'partners' ? t.partnersPage : t.publicSectorPage;
    if (!content) throw new Error(`${path}: no ${locale} content for the ${page.id} page`);
    return { src, title: content.kicker, line: content.plain, foot, home: false };
  }

  const offer = t.offers[page.id];
  return { src, title: offer.name, line: offer.plain, foot, home: false };
}

/**
 * The card says nothing but its words, so its `alt` is those words, in the
 * page's language. Derived rather than written: an alt typed next to the copy
 * goes on describing the old card the day the copy changes.
 */
export function ogImageAlt(card: OgCard): string {
  return `${card.title} — ${card.line} ${card.foot}.`;
}

/** Every route's card, in registry order. */
export const OG_CARDS: readonly OgCard[] = ROUTES.map(ogCard);
