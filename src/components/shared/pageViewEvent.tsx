'use client';

import { useEffect, useRef } from 'react';
import { trackEvent, type AnalyticsEvent } from '@/lib/analytics';

/**
 * Fires a named view event once per mount.
 *
 * GA4 already records its own `page_view`; this is the explicitly-requested
 * named event sitting alongside it, not a replacement. The ref guard stops it
 * firing twice under React Strict Mode in development.
 */
export function PageViewEvent({ event }: { event: AnalyticsEvent }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEvent(event);
  }, [event]);

  return null;
}
