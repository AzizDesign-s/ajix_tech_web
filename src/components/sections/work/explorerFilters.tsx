'use client';

import { useRef, type KeyboardEvent } from 'react';
import { WORK_FILTER_LABELS, WORK_FILTER_ORDER, type WorkFilter } from '@/types/work';
import { cn } from '@/lib/utils/cn';

interface ExplorerFiltersProps {
  value: WorkFilter;
  counts: Record<WorkFilter, number>;
  onChange: (filter: WorkFilter) => void;
  labelledBy: string;
}

/**
 * A real radiogroup, matching the Contact page's intent selector.
 *
 * Roving tabindex: the whole group is one tab stop and arrow keys move between
 * filters. Four separate tab stops would be four things a keyboard user has to
 * pass through on the way to the grid.
 */
export function ExplorerFilters({ value, counts, onChange, labelledBy }: ExplorerFiltersProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(index: number) {
    onChange(WORK_FILTER_ORDER[index]);
    refs.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent, index: number) {
    const last = WORK_FILTER_ORDER.length - 1;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        select(index === last ? 0 : index + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        select(index === 0 ? last : index - 1);
        break;
      case 'Home':
        event.preventDefault();
        select(0);
        break;
      case 'End':
        event.preventDefault();
        select(last);
        break;
    }
  }

  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="flex flex-wrap gap-2">
      {WORK_FILTER_ORDER.map((filter, index) => {
        const selected = filter === value;
        const count = counts[filter] ?? 0;
        return (
          <button
            key={filter}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => select(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              'focus-visible:ring-ring inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              selected
                ? 'border-primary bg-card text-foreground shadow-glow-blue'
                : 'border-border bg-card/60 text-muted hover:border-primary/50 hover:text-foreground',
            )}
          >
            {WORK_FILTER_LABELS[filter]}
            {/* Read as part of the option's name rather than announced
                separately, so the count travels with the label. */}
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs tabular-nums',
                selected ? 'bg-primary/15 text-blue-light' : 'bg-background/60',
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
