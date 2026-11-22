'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ResumeButton } from '@/components/shared/resumeButton';
import { AvailabilityBadge } from '@/components/shared/availabilityBadge';
import { navLinks } from '@/config/site';
import type { SiteTheme } from '@/types/theme';
import { cn } from '@/lib/utils/cn';

const MOBILE_MENU_ID = 'mobile-navigation-drawer';

const LOGO_SRC: Record<SiteTheme, string> = {
  dark: '/logo/ajix-full-dark.svg',
  light: '/logo/ajix-full-light.svg',
};

export function Navbar({ theme = 'dark' }: { theme?: SiteTheme }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const logo = LOGO_SRC[theme];

  // Adds a shadow once the user scrolls, so the floating navbar
  // visually separates from the content behind it.
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    // passive: this listener never calls preventDefault, and saying so lets the
    // browser scroll without waiting on it.
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevents the page from scrolling behind the open mobile drawer.
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const closeMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    // Send focus back where it came from, so a keyboard user does not get
    // dumped at the top of the document after closing the drawer.
    triggerRef.current?.focus();
  }, []);

  // Move focus into the drawer when it opens, keep Tab inside it while it is
  // open, and close it on Escape. Without this, focus stayed on <body> and
  // tabbing walked through the page behind the panel.
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    const focusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);

    focusables()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, closeMenu]);

  return (
    <>
      <header
        className={cn(
          'border-border bg-gradient-nav fixed inset-x-0 top-4 z-50 mx-auto flex w-[calc(100%-32px)] max-w-4xl items-center justify-between rounded-full border px-4 py-3 backdrop-blur-lg transition-shadow duration-300 md:top-6 md:px-10',
          isScrolled && 'shadow-card',
        )}
      >
        <Link href="/" aria-label="AJIX — Home" className={cn('inline-flex')}>
          <Image src={logo} alt="AJIX" width={34} height={30} preload className="h-auto w-32" />
        </Link>
        {/* Desktop nav links */}
        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/60 hover:text-foreground focus-visible:ring-ring rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden items-center gap-3 lg:flex">
          <AvailabilityBadge />
          <ResumeButton variant="primary" size="sm">
            Get Resume
          </ResumeButton>
        </div>

        {/* Mobile hamburger trigger */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="border-border focus-visible:ring-ring flex h-10 w-10 items-center justify-center rounded-full border focus-visible:ring-2 focus-visible:outline-none lg:hidden"
          aria-label="Open menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls={MOBILE_MENU_ID}
        >
          <Menu size={20} aria-hidden="true" />
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              aria-hidden="true"
              className="bg-background/80 fixed inset-0 z-60 backdrop-blur-sm lg:hidden"
            />

            {/* Slide-in panel */}
            <motion.div
              ref={panelRef}
              id={MOBILE_MENU_ID}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              className="border-border bg-background fixed inset-y-0 right-0 z-70 flex w-[80%] max-w-sm flex-col gap-10 border-l p-6 lg:hidden"
            >
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  aria-label="AJIX — Home"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn('inline-flex')}
                >
                  <Image src={logo} alt="AJIX" width={34} height={30} className="h-auto w-32" />
                </Link>

                <button
                  type="button"
                  onClick={closeMenu}
                  className="border-border focus-visible:ring-ring flex h-10 w-10 items-center justify-center rounded-full border focus-visible:ring-2 focus-visible:outline-none"
                  aria-label="Close menu"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              <nav aria-label="Mobile" className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-foreground hover:text-primary focus-visible:ring-ring border-b-border rounded-md border-b pb-4 text-lg font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-4">
                <AvailabilityBadge />
                <div className="flex items-center gap-3">
                  <ResumeButton variant="gradient" size="sm" className="flex-1">
                    Get Resume
                  </ResumeButton>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
