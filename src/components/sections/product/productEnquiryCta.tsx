'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils/cn';

interface ProductEnquiryCtaProps {
  slug: string;
  name: string;
  /** When false the CTA asks for early access rather than offering a demo. */
  demoAvailable: boolean;
  variant?: 'primary' | 'surface';
  className?: string;
}

/**
 * The single enquiry route for a product.
 *
 * It hands off to the existing Contact page rather than introducing a second
 * contact system: the intent, the product name and the kind of interest travel
 * as query parameters, and the Contact page turns them into a pre-filled —
 * and editable — opening line.
 *
 * Nothing personal is carried. The parameters say which product was being
 * looked at, and that is all.
 */
export function ProductEnquiryCta({
  slug,
  name,
  demoAvailable,
  variant = 'primary',
  className,
}: ProductEnquiryCtaProps) {
  // The label is driven by whether a demo can actually be given. Offering one
  // that does not exist is the quickest way to lose the enquiry you just won.
  const label = demoAvailable ? 'Book a Demo' : 'Request Early Access';
  const interest = demoAvailable ? 'Demo' : 'Early access';

  const href = `/contact?intent=project&product=${encodeURIComponent(name)}&interest=${encodeURIComponent(interest)}&ref=${encodeURIComponent(slug)}`;

  return (
    <Link
      href={href}
      onClick={() =>
        trackEvent('saas_demo_request_click', { product: slug, demo_available: demoAvailable })
      }
      className={cn(
        'focus-visible:ring-ring inline-flex h-11 items-center gap-2 rounded-lg px-6 text-sm font-medium transition-[filter] focus-visible:ring-2 focus-visible:outline-none',
        variant === 'primary'
          ? 'bg-gradient-secondary text-on-accent hover:brightness-110'
          : 'border-border bg-gradient-surface text-foreground hover:bg-card border transition-colors',
        className,
      )}
    >
      {label}
      <ArrowUpRight size={16} aria-hidden="true" />
    </Link>
  );
}
