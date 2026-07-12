'use client';

import { motion, type Variants } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { GridBackground } from '@/components/shared/gridBackground';
import { Spotlight } from '@/components/shared/spotlight';
import { Starfield } from '@/components/ui/starField';
import { GlowBadge } from '@/components/shared/glowBadge';
import { GradientText } from '@/components/shared/gradientText';
import { Button } from '@/components/ui/button';
import { Magnetic } from '@/components/shared/magnetic';

import { MetricPill } from '@/components/sections/about/hero/metricPill';
import { ProfileCard } from '@/components/sections/about/hero/heroFlipCard';
import { heroMetrics } from '@/data/metrics';
import { siteConfig } from '@/config/site';
import { openAndDownloadResume } from '@/lib/utils/resume';

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export function AboutHero() {
  return (
    <section className="relative flex min-h-screen w-full items-center overflow-hidden px-6 pt-32 pb-20 md:px-10">
      <GridBackground />
      <Starfield count={40} />

      <div className="pointer-events-none absolute inset-0 z-1">
        <Spotlight className="-top-40 -left-10 h-screen md:-top-20 md:-left-32" fill="cyan" />
        <Spotlight className="top-10 left-full h-[80vh] w-[50vw]" fill="violet" />
        <Spotlight className="top-80 left-full h-[60vh] w-[20vw]" fill="purple" />
        <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]" fill="blue" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6"
        >
          <motion.div variants={itemVariants}>
            <GlowBadge>UI/UX Designer · Dubai, UAE</GlowBadge>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-heading text-foreground text-4xl font-bold md:text-5xl"
          >
            Hi, I&apos;m Abdul Aziz.
            <br />
            <GradientText>Enterprise Product Designer.</GradientText>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-muted max-w-lg">
            I design and build enterprise digital products that solve complex business challenges
            through research, scalable design systems, and modern frontend engineering. From product
            strategy to production-ready interfaces, I create experiences that are intuitive,
            accessible, and built to grow.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            {heroMetrics.map((metric) => (
              <MetricPill key={metric.id} metric={metric} />
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="mt-2 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Button
                variant="gradient"
                size="md"
                icon={<ArrowUpRight size={16} />}
                href="/projects"
              >
                View Projects
              </Button>
            </Magnetic>
            <Magnetic>
              <Button
                variant="surface"
                size="md"
                onClick={
                  siteConfig.resumeUrl
                    ? () => openAndDownloadResume(siteConfig.resumeUrl, 'Abdul_Aziz_Resume.pdf')
                    : undefined
                }
              >
                Download Resume
              </Button>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          className="flex justify-center"
        >
          <ProfileCard />
        </motion.div>
      </div>
    </section>
  );
}
