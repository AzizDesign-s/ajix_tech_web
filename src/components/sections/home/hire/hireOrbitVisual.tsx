'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { UaeFlagBadge } from '@/components/ui/uaeFlagBadge';
import { Magnetic } from '@/components/shared/magnetic';

const RING_SIZES = ['40%', '60%', '78%', '100%'];

const ORBIT_TOOL_SLUGS = [
  'figma',
  'framer',
  'github',
  'react',
  'vercel',
  'tailwindcss',
  'nextdotjs',
  'typescript',
];

const ORBIT_DURATION = 40; // seconds — outer ring
const GLOW_DURATION = 30; // seconds — middle glow dots

interface HireOrbitVisualProps {
  className?: string;
}

export function HireOrbitVisual({ className }: HireOrbitVisualProps) {
  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {RING_SIZES.map((size) => (
        <div
          key={size}
          className="border-border/60 absolute rounded-full border"
          style={{ width: size, height: size }}
        />
      ))}

      {/* Inner ring — rotating gradient border via transform, not angle interpolation */}
      <div
        className="absolute overflow-hidden rounded-full"
        style={{ width: RING_SIZES[0], height: RING_SIZES[0] }}
      >
        <motion.div
          className="absolute inset-[-25%]"
          style={{
            background:
              'conic-gradient(var(--color-cyan), var(--color-primary), var(--color-violet), var(--color-cyan))',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
        <div className="bg-background absolute inset-px rounded-full" />
      </div>

      {/* Middle ring — glow dots */}
      <motion.div
        className="absolute"
        style={{ width: RING_SIZES[1], height: RING_SIZES[1] }}
        animate={{ rotate: 360 }}
        transition={{ duration: GLOW_DURATION, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 180].map((angle) => {
          const x = 50 + 50 * Math.cos((angle * Math.PI) / 180);
          const y = 50 + 50 * Math.sin((angle * Math.PI) / 180);
          return (
            <span
              key={angle}
              className="absolute"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <span className="bg-cyan absolute -inset-1.5 rounded-full opacity-70 blur-md" />
              <span className="bg-primary relative block h-2 w-2 rounded-full" />
            </span>
          );
        })}
      </motion.div>

      {/* Middle ring — glow dots */}
      <motion.div
        className="absolute"
        style={{ width: RING_SIZES[2], height: RING_SIZES[2] }}
        animate={{ rotate: 360 }}
        transition={{ duration: GLOW_DURATION, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 180].map((angle) => {
          const x = 50 + 50 * Math.cos((angle * Math.PI) / 180);
          const y = 50 + 50 * Math.sin((angle * Math.PI) / 180);
          return (
            <span
              key={angle}
              className="absolute"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <span className="bg-violet absolute -inset-1.5 rounded-full opacity-70 blur-md" />
              <span className="bg-purple relative block h-2 w-2 rounded-full" />
            </span>
          );
        })}
      </motion.div>

      {/* Outer ring — 8 orbiting tool icons, counter-rotated to stay upright */}
      <motion.div
        className="absolute"
        style={{ width: RING_SIZES[3], height: RING_SIZES[3] }}
        animate={{ rotate: 360 }}
        transition={{ duration: ORBIT_DURATION, repeat: Infinity, ease: 'linear' }}
      >
        {ORBIT_TOOL_SLUGS.map((slug, i) => {
          const angle = (360 / ORBIT_TOOL_SLUGS.length) * i;
          const x = 50 + 50 * Math.cos((angle * Math.PI) / 180);
          const y = 50 + 50 * Math.sin((angle * Math.PI) / 180);
          return (
            <div
              key={slug}
              className="absolute"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <Magnetic>
                <motion.div
                  className="border-border bg-card/80 flex h-10 w-10 items-center justify-center rounded-xl border backdrop-blur-md"
                  animate={{ rotate: -360 }}
                  transition={{ duration: ORBIT_DURATION, repeat: Infinity, ease: 'linear' }}
                >
                  <Image
                    src={`https://cdn.simpleicons.org/${slug}/94a3b8`}
                    alt={slug}
                    width={18}
                    height={18}
                    unoptimized
                    className="h-4.5 w-4.5 object-contain"
                  />
                </motion.div>
              </Magnetic>
            </div>
          );
        })}
      </motion.div>

      <div className="bg-card shadow-glow-blue relative z-10 flex h-20 w-20 items-center justify-center rounded-full">
        <Magnetic>
          <UaeFlagBadge className="h-14 w-14" />
        </Magnetic>
      </div>
    </div>
  );
}
