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

/** Populations of Clients who buy for the same reason (ADR 14). */
export type SegmentId = 'critical-systems' | 'orphan-app' | 'partners';

/** Stable names for the Achievements, so an Offer can cite one in any locale. */
export const ACHIEVEMENT_IDS = [
  'industrial-erp',
  'live-api-redesign',
  'wallet-event-sourcing',
  'on-chain-operations',
  'enterprise-onboarding',
  'codebase-audit',
  'open-data-directories',
] as const;
export type AchievementId = (typeof ACHIEVEMENT_IDS)[number];

/**
 * The home page's References: one row per client or context, each opening on
 * the Achievements done there. Socios is one Reference with three of them.
 */
export const REFERENCES = [
  { id: 'arcelormittal', achievements: ['industrial-erp'] },
  {
    id: 'socios',
    achievements: ['live-api-redesign', 'wallet-event-sourcing', 'on-chain-operations'],
  },
  { id: 'kiss-the-bride', achievements: ['enterprise-onboarding'] },
  { id: 'civic-tech', achievements: ['codebase-audit'] },
  { id: 'open-data', achievements: ['open-data-directories'] },
] as const satisfies readonly { id: string; achievements: readonly AchievementId[] }[];
export type ReferenceId = (typeof REFERENCES)[number]['id'];

export interface OfferFacts {
  segments: readonly SegmentId[];
  /** The Achievements shown on the Offer's page as its proof, in that order. */
  achievements: readonly AchievementId[];
}

export const OFFERS: Record<OfferId, OfferFacts> = {
  // The Entry offer: every Segment can buy it first.
  audit: {
    segments: ['critical-systems', 'orphan-app', 'partners'],
    achievements: ['codebase-audit', 'live-api-redesign'],
  },
  takeover: {
    segments: ['orphan-app', 'partners'],
    achievements: ['industrial-erp', 'enterprise-onboarding'],
  },
  migration: {
    segments: ['critical-systems', 'partners'],
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
  // Builds what does not exist yet, never what already runs (ADR 19). Opened
  // ahead of its proof on purpose: the directory leads, because it is a tool
  // delivered to a client that replaced work done by hand.
  build: {
    segments: ['critical-systems', 'orphan-app', 'partners'],
    achievements: ['open-data-directories', 'on-chain-operations'],
  },
  reinforcement: {
    segments: ['critical-systems', 'partners'],
    achievements: ['on-chain-operations', 'enterprise-onboarding'],
  },
};
