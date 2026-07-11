import { ArrowUpRight } from 'lucide-react';
import { Section } from '@/components/layout/section';
import { SectionDivider } from '@/components/ui/sectionDivider';
import { CheckList } from '@/components/ui/checklist';
import { Button } from '@/components/ui/button';
import { HireOrbitVisual } from '@/components/sections/home/hire/hireOrbitVisual';
import { SectionGlow } from '@/components/shared/sectionGlow';

import { highlights } from '@/data/highlights';
import { GradientText } from '@/components/shared/gradientText';

export function WhyHireAjix() {
  return (
    <Section className="relative">
      <SectionGlow />
      <div className="relative z-10 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        {/* Left — content */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="bg-gradient-primary h-px w-8" />
            <span className="text-cyan text-xs font-semibold tracking-widest uppercase">
              Why Hire AJIX
            </span>
          </div>

          <h2 className="font-heading text-foreground text-3xl font-bold md:text-4xl">
            A Designer Who Ships, Not Just <GradientText>Hands Off</GradientText>
          </h2>

          <p className="text-muted max-w-lg">
            I bridge product strategy, UI/UX design, and frontend engineering to transform ideas
            into production-ready digital products. From user research and design systems to
            responsive React applications, I help teams move faster with fewer handoff gaps.
          </p>

          <CheckList items={highlights} />

          <div className="mt-2 flex flex-wrap items-center gap-4">
            <Button variant="gradient" size="md" icon={<ArrowUpRight size={16} />} href="/about">
              To Know More
            </Button>
            <Button variant="surface" size="md" href="/projects">
              View Projects
            </Button>
          </div>
        </div>

        {/* Right — orbit visual + connector line */}
        <div className="relative flex items-center justify-center">
          <HireOrbitVisual className="h-65 w-65 sm:h-80 sm:w-80 md:h-95 md:w-95 lg:h-105 lg:w-105" />
        </div>
      </div>

      <SectionDivider className="relative z-10 mt-20" />
    </Section>
  );
}
