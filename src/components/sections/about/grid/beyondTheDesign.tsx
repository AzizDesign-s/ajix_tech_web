import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/shared/sectionHeader';
import { SectionGlow } from '@/components/shared/sectionGlow';
import { SectionDivider } from '@/components/ui/sectionDivider';
import { ProductionShowcaseCard } from '@/components/sections/about/grid/productionShowcaseCard';
import { SkillStackCard } from '@/components/sections/about/grid/skillStackCard';
import { DesignerDescriptionCard } from '@/components/sections/about/grid/designerDescriptionCard';
import { CopyEmailCard } from '@/components/sections/about/grid/copyEmailCard';
import { TimezoneGlobeCard } from '@/components/sections/about/grid/timeZoneGlobeCard';

export function BeyondTheDesign() {
  return (
    <Section className="relative">
      <SectionGlow />

      <SectionHeader
        eyebrow="Beyond the Design"
        title="More Than Design—A Collaborative Product Partner"
        description="From strategy and design to frontend development and communication, I bring the skills, tools, and mindset needed to help teams build better digital products together."
        align="center"
      />

      <div className="relative z-10 mt-16 grid w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:grid-rows-[14rem_14rem_10rem]">
        <div className="h-full lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <ProductionShowcaseCard />
        </div>

        <div className="h-full lg:col-start-2 lg:row-start-1">
          <TimezoneGlobeCard />
        </div>

        <div className="h-full lg:col-start-2 lg:row-start-2">
          <SkillStackCard />
        </div>

        <div className="h-full lg:col-start-1 lg:row-start-3">
          <DesignerDescriptionCard />
        </div>

        <div className="h-full lg:col-start-2 lg:row-start-3">
          <CopyEmailCard />
        </div>
      </div>

      <SectionDivider className="mt-20" />
    </Section>
  );
}
