import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES = ['/', '/about'] as const;

for (const route of ROUTES) {
  test(`${route} has no detectable WCAG 2.1/2.2 A or AA violations`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    const summary = results.violations.map(
      (v) => `${v.id} (${v.impact}) x${v.nodes.length}: ${v.help}`,
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
