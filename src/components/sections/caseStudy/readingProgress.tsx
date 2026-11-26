'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

/**
 * Reading progress for long case studies.
 *
 * scaleX on a composited layer, not a width animation — width forces layout on
 * every scroll frame, transform does not. The spring is dropped entirely under
 * prefers-reduced-motion, where the bar still tracks progress but without the
 * easing.
 *
 * aria-hidden because it duplicates information the scrollbar already conveys;
 * announcing a percentage on every scroll frame would be noise.
 */
export function ReadingProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: reduceMotion ? scrollYProgress : smoothed }}
      className="bg-gradient-primary fixed inset-x-0 top-0 z-100 h-0.5 origin-left"
    />
  );
}
