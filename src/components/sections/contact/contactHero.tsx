import type { CSSProperties } from 'react';
import { ArrowUpRight, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Magnetic } from '@/components/shared/magnetic';
import { GlowBadge } from '@/components/shared/glowBadge';
import { GradientText } from '@/components/shared/gradientText';
import { getCurrentAvailability, availabilityDotColor } from '@/config/availability';
import { contactChannels } from '@/config/contact';
import { cn } from '@/lib/utils/cn';
import { AiraCharacter } from '@/components/sections/contact/airaCharacter';
import { FloatingCard } from '@/components/sections/contact/floatingCard';
import { ConnectorLines } from '@/components/sections/contact/connectorLines';
import { PointerParallax } from '@/components/sections/contact/pointerParallax';

// Same stagger the dark heroes use (100ms + 120ms per item), as CSS rather than
// a Framer sequence so the h1 is present and painted in the server HTML.
const reveal = (index: number) => ({ '--reveal-delay': `${100 + index * 120}ms` }) as CSSProperties;

export function ContactHero() {
  const availability = getCurrentAvailability();
  const hasBooking = Boolean(contactChannels.bookingUrl);

  return (
    <section className="relative w-full overflow-hidden px-6 pt-32 pb-16 md:px-10 lg:pt-36 lg:pb-12">
      {/* Ambient light. Layered radial gradients rather than blurred SVG —
          same bloom, a fraction of the paint cost. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-18%] left-1/2 h-[720px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.10),rgba(37,99,235,0.05)_45%,transparent_70%)]" />
        <div className="absolute top-[22%] left-[6%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.10),transparent_68%)]" />
        <div className="absolute top-[30%] right-[4%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.09),transparent_68%)]" />
      </div>

      <PointerParallax className="mx-auto w-full max-w-7xl" strength={16}>
        <ConnectorLines />

        <div className="relative flex flex-col items-center lg:block lg:min-h-[700px]">
          {/* Copy sits above everything and comes first in the DOM, so the
              heading is the first thing read and the first thing painted. */}
          <div className="relative z-20 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <div className="hero-reveal" style={reveal(0)}>
              <GlowBadge>Let&apos;s Connect</GlowBadge>
            </div>

            <h1
              className="font-heading text-foreground hero-reveal text-4xl leading-[1.08] font-bold text-balance md:text-6xl lg:text-7xl"
              style={reveal(1)}
            >
              Great things begin with a <GradientText>conversation.</GradientText>
            </h1>

            <p
              className="text-muted hero-reveal max-w-xl text-base leading-relaxed text-pretty md:text-lg"
              style={reveal(2)}
            >
              Whether you&apos;re hiring, building a product, or exploring a collaboration, I&apos;d
              love to hear what you have in mind.
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
                  icon={<ArrowUpRight size={16} aria-hidden="true" />}
                >
                  Start a Conversation
                </Button>
              </Magnetic>
              <Magnetic>
                {/* Falls back to the channels section while no booking link is
                    configured, so this never points at a dead destination. */}
                <Button
                  variant="surface"
                  size="lg"
                  href={hasBooking ? contactChannels.bookingUrl : '#contact-channels'}
                  target={hasBooking ? '_blank' : undefined}
                  rel={hasBooking ? 'noopener noreferrer' : undefined}
                  icon={<CalendarDays size={16} aria-hidden="true" />}
                >
                  Book a Meeting
                </Button>
              </Magnetic>
            </div>
          </div>

          {/* AIRA: in normal flow on mobile, behind the composition on desktop. */}
          <div
            className={cn(
              'pointer-events-none relative z-0 mt-10 h-60 w-full max-w-[240px] select-none',
              'lg:absolute lg:inset-x-0 lg:-bottom-6 lg:mx-auto lg:mt-0 lg:h-[520px] lg:max-w-[400px]',
            )}
          >
            <AiraCharacter className="h-full w-full" />
          </div>

          {/* Cards: a clean grid on mobile, an orbiting composition on desktop.
              Nothing is hidden at any width — it only rearranges. */}
          {/* lg:static is load-bearing: without it this wrapper becomes the
              containing block for the absolutely-positioned cards, and their
              percentage offsets resolve against its own small height instead of
              the composition — which stacks them on top of each other. */}
          <div className="relative z-20 mt-12 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:static lg:mt-0 lg:block lg:gap-0">
            <FloatingCard
              title="Looking for a product designer?"
              description="Let's discuss your team and the opportunity."
              position="lg:absolute lg:top-[33%] lg:left-0 lg:w-60 xl:w-68"
              depth={1.25}
              floatDuration="7s"
              floatDelay="0s"
              floatDistance="-14px"
              revealDelay="620ms"
            />
            <FloatingCard
              title="Have a product in mind?"
              description="Let's turn your idea into an experience."
              position="lg:absolute lg:top-[25%] lg:right-0 lg:w-60 xl:w-68"
              depth={0.75}
              floatDuration="8.5s"
              floatDelay="-2s"
              floatDistance="-10px"
              revealDelay="740ms"
            />
            <FloatingCard
              title="Let's build together."
              description="Open to meaningful creative partnerships."
              position="lg:absolute lg:top-[72%] lg:left-[4%] lg:w-60 xl:w-68"
              depth={1.6}
              floatDuration="9.5s"
              floatDelay="-4s"
              floatDistance="-16px"
              revealDelay="860ms"
            />
            <FloatingCard
              // Driven by getCurrentAvailability() — the same single source of
              // truth as the navbar, drawer and footer. Never hardcoded twice.
              title={availability.label}
              description="Based in Dubai, UAE."
              badge={
                <span
                  aria-hidden="true"
                  className={cn(
                    'h-2 w-2 shrink-0 rounded-full',
                    availabilityDotColor[availability.level],
                  )}
                />
              }
              position="lg:absolute lg:top-[66%] lg:right-[4%] lg:w-60 xl:w-68"
              depth={1.1}
              floatDuration="8s"
              floatDelay="-6s"
              floatDistance="-12px"
              revealDelay="980ms"
            />
          </div>
        </div>
      </PointerParallax>
    </section>
  );
}
