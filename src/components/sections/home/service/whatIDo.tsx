'use client';

import { motion } from 'framer-motion';
import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/shared/sectionHeader';
import { SectionGlow } from '@/components/shared/sectionGlow';
import { SectionDivider } from '@/components/ui/sectionDivider';
import { ServiceCard } from '@/components/sections/home/service/serviceCard';
import { getAllServices } from '@/lib/services/services';
import { staggerContainer } from '@/animations/variants';

export function WhatIDo() {
  const services = getAllServices();

  return (
    <Section className="relative">
      <SectionGlow />

      <SectionHeader
        eyebrow="What I Do"
        title="Where design meets engineering"
        description="I combine UI/UX design, product strategy, frontend development, user research, and design systems to build scalable digital products from concept to production."
        align="left"
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="relative z-10 mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </motion.div>

      <SectionDivider className="mt-20" />
    </Section>
  );
}
