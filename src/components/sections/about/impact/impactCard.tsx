'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SpotlightCard } from '@/components/shared/spotlightCard';
import { AnimatedCounter } from '@/components/ui/animatedCounter';
import { fadeUp } from '@/animations/variants';
import type { ImpactMetric } from '@/types/impact';

interface ImpactCardProps {
  metric: ImpactMetric;
}

export function ImpactCard({ metric }: ImpactCardProps) {
  return (
    <motion.div variants={fadeUp} className="h-full">
      <SpotlightCard>
        {/* Ghost index number. Pure decoration: a 5%-opacity watermark behind
            the card, already hidden from assistive tech. WCAG 1.4.3 exempts
            incidental and decorative text from contrast requirements, but
            axe-core cannot infer intent — data-decorative marks it explicitly
            and the accessibility suite excludes those nodes. */}
        <span
          aria-hidden="true"
          data-decorative="true"
          className="font-heading text-foreground/5 absolute -top-10 right-0 text-8xl font-bold select-none"
        >
          {metric.number}
        </span>

        <div
          aria-hidden="true"
          className="bg-gradient-primary shadow-glow-blue mb-6 flex h-11 w-11 items-center justify-center rounded-xl"
        >
          <ArrowUpRight size={18} className="text-foreground" />
        </div>

        <p className="font-heading text-primary text-3xl font-bold md:text-4xl">
          <AnimatedCounter value={metric.value} suffix={metric.suffix} />
        </p>

        <h3 className="font-heading text-foreground mt-2 text-lg font-semibold">{metric.title}</h3>
        <p className="text-foreground/70 mt-1 text-sm leading-relaxed">{metric.description}</p>
      </SpotlightCard>
    </motion.div>
  );
}
