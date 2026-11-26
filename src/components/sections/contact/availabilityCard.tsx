import { Check, MapPin, Globe } from 'lucide-react';
import type { AvailabilityState } from '@/types/contact';
import { availabilityDotColor, availabilityOpenTo } from '@/config/availability';
import { WORK_ARRANGEMENTS } from '@/config/contact';
import { SideCard, CardDivider, CardLabel } from '@/components/sections/contact/sideCard';
import { LocalTime } from '@/components/sections/contact/localTime';

/**
 * Availability, at a glance.
 *
 * Every value here is driven by the single availability switch — the one
 * managed in Sanity — so the page cannot claim to be open to full-time roles
 * while the navbar badge says otherwise. Change the switch, and the label,
 * description, what-I'm-open-to list and response time all move together.
 */
export function AvailabilityCard({ availability }: { availability: AvailabilityState }) {
  const openTo = availabilityOpenTo[availability.level] ?? [];
  const responseTime = availability.responseTime.replace(/^Typical response time:\s*/i, '');

  return (
    <SideCard
      eyebrow="Availability"
      title={availability.label}
      badge={
        <span
          className={`block h-2.5 w-2.5 rounded-full ${availabilityDotColor[availability.level]}`}
          aria-hidden="true"
        />
      }
    >
      <p className="text-muted text-sm leading-relaxed">{availability.description}</p>

      <CardDivider />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="text-muted flex items-center gap-1.5 text-xs font-medium">
            <MapPin size={13} aria-hidden="true" />
            Based in
          </p>
          <p className="text-foreground mt-1 text-sm font-medium">Dubai, UAE</p>
        </div>
        <div>
          <p className="text-muted text-xs font-medium">Local time</p>
          <p className="mt-1">
            <LocalTime showIcon={false} />
          </p>
        </div>
      </div>

      {openTo.length > 0 && (
        <>
          <CardDivider />
          <CardLabel>Currently open to</CardLabel>
          <ul className="flex flex-col gap-2">
            {openTo.map((item) => (
              <li key={item} className="text-foreground flex items-start gap-2.5 text-sm">
                <span className="bg-primary/10 text-primary mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full">
                  <Check size={11} strokeWidth={3} aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </>
      )}

      <CardDivider />

      <CardLabel>
        <span className="flex items-center gap-1.5">
          <Globe size={13} aria-hidden="true" />
          Work setup
        </span>
      </CardLabel>
      <ul className="flex flex-wrap gap-2">
        {WORK_ARRANGEMENTS.map((arrangement) => (
          <li
            key={arrangement}
            className="border-border text-foreground rounded-full border px-3 py-1 text-xs font-medium"
          >
            {arrangement === 'On-site' ? 'On-site in Dubai' : arrangement}
          </li>
        ))}
      </ul>

      <CardDivider />

      <p className="text-muted text-xs">
        Typical response time: <span className="text-foreground font-medium">{responseTime}</span>
      </p>
    </SideCard>
  );
}
