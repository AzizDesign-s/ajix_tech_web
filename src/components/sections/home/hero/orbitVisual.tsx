'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

const logo = '/logo/ajix-icon-light.svg';
const RING_SIZES = [280, 360, 440, 520];

// Cycles through cyan → primary → violet across the dots
const DOT_COLORS = [
  { core: 'bg-cyan', glow: 'shadow-glow-cyan' },
  { core: 'bg-primary', glow: 'shadow-glow-primary' },
  { core: 'bg-violet', glow: 'shadow-glow-violet' },
] as const;

const GLOW_DOTS = [
  { angle: 15, radius: 440, size: 10 },
  { angle: 95, radius: 360, size: 8 },
  { angle: 160, radius: 280, size: 12 },
  { angle: 210, radius: 360, size: 8 },
  { angle: 260, radius: 440, size: 10 },
  { angle: 320, radius: 520, size: 9 },
].map((dot, i) => ({ ...dot, color: DOT_COLORS[i % DOT_COLORS.length] }));

interface OrbitVisualProps {
  className?: string;
}

export function OrbitVisual({ className }: OrbitVisualProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <div
      ref={sectionRef}
      className={cn('animate-float-slow relative flex items-center justify-center', className)}
    >
      <div className="bg-gradient-primary absolute inset-0 h-105 w-105 rounded-full opacity-20 blur-3xl" />

      {RING_SIZES.map((size) => (
        <div
          key={size}
          className="border-border/60 absolute rounded-full border"
          style={{ width: size, height: size }}
        />
      ))}

      <motion.div className="absolute h-105 w-105" style={{ rotate }}>
        {GLOW_DOTS.map((dot, i) => {
          const xPercent = 50 + (dot.radius / 420) * 50 * Math.cos((dot.angle * Math.PI) / 180);
          const yPercent = 50 + (dot.radius / 420) * 50 * Math.sin((dot.angle * Math.PI) / 180);
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

      <div className="bg-gradient-primary shadow-glow-blue relative z-10 flex h-40 w-40 items-center justify-center rounded-full">
        <div className="bg-foreground flex h-16 w-16 items-center justify-center rounded-full">
          {/* logo mark goes here once exported */}
          <Image src={logo} alt="AJIX" width={28} height={28} className="h-auto w-10" />
        </div>
      </div>
    </div>
  );
}
