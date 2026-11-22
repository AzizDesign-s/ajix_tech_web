import { siteConfig, socials } from '@/config/site';
import type { IconKey } from '@/lib/constants/icon';

/**
 * Every contact channel and form option in one place.
 *
 * Values marked PLACEHOLDER are not real. They are deliberately obvious so a
 * half-configured page cannot ship looking finished — each one either hides its
 * UI or is clearly inert until replaced. See CONFIGURATION_CHECKLIST.md.
 */

export const PLACEHOLDER = {
  whatsapp: '971000000000',
  booking: 'https://calendly.com/your-handle/30min',
} as const;

export const contactChannels = {
  /** Enquiries are delivered here. Also the address the copy button copies. */
  email: siteConfig.email,

  /**
   * International format, digits only, no "+" or spaces — wa.me requires that.
   * PLACEHOLDER until a real number is supplied; the WhatsApp card hides itself
   * while this is unset.
   */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',

  whatsappMessage:
    "Hello Abdul Aziz, I found your portfolio and I'd like to talk about an opportunity.",

  linkedin: socials.linkedin,

  /**
   * Calendly scheduling link. The booking card hides itself while this is
   * unset — a dead booking button is worse than no booking button.
   */
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? '',
  bookingProvider: 'Calendly' as const,
  bookingDuration: '30 minutes',
  timezoneNote: 'Based in Dubai (GST, UTC+4) — times shown in your local timezone.',

  resumeUrl: siteConfig.resumeUrl,
} as const;

export function isConfigured(value: string, placeholder?: string): boolean {
  return Boolean(value) && value !== placeholder;
}

export const whatsappHref = contactChannels.whatsappNumber
  ? `https://wa.me/${contactChannels.whatsappNumber}?text=${encodeURIComponent(contactChannels.whatsappMessage)}`
  : '';

/** The four entry points offered in "What brings you here?". */
export const CONTACT_INTENTS = ['hire', 'project', 'collaborate', 'hello'] as const;
export type ContactIntent = (typeof CONTACT_INTENTS)[number];

export interface IntentOption {
  id: ContactIntent;
  number: string;
  title: string;
  description: string;
  icon: IconKey;
  /** Shown above the conditional fields once this intent is selected. */
  formHint: string;
}

export const intentOptions: IntentOption[] = [
  {
    id: 'hire',
    number: '01',
    title: 'Hire Me',
    description: 'For recruiters and hiring managers.',
    icon: 'intent-hire',
    formHint: 'Tell me about the role and the team.',
  },
  {
    id: 'project',
    number: '02',
    title: 'Start a Project',
    description: 'For freelance clients, startups, and businesses.',
    icon: 'intent-project',
    formHint: 'Tell me what you want to build.',
  },
  {
    id: 'collaborate',
    number: '03',
    title: 'Collaborate',
    description: 'For agencies, designers, developers, and creative partners.',
    icon: 'intent-collaborate',
    formHint: 'Tell me what you have in mind.',
  },
  {
    id: 'hello',
    number: '04',
    title: 'Just Say Hello',
    description: 'For general inquiries.',
    icon: 'intent-hello',
    formHint: 'Say whatever you like.',
  },
];

export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
] as const;

export const WORK_ARRANGEMENTS = ['On-site', 'Hybrid', 'Remote'] as const;

export const PROJECT_CATEGORIES = [
  'Product / UX design',
  'UI design & design system',
  'Web design & development',
  'Mobile app design',
  'Brand identity',
  'Something else',
] as const;

/**
 * PLACEHOLDER RANGES — replace with the bands you actually work in.
 * AED first for the UAE market, with a final option so international
 * enquiries are not excluded.
 */
export const BUDGET_RANGES = [
  'Under AED 10,000',
  'AED 10,000 – 25,000',
  'AED 25,000 – 50,000',
  'AED 50,000 – 100,000',
  'AED 100,000+',
  'Not sure yet',
  'Prefer to discuss',
] as const;

export const TIMELINES = [
  'As soon as possible',
  'Within 1 month',
  '1 – 3 months',
  '3 – 6 months',
  'Just exploring',
] as const;

export const COLLABORATION_TYPES = [
  'Design partnership',
  'Development partnership',
  'Agency / white-label',
  'Content or community',
  'Something else',
] as const;
