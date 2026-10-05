import type { Page } from '@playwright/test';
import { RESUME } from '../../src/content/index.ts';
import { ACHIEVEMENT_IDS, OFFER_IDS } from '../../src/content/offers.ts';
import { fromPrice } from '../../src/content/prices.ts';
import { formatEuros } from '../../src/lib/money.ts';
import { homePath, pathOf } from '../../src/routes.ts';
import { CONTACT } from '../../src/site.ts';
import { expect, PATHS, test } from './fixtures.ts';

const PHONE_PATTERNS = [/\+33632134547/, /0632134547/, /06 32 13 45 47/];

async function gotoHome(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator('h1')).toBeVisible();
}

test.describe('routing and locales', () => {
  test('serves French at / and English at /en/', async ({ page }) => {
    await gotoHome(page, '/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    // The name, then the promise, in the one H1 (ADR 18).
    await expect(page.locator('h1')).toContainText('Thomas Bouzy');
    await expect(page.locator('h1')).toContainText(RESUME.fr.hero.title);
    await expect(
      page.getByRole('heading', { name: "Ce que j'ai déjà tenu en production" }),
    ).toBeVisible();

    await gotoHome(page, '/en/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(
      page.getByRole('heading', { name: 'What I have already kept running in production' }),
    ).toBeVisible();
  });

  test('the language switch changes the URL rather than mutating the page', async ({ page }) => {
    await gotoHome(page, '/');
    await page.getByRole('link', { name: 'English' }).click();
    await expect(page).toHaveURL(/\/en\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    await page.getByRole('link', { name: 'Français' }).click();
    await expect(page).toHaveURL(/localhost:\d+\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  });

  test('marks the active locale and cross-links both with hreflang', async ({ page }) => {
    await gotoHome(page, '/en/');
    await expect(page.getByRole('link', { name: 'English' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    await expect(page.getByRole('link', { name: 'Français' })).not.toHaveAttribute(
      'aria-current',
      'true',
    );

    for (const hreflang of ['en', 'fr', 'x-default']) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`)).toHaveCount(1);
    }
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /https:\/\/[^/]+\/en\/$/,
    );
  });

  test('points x-default at the French page', async ({ page }) => {
    for (const path of ['/', '/en/']) {
      await gotoHome(page, path);
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
        'href',
        /https:\/\/[^/]+\/$/,
      );
    }
  });

  test('never redirects on Accept-Language', async ({ request }) => {
    // ADR 2 stands on this point: a link sent in one language opens in it.
    for (const [path, language] of [
      ['/', 'en-GB,en;q=0.9'],
      ['/en/', 'fr-FR,fr;q=0.9'],
    ] as const) {
      const response = await request.get(path, {
        headers: { 'Accept-Language': language },
        maxRedirects: 0,
      });
      expect(response.status(), `${path} redirected a ${language} reader`).toBe(200);
    }
  });
});

test.describe('achievements accordion', () => {
  test('opens the first achievement and keeps only one open at a time', async ({ page }) => {
    await gotoHome(page, '/en/');
    const achievements = page.locator('details.achievement');
    await expect(achievements).toHaveCount(ACHIEVEMENT_IDS.length);
    await expect(achievements.nth(0)).toHaveAttribute('open', '');

    await achievements.nth(2).locator('summary').click();
    await expect(achievements.nth(2)).toHaveAttribute('open', '');
    await expect(achievements.nth(0)).not.toHaveAttribute('open', '');

    // The last one too: `name` groups the whole list, not the first few.
    const last = achievements.nth(ACHIEVEMENT_IDS.length - 1);
    await last.locator('summary').click();
    await expect(last).toHaveAttribute('open', '');
    await expect(achievements.nth(2)).not.toHaveAttribute('open', '');
  });

  test('exposes each achievement as a heading with its panel content', async ({ page }) => {
    await gotoHome(page, '/en/');
    const first = page.locator('details.achievement').first();
    await expect(
      first.getByRole('heading', { name: RESUME.en.achievements[0]?.title ?? '∅' }),
    ).toBeVisible();
    // Two facets: "Context" repeated the plain line above it (ADR 18).
    await expect(first.getByText('Context', { exact: true })).toHaveCount(0);
    await expect(first.getByText('Approach', { exact: true })).toBeVisible();
    await expect(first.getByText('Result', { exact: true })).toBeVisible();
  });

  test('is operable from the keyboard', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'WebKit needs full keyboard access enabled at OS level');
    await gotoHome(page, '/en/');
    const second = page.locator('details.achievement').nth(1);
    await second.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(second).toHaveAttribute('open', '');
  });
});

test.describe('the page is not a CV', () => {
  // Chantier A: the chronology, the job titles, the years badge and the stack
  // chips are in the PDF, and the page keeps none of them. These assertions are
  // the part that does not decay — a rebuilt section can quietly bring the CV
  // grammar back, and the reason it went is invisible in the markup.
  for (const path of PATHS) {
    test(`serves no track record and no earlier-roles disclosure on ${path}`, async ({ page }) => {
      await gotoHome(page, path);
      await expect(page.locator('#experience')).toHaveCount(0);
      await expect(page.locator('details.earlier')).toHaveCount(0);
      await expect(page.locator('.job')).toHaveCount(0);
    });
  }

  test('offers one call to action in the hero, and it reaches the Offers', async ({ page }) => {
    for (const [path, label] of [
      ['/', 'Voir les offres'],
      ['/en/', 'See the offers'],
    ] as const) {
      await gotoHome(page, path);
      const ctas = page.locator('.hero a');
      await expect(ctas).toHaveCount(1);
      await expect(ctas.first()).toHaveText(label);
      await ctas.first().click();
      await expect(page).toHaveURL(new RegExp(`${path}#offers$`));
      await expect(page.locator('#offers')).toBeInViewport();
    }
  });

  test('points the salaried route at LinkedIn, from About', async ({ page }) => {
    await gotoHome(page, '/');
    const career = page.locator('#about .about__career a');
    await expect(career).toHaveCount(1);
    await expect(career).toHaveAttribute('href', /linkedin\.com\/in\//);
  });
});

test.describe('phone number is not harvestable', () => {
  for (const path of PATHS) {
    test(`keeps the number out of the HTML source of ${path}`, async ({ request }) => {
      const html = await (await request.get(path)).text();
      for (const pattern of PHONE_PATTERNS) {
        expect(html, `phone leaked into ${path}`).not.toMatch(pattern);
      }
    });
  }

  test('reveals a tel: link on click and moves focus to it', async ({ page }) => {
    await gotoHome(page, '/en/');
    const button = page.getByRole('button', { name: 'Show phone number' });
    await expect(button).toBeVisible();
    await button.click();

    const link = page.getByRole('link', { name: '06 32 13 45 47' });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', 'tel:+33632134547');
    await expect(link).toBeFocused();
  });

  test('leaves no dead control when JavaScript is off', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/en/');
    await expect(page.getByRole('button', { name: 'Show phone number' })).toHaveCount(0);
    // Email and LinkedIn still get the visitor there. Scoped to the contact
    // section: the footer repeats both links site-wide, so an unscoped role
    // query now matches twice and says nothing about this section.
    const contact = page.locator('#contact');
    await expect(contact.getByRole('link', { name: 'birdiz@proton.me' })).toBeVisible();
    // And the booking link comes first: the home page used to be the one
    // page without it (ADR 18). A link, never an embed.
    await expect(contact.getByRole('link').first()).toHaveAttribute('href', CONTACT.booking);
    await expect(page.locator('iframe')).toHaveCount(0);
    await expect(contact.getByRole('link', { name: 'LinkedIn' })).toBeVisible();
    await context.close();
  });

  test('omits the number from the Person structured data', async ({ page }) => {
    await gotoHome(page, '/');
    const raw = await page.locator('script[type="application/ld+json"]').textContent();
    expect(raw).toBeTruthy();
    const schema = JSON.parse(raw as string);
    // The page is a ProfilePage; its subject is the Person. Two things, not one.
    expect(schema['@type']).toBe('ProfilePage');
    expect(schema.mainEntity['@type']).toBe('Person');
    expect(schema.mainEntity.name).toBe('Thomas Bouzy');

    // The point of the test: no number anywhere in the graph, at any depth.
    expect(JSON.stringify(schema)).not.toMatch(/telephone/i);
    for (const pattern of PHONE_PATTERNS) {
      expect(JSON.stringify(schema)).not.toMatch(pattern);
    }
  });
});

test.describe('navigation', () => {
  test('anchors scroll to their section, clear of the sticky header', async ({ page }) => {
    await gotoHome(page, '/en/');
    await page
      .getByRole('navigation', { name: 'Main' })
      .getByRole('link', { name: 'Approach' })
      .click();
    await expect(page).toHaveURL(/#approach$/);

    const box = await page.locator('#approach').boundingBox();
    const headerHeight = (await page.locator('.site-header').boundingBox())?.height ?? 0;
    expect(box).not.toBeNull();
    // The heading must land below the sticky header, never behind it.
    expect(box?.y ?? 0).toBeGreaterThanOrEqual(headerHeight - 1);
  });

  test('has a skip link that reaches main', async ({ page }) => {
    await gotoHome(page, '/en/');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toHaveAttribute('href', '#main');
    await expect(page.locator('main#main')).toHaveCount(1);
    // Parked above the viewport until it is focused.
    await expect(skip).toHaveCSS('top', '-100px');
  });

  test('reveals the skip link on focus, first in the tab order', async ({ page, browserName }) => {
    // WebKit does not tab to links unless macOS "Full Keyboard Access" is on,
    // and it applies `:focus` styling only in the OS-active window — neither is
    // available to Playwright's build. The CSS is engine-independent; the
    // static half of the contract is asserted above for every engine.
    test.skip(browserName === 'webkit', 'WebKit keyboard focus is not driveable here');

    await gotoHome(page, '/en/');
    await page.keyboard.press('Tab');

    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await expect(skip).toHaveCSS('top', '0px');
  });
});

test.describe('layout integrity', () => {
  test('never scrolls sideways', async ({ page }) => {
    for (const path of PATHS) {
      await gotoHome(page, path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow, `${path} overflows horizontally by ${overflow}px`).toBeLessThanOrEqual(1);
    }
  });

  test('keeps the header sticky while scrolling', async ({ page }) => {
    await gotoHome(page, '/');
    await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }));
    const top = await page.locator('.site-header').evaluate((el) => el.getBoundingClientRect().top);
    expect(Math.round(top)).toBe(0);
  });

  test('exposes exactly one h1 and no skipped heading levels', async ({ page }) => {
    for (const path of PATHS) {
      await gotoHome(page, path);
      await expect(page.locator('h1')).toHaveCount(1);

      const levels = await page.$$eval('h1, h2, h3, h4, h5, h6', (nodes) =>
        nodes.map((n) => Number(n.tagName[1])),
      );
      expect(levels[0]).toBe(1);
      for (let i = 1; i < levels.length; i++) {
        const jump = (levels[i] as number) - (levels[i - 1] as number);
        expect(
          jump,
          `${path}: heading jumped from h${levels[i - 1]} to h${levels[i]}`,
        ).toBeLessThanOrEqual(1);
      }
    }
  });
});

test.describe('motion preferences', () => {
  test.describe('with no stated preference', () => {
    test.use({ motion: 'no-preference' });

    test('scrolls smoothly and runs the ambient animations', async ({ page }) => {
      await gotoHome(page, '/');
      await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'smooth');

      const running = await page.evaluate(
        () => document.querySelector('.hero__pulse')?.getAnimations().length ?? 0,
      );
      expect(running).toBeGreaterThan(0);
    });
  });

  test.describe('when the visitor asks for reduced motion', () => {
    test.use({ motion: 'reduce' });

    test('stops animating and jumps instead of gliding', async ({ page }) => {
      await gotoHome(page, '/');
      await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');

      const durations = await page.evaluate(() =>
        [...document.querySelectorAll('.hero__pulse, .hero__blob, .contact__blob')].map(
          (el) => getComputedStyle(el).animationDuration,
        ),
      );
      expect(durations.length).toBeGreaterThan(0);
      for (const duration of durations) {
        expect(Number.parseFloat(duration)).toBeLessThan(0.01);
      }
    });
  });
});

test.describe('the home page sells the Offers (ADR 14)', () => {
  for (const locale of ['fr', 'en'] as const) {
    const home = homePath(locale);

    test(`reads problem, offers, proof, position, person on ${home}`, async ({ page }) => {
      await gotoHome(page, home);
      const order = await page.$$eval('main > section[id]', (sections) =>
        sections.map((section) => section.id),
      );
      expect(order).toEqual(['top', 'problem', 'offers', 'work', 'approach', 'about', 'contact']);
    });

    test(`links each Client sentence to its Offer, then offers the Audit, on ${home}`, async ({
      page,
    }) => {
      await gotoHome(page, home);
      const modes = page.locator('#problem .problem__mode');
      const failureModes = RESUME[locale].failureModes;
      await expect(modes).toHaveCount(failureModes.length);
      for (const [i, mode] of failureModes.entries()) {
        const link = modes.nth(i).getByRole('heading').getByRole('link');
        await expect(link).toContainText(mode.quote);
        await expect(link).toHaveAttribute(
          'href',
          pathOf(mode.offer, locale) ?? pathOf(mode.offer, 'fr') ?? '∅',
        );
      }
      // Under the four, for the Client who cannot yet name theirs.
      const audit = page.locator('#problem .problem__audit a');
      await expect(audit).toHaveAttribute('href', pathOf('audit', locale) ?? '∅');
      await expect(page.locator('.concepts')).toHaveCount(0);
    });

    test(`shows five Offers with a price from the table on ${home}`, async ({ page }) => {
      await gotoHome(page, home);
      const cards = page.locator('#offers .offers__card');
      await expect(cards).toHaveCount(OFFER_IDS.length);

      for (const id of OFFER_IDS) {
        const card = page.locator(`#offers .offers__card[data-offer="${id}"]`);
        await expect(card.getByRole('heading')).toHaveText(RESUME[locale].offers[id].name);
        await expect(card).toContainText(formatEuros(fromPrice(id).min, locale));
        // A page in this locale if there is one, the French page otherwise.
        await expect(card.getByRole('link')).toHaveAttribute(
          'href',
          pathOf(id, locale) ?? pathOf(id, 'fr') ?? '∅',
        );
      }
      await expect(page.locator('#offers .offers__card[data-offer="takeover"] a')).toHaveAttribute(
        'href',
        '/offres/reprise-et-maintenance/',
      );

      await expect(page.locator(`#offers a[href="${pathOf('partners', 'fr')}"]`)).toHaveCount(1);
    });
  }
});
