'use client';

import { motion } from 'framer-motion';
import { GlowBadge } from '@/components/shared/glowBadge';
import { PrincipleRow } from '@/components/ui/pricipleRow';
import { staggerContainer } from '@/animations/variants';
import type { Principle } from '@/types/principle';

const LINE_DURATION = 1.4;

interface PrincipleTimelineProps {
  principles: Principle[];
}

// Reusable step timeline — desktop shows an animated glowing horizontal
// line with dots that "activate" in sequence; mobile/tablet falls back
// to a stacked vertical list. Pass any `principles` array in.
export function PrincipleTimeline({ principles }: PrincipleTimelineProps) {
  const count = principles.length;

  return (
    <div className="pt-16">
      {/* Desktop timeline */}
      <div className="hidden lg:block">
        <div className="relative h-3">
          <div className="bg-border/60 absolute inset-x-0 top-1/2 h-px -translate-y-1/2" />

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: LINE_DURATION, ease: [0.65, 0, 0.35, 1] }}
            style={{ transformOrigin: 'left' }}
            className="bg-gradient-primary shadow-glow-blue absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
          />

          <div className="absolute inset-0 flex items-center justify-between">
            {principles.map((principle) => (
              <motion.span
                key={principle.id}
                initial={{ scale: 0.7, backgroundColor: '#475569' }}
                whileInView={{ scale: [0.7, 1.35, 1], backgroundColor: '#2563eb' }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{
                  duration: 0.5,
                  delay: ((principle.step - 1) / (count - 1)) * LINE_DURATION,
                  ease: 'easeOut',
                }}
                className="shadow-glow-blue h-3 w-3 rounded-full"
              />
            ))}
          </div>
        </div>

        <div
          className="mt-8 grid gap-6"
          style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
        >
          {principles.map((principle) => (
            <motion.div
              key={principle.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{
                duration: 0.5,
                delay: ((principle.step - 1) / (count - 1)) * LINE_DURATION + 0.2,
                ease: 'easeOut',
              }}
            >
              <GlowBadge>{principle.badgeLabel ?? `Step ${principle.step}`}</GlowBadge>
              <h3 className="font-heading text-foreground mt-3 text-base font-semibold">
                {principle.title}
              </h3>
              <p className="text-foreground/60 mt-1 text-sm leading-relaxed">
                {principle.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile/tablet fallback */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="lg:hidden"
      >
        {principles.map((principle) => (
          <PrincipleRow key={principle.id} principle={principle} />
        ))}
      </motion.div>
    </div>
  );
}
