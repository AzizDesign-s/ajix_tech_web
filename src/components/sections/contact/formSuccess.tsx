import { CheckCircle2 } from 'lucide-react';
import { contactChannels } from '@/config/contact';

/**
 * Replaces the form once an enquiry is accepted.
 *
 * Wording note: "sent", not "delivered". Resend returning an id means the
 * message was accepted for delivery; what happens after that is not observable
 * from here, so the copy does not claim it.
 *
 * The confirmation line is the same rule applied again: it appears only when
 * the server actually got an id back for the confirmation email. Telling
 * someone to check their spam folder for a message that was never accepted
 * sends them looking for something that does not exist.
 */
export function FormSuccess({
  message,
  confirmationSent = false,
}: {
  message: string;
  confirmationSent?: boolean;
}) {
  return (
    <div
      className="border-border bg-card shadow-card flex flex-col items-center gap-4 rounded-2xl border p-10 text-center"
      role="status"
    >
      <span className="bg-success/10 text-success flex h-14 w-14 items-center justify-center rounded-full">
        <CheckCircle2 size={28} aria-hidden="true" />
      </span>
      <h3 className="font-heading text-foreground text-2xl font-semibold">Message sent</h3>
      <p className="text-muted max-w-md text-sm leading-relaxed">{message}</p>
      {confirmationSent && (
        <p className="text-muted max-w-md text-sm leading-relaxed">
          A confirmation is on its way to your inbox — check your spam folder if it has not arrived
          within a few minutes.
        </p>
      )}
      <p className="text-muted text-xs">
        Prefer email?{' '}
        <a
          href={`mailto:${contactChannels.email}`}
          className="text-primary focus-visible:ring-ring rounded underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
        >
          {contactChannels.email}
        </a>
      </p>
    </div>
  );
}
