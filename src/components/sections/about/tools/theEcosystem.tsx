import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/shared/sectionHeader';
import { SectionGlow } from '@/components/shared/sectionGlow';
import { SectionDivider } from '@/components/ui/sectionDivider';
import { AICore } from '@/components/sections/about/tools/AICore';
import { EcosystemCard } from '@/components/sections/about/tools/ecosystemCard';

import { ecosystemCategories } from '@/data/ecosystem';

export function TheEcosystem() {
  const [topLeft, topRight, bottomLeft, bottomRight] = [
    ecosystemCategories.find((c) => c.position === 'top-left')!,
    ecosystemCategories.find((c) => c.position === 'top-right')!,
    ecosystemCategories.find((c) => c.position === 'bottom-left')!,
    ecosystemCategories.find((c) => c.position === 'bottom-right')!,
  ];

  return (
    <Section className="relative">
      <SectionGlow />

      <SectionHeader
        eyebrow="Tools & Technologies"
        title="The Ecosystem Behind Every Product"
        description="From research and design to development, analytics, and collaboration, these are the tools I use to create scalable digital products."
        align="center"
      />

      {/* Desktop: radial layout with connectors */}
      <div className="relative z-10 mt-16 hidden w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-x-16 lg:grid">
        <div className="flex flex-col gap-24">
          <div className="relative">
            <EcosystemCard category={topLeft} />
          </div>
          <div className="relative">
            <EcosystemCard category={bottomLeft} />
          </div>
        </div>

        <AICore />

        <div className="flex flex-col gap-24">
          <div className="relative">
            <EcosystemCard category={topRight} />
          </div>
          <div className="relative">
            <EcosystemCard category={bottomRight} />
          </div>
        </div>
      </div>

      {/* Mobile/tablet: stacked, no connectors */}
      <div className="relative z-10 mt-16 flex w-full flex-col items-center gap-8 lg:hidden">
        <AICore />
        <div className="grid w-full max-w-md grid-cols-1 gap-4 sm:grid-cols-2">
          {ecosystemCategories.map((category) => (
            <EcosystemCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      <SectionDivider className="mt-20" />
    </Section>
  );
}
