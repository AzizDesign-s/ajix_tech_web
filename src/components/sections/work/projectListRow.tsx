'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Eye } from 'lucide-react';
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

interface ProjectListRowProps {
  item: WorkItem;
  onQuickView: () => void;
}

/**
 * The list view's row. A denser read of the same information as the card —
 * useful once there are thirty entries and you are scanning for one.
 *
 * Same link structure as the card in actions mode: one real link on the title,
 * covering the row via ::after, with the buttons lifted above it. Nesting a
 * button inside an anchor would be invalid and would swallow its clicks.
 */
export function ProjectListRow({ item, onQuickView }: ProjectListRowProps) {
  const tools = getToolsBySlug(item.toolSlugs).slice(0, 5);
  const badgeColor = item.badge?.color ?? getCategoryColor(item.category);
  const badgeLabel = item.badge?.label ?? getCategoryLabel(item.category);

  return (
    <li className="group border-border bg-card/40 hover:border-primary/40 hover:bg-card/70 relative flex flex-col gap-4 rounded-xl border p-4 transition-colors duration-300 sm:flex-row sm:items-center sm:gap-5">
      <div className="border-border relative h-32 w-full shrink-0 overflow-hidden rounded-lg border sm:h-20 sm:w-32">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 92vw, 128px"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="border-border bg-background/60 text-muted inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-[11px]">
            <span className={cn('h-1.5 w-1.5 rounded-full', dotColorClass[badgeColor])} />
            {badgeLabel}
          </span>
          {item.year && <span className="text-muted text-xs">{item.year}</span>}
          {item.status && (
            <span className="text-muted text-xs">{STATUS_LABEL[item.status] ?? item.status}</span>
          )}
          {item.featured && (
            <span className="border-primary/40 bg-primary/10 text-blue-light rounded-full border px-2.5 py-0.5 text-[11px] font-medium">
              Featured
            </span>
          )}
        </div>

        <h3 className="font-heading text-foreground mt-1.5 text-lg font-semibold">
          <Link
            href={item.href}
            onClick={() =>
              trackEvent('project_card_click', {
                project: item.slug,
                project_type: item.projectType,
                view: 'list',
              })
            }
            className="focus-visible:ring-primary rounded-sm after:absolute after:inset-0 after:z-0 after:content-[''] focus-visible:ring-2 focus-visible:outline-none"
          >
            {item.name}
          </Link>
        </h3>

        <p className="text-muted mt-1 line-clamp-2 text-sm leading-relaxed">{item.description}</p>

        {tools.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {tools.map((tool) => (
              <li key={tool.slug} className="text-muted text-[11px]">
                {tool.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative z-10 flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onQuickView}
          className="border-border text-muted hover:text-foreground hover:bg-card focus-visible:ring-ring inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <Eye size={14} aria-hidden="true" />
          Quick view
          <span className="sr-only"> — {item.name}</span>
        </button>
        <Link
          href={item.href}
          tabIndex={-1}
          aria-hidden="true"
          className="border-border bg-gradient-surface text-foreground hover:bg-card inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm transition-colors"
        >
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </li>
  );
}
