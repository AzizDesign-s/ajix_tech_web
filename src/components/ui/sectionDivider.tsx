import { cn } from '@/lib/utils/cn';

interface SectionDividerProps {
  className?: string;
}

// Reusable closing divider — appears at the bottom of most sections,
// matching the "+" tick-mark line from the Figma design.
export function SectionDivider({ className }: SectionDividerProps) {
  return (
    <div className={cn('relative mx-auto mt-25 flex w-full max-w-5xl items-center', className)}>
      <span className="text-muted absolute left-0 -translate-x-1/2 text-lg leading-none">+</span>
      <div className="bg-border h-px w-full" />
      <span className="text-muted absolute right-0 translate-x-1/2 text-lg leading-none">+</span>
    </div>
  );
}
