'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

/**
 * Fires projects_page_view once per mount.
 *
 * Its own component so the page itself can stay a Server Component — a
 * useEffect in the page would have forced the whole route to the client.
 */
export function WorkPageView({ projectCount }: { projectCount: number }) {
  useEffect(() => {
    trackEvent('projects_page_view', { project_count: projectCount });
  }, [projectCount]);

  return null;
}
