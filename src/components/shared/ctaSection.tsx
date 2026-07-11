import { type ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/shared/sectionHeader';
import { CenterGlow } from '@/components/ui/centerGlow';
import { PulsingRings } from '@/components/shared/pulsingRings';
import { Button } from '@/components/ui/button';
import { Magnetic } from '@/components/shared/magnetic';
import { cn } from '@/lib/utils/cn';

interface CTASectionProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  secondaryDownload?: boolean;
  className?: string;
}

// Fully generic — Home supplies its own copy via the CTA wrapper below.
// Projects/About/Contact (future phases) import this directly with
// their own text and links, reusing the same visual shell.
export function CTASection({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  secondaryDownload,
  className,
}: CTASectionProps) {
  return (
    <Section className={cn('relative overflow-hidden', className)}>
      <CenterGlow />
      <PulsingRings />

      <div className="relative z-10 flex flex-col items-center text-center">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="center"
          className="mx-auto"
        />

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Magnetic>
            <Button
              variant="gradient"
              size="md"
              icon={<ArrowUpRight size={16} />}
              href={primaryHref}
            >
              {primaryLabel}
            </Button>
          </Magnetic>
          {secondaryLabel && secondaryHref && (
            <Magnetic>
              <Button variant="surface" size="md" href={secondaryHref} download={secondaryDownload}>
                {secondaryLabel}
              </Button>
            </Magnetic>
          )}
        </div>
      </div>
    </Section>
  );
}
