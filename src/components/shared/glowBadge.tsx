import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface GlowBadgeProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

// Pill with a border that's static by default and becomes a smoothly
// rotating gradient glow on hover. Reusable anywhere a highlighted
// tag/eyebrow is needed (Hero now, other pages later).
export function GlowBadge({ children, icon, className }: GlowBadgeProps) {
  return (
    <div className={cn('group relative inline-flex rounded-full p-px', className)}>
      {/* Rotating gradient border — hidden until hover */}
      <span
        className="group-hover:animate-spin-slow absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'conic-gradient(from var(--angle), var(--color-cyan), var(--color-primary), var(--color-violet), var(--color-cyan))',
        }}
      />
      {/* Static border — visible by default, fades out on hover */}
      <span className="border-primary/60 absolute inset-0 rounded-full border transition-opacity duration-500 group-hover:opacity-0" />

      <span className="bg-card text-foreground relative flex items-center gap-2 rounded-full px-4 py-2 text-sm">
        {icon}
        {children}
      </span>
    </div>
  );
}
