'use client';

import type { ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: 'left' | 'center' | 'right';
  action?: ReactNode; // e.g. "View All Projects" button
  className?: string;
}

const lineVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] } },
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  className,
}: SectionHeaderProps) {
  const isCenter = align === 'center';
  const isRight = align === 'right';

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={cn(
        'flex w-full flex-col gap-6 md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div
        className={cn(
          'flex max-w-2xl flex-col gap-4',
          isCenter && 'mx-auto items-center text-center',
          isRight && 'ml-auto items-end text-right',
        )}
      >
        {eyebrow && (
          <div className="flex items-center gap-3">
            {(align === 'left' || isCenter) && (
              <motion.span
                variants={lineVariants}
                style={{ transformOrigin: 'right' }}
                className="bg-gradient-primary h-px w-8"
              />
            )}
            <motion.span
              variants={{
                hidden: { color: 'rgba(255, 255, 255, 0.8)' }, // was var(--color-muted) — too low contrast over glow
                visible: {
                  color: 'var(--color-cyan)',
                  transition: { delay: 0.5, duration: 0.4, ease: 'easeOut' },
                },
              }}
              className="text-xs font-semibold tracking-widest uppercase"
            >
              {eyebrow}
            </motion.span>
            {(isCenter || isRight) && (
              <motion.span
                variants={lineVariants}
                style={{ transformOrigin: 'left' }}
                className="bg-gradient-primary h-px w-8"
              />
            )}
          </div>
        )}

        <h2 className="font-heading text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h2>
        {description && <p className="text-muted text-base leading-relaxed">{description}</p>}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  );
}
