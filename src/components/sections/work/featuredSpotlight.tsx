import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Section } from '@/components/layout/section';
import { SectionGlow } from '@/components/shared/sectionGlow';
import { SectionDivider } from '@/components/ui/sectionDivider';
import { dotColorClass } from '@/lib/constants/categoryClasses';
import { getCategoryColor, getCategoryLabel } from '@/lib/services/categories';
import { getToolsBySlug } from '@/lib/services/tools';
import type { WorkItem } from '@/types/work';
import { cn } from '@/lib/utils/cn';

interface FeaturedSpotlightProps {
  item: WorkItem;
}

/**
 * Section 02 — one flagship project, chosen in Sanity via
 * siteSettings.spotlightProject. Never hardcoded: if no spotlight is set the
 * page falls back to the first featured entry, and if there is none the whole
 * section is not rendered.
 *
 * A Server Component. The cover is the page's LCP element on most viewports,
 * so it is `preload`ed and sized explicitly rather than lazily discovered.
 */
export function FeaturedSpotlight({ item }: FeaturedSpotlightProps) {
  const tools = getToolsBySlug(item.toolSlugs);
  const badgeColor = item.badge?.color ?? getCategoryColor(item.category);
  const badgeLabel = item.badge?.label ?? getCategoryLabel(item.category);

  return (
    <Section className="relative">
      <SectionGlow />

      <div className="border-border bg-card/40 group relative z-10 w-full overflow-hidden rounded-3xl border backdrop-blur-xl">
        <div
          aria-hidden="true"
          className="bg-gradient-primary pointer-events-none absolute inset-x-0 top-0 h-px opacity-60"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
          <div className="border-border relative aspect-16/10 w-full overflow-hidden lg:aspect-auto lg:border-r">
            <Image
              src={item.image}
              alt={item.name}
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            {item.isPlaceholderCover && (
              <span className="bg-background/80 text-muted absolute bottom-3 left-3 rounded-md px-2 py-1 text-[11px] backdrop-blur-sm">
                Placeholder visual
              </span>
            )}
          </div>

          <div className="flex flex-col justify-center gap-5 p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="border-border bg-background/60 text-muted inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
                <span className={cn('h-1.5 w-1.5 rounded-full', dotColorClass[badgeColor])} />
                {badgeLabel}
              </span>
              <span className="border-primary/40 bg-primary/10 text-blue-light rounded-full border px-3 py-1 text-xs font-medium">
                Spotlight
              </span>
            </div>

            <h2 className="font-heading text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
              {item.name}
            </h2>

            <dl className="text-muted flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <div>
                <dt className="text-[11px] tracking-wide uppercase">Role</dt>
                <dd className="text-foreground mt-0.5">
                  {item.projectType === 'uiux' ? 'Product & UX Design' : 'Design & Frontend'}
                </dd>
              </div>
              {item.year && (
                <div>
                  <dt className="text-[11px] tracking-wide uppercase">Year</dt>
                  <dd className="text-foreground mt-0.5">{item.year}</dd>
                </div>
              )}
            </dl>

            <p className="text-muted text-base leading-relaxed">{item.description}</p>

            {tools.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <li
                    key={tool.slug}
                    className="border-border bg-background/60 text-muted rounded-md border px-2.5 py-1 text-xs"
                  >
                    {tool.label}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Link
                href={item.href}
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
                  className="border-border bg-gradient-surface text-foreground hover:bg-card focus-visible:ring-ring inline-flex h-11 items-center rounded-lg border px-6 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  Visit Website
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <SectionDivider className="mt-20" />
    </Section>
  );
}
