'use client';

import { useRef, type MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getToolsBySlug } from '@/lib/services/tools';
import { dotColorClass } from '@/lib/constants/categoryClasses';
// import { getAllCategories, getCategoryLabel } from '@/lib/services/categories';
import { getCategoryLabel, getCategoryColor } from '@/lib/services/categories';
import { isInteractiveProject, type Project } from '@/types/project';
import { cn } from '@/lib/utils/cn';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const tools = getToolsBySlug(project.toolSlugs);

  //   const categoryColor =
  //     getAllCategories().find((c) => c.slug === project.category)?.color ?? 'primary';

  const categoryColor = getCategoryColor(project.category);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    cardRef.current?.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    cardRef.current?.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  }

  const href = isInteractiveProject(project) ? project.liveUrl : `/projects/${project.slug}`;
  const isExternal = isInteractiveProject(project);

  return (
    <Link
      href={href || '#'}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group focus-visible:ring-primary relative block overflow-hidden rounded-2xl p-px focus-visible:ring-2 focus-visible:outline-none"
      aria-label={`View ${project.name}`}
    >
      {/* Rotating gradient border — contained to the 1px ring via p-px above */}
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
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>

            <h3 className="font-heading text-foreground text-xl font-semibold md:text-2xl">
              {project.name}
            </h3>
            <p className="text-muted mt-2 text-sm leading-relaxed">{project.description}</p>

            {/* Tool icons — reveal true brand color on card hover */}
            <div className="mt-4 flex items-center gap-2">
              {tools.map((tool) =>
                tool.type === 'icon' ? (
                  <div
                    key={tool.slug}
                    title={tool.label}
                    className="border-border bg-card relative flex h-9 w-9 items-center justify-center rounded-md border"
                  >
                    <Image
                      src={`https://cdn.simpleicons.org/${tool.slug}/94a3b8`}
                      alt={tool.label}
                      width={16}
                      height={16}
                      unoptimized
                      className="absolute h-4 w-4 object-contain transition-opacity duration-300 group-hover:opacity-0"
                    />
                    <Image
                      src={`https://cdn.simpleicons.org/${tool.slug}`}
                      alt=""
                      aria-hidden="true"
                      width={16}
                      height={16}
                      unoptimized
                      className="absolute h-4 w-4 object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </div>
                ) : (
                  <div
                    key={tool.slug}
                    title={tool.label}
                    className="border-border bg-card text-muted group-hover:text-primary flex h-9 w-9 items-center justify-center rounded-md border text-[12px] font-bold transition-colors duration-300"
                  >
                    {tool.badgeText}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
