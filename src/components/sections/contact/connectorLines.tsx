import type { CSSProperties } from 'react';

/**
 * Fine curves linking the floating cards to the character, picking up the
 * connected-composition cue from the Mindly reference. Decorative only, and
 * desktop only — at narrow widths the cards sit in a grid and there is nothing
 * meaningful to connect.
 *
 * preserveAspectRatio="none" lets the curves stretch with the container, so
 * they keep meeting the cards as the composition reflows.
 */
// Co-ordinates are calibrated to where the four cards actually sit in the
// desktop composition, each curve running from the card's inner edge toward
// the character. If the card offsets in contactHero.tsx change, these follow.
const CURVES = [
  { d: 'M 190 322 C 300 342, 400 352, 478 372', dash: 300, delay: '0.6s' },
  { d: 'M 812 258 C 700 292, 580 322, 522 356', dash: 320, delay: '0.75s' },
  { d: 'M 228 628 C 332 600, 420 540, 480 482', dash: 310, delay: '0.9s' },
  { d: 'M 772 584 C 680 570, 570 520, 522 472', dash: 300, delay: '1.05s' },
];

export function ConnectorLines() {
  return (
    <svg
      viewBox="0 0 1000 800"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
    >
      <defs>
        <linearGradient id="connector-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      {CURVES.map((curve) => (
        <path
          key={curve.d}
          d={curve.d}
          className="connector-line"
          fill="none"
          stroke="url(#connector-stroke)"
          strokeWidth="1"
          style={{ '--dash': curve.dash, animationDelay: curve.delay } as CSSProperties}
        />
      ))}
    </svg>
  );
}
