import type { CSSProperties } from 'react';
import { ArrowDown, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Magnetic } from '@/components/shared/magnetic';
import { GradientText } from '@/components/shared/gradientText';
import { StatCard } from '@/components/ui/statCard';
import { OrbitVisual } from '@/components/sections/home/hero/orbitVisual';
import { availabilityDotColor, availabilityResponseShort } from '@/config/availability';
import { getSiteSettings } from '@/lib/services/siteSettings';
import { contactChannels } from '@/config/contact';
import { HeroLocalTime } from '@/components/sections/contact/heroLocalTime';
import { PointerParallax } from '@/components/sections/contact/pointerParallax';

// Same stagger the dark heroes use (100ms + 120ms per item), as CSS rather than
// a Framer sequence so the h1 is present and painted in the server HTML.
const reveal = (index: number) => ({ '--reveal-delay': `${100 + index * 120}ms` }) as CSSProperties;

/**
 * Contact hero.
 *
 * Rebuilt around the orbit composition the homepage already uses, rather than
 * the AIRA placeholder and four floating cards that were here before. The old
 * version asked the visitor to read four cards before reaching the form; this
 * one states availability once, in a badge, and gets out of the way.
 *
 * The AIRA components are left in the repository untouched — this is a layout
 * decision, not a product one, and putting her back is an import away.
 *
 * Two live values sit in the stat cards: the response time, read from the
 * availability switch, and Dubai local time. Both exist for the same reason —
 * someone deciding whether to write to you wants to know when they will hear
 * back, and timezone arithmetic is a small friction worth removing.
 */
export async function ContactHero() {
  const { availability } = await getSiteSettings();
  const hasBooking = Boolean(contactChannels.bookingUrl);

  return (
    <section className="relative w-full overflow-hidden px-6 pt-32 pb-12 md:px-10 lg:pt-36">
      {/* Ambient light. Layered radial gradients rather than blurred SVG —
          same bloom, a fraction of the paint cost. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-18%] left-1/2 h-[720px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.10),rgba(37,99,235,0.05)_45%,transparent_70%)]" />
        <div className="absolute top-[22%] left-[6%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.10),transparent_68%)]" />
        <div className="absolute top-[30%] right-[4%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.09),transparent_68%)]" />
      </div>

      <PointerParallax className="relative mx-auto w-full max-w-6xl" strength={12}>
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="hero-reveal" style={reveal(0)}>
            <span className="border-border bg-card/70 text-foreground inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <span
                aria-hidden="true"
                className={`h-2 w-2 shrink-0 rounded-full ${availabilityDotColor[availability.level]}`}
              />
              {availability.label}
              <span className="text-muted" aria-hidden="true">
                ·
              </span>
              <span className="text-muted">Dubai, UAE</span>
            </span>
          </div>

          <h1
            className="font-heading text-foreground hero-reveal max-w-3xl text-4xl leading-[1.08] font-bold text-balance md:text-6xl lg:text-7xl"
            style={reveal(1)}
          >
            Great things begin with a <GradientText>conversation.</GradientText>
          </h1>

          <p
            className="text-muted hero-reveal max-w-xl text-base leading-relaxed text-pretty md:text-lg"
            style={reveal(2)}
          >
            Whether you&apos;re hiring, scoping a product, or want a second opinion on an interface
            — tell me what you&apos;re working on. Every message reaches me directly, and I reply to
            all of them.
          </p>

          <div
            className="hero-reveal flex flex-wrap items-center justify-center gap-4"
            style={reveal(3)}
          >
            <Magnetic>
              <Button
                variant="gradient"
                size="lg"
                href="#contact-form"
                icon={<ArrowDown size={16} aria-hidden="true" />}
              >
                Start the Conversation
              </Button>
            </Magnetic>
            <Magnetic>
              {/* Falls back to the booking card further down the page while no
                  scheduling link is configured, so this never points nowhere. */}
              <Button
                variant="surface"
                size="lg"
                href={hasBooking ? contactChannels.bookingUrl : '#contact-booking'}
                target={hasBooking ? '_blank' : undefined}
                rel={hasBooking ? 'noopener noreferrer' : undefined}
                icon={<CalendarDays size={16} aria-hidden="true" />}
              >
                Book a Call
              </Button>
            </Magnetic>
          </div>
        </div>

        {/* The composition. On mobile the stats sit under the orbit in normal
            flow; from lg they float either side of it. Nothing is hidden at
            any width — it only rearranges. */}
        {/* Narrower than the copy above it on purpose: at the full container
            width the stat cards sit so far from the orbit that the three read
            as separate objects rather than one composition. */}
        <div className="relative mx-auto mt-12 flex w-full max-w-4xl flex-col items-center lg:mt-4 lg:min-h-[440px] lg:justify-center">
          <OrbitVisual
            className="h-64 w-64 sm:h-80 sm:w-80 lg:h-[420px] lg:w-[420px]"
            ringClassName="border-primary/25"
          />

          <div className="mt-8 grid w-full max-w-md grid-cols-2 gap-4 lg:mt-0 lg:block lg:max-w-none">
            <StatCard
              value={availabilityResponseShort[availability.level]}
              label="Typical reply time"
              delay={0.6}
              className="lg:absolute lg:top-[22%] lg:left-0"
            />
            <StatCard
              value={<HeroLocalTime />}
              label="Local time in Dubai"
              delay={0.75}
              className="lg:absolute lg:right-0 lg:bottom-[18%]"
            />
          </div>
        </div>
      </PointerParallax>
    </section>
  );
}
