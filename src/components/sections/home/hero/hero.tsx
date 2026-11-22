import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { GridBackground } from '@/components/shared/gridBackground';
import { Spotlight } from '@/components/shared/spotlight';
import { GlowBadge } from '@/components/shared/glowBadge';
import { StatCard } from '@/components/ui/statCard';
import { OrbitVisual } from '@/components/sections/home/hero/orbitVisual';
import { Button } from '@/components/ui/button';
import { Magnetic } from '@/components/shared/magnetic';
import { ScrollIndicator } from '@/components/ui/scrollIndicator';

// Each item reveals one after another — badge, then heading, then paragraph,
// then buttons, then the orbit visual. Delays match the previous Framer Motion
// stagger (0.1s initial delay + 0.12s per child) exactly, but run as CSS so the
// hero is present in the server HTML and paints without waiting for hydration.
const reveal = (index: number) => ({ '--reveal-delay': `${100 + index * 120}ms` }) as CSSProperties;

export function Hero() {
  return (
    // min-h-dvh rather than min-h-screen: on mobile browsers 100vh ignores the
    // retracting URL bar, so the hero overflowed the visible area.
    <section className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden px-4">
      <GridBackground />

      <div className="pointer-events-none absolute inset-0 z-1">
        <Spotlight className="-top-40 -left-10 h-screen md:-top-20 md:-left-32" fill="white" />
        <Spotlight className="top-10 left-full h-[80vh] w-[50vw]" fill="cyan" />
        <Spotlight className="top-80 left-full h-[60vh] w-[20vw]" fill="white" />
        <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]" fill="blue" />
      </div>

      <div className="relative flex flex-col flex-wrap items-center justify-start gap-1 pt-40">
        <div className="z-10 flex flex-col flex-wrap items-center justify-start gap-6 px-4 text-center">
          <div className="hero-reveal" style={reveal(0)}>
            <GlowBadge>Enterprise UI/UX Designer · Dubai, UAE</GlowBadge>
          </div>

          <h1
            className="font-heading text-foreground hero-reveal max-w-3xl text-3xl font-bold sm:text-4xl md:text-6xl"
            style={reveal(1)}
          >
            Designing Enterprise Digital Products{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">That Scale</span>
          </h1>

          <p className="text-muted hero-reveal max-w-xl" style={reveal(2)}>
            I&apos;m Abdul Aziz, a UI/UX Designer, Product Designer, and Frontend Engineer crafting
            scalable digital products for startups, SaaS companies, and enterprise businesses across
            Dubai, the UAE, and beyond.
          </p>

          <div className="hero-reveal flex flex-wrap items-center gap-4" style={reveal(3)}>
            <Magnetic>
              <Button
                variant="gradient"
                size="lg"
                icon={<ArrowUpRight size={16} aria-hidden="true" />}
                href="/projects"
              >
                View Projects
              </Button>
            </Magnetic>
            <Magnetic>
              <Button variant="surface" size="lg" href="/contact">
                Let&apos;s Connect
              </Button>
            </Magnetic>
          </div>
        </div>

        <div
          className="hero-reveal relative mt-8 flex items-center justify-center pb-20"
          style={reveal(4)}
        >
          <StatCard
            value="4+"
            label="Years of Experience"
            delay={0.6}
            className="absolute top-2/5 -left-32 z-1 hidden -translate-y-1/2 lg:block"
          />
          <OrbitVisual className="h-105 w-105 max-w-[88vw]" />
          <StatCard
            value="10+"
            label="Digital Products Designed"
            delay={0.8}
            className="absolute top-3/5 -right-36 z-1 hidden -translate-y-1/2 lg:block"
          />
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
