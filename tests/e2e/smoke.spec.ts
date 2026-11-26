import { test, expect, type ConsoleMessage, type Page } from '@playwright/test';

const ROUTES = [
  '/',
  '/about',
  '/contact',
  '/projects',
  '/projects/qr-ordering-digital-system',
] as const;

/** Collects console errors and page errors, ignoring noise we do not control. */
function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (msg: ConsoleMessage) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}

test.describe('page loads', () => {
  for (const route of ROUTES) {
    test(`${route} renders with exactly one h1 and no console errors`, async ({ page }) => {
      const errors = collectErrors(page);
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);

      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      await expect(h1).toBeVisible();

      // A hydration mismatch surfaces as a console error containing these.
      const hydration = errors.filter((e) => /hydrat|did not match|Minified React error/i.test(e));
      expect(hydration, `hydration errors on ${route}`).toEqual([]);
      expect(errors, `console errors on ${route}`).toEqual([]);
    });

    test(`${route} has exactly one main landmark`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('main')).toHaveCount(1);
    });
  }
});

test.describe('hero paints without JavaScript-driven reveal', () => {
  test('homepage h1 is visible in the server HTML', async ({ request }) => {
    const res = await request.get('/');
    const html = await res.text();
    const h1 = html.match(/<h1[^>]*>/)?.[0] ?? '';
    expect(h1, 'h1 should exist in the server response').not.toBe('');
    // Regression guard for the LCP fix: the hero must not ship hidden.
    expect(h1).not.toContain('opacity:0');
  });
});

test.describe('no dead links', () => {
  test('every internal link resolves (no 404s)', async ({ page, request }) => {
    for (const route of ROUTES) {
      await page.goto(route);
      const hrefs = await page
        .locator('a[href^="/"]')
        .evaluateAll((els) =>
          Array.from(new Set(els.map((e) => (e as HTMLAnchorElement).getAttribute('href') ?? ''))),
        );
      for (const href of hrefs) {
        if (!href || href.startsWith('//') || href.startsWith('#')) continue;
        const res = await request.get(href);
        expect(res.status(), `${href} (linked from ${route})`).toBeLessThan(400);
      }
    }
  });

  test('no link points at a bare "#" placeholder', async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);
      await expect(page.locator('a[href="#"]')).toHaveCount(0);
    }
  });
});

test.describe('assets', () => {
  test('no request fails on either page', async ({ page }) => {
    const failed: string[] = [];
    page.on('response', (res) => {
      if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`);
    });
    for (const route of ROUTES) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
    }
    expect(failed).toEqual([]);
  });

  test('no third-party requests are made', async ({ page }) => {
    const external: string[] = [];
    page.on('request', (req) => {
      const url = new URL(req.url());
      if (!['127.0.0.1', 'localhost'].includes(url.hostname)) external.push(req.url());
    });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    expect(external, 'analytics is env-gated and icons are self-hosted').toEqual([]);
  });
});

test.describe('responsive layout', () => {
  const widths = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920];
  for (const width of widths) {
    test(`no horizontal scrolling at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ROUTES) {
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(600);
        const overflow = await page.evaluate(() => {
          window.scrollTo(99999, 0);
          const x = Math.round(window.scrollX);
          window.scrollTo(0, 0);
          return x;
        });
        expect(overflow, `${route} at ${width}px`).toBe(0);
      }
    });
  }
});
