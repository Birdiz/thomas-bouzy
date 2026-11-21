/**
 * The Offers, as facts that do not depend on the language they are read in.
 *
 * Copy lives in the locale modules (en.ts, fr.ts); prices live in prices.ts;
 * where each Offer's page is served, and in which locales, lives in the page
 * registry (src/routes.ts). What is left is what an Offer *is*: who buys it
 * and which Achievements prove it.
 */

/** The packaged interventions the site sells. See CONTEXT.md. */
export const OFFER_IDS = [
  'audit',
  'takeover',
  'migration',
  'reliability',
  'scaling',
  'build',
  'reinforcement',
] as const;
export type OfferId = (typeof OFFER_IDS)[number];

/** The Entry offer: the small, fixed-price Offer every Segment can buy first. */
export const ENTRY_OFFER: OfferId = 'audit';

/**
 * The home page's Offers, grouped by a situation the reader can recognise
 * (ADR 30): their software gives them trouble; a tool is missing; they have a
 * technical team. A business owner answers that question; none of three read
 * the life of an application the Offers used to be laid out as. Every Offer is
 * in one situation, the Entry offer first, and the technical team's Offers,
 * which sell to no orphan application, come last.
 */
export const SITUATIONS = [
  ['audit', 'takeover', 'reliability'],
  ['build'],
  ['migration', 'scaling', 'reinforcement'],
] as const satisfies readonly (readonly OfferId[])[];

/** Populations of Clients who buy for the same reason (ADR 14). */
export type SegmentId = 'critical-systems' | 'orphan-app' | 'partners' | 'public-sector';

/** Stable names for the Achievements, so an Offer can cite one in any locale. */
export const ACHIEVEMENT_IDS = [
  'industrial-erp',
  'live-api-redesign',
  'wallet-event-sourcing',
  'on-chain-operations',
  'acquired-app-migration',
  'enterprise-onboarding',
  'codebase-audit',
  'open-data-directories',
  'staircase-calculator',
  'village-website',
] as const;
export type AchievementId = (typeof ACHIEVEMENT_IDS)[number];

/**
 * The home page's References: one row per client or context, each opening on
 * the Achievements done there. Socios is one Reference with two of them. The
 * on-chain operations are proof for a technical buyer, and stay on the
 * Reliability page that cites them: on the home page, a business owner read
 * DeFi on Solana where he looked for a reason to call (ADR 28).
 */
export const REFERENCES = [
  { id: 'arcelormittal', achievements: ['industrial-erp'] },
  { id: 'socios', achievements: ['live-api-redesign', 'wallet-event-sourcing'] },
  { id: 'kiss-the-bride', achievements: ['enterprise-onboarding'] },
  { id: 'civic-tech', achievements: ['codebase-audit'] },
  { id: 'open-data', achievements: ['open-data-directories'] },
  { id: 'quart-de-tour', achievements: ['staircase-calculator'] },
  { id: 'grandrupt', achievements: ['village-website'] },
] as const satisfies readonly { id: string; achievements: readonly AchievementId[] }[];
export type ReferenceId = (typeof REFERENCES)[number]['id'];

export interface OfferFacts {
  segments: readonly SegmentId[];
  /** The Achievements shown on the Offer's page as its proof, in that order. */
  achievements: readonly AchievementId[];
}

export const OFFERS: Record<OfferId, OfferFacts> = {
  // The Entry offer: every Segment can buy it first. Proven by the one audit
  // of someone else's code: the API redesign proved nothing an audit sells
  // (ADR 30).
  audit: {
    segments: ['critical-systems', 'orphan-app', 'partners', 'public-sector'],
    achievements: ['codebase-audit'],
  },
  // An application another company wrote, taken over and moved into a new
  // home, is what a Takeover sells; the plants and the large accounts show it
  // kept running.
  takeover: {
    segments: ['orphan-app', 'partners', 'public-sector'],
    achievements: ['industrial-erp', 'enterprise-onboarding', 'acquired-app-migration'],
  },
  migration: {
    segments: ['critical-systems', 'partners', 'public-sector'],
    achievements: ['enterprise-onboarding', 'live-api-redesign'],
  },
  reliability: {
    segments: ['critical-systems', 'orphan-app'],
    achievements: ['wallet-event-sourcing', 'on-chain-operations'],
  },
  // Keeps a system up, where Reliability keeps it correct (ADR 19). The API
  // redesign leads: its plain line, the one an Offer page shows, is the one
  // about never going down.
  scaling: {
    segments: ['critical-systems', 'partners'],
    achievements: ['live-api-redesign', 'wallet-event-sourcing'],
  },
  // Builds what does not exist yet, never what already runs (ADR 19). The
  // directory leads, because it is a tool delivered to a client that replaced
  // work done by hand; the staircase calculator follows, a product designed
  // and put online.
  build: {
    segments: ['critical-systems', 'orphan-app', 'partners', 'public-sector'],
    achievements: ['open-data-directories', 'staircase-calculator'],
  },
  // Sells a lead and an architect inside a team. Kiss The Bride leads: four
  // juniors mentored for two years there. The API redesign follows, the
  // foundations of a running product rebuilt. On-chain operations prove
  // reliability, and stay on that Offer's page.
  reinforcement: {
    segments: ['critical-systems', 'partners'],
    achievements: ['enterprise-onboarding', 'live-api-redesign'],
  },
};
