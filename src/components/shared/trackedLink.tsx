'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { trackEvent, type AnalyticsEvent } from '@/lib/analytics';

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  event: AnalyticsEvent;
  eventParams?: Record<string, string | number | boolean | undefined>;
  external?: boolean;
  children: ReactNode;
}

/**
 * An external link that reports the click.
 *
 * Only ever pass non-identifying parameters — which channel, which intent.
 * Never an address, a name or message content.
 */
export function TrackedLink({
  href,
  event,
  eventParams,
  external = true,
  children,
  ...props
}: TrackedLinkProps) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onClick={() => trackEvent(event, eventParams)}
      {...props}
    >
      {children}
    </a>
  );
}
