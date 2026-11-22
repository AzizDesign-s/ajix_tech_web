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
  /** Optional id on the <h2>, so a control elsewhere can be labelled by it
   *  (the Contact page's radiogroup uses this). Additive — omitting it leaves
   *  every existing call site exactly as it was. */
  titleId?: string;
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
  titleId,
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
            {/* The colour is static and the reveal is opacity-only.
                Animating `color` meant the eyebrow sat at --color-muted until
                it scrolled into view, which measures 4.2:1 over the CTA
                section's brighter gradient and fails WCAG 1.4.3. Animating
                colour also forces a repaint on every frame, where opacity is
                handled by the compositor. */}
            <motion.span
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { delay: 0.5, duration: 0.4, ease: 'easeOut' },
                },
              }}
              style={{ color: 'var(--color-eyebrow)' }}
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

        <h2
          id={titleId}
          className="font-heading text-foreground text-3xl font-semibold tracking-tight md:text-4xl"
        >
          {title}
        </h2>
        {description && <p className="text-muted text-base leading-relaxed">{description}</p>}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  );
}
