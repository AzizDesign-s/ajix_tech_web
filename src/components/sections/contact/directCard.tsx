import { Mail, MessageCircle, Phone } from 'lucide-react';
import { FaLinkedin, FaBehance, FaGithub, FaInstagram } from 'react-icons/fa6';
import { SocialLink } from '@/components/ui/socialLink';
import { ResumeButton } from '@/components/shared/resumeButton';
import { TrackedLink } from '@/components/shared/trackedLink';
import { EmailChannelAction } from '@/components/sections/contact/emailChannel';
import { SideCard, CardDivider } from '@/components/sections/contact/sideCard';
import { contactChannels, whatsappHref, phoneHref, formatPhone } from '@/config/contact';
import { socials } from '@/config/site';

/**
 * The alternatives to the form.
 *
 * Every row here is conditional on its own configuration. An unconfigured
 * channel renders nothing at all rather than a control that goes nowhere — a
 * dead contact link costs more trust than a missing one, and on a page whose
 * entire job is being reachable, that cost is high.
 */
export function DirectCard() {
  const hasWhatsApp = Boolean(whatsappHref);
  const hasPhone = Boolean(phoneHref);

  return (
    <SideCard eyebrow="Direct" title="Prefer to reach out yourself?">
      <ul className="flex flex-col gap-3">
        <li className="border-border/70 bg-background/40 flex flex-col gap-2 rounded-xl border p-3">
          <span className="text-muted flex items-center gap-2 text-xs font-medium">
            <Mail size={13} aria-hidden="true" />
            Email
          </span>
          <EmailChannelAction />
        </li>

        {hasWhatsApp && (
          <li className="border-border/70 bg-background/40 rounded-xl border p-3">
            <TrackedLink
              href={whatsappHref}
              event="contact_whatsapp_click"
              className="focus-visible:ring-ring group flex items-center justify-between gap-3 rounded focus-visible:ring-2 focus-visible:outline-none"
            >
              <span className="flex items-center gap-2.5">
                <span className="bg-success/10 text-success flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                  <MessageCircle size={15} aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="text-foreground text-sm font-medium">WhatsApp</span>
                  <span className="text-muted text-xs">Quickest for a short question</span>
                </span>
              </span>
              <span className="text-primary shrink-0 text-sm font-medium">Chat &rarr;</span>
            </TrackedLink>
          </li>
        )}

        {hasPhone && (
          <li className="border-border/70 bg-background/40 rounded-xl border p-3">
            <a
              href={phoneHref}
              className="focus-visible:ring-ring flex items-center justify-between gap-3 rounded focus-visible:ring-2 focus-visible:outline-none"
            >
              <span className="flex items-center gap-2.5">
                <span className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                  <Phone size={15} aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="text-foreground text-sm font-medium">
                    {formatPhone(contactChannels.phone)}
                  </span>
                  <span className="text-muted text-xs">During Dubai working hours</span>
                </span>
              </span>
              <span className="text-primary shrink-0 text-sm font-medium">Call &rarr;</span>
            </a>
          </li>
        )}
      </ul>

      <CardDivider />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ul className="flex items-center gap-2">
          <li>
            <SocialLink href={socials.linkedin} label="LinkedIn">
              <FaLinkedin size={16} aria-hidden="true" />
            </SocialLink>
          </li>
          <li>
            <SocialLink href={socials.behance} label="Behance">
              <FaBehance size={16} aria-hidden="true" />
            </SocialLink>
          </li>
          <li>
            <SocialLink href={socials.github} label="GitHub">
              <FaGithub size={16} aria-hidden="true" />
            </SocialLink>
          </li>
          <li>
            <SocialLink href={socials.instagram} label="Instagram">
              <FaInstagram size={16} aria-hidden="true" />
            </SocialLink>
          </li>
        </ul>

        <ResumeButton variant="surface" size="sm">
          Résumé
        </ResumeButton>
      </div>
    </SideCard>
  );
}
