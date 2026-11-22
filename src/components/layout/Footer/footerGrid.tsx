import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import type { SiteTheme } from '@/types/theme';

interface FooterGridProps {
  className?: string;
  theme?: SiteTheme;
}

const grid = '/images/ui/footer-grid.svg';

export function FooterGrid({ className, theme = 'dark' }: FooterGridProps) {
  const mask = 'radial-gradient(ellipse at center, black 40%, transparent 90%)';

  // The SVG grid is drawn in #05041F and only reads correctly on the dark
  // surface — on white it is a dark smudge. The light theme gets the same
  // effect from a hairline CSS grid in the themed grid-line colour instead.
  if (theme === 'light') {
    return (
      <div
        aria-hidden="true"
        className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-grid-line)_1px,transparent_1px)] bg-size-[80px_80px]" />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      {/* Decorative only: empty alt, lazy (it sits below the fold), and
          object-cover so the grid is not stretched out of proportion. */}
      <Image src={grid} alt="" fill sizes="100vw" className="object-cover" />
    </div>
  );
}
