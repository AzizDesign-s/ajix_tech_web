import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface FloatingCardProps {
  title: string;
  description: string;
  /** Rendered before the title — an availability dot, an icon. */
  badge?: ReactNode;
  /** Desktop placement. On mobile these cards sit in a normal grid. */
  position?: string;
  /** Parallax multiplier. Larger = moves more = reads as nearer. */
  depth?: number;
  /** Float cycle, kept different per card so they never move in lockstep. */
  floatDuration?: string;
  floatDelay?: string;
  floatDistance?: string;
  revealDelay?: string;
}

export function FloatingCard({
  title,
  description,
  badge,
  position,
  depth = 1,
  floatDuration = '7s',
  floatDelay = '0s',
  floatDistance = '-12px',
  revealDelay = '0ms',
}: FloatingCardProps) {
  return (
    <div
      className={cn('parallax-layer hero-reveal w-full', position)}
      style={
        {
          '--depth': depth,
          '--reveal-delay': revealDelay,
        } as CSSProperties
      }
    >
      <div
        className="card-float"
        style={
          {
            '--float-duration': floatDuration,
            '--float-delay': floatDelay,
            '--float-distance': floatDistance,
          } as CSSProperties
        }
      >
        <div className="border-border bg-card/80 shadow-card rounded-2xl border p-4 backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(10,20,50,0.10)] lg:p-5">
          <p className="text-foreground flex items-center gap-2 text-sm font-semibold">
            {badge}
            {title}
          </p>
          <p className="text-muted mt-1.5 text-xs leading-relaxed lg:text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}
