import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/shared/sectionHeader';
import { SectionDivider } from '@/components/ui/sectionDivider';
import { PrincipleTimeline } from '@/components/shared/pricipleTimeline';
import { MetricsStrip } from '@/components/shared/metricsStrip';
import { getAllPrinciples } from '@/lib/services/principle';
import { getAllMetrics } from '@/lib/services/metrics';

export function WhyAjix() {
  const principles = getAllPrinciples();
  const metrics = getAllMetrics();

  return (
    <Section className="relative">
      <SectionHeader
        eyebrow="What I Do"
        title="Principles that shape every project"
        description="Every product I design follows the same principles — from research and strategy to development and delivery."
        align="center"
      />

      <PrincipleTimeline principles={principles} />

      <MetricsStrip metrics={metrics} className="mt-20" />

      <SectionDivider className="mt-20" />
    </Section>
  );
}
