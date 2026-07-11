import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface GlowBadgeProps {
  children: ReactNode;

  className?: string;
}

// Pill with a border that's static by default and becomes a smoothly
// rotating gradient glow on hover. Reusable anywhere a highlighted
// tag/eyebrow is needed (Hero now, other pages later).
export function GlowBadge({ children, className }: GlowBadgeProps) {
  return (
    <div className={cn('group relative inline-flex rounded-full p-px', className)}>
      {/* Base border — always visible */}
      <span aria-hidden="true" className="border-border absolute inset-0 rounded-2xl border" />

      {/* Comet beam — short bright arc that sweeps around the ring on hover */}
      <span
        aria-hidden="true"
        className="group-hover:animate-spin-slow absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'conic-gradient(from var(--angle), var(--color-cyan) 0%, var(--color-primary) 6%, var(--color-violet) 12%, transparent 22%, transparent 100%)',
        }}
      />

      <span className="bg-card text-foreground relative flex items-center gap-2 rounded-full px-4 py-2 text-sm">
        <span className="bg-gradient-primary h-2 w-2 shrink-0 rounded-full" />
        {children}
      </span>
    </div>
  );
}
