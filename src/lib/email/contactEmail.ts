import type { ContactSubmission } from '@/lib/validation/contactSchema';
import { intentOptions } from '@/config/contact';

/** Escapes user-supplied text before it goes anywhere near the HTML email. */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function intentLabel(intent: ContactSubmission['intent']): string {
  return intentOptions.find((option) => option.id === intent)?.title ?? intent;
}

/** Ordered label/value pairs for the enquiry-specific fields. */
function detailRows(submission: ContactSubmission): Array<[string, string]> {
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

export function buildSubject(submission: ContactSubmission): string {
  return `[${intentLabel(submission.intent)}] ${submission.name}`;
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

export function buildHtml(submission: ContactSubmission): string {
  const rows = detailRows(submission)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 16px 8px 0;color:#5a6478;font-size:13px;white-space:nowrap;vertical-align:top;">${esc(label)}</td>
          <td style="padding:8px 0;color:#000614;font-size:14px;">${esc(value)}</td>
        </tr>`,
    )
    .join('');

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#fbfbfd;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e4e7ef;border-radius:14px;border-collapse:separate;">
      <tr>
        <td style="padding:28px 28px 8px;">
          <p style="margin:0 0 4px;color:#2563eb;font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;">
            ${esc(intentLabel(submission.intent))}
          </p>
          <h1 style="margin:0;color:#000614;font-size:22px;font-weight:700;">New enquiry from ${esc(submission.name)}</h1>
          <p style="margin:6px 0 0;">
            <a href="mailto:${esc(submission.email)}" style="color:#2563eb;font-size:14px;text-decoration:none;">${esc(submission.email)}</a>
          </p>
        </td>
      </tr>
      ${
        rows
          ? `<tr><td style="padding:12px 28px;">
               <table role="presentation" style="width:100%;border-collapse:collapse;border-top:1px solid #e4e7ef;">${rows}</table>
             </td></tr>`
          : ''
      }
      <tr>
        <td style="padding:12px 28px 28px;">
          <p style="margin:0 0 6px;color:#5a6478;font-size:13px;">Message</p>
          <div style="padding:14px 16px;background:#f6f7fb;border-radius:10px;color:#000614;font-size:14px;line-height:1.6;white-space:pre-wrap;">${esc(submission.message)}</div>
          <p style="margin:18px 0 0;color:#5a6478;font-size:12px;">
            Reply directly to this email to reach ${esc(submission.name)}.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
