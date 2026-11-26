'use client';

import { useId, type ChangeEvent } from 'react';
import { LayoutGrid, List, Search, X } from 'lucide-react';
import type { WorkView } from '@/types/work';
import { cn } from '@/lib/utils/cn';

interface ExplorerToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  view: WorkView;
  onViewChange: (view: WorkView) => void;
  resultCount: number;
}

/** Search field and grid/list toggle. */
export function ExplorerToolbar({
  query,
  onQueryChange,
  view,
  onViewChange,
  resultCount,
}: ExplorerToolbarProps) {
  const inputId = useId();

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <label htmlFor={inputId} className="sr-only">
          Search projects
        </label>
        <Search
          size={16}
          aria-hidden="true"
          className="text-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
        />
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onQueryChange(event.target.value)}
          placeholder="Search projects"
          // Announces the result count as it changes, so a screen-reader user
          // filtering by text is not left guessing whether anything matched.
          aria-describedby={`${inputId}-count`}
          className="border-border bg-card/60 text-foreground placeholder:text-muted focus-visible:border-primary focus-visible:ring-ring h-10 w-full rounded-lg border pr-9 pl-9 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
            className="text-muted hover:text-foreground focus-visible:ring-ring absolute top-1/2 right-2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded focus-visible:ring-2 focus-visible:outline-none"
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <p id={`${inputId}-count`} aria-live="polite" className="text-muted text-sm">
          {resultCount} {resultCount === 1 ? 'project' : 'projects'}
        </p>

        <div
          role="group"
          aria-label="Layout"
          className="border-border bg-card/60 inline-flex items-center rounded-lg border p-1"
        >
          {(
            [
              { id: 'grid' as const, label: 'Grid view', Icon: LayoutGrid },
              { id: 'list' as const, label: 'List view', Icon: List },
            ] satisfies Array<{ id: WorkView; label: string; Icon: typeof LayoutGrid }>
          ).map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onViewChange(id)}
              aria-pressed={view === id}
              aria-label={label}
              className={cn(
                'focus-visible:ring-ring inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none',
                view === id ? 'bg-primary/15 text-blue-light' : 'text-muted hover:text-foreground',
              )}
            >
              <Icon size={16} aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
