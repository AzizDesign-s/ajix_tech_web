'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

/** Fires case_study_view once, so the page itself stays a Server Component. */
export function CaseStudyView({ slug, projectType }: { slug: string; projectType?: string }) {
  useEffect(() => {
    trackEvent('case_study_view', { project: slug, project_type: projectType });
  }, [slug, projectType]);

  return null;
}
