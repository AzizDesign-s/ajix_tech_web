'use client';

import { motion } from 'framer-motion';
import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/shared/sectionHeader';
import { SectionGlow } from '@/components/shared/sectionGlow';
import { SectionDivider } from '@/components/ui/sectionDivider';
import { ImpactCard } from '@/components/sections/about/impact/impactCard';
import { impactMetrics } from '@/data/impact';
import { staggerContainer } from '@/animations/variants';

export function ProductImpact() {
  return (
    <Section className="relative">
      <SectionGlow />

      <SectionHeader
        eyebrow="Product Impact"
        title="Design Decisions That Drive Better Experiences"
        description="Great design isn't just about aesthetics — it's about reducing friction, improving usability, and helping users achieve their goals with confidence."
        align="center"
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="relative z-10 mt-16 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {impactMetrics.map((metric) => (
          <ImpactCard key={metric.id} metric={metric} />
        ))}
      </motion.div>

      <SectionDivider className="mt-20" />
    </Section>
  );
}
