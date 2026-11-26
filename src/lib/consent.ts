/**
 * Visitor consent, by purpose.
 *
 * The rule this enforces: no third-party script is requested at all until the
 * visitor has said yes to the purpose it serves. Not "loaded with consent
 * denied" — not requested. Consent Mode's cookieless pings are defensible
 * under some readings, but a request to googletagmanager.com before consent is
 * still a request to a third party, and this way the guarantee is simple
 * enough to assert in a test.
 *
 * Two categories, because measurement and advertising are genuinely different
 * purposes and bundling them behind one "Accept" is the dark pattern the GDPR
 * calls out by name:
 *
 *   analytics — Google Analytics 4, Microsoft Clarity, Vercel Analytics.
 *               How many people came and what they looked at.
 *   marketing — Meta Pixel. Builds an advertising audience on a platform
 *               that is not this site.
 *
 * Vercel Speed Insights is deliberately exempt from both: it measures the
 * page, not the person, and carries no identifier.
 */

export type ConsentChoice = 'granted' | 'denied';

export type ConsentCategory = 'analytics' | 'marketing';

export const CONSENT_CATEGORIES: readonly ConsentCategory[] = ['analytics', 'marketing'] as const;

export type ConsentCategories = Record<ConsentCategory, ConsentChoice>;

/**
 * Bumped from v1 when `marketing` was split out of `analytics`. A stored v1
 * choice said yes to "Analytics" and cannot be read as a yes to advertising,
 * so the new key deliberately re-asks rather than inheriting.
 */
const STORAGE_KEY = 'ajix.consent.v2';

export interface ConsentRecord extends ConsentCategories {
  /** When the choice was made, so it can be evidenced if ever asked. */
  decidedAt: string;
}

/** Everything off. The state before a visitor has chosen, and after declining. */
export const DENY_ALL: ConsentCategories = { analytics: 'denied', marketing: 'denied' };
export const GRANT_ALL: ConsentCategories = { analytics: 'granted', marketing: 'granted' };

function isChoice(value: unknown): value is ConsentChoice {
  return value === 'granted' || value === 'denied';
}

export function readConsent(): ConsentRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>;

    // A record missing `analytics` is not a record. `marketing` is allowed to
    // be absent and falls back to denied — the safe direction.
    if (!isChoice(parsed.analytics)) return null;

    return {
      analytics: parsed.analytics,
      marketing: isChoice(parsed.marketing) ? parsed.marketing : 'denied',
      decidedAt: parsed.decidedAt ?? '',
    };
  } catch {
    // Private browsing, disabled storage, or corrupted JSON. Treat as undecided
    // rather than throwing — the banner simply asks again.
    return null;
  }
}

export function writeConsent(categories: ConsentCategories): ConsentRecord {
  const record: ConsentRecord = { ...categories, decidedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Storage unavailable: the choice still applies for this page view, it just
    // will not be remembered. Better than refusing to honour it.
  }
  return record;
}

export function clearConsent(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do.
  }
}
