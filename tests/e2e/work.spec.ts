import { test, expect, type Page } from '@playwright/test';

/**
 * Work page — filters, URL sync, search, layout toggle and Quick View.
 *
 * These assert behaviour a user depends on rather than markup details, so they
 * keep working when the visual design changes.
 */

async function gotoExplorer(page: Page, query = '') {
  await page.goto(`/projects${query}`, { waitUntil: 'domcontentloaded' });
  await page.locator('#explore').scrollIntoViewIfNeeded();
  await expect(page.getByRole('radio', { name: /All Work/ })).toBeVisible();
}

test.describe('work: filters', () => {
  test('filters are a radiogroup and arrow keys move the selection', async ({ page }) => {
    await gotoExplorer(page);

    const all = page.getByRole('radio', { name: /All Work/ });
    const uiux = page.getByRole('radio', { name: /UI\/UX Case Studies/ });

    await expect(all).toHaveAttribute('aria-checked', 'true');

    // A radiogroup is a single tab stop; the arrow keys do the moving.
    await all.focus();
    await page.keyboard.press('ArrowRight');
    await expect(uiux).toHaveAttribute('aria-checked', 'true');
    await expect(uiux).toBeFocused();

    await page.keyboard.press('ArrowLeft');
    await expect(all).toHaveAttribute('aria-checked', 'true');
  });

  test('choosing a filter updates the URL without a full page load', async ({ page }) => {
    await gotoExplorer(page);

    // If the page reloaded, this marker would be gone.
    await page.evaluate(() => {
      (window as unknown as { __noReload?: boolean }).__noReload = true;
    });

    await page.getByRole('radio', { name: /UI\/UX Case Studies/ }).click();
    await expect(page).toHaveURL(/[?&]filter=uiux/);

    const survived = await page.evaluate(
      () => (window as unknown as { __noReload?: boolean }).__noReload === true,
    );
    expect(survived, 'filtering must not reload the page').toBe(true);
  });

  test('a filter in the URL is applied on first load', async ({ page }) => {
    await gotoExplorer(page, '?filter=uiux');
    await expect(page.getByRole('radio', { name: /UI\/UX Case Studies/ })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  test('the default filter is kept out of the URL', async ({ page }) => {
    await gotoExplorer(page, '?filter=uiux');
    await page.getByRole('radio', { name: /All Work/ }).click();
    await expect(page).not.toHaveURL(/filter=/);
  });

  test('an empty category explains itself and offers a way out', async ({ page }) => {
    // SaaS products live only in Sanity, so with the local content source this
    // filter is genuinely empty — exactly the state the empty view is for.
    await gotoExplorer(page, '?filter=saas');
    const reset = page.getByRole('button', { name: /Show all work/ });
    await expect(reset).toBeVisible();
    await reset.click();
    await expect(page.getByRole('radio', { name: /All Work/ })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });
});

test.describe('work: search and layout', () => {
  test('search narrows the grid and reports the count', async ({ page }) => {
    await gotoExplorer(page);
    const search = page.getByRole('searchbox', { name: /Search projects/ });

    await search.fill('zzzzzznomatch');
    await expect(page.getByText(/Nothing matched that search/)).toBeVisible();

    await search.fill('');
    await expect(page.getByText(/Nothing matched that search/)).toHaveCount(0);
  });

  test('the layout toggle switches view and survives a reload', async ({ page }) => {
    await gotoExplorer(page);

    await page.getByRole('button', { name: 'List view' }).click();
    await expect(page).toHaveURL(/[?&]view=list/);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('#explore').scrollIntoViewIfNeeded();
    await expect(page.getByRole('button', { name: 'List view' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});

test.describe('work: quick view', () => {
  test('opens, is modal, closes on Escape and restores focus', async ({ page }) => {
    await gotoExplorer(page);

    const trigger = page.getByRole('button', { name: /Quick view/ }).first();
    await trigger.click();

    const dialog = page.locator('dialog[open]');
    await expect(dialog).toHaveCount(1);
    // showModal() puts it in the top layer and makes the rest inert, which is
    // the behaviour a hand-rolled overlay usually fails to reproduce.
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('dialog[open]')).toHaveCount(0);

    // Focus must come back to the button that opened it, not to <body>.
    await expect(trigger).toBeFocused();
  });

  test('the close button dismisses it', async ({ page }) => {
    await gotoExplorer(page);
    await page
      .getByRole('button', { name: /Quick view/ })
      .first()
      .click();
    await expect(page.locator('dialog[open]')).toHaveCount(1);

    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.locator('dialog[open]')).toHaveCount(0);
  });
});

test.describe('work: project pages', () => {
  test('a card reaches its project page and back again', async ({ page }) => {
    await gotoExplorer(page);

    const card = page.getByRole('link', { name: /QR - Ordering/ }).first();
    await card.click();
    await expect(page).toHaveURL(/\/projects\/qr-ordering-digital-system/);
    await expect(page.locator('h1')).toHaveText(/QR - Ordering/);

    await page.getByRole('link', { name: /Back to all work/ }).click();
    await expect(page).toHaveURL(/\/projects$/);
  });

  test('every project page generated at build time resolves', async ({ page, request }) => {
    // The sitemap is the contract: anything listed there must be reachable.
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const xml = await response.text();

    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => m[1])
      .filter((url) => url.includes('/projects/'));

    expect(urls.length, 'the sitemap should list real project pages').toBeGreaterThan(0);

    for (const url of urls) {
      const res = await page.request.get(new URL(url).pathname);
      expect(res.status(), `${url} is in the sitemap`).toBe(200);
    }
  });
});
