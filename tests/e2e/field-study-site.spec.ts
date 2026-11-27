import { RESUME } from '../../src/content/index.ts';
import { REFERENCES } from '../../src/content/offers.ts';
import { CONTACT, OFFERS_PUBLISHED, SITE } from '../../src/site.ts';
import { expect, PATHS, test } from './fixtures.ts';

/**
 * While the catalogue is hidden, the field study is the whole site (ADR 35):
 * its page at the home page's address, and nothing of what Thomas does or
 * wants to do. What the questionnaire itself does is held by survey.spec.ts.
 */

test.skip(OFFERS_PUBLISHED, 'The catalogue is published: the home page is about Thomas');

const t = RESUME.fr;
const survey = t.surveyPage;
if (!survey) throw new Error('The French content has no survey page');

test('serves the field study alone, at the home page', async () => {
  expect(PATHS).toEqual(['/']);
});

test('opens on the field study, and says who asks by name', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText(survey.title);
  await expect(page.locator('main .kicker').first()).toHaveText(survey.kicker);
  await expect(page.locator('.survey__byline')).toHaveText(survey.byline);
  await expect(page.locator('[data-survey]')).toHaveCount(1);
  // No trail: this is where every trail would start.
  await expect(page.locator('.breadcrumb')).toHaveCount(0);
  await expect(page).toHaveTitle(new RegExp(survey.meta.title));
});

test('says nothing of what Thomas does, or wants to do', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero, #work, #contact, #offers, #workshops')).toHaveCount(0);
  const text = (await page.locator('body').innerText()).replace(/\s/g, ' ');
  const said = [
    t.hero.role,
    t.hero.title,
    t.hero.blurb,
    t.hero.proof,
    t.footer.role,
    t.contact.title,
    ...REFERENCES.map(({ id }) => t.references[id].name),
  ].map((words) => words.replace(/\s/g, ' '));
  for (const words of said) expect(text, words).not.toContain(words);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    survey.meta.description,
  );
});

test('links nowhere but its own page and the address the notice points to', async ({ page }) => {
  await page.goto('/');
  const hrefs = await page
    .locator('a[href]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
  expect(new Set(hrefs)).toEqual(new Set(['#main', '/#top', `mailto:${CONTACT.email}`]));
  await expect(page.locator('.site-nav, .lang-switch')).toHaveCount(0);
  await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
});

test('names the person who asks in the JSON-LD, and nothing more', async ({ page }) => {
  await page.goto('/');
  const graphs = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent ?? '{}')));
  const nodes = graphs.flatMap((graph) => graph['@graph'] as Record<string, unknown>[]);
  const types = nodes.map((node) => node['@type']);
  expect(types).toEqual(['WebSite', 'WebPage', 'Person']);
  const person = nodes.find((node) => node['@type'] === 'Person');
  expect(person).toEqual({
    '@type': 'Person',
    '@id': `${SITE.origin}/#person`,
    name: SITE.author,
    url: `${SITE.origin}/`,
  });
});
