'use client';

import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/animatedCounter';
import type { SiteMetric } from '@/types/metric';
import { cn } from '@/lib/utils/cn';

interface MetricsStripProps {
  metrics: SiteMetric[];
  className?: string;
}

// Reusable glass metrics bar — pass any metrics array in.
// Used on the homepage now; safe to reuse on About or elsewhere later.
export function MetricsStrip({ metrics, className }: MetricsStripProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'divide-border border-border bg-card/40 relative grid grid-cols-2 gap-8 divide-y overflow-hidden rounded-2xl border p-8 backdrop-blur-xl sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-y-0 lg:grid-cols-5',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute -top-1/3 -left-1/3 h-2/3 w-2/3 rotate-12 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent"
      />

      {metrics.map((metric) => (
        <div key={metric.id} className="flex flex-col items-center px-4 py-4 text-center sm:py-0">
          <p className="bg-gradient-primary font-heading bg-clip-text text-3xl font-semibold text-transparent md:text-4xl">
            <AnimatedCounter value={metric.value} suffix={metric.suffix} />
          </p>
          <p className="text-muted mt-2 text-xs font-medium tracking-wide uppercase">
            {metric.label}
          </p>
        </div>
      ))}
    </motion.div>
  );
}
