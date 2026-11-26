import { test, expect } from '@playwright/test';

test.describe('desktop navigation', () => {
  test.skip(({ isMobile }) => !!isMobile, 'desktop-only nav');

  test('navbar links reach their pages', async ({ page }) => {
    await page.goto('/');
    await page.locator('header nav a', { hasText: 'About' }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator('h1')).toContainText('Abdul Aziz');
  });

  test('skip link is the first tab stop and moves focus to main', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.locator('a[href="#main-content"]');
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
  });

  test('keyboard focus is actually visible on the primary CTA', async ({ page }) => {
    await page.goto('/');
    const cta = page.locator('a[href="/projects"]').first();
    await cta.focus();
    // Regression guard for the undefined --color-ring token: a focused control
    // must render *some* visible focus indicator, not a transparent one.
    const visible = await cta.evaluate((el) => {
      const cs = getComputedStyle(el);
      const ring = cs.boxShadow;
      const hasOutline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
      const hasRing = ring !== 'none' && !/^(rgba\(0, 0, 0, 0\)[^,]*,?\s*)+$/.test(ring);
      return hasOutline || hasRing;
    });
    expect(visible, 'focused CTA has no visible focus indicator').toBe(true);
  });
});

test.describe('mobile menu', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile-only drawer');

  test('opens, traps focus, closes on Escape and restores focus', async ({ page }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Open menu' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Site menu' });
    await expect(dialog).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    // Focus must be inside the drawer, not left on <body>.
    await expect
      .poll(async () => dialog.evaluate((el) => el.contains(document.activeElement)))
      .toBe(true);

    // Tabbing must not escape the drawer.
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');
      const inside = await dialog.evaluate((el) => el.contains(document.activeElement));
      expect(inside, `focus escaped the drawer after ${i + 1} tabs`).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('a nav link closes the drawer and navigates', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('dialog').getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/about$/);
  });
});
