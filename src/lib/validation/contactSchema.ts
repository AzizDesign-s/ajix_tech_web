import { z } from 'zod';
import {
  BUDGET_RANGES,
  COLLABORATION_TYPES,
  EMPLOYMENT_TYPES,
  PROJECT_CATEGORIES,
  TIMELINES,
  WORK_ARRANGEMENTS,
} from '@/config/contact';

// One schema, imported by both the browser and the Server Action. The client
// copy is a convenience that gives instant feedback; the server copy is the one
// that actually decides. Keeping them as a single definition is the only way
// they stay in step.

const MAX = { name: 100, email: 254, short: 120, url: 500, message: 4000 } as const;

const name = z
  .string()
  .trim()
  .min(2, 'Please enter your name.')
  .max(MAX.name, `Keep this under ${MAX.name} characters.`);

const email = z
  .string()
  .trim()
  .min(1, 'Please enter your email address.')
  .max(MAX.email, 'That email address is too long.')
  .pipe(z.email('That does not look like a valid email address.'));

const message = z
  .string()
  .trim()
  .min(10, 'Please add a little more detail — at least 10 characters.')
  .max(MAX.message, `Keep this under ${MAX.message} characters.`);

const shortText = (label: string) =>
  z.string().trim().min(1, `Please enter ${label}.`).max(MAX.short, 'That is too long.');

const optionalShort = z
  .string()
  .trim()
  .max(MAX.short, 'That is too long.')
  .optional()
  .or(z.literal(''));

const optionalUrl = z
  .union([
    z.literal(''),
    z.string().trim().max(MAX.url).pipe(z.url('Please enter a full URL, starting with https://')),
  ])
  .optional();

const base = { name, email, message };

export const contactSchema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('hire'),
    ...base,
    company: shortText('the company name'),
    role: shortText('the role title'),
    employmentType: z.enum(EMPLOYMENT_TYPES),
    workArrangement: z.enum(WORK_ARRANGEMENTS),
    jobLink: optionalUrl,
  }),
  z.object({
    intent: z.literal('project'),
    ...base,
    company: optionalShort,
    projectCategory: z.enum(PROJECT_CATEGORIES),
    budget: z.enum(BUDGET_RANGES),
    timeline: z.enum(TIMELINES),
    referenceLink: optionalUrl,
  }),
  z.object({
    intent: z.literal('collaborate'),
    ...base,
    organisation: optionalShort,
    collaborationType: z.enum(COLLABORATION_TYPES),
    referenceLink: optionalUrl,
  }),
  z.object({
    intent: z.literal('hello'),
    ...base,
  }),
]);

export type ContactSubmission = z.infer<typeof contactSchema>;

/**
 * Anti-bot fields. Kept out of contactSchema so the enquiry payload stays clean
 * and these never reach the email template or analytics.
 */
export const spamGuardSchema = z.object({
  /** Hidden from humans by CSS; bots that fill every field trip it. */
  website: z.string().max(0, 'Rejected.').optional().or(z.literal('')),
  /** Epoch ms stamped when the form mounted. */
  startedAt: z.coerce.number().int().nonnegative().optional(),
});

/** A human needs at least this long to fill the form in. */
export const MIN_FILL_MS = 3000;

/** Turns FormData into a plain object for parsing. */
export function formDataToObject(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') out[key] = value;
  }
  return out;
}

/** Flattens Zod issues into { field: firstMessage } for rendering. */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}
