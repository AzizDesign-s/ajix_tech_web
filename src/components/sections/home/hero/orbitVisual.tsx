'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

const logo = '/logo/ajix-icon-light.svg';
const RING_SIZES = ['54%', '69%', '85%', '100%'];

const DOT_COLORS = [
  { core: 'bg-cyan', glow: 'shadow-glow-cyan' },
  { core: 'bg-primary', glow: 'shadow-glow-blue' },
  { core: 'bg-violet', glow: 'shadow-glow-violet' },
] as const;

// radius is now a FRACTION (0–1) of the container's half-width,
// not a raw pixel value — matches each dot to one of the ring sizes above.
const GLOW_DOTS = [
  { angle: 15, radius: 0.85, size: 10 },
  { angle: 95, radius: 0.69, size: 8 },
  { angle: 160, radius: 0.54, size: 12 },
  { angle: 210, radius: 0.69, size: 8 },
  { angle: 260, radius: 0.85, size: 10 },
  { angle: 320, radius: 1.0, size: 9 },
].map((dot, i) => ({ ...dot, color: DOT_COLORS[i % DOT_COLORS.length] }));

const ORBIT_DURATION = 30; // seconds — smooth continuous loop, matches HireOrbitVisual's feel

interface OrbitVisualProps {
  className?: string;
}

export function OrbitVisual({ className }: OrbitVisualProps) {
  return (
    <div className={cn('animate-float-slow relative flex items-center justify-center', className)}>
      <div className="bg-gradient-primary absolute inset-0 rounded-full opacity-20 blur-3xl" />

      {RING_SIZES.map((size) => (
        <div
          key={size}
          className="border-border/80 absolute rounded-full border"
          style={{ width: size, height: size }}
        />
      ))}

      {/* Continuous smooth rotation — no longer tied to scroll position */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: ORBIT_DURATION, repeat: Infinity, ease: 'linear' }}
      >
        {GLOW_DOTS.map((dot, i) => {
          const xPercent = 50 + dot.radius * 50 * Math.cos((dot.angle * Math.PI) / 180);
          const yPercent = 50 + dot.radius * 50 * Math.sin((dot.angle * Math.PI) / 180);
          return (
            <span
              key={i}
              className={cn('absolute rounded-full', dot.color.core, dot.color.glow)}
              style={{
                width: dot.size,
                height: dot.size,
                left: `${xPercent}%`,
                top: `${yPercent}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}
      </motion.div>

      <div className="bg-gradient-primary shadow-glow-blue relative z-10 flex h-24 w-24 items-center justify-center rounded-full sm:h-20 sm:w-20 lg:h-36 lg:w-36">
        <div className="bg-foreground flex h-14 w-14 items-center justify-center rounded-full sm:h-12 sm:w-12 lg:h-16 lg:w-16">
          <Image
            src={logo}
            alt="AJIX"
            width={28}
            height={28}

            className="h-auto w-6 sm:w-8 lg:w-10"
          />
        </div>
      </div>
    </div>
  );
}
