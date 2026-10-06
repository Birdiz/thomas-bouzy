import { describe, expect, it } from 'vitest';
import { RESUME } from '../src/content/index.ts';
import { OFFER_IDS, type OfferId } from '../src/content/offers.ts';
import { DAY_RATE, PRICES } from '../src/content/prices.ts';
import { pageGraph } from '../src/lib/structured-data.ts';
import { ROUTES, type Route } from '../src/routes.ts';
import { SITE } from '../src/site.ts';

/**
 * The JSON-LD, built for every route the registry serves (issue #29). What is
 * held here is what a crawler is told: the prices the table holds, where each
 * Service is sold, and no business before there is one.
 */

type Node = Record<string, unknown> & { '@type': string };

function nodes(route: Route, options?: Parameters<typeof pageGraph>[1]): Node[] {
  return pageGraph(route, options)['@graph'] as Node[];
}

function nodeOf(route: Route, type: string, options?: Parameters<typeof pageGraph>[1]): Node {
  const found = nodes(route, options).filter((node) => node['@type'] === type);
  expect(found, `${route.path}: one ${type}`).toHaveLength(1);
  return found[0] as Node;
}

const isOffer = (route: Route) => (OFFER_IDS as readonly string[]).includes(route.page.id);
const SERVICE_ROUTES = ROUTES.filter((route) => route.page.id !== 'home');

const UNREGISTERED = { businessName: '', siret: '', isComplete: false };
const REGISTERED = { businessName: 'Thomas Bouzy EI', siret: '00000000000000', isComplete: true };

describe('structured data', () => {
  it('names the site on every page', () => {
    for (const route of ROUTES) {
      const website = nodeOf(route, 'WebSite');
      expect(website['@id']).toBe(`${SITE.origin}/#website`);
      expect(website.name).toBe('Thomas Bouzy');
      expect(website.inLanguage).toEqual(['fr', 'en']);
    }
  });

  it('prices every Offer with exactly what prices.ts holds', () => {
    // Read from the table, independently of how the graph reads it: every
    // amount an Offer charges spans its combinations' lowest min to highest max.
    for (const route of ROUTES.filter(isOffer)) {
      const table = PRICES[route.page.id as OfferId];
      const expected = table.amounts.map((amount) => {
        const ranges = table.combinations.map((combination) => combination.amounts[amount]);
        return {
          min: Math.min(...ranges.map((range) => range?.min ?? Infinity)),
          max: Math.max(...ranges.map((range) => range?.max ?? -Infinity)),
        };
      });

      const offer = nodeOf(route, 'Service').offers as { priceSpecification: Node[] };
      const ranges = offer.priceSpecification.filter((spec) => 'minPrice' in spec);
      expect(ranges.map((spec) => ({ min: spec.minPrice, max: spec.maxPrice }))).toEqual(expected);
      for (const spec of offer.priceSpecification) {
        expect(spec.priceCurrency, route.path).toBe('EUR');
        expect(spec.valueAddedTaxIncluded, route.path).toBe(false);
      }
    }
  });

  it('states the day rate where what follows is billed by the day', () => {
    const dayRateOf = (route: Route) =>
      (
        (nodeOf(route, 'Service').offers as { priceSpecification: Node[] } | undefined)
          ?.priceSpecification ?? []
      ).find((spec) => spec.unitCode === 'DAY')?.price;

    for (const route of SERVICE_ROUTES) {
      const { id } = route.page;
      const byTheDay =
        id === 'partners' ||
        id === 'reinforcement' ||
        (isOffer(route) && PRICES[id as OfferId].amounts.includes('plan'));
      expect(dayRateOf(route), route.path).toBe(byTheDay ? DAY_RATE : undefined);
    }
  });

  it('sells the local Offers in the Service area, the rest in France, and English to the EU', () => {
    const area = (path: string) => {
      const route = ROUTES.find((candidate) => candidate.path === path);
      if (!route) throw new Error(`no route at ${path}`);
      return (nodeOf(route, 'Service').areaServed as Node[]).map((place) => place.name);
    };
    const local = [...SITE.serviceArea, 'FR'];

    expect(area('/offres/audit/')).toEqual(local);
    expect(area('/offres/reprise-et-maintenance/')).toEqual(local);
    expect(area('/offres/creation-sur-mesure/')).toEqual(local);
    expect(area('/collectivites/')).toEqual(local);
    for (const path of [
      '/offres/migration/',
      '/offres/fiabilisation/',
      '/offres/tenue-en-charge/',
      '/offres/renfort-senior/',
      '/partenaires/',
    ]) {
      expect(area(path), path).toEqual(['FR']);
    }
    for (const route of SERVICE_ROUTES.filter((candidate) => candidate.locale === 'en')) {
      expect(area(route.path), route.path).toEqual(['FR', 'EU']);
    }
  });

  it('describes each page other than the home page as a page about its Service', () => {
    for (const route of SERVICE_ROUTES) {
      const page = nodeOf(route, 'WebPage');
      const service = nodeOf(route, 'Service');
      const breadcrumb = nodeOf(route, 'BreadcrumbList');
      // The page and the Service are two things, linked both ways by id.
      expect(service['@id']).toBe(`${page['@id']}#service`);
      expect(page.mainEntity).toEqual({ '@id': service['@id'] });
      expect(page.breadcrumb).toEqual({ '@id': breadcrumb['@id'] });
      expect(page.isPartOf).toEqual({ '@id': `${SITE.origin}/#website` });
      expect(service.provider).toEqual({ '@id': `${SITE.origin}/#person` });
      // And the provider resolves on the page that names it.
      expect(nodeOf(route, 'Person')['@id']).toBe(`${SITE.origin}/#person`);
    }
  });

  it('searches an Offer by its heading, and walks Home › Offers › the Offer', () => {
    for (const route of ROUTES.filter(isOffer)) {
      const t = RESUME[route.locale];
      const id = route.page.id as OfferId;
      expect(nodeOf(route, 'Service').serviceType).toBe(t.offerPages[id]?.heading);
      const items = nodeOf(route, 'BreadcrumbList').itemListElement as Node[];
      expect(items.map((item) => item.name)).toEqual([t.nav.home, t.nav.offers, t.offers[id].name]);
      expect(items.map((item) => item.position)).toEqual([1, 2, 3]);
      expect(items.at(-1)?.item).toBe(new URL(route.path, SITE.origin).href);
    }
  });

  it('describes the home page as a profile of the person', () => {
    for (const route of ROUTES.filter((candidate) => candidate.page.id === 'home')) {
      const profile = nodeOf(route, 'ProfilePage', { portrait: '/_astro/portrait.webp' });
      expect(profile.mainEntity).toEqual({ '@id': `${SITE.origin}/#person` });
      const person = nodeOf(route, 'Person', { portrait: '/_astro/portrait.webp' });
      expect(person.image).toBe(`${SITE.origin}/_astro/portrait.webp`);
      expect(nodes(route).some((node) => node['@type'] === 'BreadcrumbList')).toBe(false);
    }
  });

  it('names no business before registration, and the business as provider after', () => {
    for (const route of ROUTES) {
      const graph = nodes(route, { legal: UNREGISTERED });
      expect(graph.some((node) => node['@type'] === 'ProfessionalService')).toBe(false);
    }

    for (const route of ROUTES) {
      const business = nodeOf(route, 'ProfessionalService', { legal: REGISTERED });
      expect(business['@id']).toBe(`${SITE.origin}/#business`);
      expect(business.identifier).toMatchObject({ propertyID: 'SIRET', value: REGISTERED.siret });
      // A region, never a street.
      expect(business.address).not.toHaveProperty('streetAddress');
      expect(nodeOf(route, 'WebSite', { legal: REGISTERED }).publisher).toEqual({
        '@id': business['@id'],
      });
    }
    for (const route of SERVICE_ROUTES) {
      expect(nodeOf(route, 'Service', { legal: REGISTERED }).provider).toEqual({
        '@id': `${SITE.origin}/#business`,
      });
    }
  });
});
