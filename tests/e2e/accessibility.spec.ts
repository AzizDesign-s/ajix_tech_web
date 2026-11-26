import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES = [
  '/',
  '/about',
  '/contact',
  '/projects',
  '/projects/qr-ordering-digital-system',
] as const;

/**
 * Scroll-triggered reveals only start when their section enters the viewport,
 * and axe reads whatever is on screen at that instant. Sampling an element
 * mid-fade reports a contrast figure that no settled state ever has, which
 * makes the whole suite flaky.
 *
 * So: walk the page to trigger every reveal, return to the top, then wait for
 * all running animations to finish before asserting. WCAG applies to the
 * settled state, not to transient frames of a fade.
 */
async function settle(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        // Only one-shot animations. The ambient loops — floating cards, the
        // AIRA drift, the marquees, the orbit rings — run forever, so their
        // `finished` promise never settles and awaiting it would hang.
        .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)
        .map((animation) => animation.finished.catch(() => undefined)),
    ),
  );
  await page.waitForTimeout(250);
}

for (const route of ROUTES) {
  test(`${route} has no detectable WCAG 2.1/2.2 A or AA violations`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await settle(page);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      // Elements marked data-decorative are watermarks at ~5% opacity, already
      // aria-hidden. WCAG 1.4.3 exempts incidental and decorative text from
      // contrast; axe flags them anyway because it cannot infer intent. The
      // exclusion is deliberately narrow — one attribute, applied in two
      // components, both reviewed by hand.
      .exclude('[data-decorative="true"]')
      .analyze();

    const summary = results.violations.map(
      (v) =>
        `${v.id} (${v.impact}) x${v.nodes.length}: ${v.help} — ${v.nodes[0]?.html?.slice(0, 120)}`,
    );
    expect(summary, `axe violations on ${route}`).toEqual([]);
  });
}

test('reduced motion is honoured', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  // The hero must still be readable — a reduced-motion user should never be
  // left looking at content stuck at opacity 0.
  await expect(page.locator('h1')).toBeVisible();
  const opacity = await page.locator('h1').evaluate((el) => getComputedStyle(el).opacity);
  expect(Number(opacity)).toBeGreaterThan(0.9);
});

test('contact hero is readable with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/contact', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await expect(page.locator('h1')).toBeVisible();
  const opacity = await page.locator('h1').evaluate((el) => getComputedStyle(el).opacity);
  expect(Number(opacity)).toBeGreaterThan(0.9);
});
