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
    label: 'Limited Availability',
    description:
      'Taking on select projects alongside existing commitments — reach out to check fit.',
    responseTime: 'Typical response time: within 48 hours',
  },
  busy: {
    level: 'busy',
    label: 'Currently Busy',
    description: 'Not taking new engagements right now, but happy to discuss future opportunities.',
    responseTime: 'Typical response time: within 3–5 business days',
  },
};

export const availabilityDotColor: Record<AvailabilityLevel, string> = {
  available: 'bg-success',
  limited: 'bg-warning',
  busy: 'bg-danger',
};

export function getAllAvailabilityStates(): AvailabilityState[] {
  return Object.values(availabilityStates);
}

// SINGLE SOURCE OF TRUTH. Every surface that shows availability — the navbar
// badge, the mobile drawer, the footer and the About page's profile card —
// renders <AvailabilityBadge />, which reads getCurrentAvailability() below.
// Change this one value and all of them update together.
// When this moves to Sanity, only getCurrentAvailability() needs to become
// async; no consuming component changes.
export const currentAvailabilityLevel: AvailabilityLevel = 'available';

export function getCurrentAvailability(): AvailabilityState {
  return availabilityStates[currentAvailabilityLevel];
}
