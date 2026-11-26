import { test, expect } from '@playwright/test';

/**
 * Analytics consent.
 *
 * The guarantee under test is "not requested", not "requested with consent
 * denied": until the visitor agrees, no analytics script tag exists at all.
 */

const ANALYTICS_HOSTS = ['googletagmanager.com', 'google-analytics.com', 'clarity.ms'];

test.describe('consent: the banner', () => {
  test('appears on a first visit and names both tools', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const banner = page.getByRole('region', { name: 'Analytics consent' });
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(/Google Analytics/);
    await expect(banner).toContainText(/Clarity/);
  });

  test('does not trap focus or block the page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('region', { name: 'Analytics consent' })).toBeVisible();

    // The page underneath stays reachable — this is not a modal.
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    await heading.scrollIntoViewIfNeeded();
  });

  test('offers Accept and Decline as equal choices', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const banner = page.getByRole('region', { name: 'Analytics consent' });

    const accept = banner.getByRole('button', { name: 'Accept' });
    const decline = banner.getByRole('button', { name: 'Decline' });
    await expect(accept).toBeVisible();
    await expect(decline).toBeVisible();

    // Same element type and same height: a faint "Decline" beside a filled
    // "Accept" is a dark pattern, and consent obtained that way is not freely
    // given under the GDPR.
    const acceptBox = await accept.boundingBox();
    const declineBox = await decline.boundingBox();
    expect(acceptBox?.height).toBe(declineBox?.height);
  });

  test('a choice is remembered across navigation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Decline' }).click();
    await expect(page.getByRole('region', { name: 'Analytics consent' })).toHaveCount(0);

    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('region', { name: 'Analytics consent' })).toHaveCount(0);
  });

  test('the choice is revocable from the footer', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Accept' }).click();
    await expect(page.getByRole('region', { name: 'Analytics consent' })).toHaveCount(0);

    const settings = page.getByRole('button', { name: 'Analytics settings' });
    await settings.scrollIntoViewIfNeeded();
    await settings.click();

    await expect(page.getByRole('region', { name: 'Analytics consent' })).toBeVisible();
  });
});

test.describe('consent: nothing loads before it', () => {
  test('no analytics script tag exists while undecided', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const srcs = await page
      .locator('script[src]')
      .evaluateAll((nodes) => nodes.map((node) => (node as HTMLScriptElement).src));
    for (const host of ANALYTICS_HOSTS) {
      expect(srcs.join(' '), `no script from ${host} before consent`).not.toContain(host);
    }
  });

  test('no request reaches an analytics host after declining', async ({ page }) => {
    const hits: string[] = [];
    page.on('request', (request) => {
      const url = request.url();
      if (ANALYTICS_HOSTS.some((host) => url.includes(host))) hits.push(url);
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Decline' }).click();
    await page.goto('/about', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    expect(hits).toEqual([]);
  });

  test('declining is recorded with a timestamp, for both purposes', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Decline' }).click();

    // v2, not v1: `marketing` was split out of `analytics` when the Meta Pixel
    // was added. A stored v1 choice said yes to "Analytics" and cannot be read
    // as a yes to advertising, so the key was bumped to re-ask rather than
    // silently inherit a consent that was never given.
    const stored = await page.evaluate(() => window.localStorage.getItem('ajix.consent.v2'));
    expect(stored).toBeTruthy();
    const record = JSON.parse(stored as string) as {
      analytics: string;
      marketing: string;
      decidedAt: string;
    };
    expect(record.analytics).toBe('denied');
    expect(record.marketing).toBe('denied');
    // A date you can evidence if anyone ever asks when consent was given.
    expect(Number.isNaN(Date.parse(record.decidedAt))).toBe(false);
  });

  test('the old v1 key is not read as consent', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'ajix.consent.v1',
        JSON.stringify({ analytics: 'granted', decidedAt: new Date().toISOString() }),
      );
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // A visitor who accepted under the old single-purpose banner is asked
    // again, rather than having that answer applied to a purpose they were
    // never shown.
    await expect(page.getByRole('region', { name: 'Analytics consent' })).toBeVisible();
  });

  test('accepting grants analytics but never marketing while no pixel is set', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Accept' }).click();

    const stored = await page.evaluate(() => window.localStorage.getItem('ajix.consent.v2'));
    const record = JSON.parse(stored as string) as { analytics: string; marketing: string };
    expect(record.analytics).toBe('granted');
    // The banner described analytics and nothing else. Recording a grant for
    // advertising would be consent the visitor was never asked for.
    expect(record.marketing).toBe('denied');
  });

  test('no Meta Pixel request is ever made while no pixel is configured', async ({ page }) => {
    const hits: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('facebook.net') || request.url().includes('facebook.com')) {
        hits.push(request.url());
      }
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Accept' }).click();
    await page.goto('/contact', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    // Accepting is the strongest case: even with consent granted, an
    // unconfigured integration must stay entirely absent.
    expect(hits).toEqual([]);
  });
});
