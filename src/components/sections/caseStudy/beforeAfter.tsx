'use client';

import { useId, useState } from 'react';
import Image from 'next/image';
import type { CaseStudyImage } from '@/types/caseStudy';

interface BeforeAfterProps {
  before: CaseStudyImage;
  after: CaseStudyImage;
  summary: string;
}

/**
 * Before/after comparison.
 *
 * The control is a real <input type="range">, not a draggable div. That means
 * it is keyboard-operable with arrow keys, Home and End for free, announces
 * itself as a slider, and works with a switch or any other assistive input —
 * none of which a mousedown/mousemove implementation gives you.
 *
 * The written summary below is not decoration: it is what the comparison says
 * for anyone who cannot operate a slider at all.
 */
export function BeforeAfter({ before, after, summary }: BeforeAfterProps) {
  const [position, setPosition] = useState(50);
  const sliderId = useId();

  return (
    <div className="w-full">
      <div className="border-border relative aspect-16/10 w-full overflow-hidden rounded-xl border select-none">
        {/* After sits underneath, fully visible. */}
        <Image
          src={after.url}
          alt={after.alt}
          fill
          sizes="(max-width: 768px) 92vw, 900px"
          className="object-cover object-top"
        />

        {/* Before is clipped from the right, revealing the after image. */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          aria-hidden="true"
        >
          <Image
            src={before.url}
            alt=""
            fill
            sizes="(max-width: 768px) 92vw, 900px"
            className="object-cover object-top"
          />
        </div>

        <div
          aria-hidden="true"
          className="bg-foreground/80 pointer-events-none absolute inset-y-0 w-0.5"
          style={{ left: `${position}%` }}
        />

        <span
          aria-hidden="true"
          className="bg-background/80 text-muted absolute top-3 left-3 rounded-md px-2 py-1 text-[11px] backdrop-blur-sm"
        >
          Before
        </span>
        <span
          aria-hidden="true"
          className="bg-background/80 text-muted absolute top-3 right-3 rounded-md px-2 py-1 text-[11px] backdrop-blur-sm"
        >
          After
        </span>
      </div>

      <div className="mt-4">
        <label htmlFor={sliderId} className="text-muted text-sm">
          Reveal position
        </label>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-valuetext={`${position}% before, ${100 - position}% after`}
          className="accent-primary focus-visible:ring-ring mt-2 w-full cursor-ew-resize focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        />
      </div>

      <p className="text-muted mt-4 leading-relaxed">{summary}</p>
    </div>
  );
}
