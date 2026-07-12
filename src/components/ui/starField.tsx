'use client';

import { useEffect, useState, useMemo } from 'react';

interface Star {
  id: number;
  left: string;
  top: string;
  size: number;
  delay: number;
  duration: number;
}

// Generated client-side only, after mount — Math.random() would otherwise
// produce different values on the server vs. the browser and trigger a
// hydration mismatch (same class of bug as the browser-extension warning
// we hit earlier — avoiding it outright here rather than patching it after).
function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }));
}

interface StarfieldProps {
  count?: number;
}

export function Starfield({ count = 40 }: StarfieldProps) {
  const stars = useMemo(() => generateStars(count), [count]);

  // useEffect(() => {
  //   setStars(generateStars(count));
  // }, [count]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <span
          key={star.id}
          className="bg-primary animate-twinkle absolute rounded-full"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            boxShadow: '0 0 4px 1px rgba(34, 211, 238, 0.8)',
          }}
        />
      ))}
    </div>
  );
}
