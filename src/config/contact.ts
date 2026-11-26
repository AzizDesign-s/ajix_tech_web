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

  /**
   * E.164 format, WITH the leading "+", e.g. +9715XXXXXXXX. Used for the
   * tel: link and for the JSON-LD contact point.
   *
   * Hidden entirely while unset. A phone number is the one contact detail
   * where a wrong value is worse than no value — it reaches a stranger.
   */
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '',

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

/** Formats +9715XXXXXXXX as +971 5X XXX XXXX for display. Other country
 *  codes fall back to the raw value rather than being mangled. */
export function formatPhone(e164: string): string {
  if (!e164) return '';
  const digits = e164.replace(/[^\d]/g, '');
  if (digits.startsWith('971') && digits.length === 12) {
    return `+971 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return e164;
}

export const phoneHref = contactChannels.phone ? `tel:${contactChannels.phone}` : '';

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

/**
 * The two kinds of call worth offering.
 *
 * Deliberately only two. A long menu of meeting types makes a visitor stop and
 * choose carefully, which is friction exactly where you least want it; two
 * obvious options are picked in about a second.
 *
 * Each carries a `subject` so that when no scheduling link is configured, the
 * card still works — it opens an email already labelled with the call type
 * instead of rendering a dead button.
 */
export interface MeetingType {
  id: string;
  title: string;
  minutes: number;
  description: string;
  subject: string;
}

export const meetingTypes: MeetingType[] = [
  {
    id: 'intro',
    title: 'Quick Introduction',
    minutes: 15,
    description: 'A short call to see whether there is a fit, with no agenda beyond that.',
    subject: 'Quick introduction call — 15 minutes',
  },
  {
    id: 'project',
    title: 'Project Discussion',
    minutes: 30,
    description: 'Walk through scope, constraints and timeline for a specific piece of work.',
    subject: 'Project discussion — 30 minutes',
  },
];
