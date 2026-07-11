'use client';

import Link from 'next/link';

import { ArrowUp } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram, FaBehance } from 'react-icons/fa6';
import { Logo } from '@/components/shared/logo';
import { AvailabilityBadge } from '@/components/shared/availabilityBadge';
import { SocialLink } from '@/components/ui/socialLink';
import { FooterWordmark } from '@/components/layout/Footer/footerWordmark';
import { FooterGrid } from '@/components/layout/Footer/footerGrid';
import { siteConfig, navLinks, socials } from '@/config/site';

export function Footer() {
  const year = new Date().getFullYear();

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="border-border relative overflow-hidden border-t">
      <FooterGrid />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 md:px-10">
        {/* Top row — logo, nav, availability, socials */}
        <div className="border-border/60 flex flex-col items-center gap-8 border-b pb-4 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap items-center justify-center gap-8">
            <li>
              <Logo />
            </li>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-foreground/70 hover:text-primary focus-visible:ring-primary rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

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
        <FooterWordmark />

        {/* Bottom row — copyright + back to top */}
        <div className="flex flex-col items-center gap-4 pt-4 text-center md:flex-row md:justify-between md:text-left">
          <p className="text-muted text-sm">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="text-foreground/70 focus-visible:ring-primary hover:text-foreground flex items-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
            aria-label="Scroll back to top"
          >
            Back to top
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
