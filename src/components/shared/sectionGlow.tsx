import { cn } from '@/lib/utils/cn';

interface SectionGlowProps {
  className?: string;
}

// Reusable ambient background glow — cyan, primary blue, and violet —
// used behind most homepage sections for depth.
export function SectionGlow({ className }: SectionGlowProps) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0', className)}>
      <div className="bg-cyan/20 absolute top-1/4 left-0 h-72 w-72 rounded-full blur-[110px]" />
      <div className="bg-primary/20 absolute top-0 right-0 h-72 w-72 rounded-full blur-[110px]" />
      <div className="bg-violet/20 absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-[110px]" />
    </div>
  );
}
