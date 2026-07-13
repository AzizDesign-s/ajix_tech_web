'use client';

import { cn } from '@/lib/utils/cn';

interface GradientBlobProps {
  className?: string;
}

// Adapted from Aceternity UI's BackgroundGradientAnimation, re-themed to
// our cyan/primary/violet palette and simplified for use inside a single
// bento card rather than as a full-page background.
export function GradientBlob({ className }: GradientBlobProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <div className="from-primary/40 via-background to-violet/30 absolute inset-0 bg-linear-to-br" />
      <div className="animate-float bg-cyan/30 absolute top-0 -left-1/4 h-full w-2/3 rounded-full blur-3xl" />
      <div className="animate-float-slow bg-violet/30 absolute -right-1/4 bottom-0 h-full w-2/3 rounded-full blur-3xl" />
    </div>
  );
}
