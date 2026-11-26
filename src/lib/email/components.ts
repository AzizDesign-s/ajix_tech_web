import { emailTheme as t } from '@/lib/email/theme';

/**
 * The small set of building blocks every AJIX email is assembled from.
 *
 * Everything is table-based with inline styles. That is not nostalgia: Outlook
 * on Windows renders through Microsoft Word's HTML engine, which has no
 * support for flexbox, grid, or float in any form you can rely on. Tables are
 * the only layout primitive that behaves the same in Word, Gmail's rewriter,
 * and Apple Mail.
 */

/** Escapes user-supplied text before it goes anywhere near the HTML. */
export function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Turns newlines into <br>, after escaping. For the visitor's message body. */
export function escMultiline(value: string): string {
  return esc(value).replace(/\r?\n/g, '<br />');
}

export interface ShellOptions {
  /** Shown in the inbox preview line, before the body is opened. */
  preheader: string;
  accent?: string;
  /** Small caps label above the heading. */
  eyebrow: string;
  heading: string;
  /** Raw HTML for the body. Callers are responsible for escaping. */
  body: string;
  footer: string;
}

/**
 * The outer document: head, preheader, header bar, card, footer.
 *
 * The preheader is the hidden text clients show next to the subject line in
 * the inbox list. Left unset, they pull the first visible text instead, which
 * is usually the eyebrow — so "HIRE ME" would be the preview for every
 * recruiter enquiry. Setting it is one of the highest-leverage things in an
 * email template.
 */
export function shell({
  preheader,
  accent = t.primary,
  eyebrow,
  heading,
  body,
  footer,
}: ShellOptions): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light only" />
<title>${esc(heading)}</title>
</head>
<body style="margin:0;padding:0;background-color:${t.page};-webkit-font-smoothing:antialiased;">

<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${esc(preheader)}</div>
<div style="display:none;max-height:0;overflow:hidden;">&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${t.page};">
<tr><td align="center" style="padding:32px 16px;">

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${t.maxWidth}" style="width:100%;max-width:${t.maxWidth}px;">

    <tr><td style="padding:0 0 20px 0;">
      <span style="font-family:${t.heading};font-size:20px;font-weight:700;letter-spacing:0.14em;color:${t.ink};">AJIX</span>
      <span style="font-family:${t.sans};font-size:11px;color:${t.muted};padding-left:10px;letter-spacing:0.08em;text-transform:uppercase;">Product Design &amp; Engineering</span>
    </td></tr>

    <tr><td style="background-color:${t.card};border:1px solid ${t.border};border-radius:16px;overflow:hidden;">

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr><td style="height:4px;line-height:4px;font-size:0;background-color:${accent};">&nbsp;</td></tr>
        <tr><td style="padding:32px 32px 8px 32px;">
          <p style="margin:0 0 10px 0;font-family:${t.sans};font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${accent};">${esc(eyebrow)}</p>
          <h1 style="margin:0;font-family:${t.heading};font-size:26px;line-height:1.25;font-weight:700;color:${t.ink};">${esc(heading)}</h1>
        </td></tr>
        <tr><td style="padding:16px 32px 32px 32px;">${body}</td></tr>
      </table>

    </td></tr>

    <tr><td style="padding:20px 8px 0 8px;">
      <p style="margin:0;font-family:${t.sans};font-size:12px;line-height:1.6;color:${t.muted};">${footer}</p>
    </td></tr>

  </table>

</td></tr>
</table>
</body>
</html>`;
}

/** Body paragraph. */
export function p(html: string, extra = ''): string {
  return `<p style="margin:0 0 14px 0;font-family:${t.sans};font-size:15px;line-height:1.65;color:${t.body};${extra}">${html}</p>`;
}

/**
 * Renders a value, turning it into a link when it is one.
 *
 * A job posting or reference URL sitting as dead text is the single most
 * annoying thing an enquiry email can do to whoever has to act on it.
 * Only http(s) is linked — never javascript:, data:, or anything else that
 * would be an injection vector even after escaping.
 */
function renderValue(value: string): string {
  return /^https?:\/\//i.test(value) ? link(value, value) : esc(value);
}

/** A label/value table. Returns empty string for an empty row set, so callers
 *  can drop it in unconditionally. */
export function detailTable(rows: Array<[string, string]>): string {
  if (rows.length === 0) return '';
  const cells = rows
    .map(
      ([label, value], index) => `
        <tr>
          <td style="padding:${index === 0 ? '0' : '10px'} 16px 10px 0;font-family:${t.sans};font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:${t.muted};white-space:nowrap;vertical-align:top;width:38%;">${esc(label)}</td>
          <td style="padding:${index === 0 ? '0' : '10px'} 0 10px 0;font-family:${t.sans};font-size:15px;line-height:1.5;color:${t.ink};vertical-align:top;word-break:break-word;">${renderValue(value)}</td>
        </tr>`,
    )
    .join('');

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${t.subtle};border:1px solid ${t.border};border-radius:12px;padding:18px;margin:0 0 20px 0;">
    <tr><td><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${cells}</table></td></tr>
  </table>`;
}

/** The visitor's own words, set apart so they are never confused with ours. */
export function quote(text: string, label = 'Message'): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 20px 0;">
    <tr>
      <td style="width:3px;background-color:${t.border};border-radius:3px;font-size:0;line-height:0;">&nbsp;</td>
      <td style="padding:2px 0 2px 16px;">
        <p style="margin:0 0 6px 0;font-family:${t.sans};font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:${t.muted};">${esc(label)}</p>
        <div style="font-family:${t.sans};font-size:15px;line-height:1.7;color:${t.body};white-space:normal;">${escMultiline(text)}</div>
      </td>
    </tr>
  </table>`;
}

/**
 * A call-to-action button.
 *
 * The VML block is what makes it render as a button in Outlook on Windows
 * rather than as a bare link — Word's engine ignores border-radius and
 * padding on an anchor. Everything else sees the <a> and ignores the VML.
 */
export function button(href: string, label: string, accent: string = t.primary): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 8px 0;">
    <tr><td align="center" bgcolor="${accent}" style="border-radius:10px;">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${esc(href)}" style="height:44px;v-text-anchor:middle;width:220px;" arcsize="23%" stroke="f" fillcolor="${accent}">
      <w:anchorlock/><center style="color:${t.onAccent};font-family:${t.sans};font-size:15px;font-weight:600;">${esc(label)}</center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-- -->
      <a href="${esc(href)}" style="display:inline-block;padding:13px 28px;font-family:${t.sans};font-size:15px;font-weight:600;color:${t.onAccent};text-decoration:none;border-radius:10px;background-color:${accent};">${esc(label)}</a>
      <!--<![endif]-->
    </td></tr>
  </table>`;
}

export function divider(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:22px 0;"><tr><td style="height:1px;line-height:1px;font-size:0;background-color:${t.border};">&nbsp;</td></tr></table>`;
}

/** An inline link, styled consistently. */
export function link(href: string, label: string): string {
  return `<a href="${esc(href)}" style="color:${t.primary};text-decoration:underline;">${esc(label)}</a>`;
}
