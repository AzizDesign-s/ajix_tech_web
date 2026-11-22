import { Mail, MessageCircle, CalendarDays, FileText } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa6';
import { SectionHeader } from '@/components/shared/sectionHeader';
import { TrackedLink } from '@/components/shared/trackedLink';
import { ResumeButton } from '@/components/shared/resumeButton';
import { ChannelCard } from '@/components/sections/contact/channelCard';
import { EmailChannelAction } from '@/components/sections/contact/emailChannel';
import { contactChannels, whatsappHref } from '@/config/contact';

const linkClasses =
  'text-primary focus-visible:ring-ring inline-flex min-h-9 items-center rounded text-sm font-medium underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none';

/**
 * Direct channels, as an alternative to the form.
 *
 * Every card here is conditional on its configuration being present. An
 * unconfigured channel renders nothing at all rather than a button that goes
 * nowhere — a dead contact link costs more trust than a missing one.
 */
export function ContactChannels() {
  const hasWhatsApp = Boolean(whatsappHref);
  const hasBooking = Boolean(contactChannels.bookingUrl);

  return (
    <div className="flex w-full flex-col gap-10">
      <SectionHeader
        eyebrow="Direct channels"
        title="Or reach me another way"
        description="Prefer not to use a form? Any of these reaches me just as quickly."
        align="center"
      />

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ChannelCard
          icon={<Mail size={18} aria-hidden="true" />}
          title="Email"
          description="The surest way to reach me. I read everything."
          action={<EmailChannelAction />}
        />

        {hasWhatsApp && (
          <ChannelCard
            icon={<MessageCircle size={18} aria-hidden="true" />}
            title="WhatsApp"
            description="For something quick, or if you're in the region."
            action={
              <TrackedLink
                href={whatsappHref}
                event="contact_whatsapp_click"
                className={linkClasses}
              >
                Start a chat
              </TrackedLink>
            }
          />
        )}

        <ChannelCard
          icon={<FaLinkedin size={18} aria-hidden="true" />}
          title="LinkedIn"
          description="Connect professionally, or check my background first."
          action={
            <TrackedLink
              href={contactChannels.linkedin}
              event="contact_linkedin_click"
              className={linkClasses}
            >
              View profile
            </TrackedLink>
          }
        />

        {hasBooking && (
          <ChannelCard
            icon={<CalendarDays size={18} aria-hidden="true" />}
            title={`Book a ${contactChannels.bookingDuration} call`}
            description={contactChannels.timezoneNote}
            action={
              <TrackedLink
                href={contactChannels.bookingUrl}
                event="contact_booking_click"
                className={linkClasses}
              >
                Pick a time
              </TrackedLink>
            }
          />
        )}

        <ChannelCard
          icon={<FileText size={18} aria-hidden="true" />}
          title="Résumé"
          description="The short version of everything, for recruiters in a hurry."
          action={
            <ResumeButton variant="surface" size="sm">
              Download résumé
            </ResumeButton>
          }
        />
      </div>

      {!hasBooking &&
        // Visible only to you in development — a reminder, not something a
        // visitor ever sees in production.
        process.env.NODE_ENV === 'development' && (
          <p className="text-muted mx-auto max-w-xl text-center text-xs">
            Booking card hidden: set <code>NEXT_PUBLIC_BOOKING_URL</code> to show it.
          </p>
        )}
    </div>
  );
}
