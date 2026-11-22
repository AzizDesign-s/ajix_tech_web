'use client';

import { useRef, type MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getToolsBySlug } from '@/lib/services/tools';
import { dotColorClass } from '@/lib/constants/categoryClasses';
import { getCategoryLabel, getCategoryColor } from '@/lib/services/categories';
import { isInteractiveProject, type Project } from '@/types/project';
import { projectDetailPagesEnabled } from '@/config/site';
import { cn } from '@/lib/utils/cn';
import { trackEvent } from '@/lib/analytics';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  // Cached on enter instead of read on every mousemove — getBoundingClientRect()
  // forces a synchronous layout, and firing it per pointer event was the main
  // source of layout thrashing in this card.
  const rectRef = useRef<DOMRect | null>(null);
  const tools = getToolsBySlug(project.toolSlugs);

  const categoryColor = getCategoryColor(project.category);

  function handleMouseEnter() {
    rectRef.current = cardRef.current?.getBoundingClientRect() ?? null;
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = rectRef.current;
    if (!rect || !cardRef.current) return;
    cardRef.current.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  }

  // Interactive projects open their live site; everything else would point at a
  // /projects/[slug] detail page, which does not exist yet. Rather than render a
  // link that 404s (or an empty href="#" that opens a blank tab), the card drops
  // its link wrapper until there is somewhere real to go. Flip
  // projectDetailPagesEnabled in config/site.ts once those routes ship.
  const isExternal = isInteractiveProject(project);
  const href = isExternal
    ? project.liveUrl
    : projectDetailPagesEnabled
      ? `/projects/${project.slug}`
      : '';
  const isLinked = Boolean(href);

  const shellClasses = cn(
    'group relative block overflow-hidden rounded-2xl p-px',
    isLinked && 'focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none',
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
            {/* Category badge */}
            <div className="border-border bg-background/60 text-muted mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
              <span className={cn('h-1.5 w-1.5 rounded-full', dotColorClass[categoryColor])} />
              {getCategoryLabel(project.category)}
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
            </div>

            <h3 className="font-heading text-foreground text-xl font-semibold md:text-2xl">
              {project.name}
              {isLinked && isExternal && <span className="sr-only"> (opens in a new tab)</span>}
            </h3>
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
          </div>
        </div>
      </div>
    </>
  );

  // No aria-label here: the card's visible content (category, name, description)
  // already forms the accessible name. An aria-label that omitted that text was
  // failing WCAG 2.5.3 "Label in Name" on every card.
  if (!isLinked) {
    return <div className={shellClasses}>{cardBody}</div>;
  }

  return (
    <Link
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onClick={() => trackEvent('project_click', { project: project.slug, external: isExternal })}
      className={shellClasses}
    >
      {cardBody}
    </Link>
  );
}
