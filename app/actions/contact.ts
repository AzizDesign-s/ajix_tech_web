'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';
import {
  contactSchema,
  spamGuardSchema,
  formDataToObject,
  toFieldErrors,
  MIN_FILL_MS,
} from '@/lib/validation/contactSchema';
import { buildHtml, buildSubject, buildText } from '@/lib/email/notification';
import {
  buildConfirmationHtml,
  buildConfirmationSubject,
  buildConfirmationText,
} from '@/lib/email/confirmation';
import { getSiteSettings } from '@/lib/services/siteSettings';
import { fingerprint, isDuplicate, rateLimit } from '@/lib/rateLimit';

export type ContactFormState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  fieldErrors: Record<string, string>;
  /** Changes on every submission so the client can react to repeat outcomes. */
  submittedAt?: number;
  /**
   * Whether the confirmation to the sender was accepted by Resend.
   *
   * The success screen only promises a confirmation when this is true. On the
   * `onboarding@resend.dev` test sender this is always false — that sender can
   * only deliver to the account owner — and the UI must not claim otherwise.
   */
  confirmationSent?: boolean;
};

export const initialContactState: ContactFormState = {
  status: 'idle',
  message: '',
  fieldErrors: {},
};

function fail(message: string, fieldErrors: Record<string, string> = {}): ContactFormState {
  return { status: 'error', message, fieldErrors, submittedAt: Date.now() };
}

async function clientIdentifier(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return headerList.get('x-real-ip') ?? 'unknown';
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = formDataToObject(formData);

  // 1. Bot traps. Both fail closed and say nothing specific — there is no
  //    reason to tell a bot which check it tripped.
  const guard = spamGuardSchema.safeParse(raw);
  if (!guard.success || (raw.website ?? '') !== '') {
    return fail('Something went wrong. Please try again.');
  }
  const startedAt = guard.data.startedAt;
  if (startedAt && Date.now() - startedAt < MIN_FILL_MS) {
    return fail('That was a little too quick — please try again.');
  }

  // 2. Rate limit before doing any real work.
  const identifier = await clientIdentifier();
  const limited = rateLimit(`contact:${identifier}`, 5, 60 * 60 * 1000);
  if (!limited.success) {
    const minutes = Math.ceil(limited.retryAfterSeconds / 60);
    return fail(
      `You've sent a few messages already. Please try again in about ${minutes} minute${minutes === 1 ? '' : 's'}.`,
    );
  }

  // 3. Validate. This runs regardless of what the browser did.
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return fail('Please check the highlighted fields.', toFieldErrors(parsed.error));
  }
  const submission = parsed.data;

  // 4. Don't send the same enquiry twice.
  const digest = fingerprint([identifier, submission.email, submission.intent, submission.message]);
  if (isDuplicate(digest)) {
    return {
      status: 'success',
      message: 'That message is already on its way — no need to send it twice.',
      fieldErrors: {},
      submittedAt: Date.now(),
    };
  }

  // 5. Deliver.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    // Misconfiguration is an operator problem, not the visitor's. Never claim
    // a message was sent when no provider was even called.
    console.error('[contact] Missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL.');
    return fail(
      'The contact form is not fully configured yet. Please email me directly in the meantime.',
    );
  }

  try {
    const resend = new Resend(apiKey);

    // 5a. The enquiry notification. This one decides the outcome: if it fails,
    //     the message did not reach anyone and the visitor must be told so.
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: submission.email,
      subject: buildSubject(submission),
      text: buildText(submission),
      html: buildHtml(submission),
    });

    if (error || !data?.id) {
      console.error('[contact] Resend rejected the enquiry notification:', error);
      return fail(
        'Your message could not be sent right now. Please try again, or email me directly.',
      );
    }

    // 5b. The confirmation back to the sender. Courtesy, not delivery — the
    //     enquiry is already through. A failure here is logged and reported
    //     honestly to the UI, but never turns a received message into an
    //     error the visitor has to act on.
    //
    //     It fails predictably in one case: the `onboarding@resend.dev` test
    //     sender can only deliver to the Resend account owner, so every
    //     confirmation to a real visitor is rejected until a domain is
    //     verified. That is why this is reported rather than assumed.
    let confirmationSent = false;
    try {
      const { availability } = await getSiteSettings();
      const confirmation = await resend.emails.send({
        from,
        to: [submission.email],
        replyTo: to,
        subject: buildConfirmationSubject(submission),
        text: buildConfirmationText(submission, availability),
        html: buildConfirmationHtml(submission, availability),
      });

      if (confirmation.error || !confirmation.data?.id) {
        console.error('[contact] Confirmation to sender was rejected:', confirmation.error);
      } else {
        confirmationSent = true;
      }
    } catch (confirmationError) {
      console.error('[contact] Confirmation to sender failed:', confirmationError);
    }

    // Resend has ACCEPTED the message. Delivery happens asynchronously and is
    // not observable here, so the wording says "sent", never "delivered".
    return {
      status: 'success',
      message: 'Thanks — your message has been sent. I usually reply within 24 hours.',
      fieldErrors: {},
      submittedAt: Date.now(),
      confirmationSent,
    };
  } catch (caught) {
    console.error('[contact] Unexpected failure sending enquiry:', caught);
    return fail(
      'Your message could not be sent right now. Please try again, or email me directly.',
    );
  }
}
