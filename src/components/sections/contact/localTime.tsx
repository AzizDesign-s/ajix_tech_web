'use client';

import { useSyncExternalStore } from 'react';
import { Clock } from 'lucide-react';
import {
  subscribeToDubaiClock,
  getDubaiClockSnapshot,
  getDubaiClockServerSnapshot,
  parseDubaiClock,
} from '@/lib/dubaiTime';

/**
 * Dubai wall-clock time, live.
 *
 * Small thing, disproportionate effect: a recruiter in London deciding whether
 * to expect a reply tonight gets the answer without doing timezone arithmetic.
 *
 * Renders nothing on the server. The time genuinely is not knowable there —
 * rendering a guess would either mismatch on hydration or show a stale value
 * from build time, and a wrong clock is worse than no clock.
 */
export function LocalTime({ showIcon = true }: { showIcon?: boolean }) {
  const snapshot = useSyncExternalStore(
    subscribeToDubaiClock,
    getDubaiClockSnapshot,
    getDubaiClockServerSnapshot,
  );
  const clock = parseDubaiClock(snapshot);

  if (!clock) {
    // Reserves the line so nothing shifts when the value arrives.
    return <span aria-hidden="true" className="inline-block h-5 w-24" />;
  }

  return (
    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {showIcon && <Clock size={14} aria-hidden="true" className="text-muted shrink-0" />}
      <span className="text-foreground text-sm font-medium tabular-nums">
        {clock.weekday} {clock.time}
      </span>
      {!clock.withinWorkingHours && (
        <span className="border-border text-muted rounded-full border px-2 py-0.5 text-[11px] leading-none">
          Outside hours
        </span>
      )}
      <span className="sr-only">
        {clock.withinWorkingHours
          ? 'Currently within working hours in Dubai.'
          : 'Currently outside working hours in Dubai.'}
      </span>
    </span>
  );
}
