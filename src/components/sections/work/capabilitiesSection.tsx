import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/shared/sectionHeader';
import { SectionGlow } from '@/components/shared/sectionGlow';
import { SectionDivider } from '@/components/ui/sectionDivider';
import { SpotlightCard } from '@/components/shared/spotlightCard';
import { Icon } from '@/components/ui/icon';
import { capabilities } from '@/config/capabilities';

// Section 06. Reuses SpotlightCard so the hover behaviour matches the
// Homepage service cards exactly rather than approximating them.
export function CapabilitiesSection() {
  return (
    <Section className="relative">
      <SectionGlow />

      <SectionHeader
        eyebrow="Featured Capabilities"
        title="Where design and engineering meet"
        description="The six things I am actually hired to do, across product design, design systems and frontend delivery."
        align="left"
      />

      <ul className="relative z-10 mt-16 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((capability) => (
          <li key={capability.id}>
            <SpotlightCard>
              <span className="border-border text-primary bg-background/60 relative z-10 flex h-12 w-12 items-center justify-center rounded-xl border">
                <Icon name={capability.icon} size={20} aria-hidden="true" />
              </span>
              <h3 className="font-heading text-foreground relative z-10 mt-5 text-xl font-semibold">
                {capability.title}
              </h3>
              <p className="text-muted relative z-10 mt-2 text-sm leading-relaxed">
                {capability.description}
              </p>
            </SpotlightCard>
          </li>
        ))}
      </ul>

      <SectionDivider className="mt-20" />
    </Section>
  );
}
