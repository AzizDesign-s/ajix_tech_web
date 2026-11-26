'use client';

import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

/**
 * The CTA at the foot of a project page.
 *
 * A client component purely so the click can be reported with the project it
 * came from — which is the whole point of tracking it separately from the
 * site-wide CTA.
 */
export function ProjectContactCta({ slug, label }: { slug: string; label: string }) {
  return (
    <Link
      href={`/contact?intent=project&ref=${encodeURIComponent(slug)}`}
      onClick={() => trackEvent('project_contact_click', { project: slug })}
      className="border-border bg-gradient-surface text-foreground hover:bg-card focus-visible:ring-ring inline-flex h-10 items-center rounded-lg border px-5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      {label}
    </Link>
  );
}
