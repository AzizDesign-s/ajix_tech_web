'use client';

import { ArrowUp } from 'lucide-react';

// The only interactive part of the footer. Isolated into its own client
// component so the rest of the footer — logo, nav, availability, socials,
// wordmark, grid — can stay a Server Component and out of the JS bundle.
export function BackToTop() {
  function scrollToTop() {
    // Honour the user's motion preference: `scroll-behavior: auto !important`
    // in globals.css cannot override an explicit behavior passed here.
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="text-foreground/70 focus-visible:ring-ring hover:text-foreground -mx-2 flex min-h-11 items-center gap-2 rounded-md px-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      Back to top
      <ArrowUp size={14} aria-hidden="true" />
    </button>
  );
}
