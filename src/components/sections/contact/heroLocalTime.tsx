'use client';

import { useSyncExternalStore } from 'react';
import {
  subscribeToDubaiClock,
  getDubaiClockSnapshot,
  getDubaiClockServerSnapshot,
  parseDubaiClock,
} from '@/lib/dubaiTime';

/**
 * Just the time, for the hero stat card.
 *
 * A second presentation of the same store the availability card uses — not a
 * duplicate clock. Both subscribe to one interval, so adding this costs
 * nothing beyond the component itself.
 */
export function HeroLocalTime() {
  const snapshot = useSyncExternalStore(
    subscribeToDubaiClock,
    getDubaiClockSnapshot,
    getDubaiClockServerSnapshot,
  );
  const clock = parseDubaiClock(snapshot);

  // An em dash holds the line's height until the real value arrives, so the
  // card does not change size and shift the layout around it.
  return <span className="tabular-nums">{clock ? clock.time : '--:--'}</span>;
}
