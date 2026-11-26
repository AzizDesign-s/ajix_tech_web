import type { ContactSubmission } from '@/lib/validation/contactSchema';
import { intentOptions } from '@/config/contact';
import { emailTheme as t, intentAccent } from '@/lib/email/theme';
import { shell, p, detailTable, quote, button, divider, esc, link } from '@/lib/email/components';

/**
 * The enquiry notification — the email that reaches Abdul Aziz.
 *
 * Optimised for one job: deciding whether to reply, from a phone, in about
 * four seconds. Who it is, what they want, and a reply button that already
 * has the right address in it.
 */

export function intentLabel(intent: ContactSubmission['intent']): string {
  return intentOptions.find((option) => option.id === intent)?.title ?? intent;
}

/** Ordered label/value pairs for the enquiry-specific fields. */
export function detailRows(submission: ContactSubmission): Array<[string, string]> {
  const rows: Array<[string, string | undefined]> = [];

  switch (submission.intent) {
    case 'hire':
      rows.push(
        ['Company', submission.company],
        ['Role', submission.role],
        ['Employment type', submission.employmentType],
        ['Work arrangement', submission.workArrangement],
        ['Job description', submission.jobLink],
      );
      break;
    case 'project':
      rows.push(
        ['Company', submission.company],
        ['Project category', submission.projectCategory],
        ['Budget', submission.budget],
        ['Timeline', submission.timeline],
        ['Reference', submission.referenceLink],
      );
      break;
    case 'collaborate':
      rows.push(
        ['Organisation', submission.organisation],
        ['Collaboration type', submission.collaborationType],
        ['Reference', submission.referenceLink],
      );
      break;
    case 'hello':
      break;
  }

  return rows.filter((row): row is [string, string] => Boolean(row[1]));
}

/**
 * Subject line.
 *
 * Intent first, in brackets, so a mail rule can filter on it and so the inbox
 * list is scannable without opening anything. Company is included when known,
 * because "[Hire Me] Sarah Khan — Careem" is a different decision from
 * "[Hire Me] Sarah Khan".
 */
export function buildSubject(submission: ContactSubmission): string {
  const org =
    submission.intent === 'hire'
      ? submission.company
      : submission.intent === 'project'
        ? submission.company
        : submission.intent === 'collaborate'
          ? submission.organisation
          : undefined;

  return org
    ? `[${intentLabel(submission.intent)}] ${submission.name} — ${org}`
    : `[${intentLabel(submission.intent)}] ${submission.name}`;
}

export function buildText(submission: ContactSubmission): string {
  const lines = [
    `New ${intentLabel(submission.intent).toLowerCase()} enquiry from the AJIX contact form.`,
    '',
    `Name:  ${submission.name}`,
    `Email: ${submission.email}`,
  ];
  for (const [label, value] of detailRows(submission)) lines.push(`${label}: ${value}`);
  lines.push(
    '',
    'Message:',
    submission.message,
    '',
    `Reply directly to this email to reach ${submission.name}.`,
  );
  return lines.join('\n');
}

export function buildHtml(submission: ContactSubmission, receivedAt = new Date()): string {
  const accent = intentAccent[submission.intent] ?? t.primary;
  const label = intentLabel(submission.intent);

  // Dubai time, because that is the timezone the decision is being made in.
  const stamp = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Dubai',
  }).format(receivedAt);

  const replySubject = encodeURIComponent(`Re: your ${label.toLowerCase()} enquiry — AJIX`);
  const replyHref = `mailto:${submission.email}?subject=${replySubject}`;

  const body = [
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 20px 0;">
      <tr>
        <td style="font-family:${t.sans};font-size:16px;font-weight:600;color:${t.ink};padding:0 0 4px 0;">${esc(submission.name)}</td>
      </tr>
      <tr>
        <td style="font-family:${t.sans};font-size:14px;padding:0;">${link(`mailto:${submission.email}`, submission.email)}</td>
      </tr>
    </table>`,

    detailTable(detailRows(submission)),
    quote(submission.message),
    button(replyHref, `Reply to ${submission.name.split(' ')[0] || submission.name}`, accent),
    divider(),
    p(
      `Received ${esc(stamp)} (Dubai time). Replying to this email goes straight to ${esc(submission.name)} — the reply-to address is already set.`,
      `font-size:13px;color:${t.muted};margin:0;`,
    ),
  ].join('');

  return shell({
    preheader: `${submission.name}: ${submission.message.slice(0, 110)}`,
    accent,
    eyebrow: label,
    heading: 'New enquiry',
    body,
    footer: 'Sent automatically by the AJIX contact form.',
  });
}
