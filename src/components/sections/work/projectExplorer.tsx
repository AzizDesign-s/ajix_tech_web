'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/shared/sectionHeader';
import { SectionDivider } from '@/components/ui/sectionDivider';
import { ProjectCard } from '@/components/sections/home/project/projectCard';
import { ExplorerFilters } from '@/components/sections/work/explorerFilters';
import { ExplorerToolbar } from '@/components/sections/work/explorerToolbar';
import { ProjectListRow } from '@/components/sections/work/projectListRow';
import { QuickView } from '@/components/sections/work/quickView';
import { trackEvent } from '@/lib/analytics';
import {
  WORK_FILTER_LABELS,
  WORK_FILTER_ORDER,
  isWorkFilter,
  isWorkView,
  type WorkFilter,
  type WorkItem,
  type WorkView,
} from '@/types/work';

/** How many entries render before "Show more". */
const PAGE_SIZE = 12;

interface ProjectExplorerProps {
  items: WorkItem[];
}

/**
 * Sections 03, 04 and 05 — filters, gallery and quick view.
 *
 * All filtering happens in memory over a list the server already sent, so
 * changing a filter costs no request and no reload. The URL is kept in step
 * with `router.replace(..., { scroll: false })` so a filtered view can be
 * shared or bookmarked, without pushing a history entry for every chip press —
 * otherwise Back would walk through filter changes instead of leaving the page.
 */
export function ProjectExplorer({ items }: ProjectExplorerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const headingId = useId();

  const urlFilter = searchParams.get('filter');
  const urlView = searchParams.get('view');
  const urlQuery = searchParams.get('q') ?? '';

  const [filter, setFilter] = useState<WorkFilter>(isWorkFilter(urlFilter) ? urlFilter : 'all');
  const [view, setView] = useState<WorkView>(isWorkView(urlView) ? urlView : 'grid');
  const [query, setQuery] = useState(urlQuery);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [quickViewItem, setQuickViewItem] = useState<WorkItem | null>(null);

  const counts = useMemo(() => {
    const result = Object.fromEntries(WORK_FILTER_ORDER.map((f) => [f, 0])) as Record<
      WorkFilter,
      number
    >;
    result.all = items.length;
    for (const item of items) {
      const key = item.projectType;
      if (key && key in result) result[key as WorkFilter] += 1;
    }
    return result;
  }, [items]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (filter !== 'all' && item.projectType !== filter) return false;
      if (needle && !item.searchText.includes(needle)) return false;
      return true;
    });
  }, [items, filter, query]);

  const shown = filtered.slice(0, visible);

  // Writes the current state to the URL.
  //
  // window.history.replaceState, not router.replace(). Next documents the
  // History API as the supported way to shallow-route, and it stays in sync
  // with useSearchParams. router.replace() is a no-op on this page: /projects
  // is statically prerendered, so a search-param-only change leaves the route
  // tree identical and the router skips it — the filter worked but the URL
  // never moved. The History API also avoids an RSC round-trip for what is
  // purely client-side filtering.
  //
  // replaceState rather than pushState so Back leaves the page instead of
  // walking the user through every chip they pressed.
  //
  // Params sitting at their default are removed rather than written as
  // `filter=all`, so a clean view has a clean URL.
  const syncUrl = useCallback(
    (next: { filter?: WorkFilter; view?: WorkView; q?: string }) => {
      if (typeof window === 'undefined') return;

      const params = new URLSearchParams(window.location.search);
      const set = (key: string, value: string, fallback: string) => {
        if (value === fallback) params.delete(key);
        else params.set(key, value);
      };
      if (next.filter !== undefined) set('filter', next.filter, 'all');
      if (next.view !== undefined) set('view', next.view, 'grid');
      if (next.q !== undefined) set('q', next.q.trim(), '');

      const search = params.toString();
      window.history.replaceState(null, '', search ? `${pathname}?${search}` : pathname);
    },
    [pathname],
  );

  function handleFilterChange(next: WorkFilter) {
    setFilter(next);
    setVisible(PAGE_SIZE);
    syncUrl({ filter: next });
    trackEvent('project_filter_select', { filter: next, result_count: counts[next] ?? 0 });
  }

  function handleViewChange(next: WorkView) {
    setView(next);
    syncUrl({ view: next });
  }

  function handleQueryChange(next: string) {
    setQuery(next);
    setVisible(PAGE_SIZE);
    syncUrl({ q: next });
  }

  // The search event is debounced and deliberately carries no query text.
  // A search box is free text: people type their own name, an email address,
  // anything. Sending that to GA4 would be exactly the personal-data leak the
  // brief forbids, so only a length and a result count go out.
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      trackEvent('project_search', {
        query_length: trimmed.length,
        result_count: filtered.length,
      });
    }, 500);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [query, filtered.length]);

  function openQuickView(item: WorkItem) {
    setQuickViewItem(item);
    trackEvent('project_quick_view', { project: item.slug, project_type: item.projectType });
  }

  const itemTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <Section id="explore" className="relative">
      <SectionHeader
        eyebrow="Project Explorer"
        title="Browse the full archive"
        description="Filter by discipline, search by name or technology, and switch between a visual grid and a scannable list."
        align="left"
        titleId={headingId}
      />

      <div className="relative z-10 mt-10 flex w-full flex-col gap-5">
        <ExplorerFilters
          value={filter}
          counts={counts}
          onChange={handleFilterChange}
          labelledBy={headingId}
        />
        <ExplorerToolbar
          query={query}
          onQueryChange={handleQueryChange}
          view={view}
          onViewChange={handleViewChange}
          resultCount={filtered.length}
        />
      </div>

      <div className="relative z-10 mt-10 w-full">
        {shown.length === 0 ? (
          <EmptyState
            filter={filter}
            query={query}
            onReset={() => {
              setFilter('all');
              setQuery('');
              setVisible(PAGE_SIZE);
              syncUrl({ filter: 'all', q: '' });
            }}
          />
        ) : view === 'grid' ? (
          <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={itemTransition}
                >
                  <ProjectCard
                    project={item}
                    badge={item.badge}
                    href={item.href}
                    showMeta
                    showActions
                    primaryActionLabel={item.primaryActionLabel}
                    analyticsSource="work"
                    onQuickView={() => openQuickView(item)}
                    secondaryAction={
                      item.liveUrl ? (
                        <a
                          href={item.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            trackEvent('project_live_demo_click', { project: item.slug })
                          }
                          className="border-border text-muted hover:text-foreground hover:bg-card focus-visible:ring-ring inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                        >
                          Visit Website
                          <span className="sr-only"> — {item.name} (opens in a new tab)</span>
                        </a>
                      ) : undefined
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.ul layout className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={itemTransition}
                >
                  <ProjectListRow item={item} onQuickView={() => openQuickView(item)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}

        {filtered.length > shown.length && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setVisible((current) => current + PAGE_SIZE)}
              className="border-border bg-gradient-surface text-foreground hover:bg-card focus-visible:ring-ring inline-flex h-11 items-center rounded-lg border px-6 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              Show more
              <span className="text-muted ml-2">({filtered.length - shown.length} remaining)</span>
            </button>
          </div>
        )}
      </div>

      <QuickView item={quickViewItem} onClose={() => setQuickViewItem(null)} />

      <SectionDivider className="mt-20" />
    </Section>
  );
}

function EmptyState({
  filter,
  query,
  onReset,
}: {
  filter: WorkFilter;
  query: string;
  onReset: () => void;
}) {
  const hasQuery = query.trim().length > 0;

  return (
    <div className="border-border bg-card/40 flex flex-col items-center rounded-2xl border border-dashed px-6 py-16 text-center">
      <p className="text-foreground font-heading text-xl font-semibold">
        {hasQuery ? 'Nothing matched that search' : `No ${WORK_FILTER_LABELS[filter]} yet`}
      </p>
      <p className="text-muted mt-2 max-w-md text-sm leading-relaxed">
        {hasQuery
          ? 'Try a shorter search, or clear it to see everything.'
          : 'This category has nothing published yet. The other categories do.'}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="border-border bg-gradient-surface text-foreground hover:bg-card focus-visible:ring-ring mt-6 inline-flex h-10 items-center rounded-lg border px-5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        Show all work
      </button>
    </div>
  );
}
