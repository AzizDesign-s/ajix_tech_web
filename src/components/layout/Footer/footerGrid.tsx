import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

interface FooterGridProps {
  className?: string;
}

const grid = '/images/ui/footer-grid.svg';

export function FooterGrid({ className }: FooterGridProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      style={{
        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 90%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 90%)',
      }}
    >
      {/* Decorative only: empty alt, lazy (it sits below the fold), and
          object-cover so the grid is not stretched out of proportion. */}
      <Image src={grid} alt="" fill sizes="100vw" className="object-cover" />
    </div>
  );
}
