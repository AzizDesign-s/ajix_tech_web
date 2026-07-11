'use client';

import { useRef, type ReactNode, type MouseEvent } from 'react';
import { cn } from '@/lib/utils/cn';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

// Reusable hover-spotlight card shell: cursor-tracked glow, glass sheen,
// top edge highlight, subtle lift on hover. Used by ServiceCard now —
// Tools (Phase 8) and any future card grid should wrap content in this
// instead of re-implementing the hover effect from scratch.
export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    cardRef.current?.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    cardRef.current?.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        'group border-border bg-card/40 shadow-card relative flex h-full flex-col overflow-hidden rounded-2xl border p-8 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1',
        className,
      )}
    >
      {/* Glass sheen */}
      <div
        aria-hidden="true"
        className="absolute -top-1/3 -left-1/3 h-2/3 w-2/3 rotate-12 rounded-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:translate-x-4 group-hover:translate-y-2"
      />
      {/* Cursor-tracked spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(240px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in srgb, var(--color-primary) 18%, transparent), transparent 70%)',
        }}
      />
      {/* Top edge highlight */}
      <div
        aria-hidden="true"
        className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"
      />

      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </div>
  );
}
