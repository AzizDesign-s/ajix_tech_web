import type { AvailabilityLevel, AvailabilityState } from '@/types/contact';

export const availabilityStates: Record<AvailabilityLevel, AvailabilityState> = {
  available: {
    level: 'available',
    label: 'Available for Work',
    description: 'Currently taking on new enterprise design and engineering engagements.',
    responseTime: 'Typical response time: within 24 hours',
  },
  limited: {
    level: 'limited',
    label: 'Currently Working',
    description: 'On an active engagement, but open to discussing new projects starting soon.',
    responseTime: 'Typical response time: within 48 hours',
  },
  busy: {
    level: 'busy',
    label: 'Currently Busy',
    description: 'Not taking new engagements right now, but happy to discuss future opportunities.',
    responseTime: 'Typical response time: within 3–5 business days',
  },
  unavailable: {
    level: 'unavailable',
    label: 'Not Available',
    description: 'Not accepting new work at the moment. Feel free to get in touch anyway.',
    responseTime: 'Typical response time: within a week',
  },
};

/**
 * What each availability level is actually open to.
 *
 * Kept beside the levels rather than on AvailabilityState, so the Sanity
 * document shape and its mapper stay untouched: the switch in Sanity still
 * stores one level, and this is how that level is presented.
 *
 * These mirror the three routes the contact form itself offers, so the page
 * cannot say it is open to something the form does not accept.
 */
export const availabilityOpenTo: Record<AvailabilityLevel, string[]> = {
  available: ['Full-time roles', 'Select freelance projects', 'Long-term collaborations'],
  limited: ['Freelance projects starting soon', 'Long-term collaborations'],
  busy: ['Conversations about future work'],
  unavailable: ['Introductions, for later'],
};

/** Compact form of the response time, for the hero stat card where there is
 *  room for a number and not a sentence. */
export const availabilityResponseShort: Record<AvailabilityLevel, string> = {
  available: '24h',
  limited: '48h',
  busy: '3-5d',
  unavailable: '1wk',
};

export const availabilityDotColor: Record<AvailabilityLevel, string> = {
  available: 'bg-success',
  limited: 'bg-warning',
  busy: 'bg-danger',
  unavailable: 'bg-muted',
};

export function getAllAvailabilityStates(): AvailabilityState[] {
  return Object.values(availabilityStates);
}

/**
 * The fallback used before Sanity is switched on, and whenever a Sanity read
 * fails. Every surface that shows availability — navbar badge, mobile drawer,
 * footer, About profile card, Contact hero — renders the value supplied by
 * <AvailabilityProvider>, which the route-group layouts populate from
 * getSiteSettings(). This constant is what that resolves to with
 * CONTENT_SOURCE=local.
 */
export const currentAvailabilityLevel: AvailabilityLevel = 'available';

export function getCurrentAvailability(): AvailabilityState {
  return availabilityStates[currentAvailabilityLevel];
}

/** Narrows an arbitrary string (e.g. from Sanity) to a known level. */
export function toAvailabilityLevel(value: string | null | undefined): AvailabilityLevel {
  return value && value in availabilityStates
    ? (value as AvailabilityLevel)
    : currentAvailabilityLevel;
}
