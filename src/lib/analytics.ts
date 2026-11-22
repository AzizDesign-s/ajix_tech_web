// Thin wrapper over gtag so event names stay consistent and call sites never
// touch window directly. Every call is a no-op when GA4 is not configured, so
// nothing breaks locally or in a preview deployment.
//
// Naming convention: snake_case verb_noun, matching GA4's recommended-event
// style. Keep new events in this union so the list stays reviewable.
export type AnalyticsEvent =
  'cta_click' | 'resume_download' | 'project_click' | 'social_click' | 'email_copy' | 'nav_click';

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: 'event' | 'config' | 'consent', ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

/**
 * Send a custom event to GA4.
 *
 * Never pass anything that identifies a person — no email addresses, names or
 * free-text input. Parameters should describe *what* was interacted with.
 */
export function trackEvent(event: AnalyticsEvent, params: GtagParams = {}) {
  if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) return;
  window.gtag('event', event, params);
}
