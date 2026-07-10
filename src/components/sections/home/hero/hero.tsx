'use client';

import { motion, type Variants } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { GridBackground } from '@/components/shared/gridBackground';
import { Spotlight } from '@/components/shared/spotlight';
import { GlowBadge } from '@/components/shared/glowBadge';
import { StatCard } from '@/components/ui/statCard';
import { OrbitVisual } from '@/components/sections/home/hero/orbitVisual';
import { Button } from '@/components/ui/button';
import { Magnetic } from '@/components/shared/magnetic';

// Staggers each child in on load — badge, then heading, then paragraph,
// then buttons, then the orbit visual, one after another.
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export function Hero() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden overflow-y-visible px-4">
      <GridBackground />

      <div className="pointer-events-none absolute inset-0 z-1">
        <Spotlight className="-top-40 -left-10 h-screen md:-top-20 md:-left-32" fill="white" />
        <Spotlight className="top-10 left-full h-[80vh] w-[50vw]" fill="cyan" />
        <Spotlight className="top-80 left-full h-[60vh] w-[20vw]" fill="white" />
        <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]" fill="blue" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col flex-wrap items-center gap-6 px-4 pt-40 text-center"
      >
        <motion.div variants={itemVariants}>
          <GlowBadge>Enterprise UI/UX Designer · Dubai, UAE</GlowBadge>
        </motion.div>

        <motion.h1
          variants={itemVariants}

          className="font-heading text-foreground max-w-3xl text-3xl font-bold sm:text-4xl md:text-6xl"
        >
          Designing Enterprise Digital Products{' '}
          <span className="bg-gradient-primary bg-clip-text text-transparent">That Scale</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-muted max-w-xl">
          I&apos;m Abdul Aziz, a UI/UX Designer, Product Designer, and Frontend Engineer crafting
          scalable digital products for startups, SaaS companies, and enterprise businesses across
          Dubai, the UAE, and beyond.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
          <Magnetic>
            <Button variant="gradient" size="lg" icon={<ArrowUpRight size={16} />} href="/projects">
              View Projects
            </Button>
          </Magnetic>
          <Magnetic>
            <Button variant="surface" size="lg" href="/contact">
              Let&apos;s Connect
            </Button>
          </Magnetic>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="relative mt-8 flex items-center justify-center"
        >
          <StatCard
            value="4+"
            label="Years of Experience"
            delay={0.6}
            className="absolute top-1/2 -left-32 z-1 hidden -translate-y-1/2 lg:block"
          />
          <OrbitVisual className="h-105 w-105" />
          <StatCard
            value="10+"
            label="Digital Products Designed"
            delay={0.8}
            className="absolute top-3/4 -right-36 z-1 hidden -translate-y-1/2 lg:block"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
