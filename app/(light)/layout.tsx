import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar/navbar';
import { Footer } from '@/components/layout/Footer/footer';

// Light surface routes: /contact.
//
// data-theme="light" re-declares the colour tokens for this subtree (see
// app/globals.css). Because Tailwind v4 compiles token utilities as
// `var(--color-*)` references rather than baked values, every existing
// component underneath — Button, SectionHeader, AvailabilityBadge, CTASection —
// renders in the light palette without any change to the components themselves.
export default function LightLayout({ children }: { children: ReactNode }) {
  return (
    <div data-theme="light" className="bg-background text-foreground min-h-dvh">
      <Navbar theme="light" />
      <main id="main-content">{children}</main>
      <Footer theme="light" />
    </div>
  );
}
