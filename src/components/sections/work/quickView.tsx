'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { dotColorClass } from '@/lib/constants/categoryClasses';
import { getCategoryColor, getCategoryLabel } from '@/lib/services/categories';
import { getToolsBySlug } from '@/lib/services/tools';
import { trackEvent } from '@/lib/analytics';
import type { WorkItem } from '@/types/work';
import { cn } from '@/lib/utils/cn';

const STATUS_LABEL: Record<string, string> = {
  concept: 'Concept',
  'in-progress': 'In progress',
  completed: 'Completed',
  live: 'Live',
  beta: 'Beta',
};

interface QuickViewProps {
  item: WorkItem | null;
  onClose: () => void;
}

/**
 * Preview of one entry without leaving the explorer.
 *
 * Deliberately opened from an explicit "Quick view" button rather than on card
 * hover: a hover-triggered modal is unreachable on a touch screen and hostile
 * to keyboard users, and it fires when someone is only passing the cursor over
 * the grid on their way somewhere else.
 */
export function QuickView({ item, onClose }: QuickViewProps) {
  // Keep the panel mounted with no item so the close transition can finish,
  // but render nothing inside it.
  const open = Boolean(item);
  const tools = item ? getToolsBySlug(item.toolSlugs) : [];
  const badgeColor = item?.badge?.color ?? (item ? getCategoryColor(item.category) : 'primary');
  const badgeLabel = item?.badge?.label ?? (item ? getCategoryLabel(item.category) : '');

  return (
    <Dialog open={open} onClose={onClose} title={item?.name ?? ''}>
      {item && (
        <div className="mt-6 grid gap-6 md:grid-cols-[1.1fr_1fr] md:gap-8">
          <div className="border-border relative aspect-16/10 w-full overflow-hidden rounded-xl border">
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 88vw, 480px"
              className="object-cover object-top"
            />
            {item.isPlaceholderCover && (
              <span className="bg-background/80 text-muted absolute bottom-2 left-2 rounded-md px-2 py-1 text-[11px] backdrop-blur-sm">
                Placeholder visual
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="border-border bg-background/60 text-muted inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
                <span className={cn('h-1.5 w-1.5 rounded-full', dotColorClass[badgeColor])} />
                {badgeLabel}
              </span>
              {item.featured && (
                <span className="border-primary/40 bg-primary/10 text-blue-light rounded-full border px-3 py-1 text-xs font-medium">
                  Featured
                </span>
              )}
            </div>

            <dl className="text-muted mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="text-[11px] tracking-wide uppercase">Role</dt>
                <dd className="text-foreground mt-0.5">
                  {item.projectType === 'uiux'
                    ? 'Product & UX Design'
                    : item.kind === 'product'
                      ? 'Product & Engineering'
                      : 'Design & Frontend'}
                </dd>
              </div>
              {item.year && (
                <div>
                  <dt className="text-[11px] tracking-wide uppercase">Year</dt>
                  <dd className="text-foreground mt-0.5">{item.year}</dd>
                </div>
              )}
              {item.status && (
                <div>
                  <dt className="text-[11px] tracking-wide uppercase">Status</dt>
                  <dd className="text-foreground mt-0.5">
                    {STATUS_LABEL[item.status] ?? item.status}
                  </dd>
                </div>
              )}
            </dl>

            <p className="text-muted mt-4 text-sm leading-relaxed">{item.description}</p>

            {tools.length > 0 && (
              <div className="mt-5">
                <h3 className="text-muted text-[11px] tracking-wide uppercase">Technologies</h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {tools.map((tool) => (
                    <li
                      key={tool.slug}
                      className="border-border bg-background/60 text-muted rounded-md border px-2.5 py-1 text-xs"
                    >
                      {tool.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
              <Link
                href={item.href}
                onClick={() =>
                  trackEvent('project_card_click', {
                    project: item.slug,
                    project_type: item.projectType,
                    from: 'quick_view',
                  })
                }
                className="bg-gradient-secondary text-on-accent focus-visible:ring-ring inline-flex h-11 items-center gap-2 rounded-lg px-6 text-sm font-medium transition-[filter] hover:brightness-110 focus-visible:ring-2 focus-visible:outline-none"
              >
                {item.primaryActionLabel}
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>

              {item.liveUrl && (
                <a
                  href={item.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('project_live_demo_click', { project: item.slug })}
                  className="border-border bg-gradient-surface text-foreground hover:bg-card focus-visible:ring-ring inline-flex h-11 items-center gap-2 rounded-lg border px-6 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  Visit Website
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
