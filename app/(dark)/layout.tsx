import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar/navbar';
import { Footer } from '@/components/layout/Footer/footer';

// Dark surface routes: /, /about, /projects.
// The route group name in parentheses does not appear in any URL.
//
// Navbar and Footer live here rather than in the root layout so each group can
// render them in its own theme. Both groups share the root layout, so moving
// between a dark page and the light Contact page is still a client-side
// navigation — no full reload, no flash.
export default function DarkLayout({ children }: { children: ReactNode }) {
  return (
    <div data-theme="dark" className="bg-background text-foreground min-h-dvh">
      <Navbar theme="dark" />
      <main id="main-content">{children}</main>
      <Footer theme="dark" />
    </div>
  );
}
