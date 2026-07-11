'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

const RING_SIZES = [300, 460, 620, 780]; // px

interface PulsingRingsProps {
  className?: string;
}

// 4 concentric circles that gently breathe (scale + fade) on a staggered
// loop. Reusable background decoration for any centered section.
export function PulsingRings({ className }: PulsingRingsProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden',
        className,
      )}
    >
      {RING_SIZES.map((size, i) => (
        <motion.div
          key={size}
          className="border-border/80 absolute rounded-full border"
          style={{ width: size, height: size }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.85, 0.5] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.6,
          }}
        />
      ))}
    </div>
  );
}
