import { cn } from '@/lib/utils/cn';

interface CenterGlowProps {
  className?: string;
}

// Same cyan/primary/violet 3-color glow as SectionGlow, but stacked
// at the center instead of spread to the corners.
export function CenterGlow({ className }: CenterGlowProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden',
        className,
      )}
    >
      <div className="bg-cyan/20 h-72 w-72 rounded-full blur-[110px]" />
      <div className="bg-primary/20 absolute h-72 w-72 -translate-x-16 rounded-full blur-[110px]" />
      <div className="bg-violet/20 absolute h-72 w-72 translate-x-16 rounded-full blur-[110px]" />
    </div>
  );
}
