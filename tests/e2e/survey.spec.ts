import AxeBuilder from '@axe-core/playwright';
import type { Page, Route } from '@playwright/test';
import { RESUME } from '../../src/content/index.ts';
import type { SurveyStructure } from '../../src/lib/survey/types.ts';
import { FIELD_STUDY } from '../../src/site.ts';
import { expect, test } from './fixtures.ts';

/**
 * The field study's page (ADR 34), with the back office mocked: the page asks
 * it for the questionnaire and posts the answers to it. What is asserted is
 * what a respondent sees, and what reaches the back office.
 */

const form = RESUME.fr.surveyPage?.form;
if (!form) throw new Error('The French content has no survey page');
const labels = form;

const API = `**/api/surveys/${FIELD_STUDY.slug}`;

/** A manufacturer gets the production step, a hospital the care step, both the common one. */
const STRUCTURE: SurveyStructure = {
  slug: FIELD_STUDY.slug,
  title: 'Test',
  status: 'published',
  intro: {},
  sections: [
    {
      code: 'A',
      title: 'Votre organisation',
      questions: [
        {
          code: 'A1',
          type: 'single',
          label: 'Vous êtes :',
          required: true,
          options: [
            { value: 'entreprise', label: 'Une entreprise' },
            { value: 'industrie', label: 'Un industriel' },
            { value: 'sante', label: 'Un établissement de santé' },
          ],
        },
      ],
    },
    {
      code: 'B',
      title: 'Votre production',
      displayIf: { question: 'A1', in: ['industrie'] },
      questions: [
        {
          code: 'B1',
          type: 'multi',
          label: 'Ce qui vous coûte le plus de temps',
          required: false,
          maxSelections: 2,
          options: [
            { value: 'stock', label: 'Le stock' },
            { value: 'planning', label: 'Le planning' },
            { value: 'aucun', label: 'Rien de tout ça', exclusive: true, pinLast: true },
          ],
        },
      ],
    },
    {
      code: 'C',
      title: 'Vos soins',
      displayIf: { question: 'A1', in: ['sante'] },
      questions: [{ code: 'C1', type: 'text', label: 'Un irritant', required: false, options: [] }],
    },
    {
      code: 'D',
      title: 'Votre avis',
      questions: [
        {
          code: 'D1',
          type: 'scale',
          label: 'Votre aisance avec le numérique',
          required: false,
          scaleMin: 1,
          scaleMax: 5,
          anchorMin: 'Faible',
          anchorMax: 'Forte',
          allowNoOpinion: true,
          options: [],
        },
        {
          code: 'D2',
          type: 'single_with_text',
          label: 'Un outil vous manque ?',
          required: false,
          options: [
            { value: 'oui', label: 'Oui', revealsText: true, textHelp: 'Lequel ?' },
            { value: 'non', label: 'Non' },
          ],
        },
      ],
    },
  ],
};

interface Mock {
  posted: unknown[];
}

async function mockApi(
  page: Page,
  {
    get = 200,
    post = 201,
    errors,
  }: { get?: number; post?: number; errors?: Record<string, string> } = {},
): Promise<Mock> {
  const mock: Mock = { posted: [] };
  await page.route(API, (route: Route) =>
    get === 200
      ? route.fulfill({ json: STRUCTURE })
      : route.fulfill({ status: get, json: { error: 'closed' } }),
  );
  await page.route(`${API}/responses`, (route: Route) => {
    mock.posted.push(route.request().postDataJSON());
    return post === 201
      ? route.fulfill({ status: 201, json: { id: 'b5a1' } })
      : route.fulfill({ status: post, json: { errors } });
  });
  return mock;
}

const step = (page: Page) => page.locator('.survey__step');
const title = (page: Page) => page.locator('.survey__title');
const next = (page: Page) => page.getByRole('button', { name: labels.next });

test('walks a manufacturer through its branch, then sends the answers and the contact', async ({
  page,
}) => {
  const mock = await mockApi(page);
  await page.goto('/enquete/');
  await expect(title(page)).toHaveText('Votre organisation');
  // Before the profile, the steps are those everyone sees, and the contact.
  await expect(step(page)).toHaveText('Étape 1 sur 3');
  await page.getByLabel('Un industriel').check();
  // The branch adds its step at once.
  await expect(step(page)).toHaveText('Étape 1 sur 4');
  await next(page).click();

  await expect(title(page)).toHaveText('Votre production');
  await expect(title(page)).toBeFocused();
  await page.getByLabel('Le stock').check();
  await page.getByLabel('Rien de tout ça').check();
  // An exclusive answer unticks the others.
  await expect(page.getByLabel('Le stock')).not.toBeChecked();
  await page.getByLabel('Le planning').check();
  await expect(page.getByLabel('Rien de tout ça')).not.toBeChecked();
  await next(page).click();

  await expect(title(page)).toHaveText('Votre avis');
  await page.getByLabel('4').check();
  await expect(page.getByLabel('Lequel ?')).toBeHidden();
  await page.getByLabel('Oui').check();
  await page.getByLabel('Lequel ?').fill('Un suivi des commandes');
  await next(page).click();

  await expect(title(page)).toHaveText(labels.contact.title);
  await page.getByLabel(labels.contact.email).fill('camille@example.org');
  await page.getByLabel(labels.contact.wantsMeeting).check();
  await page.getByLabel(labels.contact.consent).check();
  await page.getByRole('button', { name: labels.submit }).click();

  await expect(page.getByRole('heading', { name: labels.thanks.title })).toBeFocused();
  await expect(page.locator('.survey__app a.btn-primary')).toHaveAttribute('href', '/rdv/');
  expect(mock.posted).toEqual([
    {
      answers: {
        A1: { options: ['industrie'] },
        B1: { options: ['planning'] },
        D1: { echelle: 4 },
        D2: { options: ['oui'], texte: 'Un suivi des commandes' },
      },
      contact: { email: 'camille@example.org', wantsMeeting: true, contactConsent: true },
      website: '',
    },
  ]);
});

test('drops the branch a changed answer leaves, and sends no contact unless given', async ({
  page,
}) => {
  const mock = await mockApi(page);
  await page.goto('/enquete/');
  await page.getByLabel('Un industriel').check();
  await next(page).click();
  await page.getByLabel('Le stock').check();
  await page.getByRole('button', { name: labels.back }).click();
  await page.getByLabel('Une entreprise').check();
  await next(page).click();
  await expect(title(page)).toHaveText('Votre avis');
  await next(page).click();
  await page.getByRole('button', { name: labels.submit }).click();
  await expect(page.getByRole('heading', { name: labels.thanks.title })).toBeVisible();
  expect(mock.posted).toEqual([{ answers: { A1: { options: ['entreprise'] } }, website: '' }]);
});

test('says what is missing, on the question, and keeps the respondent on the step', async ({
  page,
}) => {
  await mockApi(page);
  await page.goto('/enquete/');
  await next(page).click();
  const question = page.locator('[data-question="A1"]');
  await expect(question).toHaveAttribute('aria-invalid', 'true');
  await expect(question.locator('.survey__error')).toHaveText('Cette question est obligatoire.');
  await expect(page.getByLabel('Une entreprise')).toBeFocused();
  await expect(title(page)).toHaveText('Votre organisation');
});

test('asks for a way to reach them and their consent once a contact is started', async ({
  page,
}) => {
  const mock = await mockApi(page);
  await page.goto('/enquete/');
  await page.getByLabel('Une entreprise').check();
  await next(page).click();
  await next(page).click();
  await page.getByLabel(labels.contact.name).fill('Camille');
  await page.getByRole('button', { name: labels.submit }).click();
  await expect(page.locator('#contact-email-error')).not.toBeEmpty();
  await expect(page.locator('#contact-contactConsent-error')).not.toBeEmpty();
  expect(mock.posted).toEqual([]);
});

test('shows the errors the back office returns, on the step they belong to', async ({ page }) => {
  await mockApi(page, { post: 422, errors: { A1: 'Réponse refusée.' } });
  await page.goto('/enquete/');
  await page.getByLabel('Une entreprise').check();
  await next(page).click();
  await next(page).click();
  await page.getByRole('button', { name: labels.submit }).click();
  await expect(title(page)).toHaveText('Votre organisation');
  await expect(page.locator('[data-question="A1"] .survey__error')).toHaveText('Réponse refusée.');
});

test('says the study is closed when the back office says so', async ({ page }) => {
  await mockApi(page, { get: 410 });
  await page.goto('/enquete/');
  await expect(page.locator('.survey__message')).toHaveText(labels.closed);
  await expect(
    page.locator('.survey__app').getByRole('link', { name: labels.book }),
  ).toHaveAttribute('href', '/rdv/');
});

test('offers to try again when the back office cannot be reached', async ({ page }) => {
  let calls = 0;
  await page.route(API, (route) => {
    calls += 1;
    return calls === 1 ? route.abort() : route.fulfill({ json: STRUCTURE });
  });
  await page.goto('/enquete/');
  await expect(page.locator('.survey__message')).toHaveText(labels.unreachable);
  await page.getByRole('button', { name: labels.retry }).click();
  await expect(title(page)).toHaveText('Votre organisation');
});

test('keeps the answers given when the page is reloaded', async ({ page }) => {
  await mockApi(page);
  await page.goto('/enquete/');
  await page.getByLabel('Un industriel').check();
  await next(page).click();
  await page.reload();
  await expect(title(page)).toHaveText('Votre production');
  await page.getByRole('button', { name: labels.back }).click();
  await expect(page.getByLabel('Un industriel')).toBeChecked();
});

test('is usable from the keyboard alone', async ({ page, browserName }) => {
  // WebKit does not tab to form controls by default, as Safari does not.
  test.skip(browserName === 'webkit', 'Tab skips controls in WebKit by default');
  await mockApi(page);
  await page.goto('/enquete/');
  await expect(title(page)).toBeVisible();
  await page.getByLabel('Une entreprise').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByLabel('Un industriel')).toBeChecked();
  await page.keyboard.press('Enter');
  await expect(title(page)).toHaveText('Votre production');
});

for (const at of ['first step', 'contact step'] as const) {
  test(`has no serious accessibility violation at the ${at}`, async ({ page }) => {
    await mockApi(page);
    await page.goto('/enquete/');
    if (at === 'contact step') {
      await page.getByLabel('Une entreprise').check();
      await next(page).click();
      await next(page).click();
      // With its errors showing, which is when it is hardest to read.
      await page.getByLabel(labels.contact.name).fill('Camille');
      await page.getByRole('button', { name: labels.submit }).click();
    } else {
      await next(page).click();
    }
    await expect(page.locator('.survey__error:not(:empty)').first()).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    expect(blocking.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
  });
}
