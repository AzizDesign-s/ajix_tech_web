import { cn } from '@/lib/utils/cn';

/**
 * AIRA, as an original abstract figure — a luminous presence rather than a
 * depicted person. Pure SVG: gradients and strokes, no raster, no filters.
 *
 * Deliberately no feGaussianBlur. Large blur filters are rasterised on the CPU
 * and were already identified as the most expensive paint on the dark pages;
 * layered radial gradients give the same soft bloom for a fraction of the cost.
 *
 * This renders whenever `airaConfig.src` is unset, and as the runtime fallback
 * if a real asset fails to load. It is decorative, so it is hidden from
 * assistive technology — the surrounding copy carries all the meaning.
 */
export function AiraPlaceholder({ className }: { className?: string }) {
  // Horizontal light bands across the figure, suggesting a holographic form.
  const bands = Array.from({ length: 40 }, (_, i) => {
    const y = 84 + i * 13;
    // Fade the bands out towards the base so the figure dissolves into light.
    const falloff = 1 - Math.pow(i / 40, 1.6);
    return { y, opacity: (0.09 + (i % 3 === 0 ? 0.12 : 0.04)) * falloff };
  });

  return (
    <svg
      viewBox="0 0 440 620"
      className={cn('aira-figure h-full w-full', className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="aira-aura" cx="50%" cy="38%" r="58%">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.20" />
          <stop offset="45%" stopColor="#2563eb" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="aira-body" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="38%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>

        <radialGradient id="aira-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.72" />
          <stop offset="35%" stopColor="#22d3ee" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="aira-dissolve" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbfbfd" stopOpacity="0" />
          <stop offset="78%" stopColor="#fbfbfd" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fbfbfd" stopOpacity="1" />
        </linearGradient>

        {/* Head and torso as one silhouette, used to clip the light bands. */}
        <clipPath id="aira-silhouette">
          <circle cx="220" cy="160" r="70" />
          <path d="M180 222c-40 10-66 50-80 108-20 76-31 158-36 248h312c-5-90-16-172-36-248-14-58-40-98-80-108z" />
        </clipPath>
      </defs>

      {/* Ambient bloom */}
      <ellipse cx="220" cy="260" rx="215" ry="255" fill="url(#aira-aura)" />

      {/* Concentric light rings */}
      <g className="aira-rings" stroke="#2563eb" fill="none">
        <circle cx="220" cy="160" r="112" strokeOpacity="0.16" strokeWidth="1" />
        <circle cx="220" cy="160" r="158" strokeOpacity="0.10" strokeWidth="1" />
        <circle cx="220" cy="160" r="208" strokeOpacity="0.05" strokeWidth="1" />
      </g>

      <g clipPath="url(#aira-silhouette)">
        {/* Base form */}
        <rect x="0" y="0" width="440" height="620" fill="url(#aira-body)" opacity="0.2" />
        {/* Light bands */}
        {bands.map((band) => (
          <rect
            key={band.y}
            x="0"
            y={band.y}
            width="440"
            height="5"
            fill="url(#aira-body)"
            opacity={band.opacity}
          />
        ))}
        {/* Edge definition down the left of the form */}
        <path
          d="M180 222c-40 10-66 50-80 108-20 76-31 158-36 248"
          fill="none"
          stroke="url(#aira-body)"
          strokeOpacity="0.45"
          strokeWidth="1.5"
        />
      </g>

      {/* Crown arc */}
      <path
        d="M150 160a70 70 0 0 1 140 0"
        fill="none"
        stroke="url(#aira-body)"
        strokeOpacity="0.55"
        strokeWidth="1.5"
      />

      {/* Inner light */}
      <circle className="aira-core" cx="220" cy="158" r="62" fill="url(#aira-core)" />

      {/* Dissolve the base into the page */}
      <rect x="0" y="430" width="440" height="190" fill="url(#aira-dissolve)" />
    </svg>
  );
}
