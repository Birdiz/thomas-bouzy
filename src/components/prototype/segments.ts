/**
 * PROTOTYPE — throwaway, branch `prototype/segment-entry`. Never merge.
 *
 * Question: how does each audience quickly see which Offers are useful to it?
 * Three variants on the home page's Offers section, switchable with
 * `?variant=0|A|B|C`, plus a Critical-systems landing page at
 * /prototype/systemes-critiques/ (dev server only).
 *
 * The audiences are the ADR 14 Segments, plus the two the site already serves
 * without naming them (public sector, the shared-spreadsheet Build buyer), plus
 * the Referrer, who buys nothing. Offer membership is read from offers.ts where
 * a Segment exists there; the spreadsheet column is this prototype's guess.
 */
import { OFFER_IDS, OFFERS, type OfferId, type SegmentId } from '../../content/offers.ts';
import { linkTo } from '../../routes.ts';

export interface ProtoAudience {
  id: SegmentId | 'spreadsheet';
  /** Completes "Vous êtes…". */
  label: string;
  /** Short column header for the matrix and the filter chips. */
  short: string;
  /** What they would recognise themselves in. */
  hint: string;
  /** Where the strip sends them. */
  href: string;
  /** Whether that destination is a page written for them, or a borrowed one. */
  landing: 'own' | 'prototype' | 'offer-page' | 'none';
  offers: readonly OfferId[];
  /** Not a Segment in CONTEXT.md today. */
  unnamed?: true;
}

const of = (segment: SegmentId) => OFFER_IDS.filter((id) => OFFERS[id].segments.includes(segment));

export const AUDIENCES: readonly ProtoAudience[] = [
  {
    id: 'critical-systems',
    label: 'un éditeur ou une scale-up',
    short: 'Éditeur, scale-up',
    hint: "Votre système déplace de l'argent ou des engagements.",
    href: '/prototype/systemes-critiques/',
    landing: 'prototype',
    offers: of('critical-systems'),
  },
  {
    id: 'orphan-app',
    label: 'une PME ou un industriel',
    short: 'PME, industrie',
    hint: "Une appli métier que plus personne n'ose toucher.",
    href: linkTo('takeover', 'fr').href,
    landing: 'offer-page',
    offers: of('orphan-app'),
  },
  {
    id: 'spreadsheet',
    label: 'une entreprise qui tourne sur un tableur',
    short: 'Tableur partagé',
    hint: 'Partagé, indispensable, et fragile.',
    href: linkTo('build', 'fr').href,
    landing: 'offer-page',
    offers: ['audit', 'build'],
    unnamed: true,
  },
  {
    id: 'partners',
    label: 'une agence ou une ESN',
    short: 'Agence, ESN',
    hint: 'Un renfort senior, en marque blanche.',
    href: linkTo('partners', 'fr').href,
    landing: 'own',
    offers: of('partners'),
  },
  {
    id: 'public-sector',
    label: 'une collectivité ou un établissement public',
    short: 'Collectivité',
    hint: 'Achat public, réversibilité, RGAA.',
    href: linkTo('public-sector', 'fr').href,
    landing: 'own',
    offers: of('public-sector'),
    unnamed: true,
  },
];

export const REFERRER = {
  label: 'Expert-comptable, intégrateur ERP, ancien collègue ?',
  hint: 'Vous voyez le problème avant moi : envoyez-moi la personne, je lui dis franchement si je peux aider.',
  href: '#contact',
};

export const VARIANTS = [
  { key: '0', name: 'Actuel', note: 'La ligne « agence ? collectivité ? » sous les Offres.' },
  {
    key: 'A',
    name: 'Bandeau « Vous êtes… »',
    note: 'Sous les Offres : un lien par public vers sa page. Naviguer.',
  },
  {
    key: 'B',
    name: 'Filtre en place',
    note: 'Au-dessus des Offres : choisir son public estompe les autres cartes. Filtrer.',
  },
  {
    key: 'C',
    name: 'Matrice Offres × publics',
    note: 'Sous les Offres : un tableau statique, sans JavaScript. Lire.',
  },
] as const;
