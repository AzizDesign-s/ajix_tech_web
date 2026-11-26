'use client';

import { useRef, type MouseEvent, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Eye } from 'lucide-react';
import { getToolsBySlug } from '@/lib/services/tools';
import { dotColorClass } from '@/lib/constants/categoryClasses';
import { getCategoryLabel, getCategoryColor } from '@/lib/services/categories';
import {
  PROJECT_CATEGORIES,
  type ProjectCategory,
  type ProjectStatus,
  type ProjectType,
} from '@/types/project';
import type { CategoryColor } from '@/types/category';
import { projectDetailPagesEnabled } from '@/config/site';
import { cn } from '@/lib/utils/cn';
import { trackEvent } from '@/lib/analytics';

/**
 * What the card needs in order to render.
 *
 * Widened from `Project` so a SaaS product can use the same card without being
 * forced into the project union. Every `Project` satisfies this shape, so the
 * homepage call site is unchanged.
 */
export interface ProjectCardItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ProjectCategory;
  toolSlugs: string[];
  image: string;
  projectType?: ProjectType;
  year?: string;
  status?: ProjectStatus;
  liveUrl?: string;
  featured?: boolean;
  isPlaceholderCover?: boolean;
}

const STATUS_LABEL: Record<ProjectStatus, string> = {
  concept: 'Concept',
  'in-progress': 'In progress',
  completed: 'Completed',
  live: 'Live',
  beta: 'Beta',
};

interface ProjectCardProps {
  project: ProjectCardItem;

  // ---- Everything below is optional and defaults to the homepage render. ----

  /** Overrides the category badge. Used by SaaS products, which have no category. */
  badge?: { label: string; color: CategoryColor };
  /** Where the card's primary link points. Defaults to the project detail page. */
  href?: string;
  /** Shows the year and status row under the title. */
  showMeta?: boolean;
  /** Shows the CTA row. Turning this on also makes the card a <div> rather than
   *  a <Link>, because nesting buttons inside an anchor is invalid and traps
   *  keyboard users. The title becomes the link and covers the card instead. */
  showActions?: boolean;
  /** Label for the primary CTA. Category-specific on the Work page. */
  primaryActionLabel?: string;
  /** Rendered after the primary CTA — e.g. "Visit Website". */
  secondaryAction?: ReactNode;
  /** Opens the Quick View dialog. Omit to hide the button. */
  onQuickView?: () => void;
  /** Where a click is reported from, so homepage and Work page are separable. */
  analyticsSource?: 'homepage' | 'work';
  className?: string;
}

export function ProjectCard({
  project,
  badge,
  href: hrefOverride,
  showMeta = false,
  showActions = false,
  primaryActionLabel = 'View Project',
  secondaryAction,
  onQuickView,
  analyticsSource = 'homepage',
  className,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  // Cached on enter instead of read on every mousemove — getBoundingClientRect()
  // forces a synchronous layout, and firing it per pointer event was the main
  // source of layout thrashing in this card.
  const rectRef = useRef<DOMRect | null>(null);
  const tools = getToolsBySlug(project.toolSlugs);

  const badgeColor = badge?.color ?? getCategoryColor(project.category);
  const badgeLabel = badge?.label ?? getCategoryLabel(project.category);

  function handleMouseEnter() {
    rectRef.current = cardRef.current?.getBoundingClientRect() ?? null;
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = rectRef.current;
    if (!rect || !cardRef.current) return;
    cardRef.current.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  }

  // Interactive projects open their live site; everything else points at a
  // /projects/[slug] detail page. Before those routes existed the card dropped
  // its link wrapper rather than render an href that 404s — that is what
  // projectDetailPagesEnabled in config/site.ts still guards.
  const isExternal =
    project.category === PROJECT_CATEGORIES.INTERACTIVE_EXPERIENCE && !hrefOverride;
  const href =
    hrefOverride ??
    (isExternal
      ? (project.liveUrl ?? '')
      : projectDetailPagesEnabled
        ? `/projects/${project.slug}`
        : '');
  const isLinked = Boolean(href);

  function reportClick() {
    trackEvent(analyticsSource === 'work' ? 'project_card_click' : 'project_click', {
      project: project.slug,
      external: isExternal,
      project_type: project.projectType,
    });
  }

  const shellClasses = cn(
    'group relative block overflow-hidden rounded-2xl p-px',
    isLinked &&
      !showActions &&
      'focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none',
    className,
  );

  const cardBody = (
    <>
      {/* Base border — always visible */}
      <span aria-hidden="true" className="border-border absolute inset-0 rounded-2xl border" />

      {/* Comet beam — short bright arc that sweeps around the ring on hover */}
      <span
        aria-hidden="true"
        className="group-hover:animate-spin-slow absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'conic-gradient(from var(--angle), var(--color-cyan) 0%, var(--color-primary) 6%, var(--color-violet) 12%, transparent 22%, transparent 100%)',
        }}
      />

      {/* Opaque backing — blocks the gradient/border layer from bleeding
          through the translucent glass content below */}
      <div className="bg-gradient-surface relative overflow-hidden rounded-2xl">
        <div
          ref={cardRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          className="bg-card/60 relative overflow-hidden rounded-2xl p-5 backdrop-blur-xl"
        >
          {/* Cursor-tracked spotlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                'radial-gradient(280px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in srgb, var(--color-primary) 18%, transparent), transparent 70%)',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute -top-1/3 -left-1/3 h-2/3 w-2/3 rotate-12 rounded-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:translate-x-4 group-hover:translate-y-2"
          />

          {/* Top edge highlight */}
          <div
            aria-hidden="true"
            className="absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent"
          />

          <div className="relative z-10">
            {/* Category badge, plus the featured marker when asked for */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <div className="border-border bg-background/60 text-muted inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
                <span className={cn('h-1.5 w-1.5 rounded-full', dotColorClass[badgeColor])} />
                {badgeLabel}
              </div>
              {showMeta && project.featured && (
                <div className="border-primary/40 bg-primary/10 text-blue-light inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
                  Featured
                </div>
              )}
            </div>

            {/* Project image */}
            <div className="border-border relative mb-5 h-48 w-full overflow-hidden rounded-xl border">
              <Image
                src={project.image}
                alt={project.name}
                fill
                sizes="(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 600px"
                className="pointer-events-none object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {showMeta && project.isPlaceholderCover && (
                <span className="bg-background/80 text-muted absolute bottom-2 left-2 rounded-md px-2 py-1 text-[11px] backdrop-blur-sm">
                  Placeholder visual
                </span>
              )}
            </div>

            <h3 className="font-heading text-foreground text-xl font-semibold md:text-2xl">
              {/* When actions are shown the card is a <div>, so the title carries
                  the link and its ::after covers the card. That keeps one link
                  per card for screen readers while the whole surface stays
                  clickable — and leaves the buttons genuinely clickable, which
                  they would not be inside an anchor. */}
              {showActions && isLinked ? (
                <Link
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  onClick={reportClick}
                  className="focus-visible:ring-primary rounded-sm after:absolute after:inset-0 after:z-0 after:content-[''] focus-visible:ring-2 focus-visible:outline-none"
                >
                  {project.name}
                  {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
                </Link>
              ) : (
                <>
                  {project.name}
                  {isLinked && isExternal && <span className="sr-only"> (opens in a new tab)</span>}
                </>
              )}
            </h3>

            {showMeta && (project.year || project.status) && (
              <div className="text-muted mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                {project.year && <span>{project.year}</span>}
                {project.year && project.status && (
                  <span aria-hidden="true" className="bg-border h-1 w-1 rounded-full" />
                )}
                {project.status && <span>{STATUS_LABEL[project.status]}</span>}
              </div>
            )}

            <p className="text-muted mt-2 text-sm leading-relaxed">{project.description}</p>

            {/* Tool icons — reveal true brand color on card hover */}
            <div className="mt-4 flex items-center gap-2">
              {tools.map((tool) => (
                <div
                  key={tool.slug}
                  title={tool.label}
                  className="border-border bg-card relative flex h-9 w-9 items-center justify-center rounded-md border"
                >
                  {tool.type === 'icon' ? (
                    <Image
                      src={`/icons/tools/${tool.slug}.svg`}
                      alt={tool.label}
                      width={16}
                      height={16}
                      className="tool-icon h-4 w-4 object-contain"
                    />
                  ) : (
                    <span className="text-muted group-hover:text-primary text-[12px] font-bold transition-colors duration-300">
                      {tool.badgeText}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {showActions && (
              /* z-10 lifts these above the title link's ::after overlay, so a
                 click on a button is a click on that button. */
              <div className="relative z-10 mt-5 flex flex-wrap items-center gap-2">
                {isLinked && (
                  <Link
                    href={href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    onClick={reportClick}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="border-border bg-gradient-surface text-foreground hover:bg-card focus-visible:ring-ring inline-flex h-9 items-center gap-1.5 rounded-md border px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {primaryActionLabel}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                )}
                {secondaryAction}
                {onQuickView && (
                  <button
                    type="button"
                    onClick={onQuickView}
                    className="border-border text-muted hover:text-foreground hover:bg-card focus-visible:ring-ring inline-flex h-9 items-center gap-1.5 rounded-md border px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <Eye size={14} aria-hidden="true" />
                    Quick view
                    <span className="sr-only"> — {project.name}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  // No aria-label here: the card's visible content (category, name, description)
  // already forms the accessible name. An aria-label that omitted that text was
  // failing WCAG 2.5.3 "Label in Name" on every card.
  if (showActions || !isLinked) {
    return <div className={shellClasses}>{cardBody}</div>;
  }

  return (
    <Link
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onClick={reportClick}
      className={shellClasses}
    >
      {cardBody}
    </Link>
  );
}
