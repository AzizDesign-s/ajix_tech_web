import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/shared/sectionHeader';
import { SectionDivider } from '@/components/ui/sectionDivider';
import { ToolsMarquee } from '@/components/sections/home/tools/toolsMarque';
import { toolsRowOne, toolsRowTwo } from '@/data/tools';

export function ToolsSection() {
  return (
    <Section className="overflow-hidden">
      <SectionHeader
        eyebrow="Tools & Technologies"
        title="Tools That Power Every Project"
        description="From design and prototyping to frontend development and collaboration, these are the tools I rely on to create scalable digital experiences."
        align="center"
        className="mx-auto"
      />

      {/* Full-bleed marquee with edge-fade mask so rows dissolve at the sides */}
      <div
        className="relative mx-auto mt-16 flex max-w-7xl flex-col gap-4"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <ToolsMarquee tools={toolsRowOne} direction="left" duration={34} />
        <ToolsMarquee tools={toolsRowTwo} direction="right" duration={28} />
      </div>

      <SectionDivider className="mt-20" />
    </Section>
  );
}
