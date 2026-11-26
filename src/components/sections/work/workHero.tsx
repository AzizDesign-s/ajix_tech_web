import type { CSSProperties } from 'react';
import { ArrowDown } from 'lucide-react';
import { GridBackground } from '@/components/shared/gridBackground';
import { Spotlight } from '@/components/shared/spotlight';
import { Starfield } from '@/components/ui/starField';
import { GlowBadge } from '@/components/shared/glowBadge';
import { GradientText } from '@/components/shared/gradientText';
import { Button } from '@/components/ui/button';
import { Magnetic } from '@/components/shared/magnetic';
import { WORK_FILTER_LABELS, type WorkFilter } from '@/types/work';

// Same stagger as the Home and About heroes (100ms + 120ms per child), as CSS
// rather than a Framer sequence so the h1 is painted in the server HTML
// instead of waiting on hydration.
const reveal = (index: number) => ({ '--reveal-delay': `${100 + index * 120}ms` }) as CSSProperties;

interface WorkHeroProps {
  counts: Record<WorkFilter, number>;
}

export function WorkHero({ counts }: WorkHeroProps) {
  const summary: Array<{ filter: WorkFilter; count: number }> = [
    { filter: 'uiux', count: counts.uiux },
    { filter: 'website', count: counts.website },
    { filter: 'saas', count: counts.saas },
  ];

  return (
    <section className="relative flex w-full items-center overflow-hidden px-6 pt-32 pb-20 md:px-10 lg:pt-40">
      <GridBackground />
      <Starfield count={40} />

      <div className="pointer-events-none absolute inset-0 z-1">
        <Spotlight className="-top-40 -left-10 h-screen md:-top-20 md:-left-32" fill="cyan" />
        <Spotlight className="top-10 left-full h-[80vh] w-[50vw]" fill="violet" />
        <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]" fill="blue" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="flex max-w-3xl flex-col gap-6">
          <div className="hero-reveal" style={reveal(0)}>
            <GlowBadge>Selected Work</GlowBadge>
          </div>

          <h1
            className="font-heading text-foreground hero-reveal text-4xl font-bold tracking-tight md:text-6xl"
            style={reveal(1)}
          >
            Ideas shaped into <GradientText>experiences.</GradientText>
          </h1>

          <p
            className="text-muted hero-reveal max-w-xl text-base leading-relaxed"
            style={reveal(2)}
          >
            From UX strategy and product design to interactive websites and evolving business
            software.
          </p>

          {/* Category summary. Counts come from the same data the explorer
              filters, so the hero can never claim a number the grid does not
              contain. */}
          <dl className="hero-reveal flex flex-wrap gap-x-8 gap-y-4" style={reveal(3)}>
            {summary.map(({ filter, count }) => (
              <div key={filter} className="flex flex-col">
                <dt className="text-muted text-xs tracking-widest uppercase">
                  {WORK_FILTER_LABELS[filter]}
                </dt>
                <dd className="font-heading text-foreground mt-1 text-3xl font-semibold tabular-nums">
                  {count}
                </dd>
              </div>
            ))}
          </dl>

          <div className="hero-reveal mt-2 flex flex-wrap items-center gap-4" style={reveal(4)}>
            <Magnetic>
              <Button
                variant="gradient"
                size="md"
                icon={<ArrowDown size={16} aria-hidden="true" />}
                href="#explore"
              >
                Explore the work
              </Button>
            </Magnetic>
            <Button variant="surface" size="md" href="/contact">
              Start a project
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
