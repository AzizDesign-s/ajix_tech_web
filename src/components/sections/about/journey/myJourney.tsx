import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/shared/sectionHeader';
import { SectionGlow } from '@/components/shared/sectionGlow';
import { SectionDivider } from '@/components/ui/sectionDivider';
import { PrincipleTimeline } from '@/components/shared/pricipleTimeline';
import { journeyMilestones } from '@/data/journey';

export function MyJourney() {
  return (
    <Section className="relative">
      <SectionGlow />

      <SectionHeader
        eyebrow="My Journey"
        title="From first pixels to enterprise systems"
        description="From designing interfaces to building scalable enterprise products, every step has shaped how I approach user experience, frontend engineering, and product design today."
        align="center"
      />

      <div className="relative z-10 w-full">
        <PrincipleTimeline principles={journeyMilestones} />
      </div>

      <SectionDivider className="mt-20" />
    </Section>
  );
}
