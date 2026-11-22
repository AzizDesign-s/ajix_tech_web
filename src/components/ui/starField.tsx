import type { CSSProperties } from 'react';

interface Star {
  id: number;
  left: string;
  top: string;
  size: number;
  delay: number;
  duration: number;
}

function round(value: number, decimals = 3) {
  return Number(value.toFixed(decimals));
}

// Deterministic by design: a seeded pseudo-random source produces identical
// values on the server and in the browser, so there is no hydration mismatch
// and this can stay a Server Component (zero client JS).
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
  const stars = generateStars(count);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <span
          key={star.id}
          className="bg-primary animate-twinkle absolute rounded-full"
          style={
            {
              left: star.left,
              top: star.top,
              // These were `${star.size}` with no unit — an invalid CSS length,
              // so the browser dropped it and every star rendered at 0x0. Only
              // the box-shadow was visible, as a faint blur instead of a star.
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
              boxShadow: '0 0 4px 1px rgba(34, 211, 238, 0.8)',
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
