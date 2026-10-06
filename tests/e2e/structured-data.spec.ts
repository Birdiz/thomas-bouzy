import { breadcrumbOf } from '../../src/lib/breadcrumb.ts';
import { ROUTES } from '../../src/routes.ts';
import { expect, test } from './fixtures.ts';

/**
 * The JSON-LD as the built page serves it (issue #29). Its content is held by
 * tests/structured-data.spec.ts; what is held here is that every route ships
 * one graph that parses, that the trail it tells crawlers is the one the
 * reader sees, and that whatever it points at is served.
 */

type Node = { '@type': string; [key: string]: unknown };

for (const route of ROUTES) {
  test(`${route.path} carries one JSON-LD graph that parses`, async ({ page, request }) => {
    await page.goto(route.path);
    const scripts = page.locator('script[type="application/ld+json"]');
    await expect(scripts).toHaveCount(1);
    const json = JSON.parse((await scripts.textContent()) ?? '');
    expect(json['@context']).toBe('https://schema.org');
    const graph: Node[] = json['@graph'];
    expect(graph.filter((node) => node['@type'] === 'WebSite')).toHaveLength(1);
    // LEGAL is incomplete until registration, and so there is no business.
    expect(graph.some((node) => node['@type'] === 'ProfessionalService')).toBe(false);

    // A Person image is the portrait the build emitted, not a missing file.
    const person = graph.find((node) => node['@type'] === 'Person');
    if (typeof person?.image === 'string') {
      const response = await request.get(new URL(person.image).pathname);
      expect(response.status(), String(person.image)).toBe(200);
    }

    if (route.page.id === 'home') return;
    const list = graph.find((node) => node['@type'] === 'BreadcrumbList');
    const items = (list?.itemListElement ?? []) as Node[];
    const trail = breadcrumbOf(route);
    expect(items.map((item) => item.name)).toEqual(trail.map((crumb) => crumb.name));
    // The visible breadcrumb names the same steps.
    const visible = page.locator('nav.breadcrumb li');
    await expect(visible).toHaveCount(trail.length);
    for (const [i, crumb] of trail.entries()) {
      await expect(visible.nth(i)).toContainText(crumb.name);
    }
  });
}
