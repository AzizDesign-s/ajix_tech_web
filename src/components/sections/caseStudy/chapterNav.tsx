'use client';

import { useEffect, useRef, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import type { Chapter } from '@/types/caseStudy';
import { cn } from '@/lib/utils/cn';

interface ChapterNavProps {
  chapters: Chapter[];
  projectSlug: string;
}

/**
 * Sticky chapter navigation with scroll-linked highlighting.
 *
 * IntersectionObserver rather than a scroll listener: the browser does the
 * work off the main thread and fires only when a section's visibility actually
 * changes, where a scroll handler runs on every frame whether anything changed
 * or not.
 *
 * Smooth scrolling is left to CSS (`scroll-behavior`), which already honours
 * prefers-reduced-motion globally — doing it in JavaScript would bypass that.
 */
export function ChapterNav({ chapters, projectSlug }: ChapterNavProps) {
  const [activeId, setActiveId] = useState<string | null>(chapters[0]?.id ?? null);
  // Which sections have already been reported, so the analytics event fires
  // once per section rather than on every scroll back and forth.
  const reported = useRef(new Set<string>());

  useEffect(() => {
    if (chapters.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // The topmost section currently intersecting wins, so scrolling up
        // highlights the section you are entering rather than the one you left.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length === 0) return;
        const id = visible[0].target.id;
        setActiveId(id);

        if (!reported.current.has(id)) {
          reported.current.add(id);
          trackEvent('case_study_section_view', { project: projectSlug, section: id });
        }
      },
      {
        // Top band of the viewport, below the fixed navbar. A section counts as
        // "being read" when it is near the top, not when it first peeks in.
        rootMargin: '-25% 0px -60% 0px',
        threshold: 0,
      },
    );

    for (const chapter of chapters) {
      const element = document.getElementById(chapter.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [chapters, projectSlug]);

  if (chapters.length < 3) return null;

  return (
    <nav aria-label="Case study sections" className="sticky top-28">
      <p className="text-muted text-[11px] tracking-widest uppercase">Contents</p>
      <ul className="border-border mt-4 space-y-1 border-l">
        {chapters.map((chapter) => {
          const active = chapter.id === activeId;
          return (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'focus-visible:ring-ring -ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  active
                    ? 'border-primary text-foreground'
                    : 'text-muted hover:text-foreground border-transparent',
                )}
              >
                {chapter.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
