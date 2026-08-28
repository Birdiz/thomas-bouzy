import type { Page } from '@playwright/test';
import { expect, test } from './fixtures.ts';

const PHONE_PATTERNS = [/\+33632134547/, /0632134547/, /06 32 13 45 47/];

async function gotoHome(page: Page, path: '/' | '/fr/') {
  await page.goto(path);
  await expect(page.locator('h1')).toBeVisible();
}

test.describe('routing and locales', () => {
  test('serves English at / and French at /fr/', async ({ page }) => {
    await gotoHome(page, '/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('h1')).toHaveText('Thomas Bouzy');
    await expect(page.getByRole('heading', { name: 'Five things worth opening' })).toBeVisible();

    await gotoHome(page, '/fr/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(page.getByRole('heading', { name: 'Cinq sujets à ouvrir' })).toBeVisible();
  });

  test('the language switch changes the URL rather than mutating the page', async ({ page }) => {
    await gotoHome(page, '/');
    await page.getByRole('link', { name: 'Français' }).click();
    await expect(page).toHaveURL(/\/fr\/?$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');

    await page.getByRole('link', { name: 'English' }).click();
    await expect(page).toHaveURL(/localhost:\d+\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('marks the active locale and cross-links both with hreflang', async ({ page }) => {
    await gotoHome(page, '/fr/');
    await expect(page.getByRole('link', { name: 'Français' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    await expect(page.getByRole('link', { name: 'English' })).not.toHaveAttribute(
      'aria-current',
      'true',
    );

    for (const hreflang of ['en', 'fr', 'x-default']) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`)).toHaveCount(1);
    }
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /https:\/\/[^/]+\/fr\//,
    );
  });
});

test.describe('projects accordion', () => {
  test('opens the first project and keeps only one open at a time', async ({ page }) => {
    await gotoHome(page, '/');
    const projects = page.locator('details.project');
    await expect(projects).toHaveCount(5);
    await expect(projects.nth(0)).toHaveAttribute('open', '');

    await projects.nth(2).locator('summary').click();
    await expect(projects.nth(2)).toHaveAttribute('open', '');
    await expect(projects.nth(0)).not.toHaveAttribute('open', '');
  });

  test('exposes each project as a heading with its panel content', async ({ page }) => {
    await gotoHome(page, '/');
    const first = page.locator('details.project').first();
    await expect(
      first.getByRole('heading', { name: /Event Sourcing on wallet transactions/ }),
    ).toBeVisible();
    await expect(first.getByText('Context', { exact: true })).toBeVisible();
    await expect(first.getByText('Approach', { exact: true })).toBeVisible();
    await expect(first.getByText('Result', { exact: true })).toBeVisible();
  });

  test('is operable from the keyboard', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'WebKit needs full keyboard access enabled at OS level');
    await gotoHome(page, '/');
    const second = page.locator('details.project').nth(1);
    await second.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(second).toHaveAttribute('open', '');
  });
});

test.describe('earlier experience disclosure', () => {
  test('reveals four earlier roles and swaps its label', async ({ page }) => {
    await gotoHome(page, '/');
    const earlier = page.locator('details.earlier');
    const cards = earlier.locator('.earlier__card');

    await expect(cards.first()).not.toBeVisible();
    await expect(earlier.getByText('Show earlier experience (2014–2018)')).toBeVisible();

    await earlier.locator('summary').click();
    await expect(cards).toHaveCount(4);
    await expect(cards.first()).toBeVisible();
    await expect(earlier.getByText('Hide earlier experience')).toBeVisible();
    await expect(earlier.getByText('Show earlier experience (2014–2018)')).not.toBeVisible();
  });
});

test.describe('phone number is not harvestable', () => {
  for (const path of ['/', '/fr/'] as const) {
    test(`keeps the number out of the HTML source of ${path}`, async ({ request }) => {
      const html = await (await request.get(path)).text();
      for (const pattern of PHONE_PATTERNS) {
        expect(html, `phone leaked into ${path}`).not.toMatch(pattern);
      }
    });
  }

  test('reveals a tel: link on click and moves focus to it', async ({ page }) => {
    await gotoHome(page, '/');
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
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Show phone number' })).toHaveCount(0);
    // Email and LinkedIn still get the visitor there.
    await expect(page.getByRole('link', { name: 'tom.bouzy@gmail.com' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'LinkedIn' })).toBeVisible();
    await context.close();
  });

  test('omits the number from the Person structured data', async ({ page }) => {
    await gotoHome(page, '/');
    const raw = await page.locator('script[type="application/ld+json"]').textContent();
    expect(raw).toBeTruthy();
    const schema = JSON.parse(raw as string);
    expect(schema['@type']).toBe('Person');
    expect(schema.name).toBe('Thomas Bouzy');
    expect(JSON.stringify(schema)).not.toMatch(/telephone/i);
    for (const pattern of PHONE_PATTERNS) {
      expect(JSON.stringify(schema)).not.toMatch(pattern);
    }
  });
});

test.describe('navigation', () => {
  test('anchors scroll to their section, clear of the sticky header', async ({ page }) => {
    await gotoHome(page, '/');
    await page
      .getByRole('navigation', { name: 'Main' })
      .getByRole('link', { name: 'Skills' })
      .click();
    await expect(page).toHaveURL(/#skills$/);

    const box = await page.locator('#skills').boundingBox();
    const headerHeight = (await page.locator('.site-header').boundingBox())?.height ?? 0;
    expect(box).not.toBeNull();
    // The heading must land below the sticky header, never behind it.
    expect(box?.y ?? 0).toBeGreaterThanOrEqual(headerHeight - 1);
  });

  test('has a skip link that reaches main', async ({ page }) => {
    await gotoHome(page, '/');
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

    await gotoHome(page, '/');
    await page.keyboard.press('Tab');

    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await expect(skip).toHaveCSS('top', '0px');
  });
});

test.describe('layout integrity', () => {
  test('never scrolls sideways', async ({ page }) => {
    for (const path of ['/', '/fr/'] as const) {
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
    for (const path of ['/', '/fr/'] as const) {
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
