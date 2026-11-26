import { CalendarDays, Clock } from 'lucide-react';
import { TrackedLink } from '@/components/shared/trackedLink';
import { SideCard } from '@/components/sections/contact/sideCard';
import { contactChannels, meetingTypes } from '@/config/contact';

/**
 * Booking.
 *
 * The card never hides itself, unlike the direct channels — because it has a
 * working fallback. With no scheduling link configured, each call type opens
 * an email already carrying the right subject line. That is a slower path to
 * the same outcome, which beats removing the option entirely: someone who
 * wants a call should always be able to ask for one.
 *
 * The timezone note is there because every booking tool shows times in the
 * visitor's own zone, and people routinely assume otherwise and turn up an
 * hour out.
 */
export function BookingCard() {
  const hasBooking = Boolean(contactChannels.bookingUrl);

  return (
    <SideCard
      eyebrow="Book a meeting"
      title="Rather talk it through?"
      badge={
        <span className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
          <CalendarDays size={15} aria-hidden="true" />
        </span>
      }
    >
      <p className="text-muted text-sm leading-relaxed">
        {hasBooking
          ? 'Pick a slot that suits you. Times are shown in your own timezone, and you will get a calendar invite with a video link straight away.'
          : 'Tell me which kind of call you want and I will send times that work. I am in Gulf Standard Time (GMT+4).'}
      </p>

      <ul className="mt-4 flex flex-col gap-2.5">
        {meetingTypes.map((meeting) => {
          const href = hasBooking
            ? contactChannels.bookingUrl
            : `mailto:${contactChannels.email}?subject=${encodeURIComponent(meeting.subject)}`;

          return (
            <li key={meeting.id}>
              <TrackedLink
                href={href}
                event="contact_booking_click"
                eventParams={{ meeting: meeting.id, mode: hasBooking ? 'scheduler' : 'email' }}
                external={hasBooking}
                className="border-border/70 bg-background/40 hover:border-primary/50 focus-visible:ring-ring block rounded-xl border p-3.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="text-foreground text-sm font-semibold">{meeting.title}</span>
                  <span className="border-border text-muted flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] leading-none">
                    <Clock size={10} aria-hidden="true" />
                    {meeting.minutes} min
                  </span>
                </span>
                <span className="text-muted mt-1.5 block text-xs leading-relaxed">
                  {meeting.description}
                </span>
              </TrackedLink>
            </li>
          );
        })}
      </ul>

      {!hasBooking && (
        <p className="text-muted mt-4 text-xs leading-relaxed">
          Online scheduling is not set up yet — for now, picking a call type opens an email with the
          right subject line already filled in.
        </p>
      )}
    </SideCard>
  );
}
