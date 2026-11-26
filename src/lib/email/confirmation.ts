import type { ContactSubmission } from '@/lib/validation/contactSchema';
import type { AvailabilityState } from '@/types/contact';
import { siteConfig, socials } from '@/config/site';
import { emailTheme as t, intentAccent } from '@/lib/email/theme';
import { shell, p, detailTable, quote, button, divider, esc, link } from '@/lib/email/components';
import { intentLabel, detailRows } from '@/lib/email/notification';

/**
 * The confirmation that goes back to whoever wrote in.
 *
 * Two jobs. First, remove the doubt — a form that swallows a message with no
 * acknowledgement is the single most common reason people give up and email
 * directly, or do not follow up at all. Second, set an expectation that is
 * actually true: the response time quoted here is read from the live
 * availability setting, not hardcoded, so it cannot drift out of step with
 * what the site itself says.
 *
 * Deliberately not marketing. No newsletter signup, no "while you wait" pitch,
 * no tracking pixel. It is a receipt with a human voice.
 */

function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] || full;
}

interface IntentCopy {
  heading: string;
  lead: string;
}

function copyFor(submission: ContactSubmission): IntentCopy {
  const name = firstName(submission.name);

  switch (submission.intent) {
    case 'hire': {
      const role = submission.role ? ` for ${submission.role}` : '';
      const at = submission.company ? ` at ${submission.company}` : '';
      return {
        heading: `Opportunity received, ${name}.`,
        lead: `Thanks for thinking of me${role}${at}. I read every opportunity properly rather than skimming it, so you will get a straight answer either way — including if I do not think it is the right fit.`,
      };
    }
    case 'project':
      return {
        heading: `Brief received, ${name}.`,
        lead: `Thanks for walking me through what you are building. I will come back with honest thoughts on scope, approach and timeline — including whether I am the right person for it.`,
      };
    case 'collaborate':
      return {
        heading: `Good to hear from you, ${name}.`,
        lead: `Thanks for the note about working together. I will have a proper look at what you have described and come back to you.`,
      };
    case 'hello':
      return {
        heading: `Message received, ${name}.`,
        lead: `Thanks for getting in touch. Everything that comes through this form reaches me directly, and I read all of it.`,
      };
  }
}

/**
 * Subject lines, written per intent rather than templated from the intent
 * label — "Your hire me enquiry" is what templating gives you, and it reads
 * like a machine wrote it. These mirror the headings inside the email so the
 * inbox line and the message agree.
 */
const CONFIRMATION_SUBJECTS: Record<ContactSubmission['intent'], string> = {
  hire: 'Opportunity received — AJIX',
  project: 'Project brief received — AJIX',
  collaborate: 'Collaboration enquiry received — AJIX',
  hello: 'Thanks for getting in touch — AJIX',
};

export function buildConfirmationSubject(submission: ContactSubmission): string {
  return CONFIRMATION_SUBJECTS[submission.intent];
}

export function buildConfirmationText(
  submission: ContactSubmission,
  availability: AvailabilityState,
): string {
  const { heading, lead } = copyFor(submission);

  const lines = [
    heading,
    '',
    lead,
    '',
    availability.responseTime.replace(/^Typical response time: /, 'Expected reply: '),
    '',
    'For your records, here is what you sent:',
    '',
  ];
  for (const [label, value] of detailRows(submission)) lines.push(`${label}: ${value}`);
  lines.push(
    '',
    'Message:',
    submission.message,
    '',
    `If anything has changed, just reply to this email — it reaches me directly at ${siteConfig.email}.`,
    '',
    '— Abdul Aziz',
    siteConfig.url,
  );
  return lines.join('\n');
}

export function buildConfirmationHtml(
  submission: ContactSubmission,
  availability: AvailabilityState,
): string {
  const accent = intentAccent[submission.intent] ?? t.primary;
  const { heading, lead } = copyFor(submission);
  const rows = detailRows(submission);

  // Stated by the site itself, never invented here. If availability changes in
  // Sanity, this sentence changes with it.
  const expectation = availability.responseTime.replace(/^Typical response time:\s*/i, '');

  const body = [
    p(esc(lead)),

    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${t.subtle};border:1px solid ${t.border};border-radius:12px;margin:4px 0 22px 0;">
      <tr><td style="padding:16px 18px;">
        <p style="margin:0 0 4px 0;font-family:${t.sans};font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${t.muted};">Expected reply</p>
        <p style="margin:0;font-family:${t.sans};font-size:15px;font-weight:600;color:${t.ink};">${esc(expectation)}</p>
      </td></tr>
    </table>`,

    p(
      `<strong style="color:${t.ink};">For your records</strong> — this is what came through:`,
      `font-size:14px;margin-bottom:12px;`,
    ),

    detailTable(rows),
    quote(submission.message, 'What you wrote'),

    divider(),

    p(
      `In the meantime, you are welcome to look through my work.`,
      `font-size:14px;margin-bottom:12px;`,
    ),
    button(`${siteConfig.url}/projects`, 'Browse my work', accent),

    p(
      `Something to add, or something changed? Reply to this email — it reaches me directly at ${link(`mailto:${siteConfig.email}`, siteConfig.email)}. You can also find me on ${link(socials.linkedin, 'LinkedIn')}.`,
      `font-size:14px;margin-top:14px;`,
    ),

    p(
      `— Abdul Aziz<br /><span style="color:${t.muted};">Product Designer &amp; Design Engineer, Dubai</span>`,
      `font-size:15px;margin-top:22px;margin-bottom:0;`,
    ),
  ].join('');

  return shell({
    preheader: `${lead.slice(0, 120)}`,
    accent,
    eyebrow: intentLabel(submission.intent),
    heading,
    body,
    footer: `You are receiving this because you used the contact form at ${esc(siteConfig.url.replace(/^https?:\/\//, ''))}. This is a one-off confirmation, not a mailing list — there is nothing to unsubscribe from.`,
  });
}
