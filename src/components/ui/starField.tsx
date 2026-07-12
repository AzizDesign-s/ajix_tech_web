'use client';

import { useMemo } from 'react';

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
function round(value: number, decimals = 3) {
  return Number(value.toFixed(decimals));
}

function seededRandom(seed: number) {
  return Math.abs(Math.sin(seed * 999) * 10000) % 1;
}
function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${round(seededRandom(i) * 100)}%`,
    top: `${round(seededRandom(i + 1) * 100)}%`,
    size: round(seededRandom(i + 2) * 2 + 1),
    delay: round(seededRandom(i + 3) * 4),
    duration: round(seededRandom(i + 4) * 3 + 2),
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
            width: `${star.size}`,
            height: `${star.size}`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            boxShadow: '0 0 4px 1px rgba(34, 211, 238, 0.8)',
          }}
        />
      ))}
    </div>
  );
}
