import Link from 'next/link';

import { FaGithub, FaLinkedin, FaInstagram, FaBehance } from 'react-icons/fa6';
import { Logo } from '@/components/shared/logo';
import { AvailabilityBadge } from '@/components/shared/availabilityBadge';
import { SocialLink } from '@/components/ui/socialLink';
import { FooterWordmark } from '@/components/layout/Footer/footerWordmark';
import { FooterGrid } from '@/components/layout/Footer/footerGrid';
import { BackToTop } from '@/components/layout/Footer/backToTop';
import { siteConfig, navLinks, socials } from '@/config/site';
import type { SiteTheme } from '@/types/theme';

export function Footer({ theme = 'dark' }: { theme?: SiteTheme }) {
  // Evaluated on the server at build time. Previously this ran in a Client
  // Component on a statically prerendered page, which could disagree with the
  // prerendered HTML across a year boundary and warn about a hydration mismatch.
  const year = new Date().getFullYear();

  return (
    <footer className="border-border bg-background relative overflow-hidden border-t">
      <FooterGrid theme={theme} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 md:px-10">
        {/* Top row — logo, nav, availability, socials */}
        <div className="border-border/60 flex flex-col items-center gap-8 border-b pb-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <Logo theme={theme} />
            <nav aria-label="Footer">
              <ul className="flex flex-wrap items-center justify-center gap-6">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      // min-h-11 keeps the hit area at/above the 24px WCAG 2.5.8
                      // minimum (and near the 44px comfort target) without
                      // changing how the label looks.
                      className="text-foreground/70 hover:text-primary focus-visible:ring-ring -mx-2 flex min-h-11 items-center rounded-md px-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <AvailabilityBadge />
            <div className="flex items-center gap-3">
              <SocialLink href={socials.linkedin} label="LinkedIn">
                <FaLinkedin size={16} />
              </SocialLink>
              <SocialLink href={socials.behance} label="Behance">
                <FaBehance size={16} />
              </SocialLink>
              <SocialLink href={socials.instagram} label="Instagram">
                <FaInstagram size={16} />
              </SocialLink>
              <SocialLink href={socials.github} label="GitHub">
                <FaGithub size={16} />
              </SocialLink>
            </div>
          </div>
        </div>

        {/* Giant reveal wordmark */}
        <FooterWordmark theme={theme} />

        {/* Bottom row — copyright + back to top */}
        <div className="flex flex-col items-center gap-4 pt-4 text-center md:flex-row md:justify-between md:text-left">
          <p className="text-muted text-sm">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
