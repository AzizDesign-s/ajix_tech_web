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
  /** Pre-rendered secondary action for cases that need a click handler.
   *  An onClick cannot be passed down from here — this component and its
   *  callers are Server Components, so the handler would never reach the
   *  browser. Callers supply an interactive Client Component instead. */
  secondaryAction?: ReactNode;
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
  secondaryAction,
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
              icon={<ArrowUpRight size={16} aria-hidden="true" />}
              href={primaryHref}
            >
              {primaryLabel}
            </Button>
          </Magnetic>
          {/* This previously required BOTH secondaryLabel and secondaryHref.
              The homepage passes a label with an action and no href, so the
              condition was never satisfied and the secondary CTA — the resume
              download — silently did not render at all. */}
          {secondaryAction && <Magnetic>{secondaryAction}</Magnetic>}
          {!secondaryAction && secondaryLabel && secondaryHref && (
            <Magnetic>
              <Button variant="surface" size="md" href={secondaryHref}>
                {secondaryLabel}
              </Button>
            </Magnetic>
          )}
        </div>
      </div>
    </Section>
  );
}
