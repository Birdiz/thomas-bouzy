import AxeBuilder from '@axe-core/playwright';
import type { Page, Route } from '@playwright/test';
import { RESUME } from '../../src/content/index.ts';
import type { SurveyStructure } from '../../src/lib/survey/types.ts';
import { pathOf } from '../../src/routes.ts';
import { FIELD_STUDY } from '../../src/site.ts';
import { expect, test } from './fixtures.ts';

/**
 * The field study's page (ADR 34), at the home page's address while the
 * catalogue is hidden (ADR 35), with the back office mocked: the page asks
 * it for the questionnaire and posts the answers to it. What is asserted is
 * what a respondent sees, and what reaches the back office.
 */

const form = RESUME.fr.surveyPage?.form;
if (!form) throw new Error('The French content has no survey page');
const labels = form;

const SURVEY = pathOf('survey', 'fr') ?? '';
if (!SURVEY) throw new Error('This build serves no field study');

const API = `**/api/surveys/${FIELD_STUDY.slug}`;

/** A manufacturer gets the production step, a hospital the care step, both the common one. */
const STRUCTURE: SurveyStructure = {
  slug: FIELD_STUDY.slug,
  title: 'Test',
  status: 'published',
  // Set, and never shown: the page announces no duration (ADR 34).
  estimatedMinutes: 7,
  intro: {
    heading: 'Une enquête inventée',
    body: ['Elle nomme ses lieux et ses gens, que la page ne connaît pas.'],
  },
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
            {
              value: 'autre',
              label: 'Une autre structure',
              revealsText: true,
              textHelp: 'Laquelle ?',
            },
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
const submit = (page: Page) => page.getByRole('button', { name: labels.submit });
const c = labels.contact;

/** Answers the first step as a business and walks to the contact step. */
async function toContactStep(page: Page) {
  await page.getByLabel('Une entreprise').check();
  await next(page).click();
  await expect(title(page)).toHaveText('Votre avis');
  await next(page).click();
  await expect(title(page)).toHaveText(c.title);
}

test('opens on the questionnaire’s own introduction, and says neither how long nor how many', async ({
  page,
}) => {
  await mockApi(page);
  await page.goto(SURVEY);
  await expect(page.locator('.survey__intro h2')).toHaveText('Une enquête inventée');
  await expect(page.locator('.survey__intro')).toContainText('ses lieux et ses gens');
  // No duration and no count: neither the 7 minutes the questionnaire sets,
  // nor a number of questions, though the steps are counted.
  const text = await page.locator('main').innerText();
  expect(text).not.toMatch(/\d+\s*(min\b|minutes?|questions?)|\b7\b/i);
  // The introduction belongs to the start: it does not follow the respondent.
  await page.getByLabel('Une entreprise').check();
  await next(page).click();
  await expect(page.locator('.survey__intro')).toHaveCount(0);
});

test('walks a manufacturer through its branch, then sends the answers and the contact', async ({
  page,
}) => {
  const mock = await mockApi(page);
  await page.goto(SURVEY);
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
  await page.getByLabel('4', { exact: true }).check();
  await expect(page.getByLabel('Lequel ?')).toBeHidden();
  await page.getByLabel('Oui').check();
  await page.getByLabel('Lequel ?').fill('Un suivi des commandes');
  await next(page).click();

  await expect(title(page)).toHaveText(c.title);
  await expect(title(page)).toBeFocused();
  await expect(step(page)).toHaveText('Étape 4 sur 4');
  // The name and the organisation are asked only with the consent.
  await expect(page.getByLabel(c.name)).toBeHidden();
  await page.getByLabel(c.wantsSynthesis).check();
  await page.getByLabel(c.wantsMeeting).check();
  await page.getByLabel(c.contactConsent).check();
  await expect(page.getByLabel(c.name)).toBeVisible();
  await page.getByLabel(c.email).fill('camille@example.org');
  await page.getByLabel(c.name).fill('Camille');
  await page.getByLabel(c.organisation).fill('Scierie Exemple');
  await submit(page).click();

  const thanks = page.getByRole('heading', { name: labels.thanks.title });
  await expect(thanks).toBeFocused();
  // Nothing to book: the page says nothing of what Thomas sells (ADR 35).
  await expect(page.locator('.survey__app a')).toHaveCount(0);
  expect(mock.posted).toEqual([
    {
      answers: {
        A1: { options: ['industrie'] },
        B1: { options: ['planning'] },
        D1: { echelle: 4 },
        D2: { options: ['oui'], texte: 'Un suivi des commandes' },
      },
      contact: {
        email: 'camille@example.org',
        name: 'Camille',
        organisation: 'Scierie Exemple',
        wantsSynthesis: true,
        wantsMeeting: true,
        contactConsent: true,
      },
      website: '',
    },
  ]);
  // Sent, so forgotten: a reload starts afresh.
  await page.reload();
  await expect(title(page)).toHaveText('Votre organisation');
  await expect(page.getByLabel('Un industriel')).not.toBeChecked();
});

test('drops the branch a changed answer leaves, and sends no contact unless given', async ({
  page,
}) => {
  const mock = await mockApi(page);
  await page.goto(SURVEY);
  await page.getByLabel('Un industriel').check();
  await next(page).click();
  await page.getByLabel('Le stock').check();
  await page.getByRole('button', { name: labels.back }).click();
  await expect(title(page)).toBeFocused();
  await page.getByLabel('Une entreprise').check();
  await next(page).click();
  await expect(title(page)).toHaveText('Votre avis');
  await next(page).click();
  await submit(page).click();
  await expect(page.getByRole('heading', { name: labels.thanks.title })).toBeVisible();
  expect(mock.posted).toEqual([{ answers: { A1: { options: ['entreprise'] } }, website: '' }]);
});

test('keeps the text an option reveals, on a single question too', async ({ page }) => {
  const mock = await mockApi(page);
  await page.goto(SURVEY);
  await expect(page.getByLabel('Laquelle ?')).toBeHidden();
  await page.getByLabel('Une autre structure').check();
  await page.getByLabel('Laquelle ?').fill('Une SCOP');
  await next(page).click();
  await next(page).click();
  await submit(page).click();
  await expect(page.getByRole('heading', { name: labels.thanks.title })).toBeVisible();
  expect(mock.posted).toEqual([
    { answers: { A1: { options: ['autre'], texte: 'Une SCOP' } }, website: '' },
  ]);
});

test('says what is missing, on the question, and keeps the respondent on the step', async ({
  page,
}) => {
  await mockApi(page);
  await page.goto(SURVEY);
  await next(page).click();
  const question = page.locator('[data-question="A1"]');
  await expect(question.locator('.survey__error')).toHaveText('Cette question est obligatoire.');
  const first = page.getByLabel('Une entreprise');
  await expect(first).toHaveAttribute('aria-invalid', 'true');
  // The error is read with the field, and the cursor is put on it.
  await expect(first).toHaveAccessibleDescription(/Cette question est obligatoire/);
  await expect(first).toBeFocused();
  await expect(page.locator('[aria-live="polite"]')).toHaveText(labels.fixErrors);
  await expect(title(page)).toHaveText('Votre organisation');
  // Answering clears it.
  await first.check();
  await expect(question.locator('.survey__error')).toBeEmpty();
});

test('holds each box of the contact step to what the back office asks of it', async ({ page }) => {
  const mock = await mockApi(page);
  await page.goto(SURVEY);
  await toContactStep(page);

  // The synthesis needs an address.
  await page.getByLabel(c.wantsSynthesis).check();
  await submit(page).click();
  await expect(page.locator('#contact-email-error')).toHaveText(
    'Indiquez votre adresse e-mail pour recevoir la synthèse.',
  );
  await expect(page.getByLabel(c.email)).toBeFocused();

  // The meeting needs the consent too.
  await page.getByLabel(c.email).fill('camille@example.org');
  await page.getByLabel(c.wantsMeeting).check();
  await submit(page).click();
  await expect(page.locator('#contact-contactConsent-error')).toHaveText(
    'Votre accord est nécessaire pour être recontacté.',
  );
  expect(mock.posted).toEqual([]);

  // The synthesis alone is no consent to be contacted again.
  await page.getByLabel(c.wantsMeeting).uncheck();
  await submit(page).click();
  await expect(page.getByRole('heading', { name: labels.thanks.title })).toBeVisible();
  expect(mock.posted).toEqual([
    {
      answers: { A1: { options: ['entreprise'] } },
      contact: {
        email: 'camille@example.org',
        wantsSynthesis: true,
        wantsMeeting: false,
        contactConsent: false,
      },
      website: '',
    },
  ]);
});

test('carries the notice under the consent box, and a field nobody sees', async ({ page }) => {
  await mockApi(page);
  await page.goto(SURVEY);
  await toContactStep(page);
  const consent = page.getByLabel(c.contactConsent);
  await expect(consent).toHaveAccessibleDescription(/24 mois/);
  await expect(consent).toHaveAccessibleDescription(/seul à lire/);
  const trap = page.locator('input[name="website"]');
  await expect(trap).toHaveCount(1);
  await expect(trap).not.toBeInViewport();
  await expect(trap).toHaveAttribute('tabindex', '-1');
});

test('puts the errors the back office returns back on the step they belong to', async ({
  page,
}) => {
  await mockApi(page, {
    post: 422,
    errors: {
      A1: 'Réponse refusée.',
      'contact.email': 'Cette adresse e-mail n’est pas valide.',
    },
  });
  await page.goto(SURVEY);
  await toContactStep(page);
  await page.getByLabel(c.wantsSynthesis).check();
  await page.getByLabel(c.email).fill('camille@example.org');
  await submit(page).click();
  // The question's step first, where the cursor goes.
  await expect(title(page)).toHaveText('Votre organisation');
  await expect(page.locator('[data-question="A1"] .survey__error')).toHaveText('Réponse refusée.');
  await expect(page.getByLabel('Une entreprise')).toBeFocused();
  await expect(page.locator('[aria-live="polite"]')).toHaveText(labels.fixErrors);
});

test('puts a refused contact back on the contact step', async ({ page }) => {
  await mockApi(page, {
    post: 422,
    errors: { 'contact.email': 'Cette adresse e-mail n’est pas valide.' },
  });
  await page.goto(SURVEY);
  await toContactStep(page);
  await page.getByLabel(c.wantsSynthesis).check();
  await page.getByLabel(c.email).fill('camille@exemple.invalid');
  await submit(page).click();
  await expect(title(page)).toHaveText(c.title);
  await expect(page.locator('#contact-email-error')).toHaveText(
    'Cette adresse e-mail n’est pas valide.',
  );
  await expect(page.getByLabel(c.email)).toBeFocused();
});

test('says the study is closed when the back office says so', async ({ page }) => {
  for (const status of [404, 410]) {
    await mockApi(page, { get: status });
    await page.goto(SURVEY);
    await expect(page.locator('.survey__message')).toHaveText(labels.closed);
    await expect(page.locator('.survey__app a')).toHaveCount(0);
    await expect(page.locator('.survey__form')).toHaveCount(0);
    await page.unrouteAll();
  }
});

test('says the study is closed when it closes while the respondent answers', async ({ page }) => {
  await mockApi(page, { post: 410 });
  await page.goto(SURVEY);
  await toContactStep(page);
  await submit(page).click();
  await expect(page.locator('.survey__message')).toHaveText(labels.closed);
  await expect(page.locator('.survey__message')).toBeFocused();
});

test('offers to try again when the questionnaire cannot be loaded', async ({ page }) => {
  let calls = 0;
  await page.route(API, (route) => {
    calls += 1;
    return calls === 1 ? route.abort() : route.fulfill({ json: STRUCTURE });
  });
  await page.goto(SURVEY);
  await expect(page.locator('.survey__message')).toHaveText(labels.unreachable);
  await page.getByRole('button', { name: labels.retry }).click();
  await expect(title(page)).toHaveText('Votre organisation');
});

test('keeps the answers on the page when they cannot be sent, and sends them on retry', async ({
  page,
}) => {
  const mock = await mockApi(page);
  let failures = 1;
  await page.route(`${API}/responses`, (route) => {
    if (failures-- > 0) return route.abort();
    return route.fallback();
  });
  await page.goto(SURVEY);
  await toContactStep(page);
  await submit(page).click();
  await expect(page.getByRole('alert')).toHaveText(labels.sendFailed);
  await expect(title(page)).toHaveText(c.title);
  await submit(page).click();
  await expect(page.getByRole('heading', { name: labels.thanks.title })).toBeVisible();
  expect(mock.posted).toHaveLength(1);
});

test('keeps the answers given when the page is reloaded', async ({ page }) => {
  await mockApi(page);
  await page.goto(SURVEY);
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
  await page.goto(SURVEY);
  await expect(title(page)).toBeVisible();
  await page.getByLabel('Une entreprise').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByLabel('Un industriel')).toBeChecked();
  await page.keyboard.press('Enter');
  await expect(title(page)).toHaveText('Votre production');
});

test('groups each choice under its question, as a fieldset named by its legend', async ({
  page,
}) => {
  await mockApi(page);
  await page.goto(SURVEY);
  const group = page.getByRole('group', { name: 'Vous êtes :' });
  await expect(group).toHaveCount(1);
  await expect(group.getByRole('radio')).toHaveCount(4);
});

for (const at of [
  'first step',
  'first step, with its errors',
  'contact step, with its errors',
  'thanks',
] as const) {
  test(`has no accessibility violation on ${SURVEY} at the ${at}`, async ({ page }) => {
    await mockApi(page);
    await page.goto(SURVEY);
    await expect(title(page)).toBeVisible();
    if (at === 'first step, with its errors') {
      await next(page).click();
      await expect(page.locator('.survey__error:not(:empty)').first()).toBeVisible();
    } else if (at === 'contact step, with its errors') {
      await toContactStep(page);
      await page.getByLabel(c.wantsMeeting).check();
      await submit(page).click();
      await expect(page.locator('.survey__error:not(:empty)').first()).toBeVisible();
    } else if (at === 'thanks') {
      await toContactStep(page);
      await submit(page).click();
      await expect(page.getByRole('heading', { name: labels.thanks.title })).toBeVisible();
    }
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();
    expect(
      results.violations.map(
        (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target).join(', ')}`,
      ),
    ).toEqual([]);
  });
}
