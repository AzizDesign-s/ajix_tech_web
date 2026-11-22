'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { UaeFlagBadge } from '@/components/ui/uaeFlagBadge';
import { Magnetic } from '@/components/shared/magnetic';

const RING_SIZES = ['40%', '60%', '78%', '100%'];

const ORBIT_TOOLS = [
  { slug: 'figma', label: 'Figma' },
  { slug: 'framer', label: 'Framer' },
  { slug: 'github', label: 'GitHub' },
  { slug: 'react', label: 'React' },
  { slug: 'vercel', label: 'Vercel' },
  { slug: 'tailwindcss', label: 'Tailwind CSS' },
  { slug: 'nextdotjs', label: 'Next.js' },
  { slug: 'typescript', label: 'TypeScript' },
];

const ORBIT_DURATION = 40; // seconds — outer ring
const GLOW_DURATION_1 = 30;
const GLOW_DURATION_2 = 20; // seconds — middle glow dots

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
        transition={{ duration: GLOW_DURATION_1, repeat: Infinity, ease: 'linear' }}
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
        transition={{ duration: GLOW_DURATION_2, repeat: Infinity, ease: 'linear' }}
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
      {/* The ring and each icon's counter-rotation were nine separate infinite
          Framer Motion animations, all holding a JS animation loop open for the
          life of the page. globals.css already defines both directions as CSS
          keyframes (--animate-orbit / --animate-orbit-reverse), which run off
          the main thread and are covered by the reduced-motion block. */}
      <div
        className="animate-orbit absolute"
        style={{
          width: RING_SIZES[3],
          height: RING_SIZES[3],
          animationDuration: `${ORBIT_DURATION}s`,
        }}
      >
        {ORBIT_TOOLS.map(({ slug, label }, i) => {
          const angle = (360 / ORBIT_TOOLS.length) * i;
          const x = 50 + 50 * Math.cos((angle * Math.PI) / 180);
          const y = 50 + 50 * Math.sin((angle * Math.PI) / 180);
          return (
            <div
              key={slug}
              className="absolute"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <Magnetic>
                <div
                  className="animate-orbit-reverse border-border bg-card/80 flex h-10 w-10 items-center justify-center rounded-xl border backdrop-blur-md"
                  style={{ animationDuration: `${ORBIT_DURATION}s` }}
                >
                  <Image
                    src={`/icons/tools/${slug}.svg`}
                    alt={label}
                    width={18}
                    height={18}
                    className="tool-icon-static h-4.5 w-4.5 object-contain"
                  />
                </div>
              </Magnetic>
            </div>
          );
        })}
      </div>

      <div className="bg-card shadow-glow-blue relative z-10 flex h-20 w-20 items-center justify-center rounded-full">
        <Magnetic>
          <UaeFlagBadge className="h-14 w-14" />
        </Magnetic>
      </div>
    </div>
  );
}
