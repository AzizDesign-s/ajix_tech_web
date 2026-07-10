'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { AvailabilityBadge } from '@/components/shared/availabilityBadge';
import { LanguageToggle } from '@/components/shared/languageToggle';
import { navLinks, siteConfig } from '@/config/site';
import { cn } from '@/lib/utils/cn';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Adds a shadow once the user scrolls, so the floating navbar
  // visually separates from the content behind it.
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevents the page from scrolling behind the open mobile drawer.
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        aria-label="Primary navigation"
        className={cn(
          'border-border bg-gradient-nav fixed inset-x-0 top-4 z-50 mx-auto flex w-[calc(100%-32px)] max-w-4xl items-center justify-between rounded-full border px-4 py-3 backdrop-blur-lg transition-shadow duration-300 md:top-6 md:px-10',
          isScrolled && 'shadow-card',
        )}
      >
        <Logo />

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/60 hover:text-foreground focus-visible:ring-ring text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden items-center gap-3 lg:flex">
          <AvailabilityBadge />
          <LanguageToggle />
          {siteConfig.resumeUrl && (
            <Button variant="primary" size="sm">
              <a href={siteConfig.resumeUrl} target="_blank" rel="noopener noreferrer">
                Get Resume
              </a>
            </Button>
          )}
        </div>

        {/* Mobile hamburger trigger */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="border-border flex h-10 w-10 items-center justify-center rounded-full border lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
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
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-background/80 fixed inset-0 z-60 backdrop-blur-sm lg:hidden"
            />

            {/* Slide-in panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              className="border-border bg-background fixed inset-y-0 right-0 z-70 flex w-[80%] max-w-sm flex-col gap-10 border-l p-6 lg:hidden"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="border-border flex h-10 w-10 items-center justify-center rounded-full border"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-foreground hover:text-primary border-b-border border-b pb-4 text-lg font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-4">
                <AvailabilityBadge />
                <div className="flex items-center gap-3">
                  <LanguageToggle />
                  {siteConfig.resumeUrl && (
                    <Button
                      variant="gradient"
                      size="sm"

                      className="flex-1"
                    >
                      <a href={siteConfig.resumeUrl} target="_blank" rel="noopener noreferrer">
                        Get Resume
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
