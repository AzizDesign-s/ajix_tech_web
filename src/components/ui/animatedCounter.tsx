'use client';

import { useEffect, useRef } from 'react';
import { animate, useReducedMotion } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number; // seconds
}

// Counts up to `value` once it scrolls into view.
//
// Two things changed from the previous implementation:
//  1. The real number is rendered on the server. It used to render 0, so a
//     crawler — or anyone whose JS failed — saw "0+ Years of Experience".
//  2. The count is written straight to the DOM node instead of through React
//     state, which previously triggered a re-render on every animation frame
//     (~90 renders per counter, per animation).
export function AnimatedCounter({ value, suffix = '', duration = 1.5 }: AnimatedCounterProps) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = numberRef.current;
    // Reduced motion: leave the server-rendered final value in place.
    if (!el || prefersReducedMotion || typeof IntersectionObserver === 'undefined') return;

    let stop: (() => void) | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect(); // once only — no repeated triggers on re-entry
        el.textContent = '0';
        const controls = animate(0, value, {
          duration,
          ease: 'easeOut',
          onUpdate: (latest) => {
            el.textContent = String(Math.round(latest));
          },
          onComplete: () => {
            el.textContent = String(value); // land exactly on the real number
          },
        });
        stop = () => controls.stop();
      },
      { rootMargin: '-80px' },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      stop?.();
    };
  }, [value, duration, prefersReducedMotion]);

  return (
    <span>
      <span ref={numberRef}>{value}</span>
      {suffix}
    </span>
  );
}
