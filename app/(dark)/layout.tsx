import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar/navbar';
import { Footer } from '@/components/layout/Footer/footer';
import { AvailabilityProvider } from '@/components/shared/availabilityProvider';
import { getSiteSettings } from '@/lib/services/siteSettings';

// Dark surface routes: /, /about, /projects.
// The route group name in parentheses does not appear in any URL.
//
// Navbar and Footer live here rather than in the root layout so each group can
// render them in its own theme. Both groups share the root layout, so moving
// between a dark page and the light Contact page is still a client-side
// navigation — no full reload, no flash.
//
// The availability state is read once here and handed to the client components
// that display it (navbar badge, mobile drawer, About flip card) through
// context, because those cannot await a Sanity read themselves.
export default async function DarkLayout({ children }: { children: ReactNode }) {
  const { availability } = await getSiteSettings();

  return (
    <div data-theme="dark" className="bg-background text-foreground min-h-dvh">
      <AvailabilityProvider value={availability}>
        <Navbar theme="dark" />
        <main id="main-content">{children}</main>
        <Footer theme="dark" />
      </AvailabilityProvider>
    </div>
  );
}
