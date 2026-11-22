'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Writes the pointer's offset from the centre of this element into two CSS
 * custom properties. Children opt in by adding `.parallax-layer` and their own
 * `--depth`, so the whole composition moves off a single listener.
 *
 * Deliberately avoids per-card listeners and per-frame getBoundingClientRect():
 * the rect is measured on enter and on resize only, and updates are coalesced
 * into one requestAnimationFrame. On a coarse pointer nothing is attached at
 * all, and .parallax-layer is a no-op there anyway.
 */
export function PointerParallax({
  children,
  className,
  strength = 18,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia('(pointer: fine)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || calm.matches) return;

    let rect = el.getBoundingClientRect();
    let frame = 0;
    let nextX = 0;
    let nextY = 0;

    const measure = () => {
      rect = el.getBoundingClientRect();
    };

    const apply = () => {
      frame = 0;
      el.style.setProperty('--pointer-x', nextX.toFixed(3));
      el.style.setProperty('--pointer-y', nextY.toFixed(3));
    };

    const onMove = (event: PointerEvent) => {
      if (rect.width === 0) return;
      // -1..1 either side of centre, scaled by strength.
      nextX = ((event.clientX - rect.left) / rect.width - 0.5) * 2 * strength;
      nextY = ((event.clientY - rect.top) / rect.height - 0.5) * 2 * strength;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      nextX = 0;
      nextY = 0;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    measure();
    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('scroll', measure, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
    };
  }, [strength]);

  return (
    <div ref={ref} className={cn('relative', className)}>
      {children}
    </div>
  );
}
