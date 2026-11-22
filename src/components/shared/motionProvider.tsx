'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

// The CSS @media (prefers-reduced-motion) block in globals.css only neutralises
// CSS keyframes and transitions — every Framer Motion animation ignored the
// preference entirely. reducedMotion="user" makes Framer honour it globally:
// transform and layout animations are skipped, opacity still cross-fades so
// content never gets stuck invisible.
// Children stay Server Components; only this provider is client-side.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
