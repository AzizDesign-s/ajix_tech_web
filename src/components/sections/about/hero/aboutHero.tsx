import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { GridBackground } from '@/components/shared/gridBackground';
import { Spotlight } from '@/components/shared/spotlight';
import { Starfield } from '@/components/ui/starField';
import { GlowBadge } from '@/components/shared/glowBadge';
import { GradientText } from '@/components/shared/gradientText';
import { Button } from '@/components/ui/button';
import { Magnetic } from '@/components/shared/magnetic';
import { ResumeButton } from '@/components/shared/resumeButton';

import { MetricPill } from '@/components/sections/about/hero/metricPill';
import { ProfileCard } from '@/components/sections/about/hero/heroFlipCard';
import { heroMetrics } from '@/data/metrics';

// Same stagger as before (0.1s + 0.12s per child), now as CSS so the hero is
// visible in the server HTML rather than waiting on hydration.
const reveal = (index: number) => ({ '--reveal-delay': `${100 + index * 120}ms` }) as CSSProperties;

export function AboutHero() {
  return (
    <section className="relative flex min-h-dvh w-full items-center overflow-hidden px-6 pt-32 pb-20 md:px-10">
      <GridBackground />
      <Starfield count={40} />

      <div className="pointer-events-none absolute inset-0 z-1">
        <Spotlight className="-top-40 -left-10 h-screen md:-top-20 md:-left-32" fill="cyan" />
        <Spotlight className="top-10 left-full h-[80vh] w-[50vw]" fill="violet" />
        <Spotlight className="top-80 left-full h-[60vh] w-[20vw]" fill="purple" />
        <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]" fill="blue" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className="hero-reveal" style={reveal(0)}>
            <GlowBadge>UI/UX Designer · Dubai, UAE</GlowBadge>
          </div>

          <h1
            className="font-heading text-foreground hero-reveal text-4xl font-bold md:text-5xl"
            style={reveal(1)}
          >
            Hi, I&apos;m Abdul Aziz.
            <br />
            <GradientText>Enterprise Product Designer.</GradientText>
          </h1>

          <p className="text-muted hero-reveal max-w-lg" style={reveal(2)}>
            I design and build enterprise digital products that solve complex business challenges
            through research, scalable design systems, and modern frontend engineering. From product
            strategy to production-ready interfaces, I create experiences that are intuitive,
            accessible, and built to grow.
          </p>

          <div className="hero-reveal flex flex-wrap gap-3" style={reveal(3)}>
            {heroMetrics.map((metric) => (
              <MetricPill key={metric.id} metric={metric} />
            ))}
          </div>

          <div className="hero-reveal mt-2 flex flex-wrap items-center gap-4" style={reveal(4)}>
            <Magnetic>
              <Button
                variant="gradient"
                size="md"
                icon={<ArrowUpRight size={16} aria-hidden="true" />}
                href="/projects"
              >
                View Projects
              </Button>
            </Magnetic>
            <Magnetic>
              <ResumeButton variant="surface" size="md" />
            </Magnetic>
          </div>
        </div>

        <div
          className="hero-reveal-scale flex justify-center"
          style={{ '--reveal-delay': '300ms' } as CSSProperties}
        >
          <ProfileCard />
        </div>
      </div>
    </section>
  );
}
