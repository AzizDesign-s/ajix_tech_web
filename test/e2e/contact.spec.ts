import { test, expect } from '@playwright/test';

test.describe('contact: theme', () => {
  test('light route renders on the light palette and dark routes do not', async ({ page }) => {
    await page.goto('/contact');
    const theme = page.locator('[data-theme="light"]').first();
    await expect(theme).toBeVisible();

    const bg = await theme.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(251, 251, 253)');

    await page.goto('/');
    await expect(page.locator('[data-theme="dark"]').first()).toBeVisible();
    await expect(page.locator('[data-theme="light"]')).toHaveCount(0);
  });

  test('logo swaps with the theme', async ({ page }) => {
    await page.goto('/');
    const darkLogo = await page.locator('header img').first().getAttribute('src');
    await page.goto('/contact');
    const lightLogo = await page.locator('header img').first().getAttribute('src');
    expect(darkLogo).not.toBe(lightLogo);
  });

  test('dark to light navigation is client-side, with no full reload', async ({
    page,
    isMobile,
  }) => {
    // The header nav is hidden below lg; the mobile drawer has its own test.
    test.skip(!!isMobile, 'desktop nav only');
    await page.goto('/');
    // A marker that only survives if the document is never reloaded.
    await page.evaluate(() => {
      (window as unknown as { __kept?: boolean }).__kept = true;
    });
    await page.locator('header nav a', { hasText: 'Contact' }).first().click();
    await expect(page).toHaveURL(/\/contact$/);
    const survived = await page.evaluate(
      () => (window as unknown as { __kept?: boolean }).__kept === true,
    );
    expect(survived, 'navigation caused a full page reload').toBe(true);
  });
});

test.describe('contact: intent selector', () => {
  test('is a radiogroup and arrow keys move the selection', async ({ page }) => {
    await page.goto('/contact');
    const group = page.getByRole('radiogroup');
    await expect(group).toBeVisible();

    const hire = page.getByRole('radio', { name: /Hire Me/ });
    await expect(hire).toHaveAttribute('aria-checked', 'true');

    await hire.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('radio', { name: /Start a Project/ })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await expect(hire).toHaveAttribute('aria-checked', 'false');

    // Wraps around from the last option back to the first.
    await page.keyboard.press('End');
    await expect(page.getByRole('radio', { name: /Just Say Hello/ })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await page.keyboard.press('ArrowRight');
    await expect(hire).toHaveAttribute('aria-checked', 'true');
  });

  test('changing intent changes which fields the form asks for', async ({ page }) => {
    await page.goto('/contact');

    // Hiring asks about the role.
    await expect(page.locator('#employmentType')).toBeVisible();
    await expect(page.locator('#budget')).toHaveCount(0);

    await page.getByRole('radio', { name: /Start a Project/ }).click();
    await expect(page.locator('#budget')).toBeVisible();
    await expect(page.locator('#employmentType')).toHaveCount(0);

    await page.getByRole('radio', { name: /Just Say Hello/ }).click();
    // The minimal form: name, email, message only.
    await expect(page.locator('#budget')).toHaveCount(0);
    await expect(page.locator('#company')).toHaveCount(0);
    await expect(page.locator('#message')).toBeVisible();
  });
});

test.describe('contact: form', () => {
  test('blocks an empty submission and reports the fields', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: /Send message/ }).click();

    // Client-side validation ran — no navigation, and errors are announced.
    await expect(page).toHaveURL(/\/contact$/);
    const alerts = page.locator('[role="alert"]:not(.sr-only)');
    await expect(alerts.first()).toBeVisible();
    await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'true');
  });

  test('rejects a malformed email', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('radio', { name: /Just Say Hello/ }).click();
    await page.locator('#name').fill('Test Person');
    await page.locator('#email').fill('not-an-email');
    await page.locator('#message').fill('This is a long enough message to pass validation.');
    await page.getByRole('button', { name: /Send message/ }).click();
    await expect(page.locator('#email')).toHaveAttribute('aria-invalid', 'true');
  });

  test('the honeypot is hidden from people and from assistive tech', async ({ page }) => {
    await page.goto('/contact');
    const honeypot = page.locator('input[name="website"]');
    await expect(honeypot).toHaveCount(1);
    await expect(honeypot).not.toBeInViewport();
    await expect(honeypot).toHaveAttribute('tabindex', '-1');
    const hidden = await honeypot.evaluate((el) => Boolean(el.closest('[aria-hidden="true"]')));
    expect(hidden).toBe(true);
  });

  test('every control has an accessible name', async ({ page }) => {
    await page.goto('/contact');
    const unnamed = await page.evaluate(() =>
      Array.from(document.querySelectorAll('input, select, textarea'))
        .filter((el) => {
          const control = el as HTMLInputElement;
          if (control.type === 'hidden' || control.name === 'website') return false;
          const labelled =
            control.labels?.length ||
            control.getAttribute('aria-label') ||
            control.getAttribute('aria-labelledby');
          return !labelled;
        })
        .map((el) => (el as HTMLInputElement).name || el.id),
    );
    expect(unnamed).toEqual([]);
  });
});

test.describe('contact: composition', () => {
  test('floating cards do not overlap each other on desktop', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'cards are a simple grid on mobile');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/contact');
    await page.waitForTimeout(1500);

    const boxes = await page.locator('.card-float').evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top, left: r.left, right: r.right, bottom: r.bottom };
      }),
    );
    expect(boxes.length).toBe(4);

    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i];
        const b = boxes[j];
        const overlaps =
          a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
        expect(overlaps, `cards ${i} and ${j} overlap`).toBe(false);
      }
    }
  });

  test('the heading is server-rendered visible', async ({ request }) => {
    const html = await (await request.get('/contact')).text();
    const h1 = html.match(/<h1[^>]*>/)?.[0] ?? '';
    expect(h1).not.toBe('');
    expect(h1).not.toContain('opacity:0');
  });
});
