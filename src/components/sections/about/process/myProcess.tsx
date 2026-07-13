'use client';

import { motion } from 'framer-motion';
import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/shared/sectionHeader';
import { SectionDivider } from '@/components/ui/sectionDivider';
import { ProcessCard } from '@/components/sections/about/process/processCard';
import { QuoteStrip } from '@/components/sections/about/process/qouteStrip';
import { processSteps } from '@/data/process';
import { staggerContainer } from '@/animations/variants';

export function MyProcess() {
  return (
    <Section className="relative">
      <SectionHeader
        eyebrow="My Process"
        title="A Simple Process for Complex Products"
        description="Every successful product follows a structured process — from understanding user needs to validating solutions and delivering production-ready experiences."
        align="center"
      />

      <motion.div
        variants={staggerContainer}
        className="relative z-10 mt-16 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {processSteps.map((step) => (
          <ProcessCard key={step.id} step={step} />
        ))}
      </motion.div>

      <div className="relative z-10 mt-10 w-full">
        <QuoteStrip
          quote="Every Pixel Has a Purpose. Every Line of Code Has Intent."
          subtext="A process that turns ideas into scalable digital products."
        />
      </div>

      <SectionDivider className="mt-20" />
    </Section>
  );
}
