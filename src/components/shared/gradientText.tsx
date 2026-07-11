import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
}

// Reusable animated gradient text — the gradient continuously shifts
// left-to-right for a subtle shimmer. Use anywhere emphasized text needs
// the brand gradient treatment (Hero, Why Hire AJIX, and beyond).
export function GradientText({ children, className }: GradientTextProps) {
  return (
    <span
      className={cn(
        'animate-gradient-shift bg-size-[200%_auto] bg-clip-text text-transparent',
        className,
      )}
      style={{
        backgroundImage:
          'linear-gradient(90deg, var(--color-cyan), var(--color-primary), var(--color-violet), var(--color-cyan))',
      }}
    >
      {children}
    </span>
  );
}
