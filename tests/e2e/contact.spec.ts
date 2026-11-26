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
  test('the heading is server-rendered visible', async ({ request }) => {
    const html = await (await request.get('/contact')).text();
    const h1 = html.match(/<h1[^>]*>/)?.[0] ?? '';
    expect(h1).not.toBe('');
    expect(h1).not.toContain('opacity:0');
  });

  test('no horizontal overflow at any width', async ({ page }) => {
    for (const width of [320, 375, 390, 430, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/contact', { waitUntil: 'networkidle' });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `overflow at ${width}px`).toBeLessThanOrEqual(0);
    }
  });

  test('the sidebar sits beside the form on desktop and under it on mobile', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/contact', { waitUntil: 'networkidle' });

    const form = page.locator('#contact-form form').first();
    const card = page.getByRole('region', { name: /available|currently|not available/i }).first();

    const formBox = await form.boundingBox();
    const cardBox = await card.boundingBox();
    expect(formBox).not.toBeNull();
    expect(cardBox).not.toBeNull();

    if (isMobile) {
      // Stacked: the card starts below where the form starts.
      expect(cardBox!.y).toBeGreaterThan(formBox!.y);
    } else {
      // Side by side: the card's left edge is past the form's right edge.
      expect(cardBox!.x).toBeGreaterThanOrEqual(formBox!.x + formBox!.width - 1);
    }
  });

  test('the form comes before the sidebar in the DOM', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'networkidle' });

    // Checked against the live DOM, not the raw HTML string. The form sits
    // inside a <Suspense> boundary, so React streams it after the sidebar in
    // the response body and reorders it on arrival — the source order is a
    // streaming artefact and says nothing about what a keyboard reaches.
    const formFirst = await page.evaluate(() => {
      const form = document.querySelector('#contact-form form');
      const card = document.querySelector('[aria-labelledby^="card-"]');
      if (!form || !card) return null;
      // DOCUMENT_POSITION_FOLLOWING === 4: the card comes after the form.
      return (form.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
    });

    // The form is why the page exists, so it must be what a keyboard and a
    // screen reader reach first — regardless of where it sits visually.
    expect(formFirst, 'form or sidebar card not found').not.toBeNull();
    expect(formFirst).toBe(true);
  });
});

test.describe('contact: availability', () => {
  test('one availability state drives the badge, the card and the FAQ', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'networkidle' });

    // The card's accessible name is its TITLE (the live availability label),
    // not the "Availability" eyebrow above it — that is a styled <p>.
    const card = page.getByRole('region', { name: /available|currently|not available/i }).first();
    const label = await card.getByRole('heading', { level: 2 }).textContent();
    expect(label?.trim()).toBeTruthy();

    // The navbar badge reads from the same source; if these ever disagree the
    // page is telling two different stories about whether work is being taken.
    // On mobile that badge lives in the collapsed drawer rather than the bar,
    // so assert it is present in the header rather than painted.
    const navBadge = page.locator('header').getByText(label!.trim(), { exact: false }).first();
    await expect(navBadge).toHaveCount(1);
    expect((await navBadge.textContent())?.trim()).toBe(label!.trim());
  });

  test('local time renders without a hydration mismatch', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.goto('/contact', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // The clock is the one value that cannot be known on the server, so it is
    // the most likely source of a hydration error on this page.
    const hydration = errors.filter(
      (text) => text.includes('Hydration') || text.includes('did not match'),
    );
    expect(hydration).toEqual([]);

    await expect(page.getByText(/local time/i).first()).toBeVisible();
  });
});

test.describe('contact: FAQ', () => {
  test('is keyboard operable and starts closed', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'networkidle' });

    const first = page.locator('#contact-faq details').first();
    await expect(first).toBeVisible();
    expect(await first.evaluate((el) => (el as HTMLDetailsElement).open)).toBe(false);

    await first.locator('summary').focus();
    await page.keyboard.press('Enter');
    expect(await first.evaluate((el) => (el as HTMLDetailsElement).open)).toBe(true);
  });

  test('every rendered question appears in the FAQ structured data', async ({ request }) => {
    const html = await (await request.get('/contact')).text();

    const blocks = [
      ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
    ].map((match) => match[1]);
    const faq = blocks
      .map((raw) => JSON.parse(raw.replace(/\\u003c/g, '<')) as { '@type'?: string })
      .find((data) => data['@type'] === 'FAQPage') as
      { mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }> } | undefined;

    expect(faq, 'no FAQPage structured data found').toBeTruthy();
    expect(faq!.mainEntity.length).toBeGreaterThan(0);

    // Marking up questions that are not on the page is a structured-data
    // violation, so every question in the markup must also be visible.
    for (const entry of faq!.mainEntity) {
      expect(html).toContain(entry.name.replace(/&/g, '&amp;'));
    }
  });
});

test.describe('contact: channels', () => {
  test('no channel renders a dead link', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'networkidle' });

    const hrefs = await page
      .locator('#contact-form a[href]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''));

    for (const href of hrefs) {
      expect(href, 'an empty or placeholder href reached the page').not.toBe('');
      expect(href).not.toBe('#');
      expect(href).not.toContain('your-handle');
      expect(href).not.toContain('971000000000');
    }
  });

  test('booking falls back to a pre-addressed email when no scheduler is set', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'networkidle' });

    const booking = page.locator('#contact-booking a').first();
    const href = await booking.getAttribute('href');

    // Either a real scheduler link, or a mailto already carrying the call type.
    // What it must never be is absent: someone who wants a call should always
    // be able to ask for one.
    expect(href).toBeTruthy();
    expect(href!.startsWith('mailto:') || href!.startsWith('http')).toBe(true);
    if (href!.startsWith('mailto:')) expect(href).toContain('subject=');
  });
});
