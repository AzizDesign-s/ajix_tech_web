// Thin wrapper over gtag so event names stay consistent and call sites never
// touch window directly. Every call is a no-op when GA4 is not configured, so
// nothing breaks locally or in a preview deployment.
//
// Naming convention: snake_case verb_noun, matching GA4's recommended-event
// style. Keep new events in this union so the list stays reviewable.
export type AnalyticsEvent =
  | 'cta_click'
  | 'resume_download'
  | 'project_click'
  | 'social_click'
  | 'email_copy'
  | 'nav_click'
  // Contact page
  | 'contact_page_view'
  | 'contact_intent_select'
  | 'contact_form_start'
  | 'contact_form_error'
  | 'contact_form_submit'
  | 'generate_lead'
  | 'contact_email_click'
  | 'contact_whatsapp_click'
  | 'contact_linkedin_click'
  | 'contact_booking_click'
  | 'contact_resume_download'
  // Work page
  | 'projects_page_view'
  | 'project_filter_select'
  | 'project_search'
  | 'project_card_click'
  | 'project_quick_view'
  | 'project_featured_click'
  | 'project_live_demo_click'
  | 'case_study_view'
  | 'case_study_section_view'
  | 'project_contact_click'
  // SaaS products
  | 'saas_product_view'
  | 'saas_demo_request_click';

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: 'event' | 'config' | 'consent', ...args: unknown[]) => void;
    dataLayer?: unknown[];
    /**
     * Meta Pixel. Present only after the pixel script has been injected, which
     * happens solely once marketing consent is granted — so every call site
     * must treat it as possibly undefined.
     */
    fbq?: (command: 'init' | 'track' | 'trackCustom' | 'consent', ...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

/**
 * Meta Pixel, called a "Dataset ID" in Meta's current Events Manager UI. The
 * same 15-16 digit number either way.
 *
 * Public by design: it ships in the page source and anyone can read it. The
 * secret in Meta's stack is the Conversions API access token, which this site
 * does not use — everything here is browser-side.
 *
 * Its presence is also what decides whether the consent banner offers an
 * advertising category at all. No pixel configured, no advertising toggle:
 * offering a choice over something that does not exist is just noise.
 */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

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

/**
 * Meta's standard events, limited to the two this site has any use for.
 *
 * `Lead` is the one that matters: it is what makes a contact-form completion
 * optimisable as a conversion in Meta Ads. `PageView` fires from the base
 * snippet and is listed here only so route-change tracking can reuse it.
 */
export type MetaEvent = 'PageView' | 'Lead';

/**
 * Send a standard event to the Meta Pixel.
 *
 * No-ops unless the pixel is configured AND has been injected, which only
 * happens after marketing consent. Never pass anything identifying: Meta's
 * advanced matching is deliberately not enabled, and a name or email address
 * in a parameter here would defeat that.
 */
export function trackMetaEvent(event: MetaEvent, params: GtagParams = {}) {
  if (typeof window === 'undefined' || !window.fbq || !META_PIXEL_ID) return;
  window.fbq('track', event, params);
}
