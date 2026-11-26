import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Section } from '@/components/layout/section';
import { SectionDivider } from '@/components/ui/sectionDivider';
import { CTASection } from '@/components/shared/ctaSection';
import { ProjectJsonLd } from '@/components/shared/JsonLd';
import { GridBackground } from '@/components/shared/gridBackground';
import { Spotlight } from '@/components/shared/spotlight';
import { ProjectCard } from '@/components/sections/home/project/projectCard';
import { LightboxProvider } from '@/components/sections/caseStudy/lightbox';
import { SectionRenderer } from '@/components/sections/caseStudy/sectionRenderer';
import { ChapterNav } from '@/components/sections/caseStudy/chapterNav';
import { ReadingProgress } from '@/components/sections/caseStudy/readingProgress';
import { RecruiterSummary } from '@/components/sections/caseStudy/recruiterSummary';
import { CaseStudyView } from '@/components/sections/caseStudy/caseStudyView';
import { ProjectContactCta } from '@/components/sections/caseStudy/projectContactCta';
import { dotColorClass } from '@/lib/constants/categoryClasses';
import { getCategoryColor, getCategoryLabel } from '@/lib/services/categories';
import { getToolsBySlug } from '@/lib/services/tools';
import { getWorkItem, getWorkItems } from '@/lib/services/work';
import { chaptersFrom } from '@/types/caseStudy';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils/cn';

// One renderer, two presentations.
//
// The chrome is driven by the content rather than by the project type: the
// chapter navigation and reading-progress bar appear once a project has enough
// headed sections to need them, and stay out of the way when it does not. That
// is why a short website write-up and a nineteen-section case study can share
// one template without either being padded or cramped.

const STATUS_LABEL: Record<string, string> = {
  concept: 'Concept',
  'in-progress': 'In progress',
  completed: 'Completed',
  live: 'Live',
  beta: 'Beta',
};

/** A case study earns its reading chrome at three headed sections. */
const CHROME_THRESHOLD = 3;

export async function generateStaticParams() {
  const items = await getWorkItems();
  return items.filter((item) => item.kind === 'project').map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getWorkItem(slug);
  if (!project) return { title: 'Project not found' };

  const image = project.image.startsWith('http')
    ? project.image
    : `${siteConfig.url}${project.image}`;

  // A page still carrying placeholder copy stays out of Google while remaining
  // visible on the Work page. Publishing and indexing are separate decisions.
  const thin = project.isPlaceholderCover && !project.caseStudySections?.length;

  return {
    title: project.name,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    robots: thin ? { index: false, follow: true } : undefined,
    openGraph: {
      title: `${project.name} — AJIX`,
      description: project.description,
      url: `/projects/${project.slug}`,
      type: 'article',
      images: [{ url: image, width: 1200, height: 630, alt: project.name }],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getWorkItem(slug);
  if (!project || project.kind !== 'project') notFound();

  const all = await getWorkItems();

  // Related work: whatever was chosen in Sanity, otherwise siblings of the
  // same type. Never the project itself.
  const chosen = project.relatedSlugs ?? [];
  const related = (
    chosen.length
      ? chosen
          .map((relatedSlug) => all.find((item) => item.slug === relatedSlug))
          .filter((item): item is NonNullable<typeof item> => Boolean(item))
      : all.filter((item) => item.kind === 'project' && item.projectType === project.projectType)
  )
    .filter((item) => item.slug !== project.slug)
    .slice(0, 3);

  const sections = project.caseStudySections ?? [];
  const chapters = chaptersFrom(sections);
  const showChrome = chapters.length >= CHROME_THRESHOLD;

  const tools = getToolsBySlug(project.toolSlugs);
  const badgeColor = project.badge?.color ?? getCategoryColor(project.category);
  const badgeLabel = project.badge?.label ?? getCategoryLabel(project.category);
  const isWebsite = project.projectType === 'website';

  return (
    <LightboxProvider>
      <ProjectJsonLd
        project={{
          name: project.name,
          slug: project.slug,
          description: project.description,
          image: project.image,
          category: badgeLabel,
          year: project.year,
        }}
      />
      <CaseStudyView slug={project.slug} projectType={project.projectType} />
      {showChrome && <ReadingProgress />}

      {/* ---- Hero ---- */}
      <section className="relative w-full overflow-hidden px-6 pt-32 pb-12 md:px-10 lg:pt-40">
        <GridBackground />
        <div className="pointer-events-none absolute inset-0 z-1">
          <Spotlight className="-top-40 -left-10 h-screen md:-top-20 md:-left-32" fill="cyan" />
          <Spotlight className="top-10 left-full h-[80vh] w-[50vw]" fill="violet" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link
              href="/projects"
              className="text-muted hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-2 rounded text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              Back to all work
            </Link>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className="border-border bg-background/60 text-muted inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
              <span className={cn('h-1.5 w-1.5 rounded-full', dotColorClass[badgeColor])} />
              {badgeLabel}
            </span>
            {project.status && (
              <span className="border-border bg-background/60 text-muted rounded-full border px-3 py-1 text-xs">
                {STATUS_LABEL[project.status] ?? project.status}
              </span>
            )}
          </div>

          <h1 className="font-heading text-foreground mt-5 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            {project.name}
          </h1>
          <p className="text-muted mt-5 max-w-2xl text-base leading-relaxed md:text-lg">
            {project.description}
          </p>

          {/* A website project leads with the live site; that is the thing a
              visitor most wants from it. */}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'focus-visible:ring-ring mt-8 inline-flex h-11 items-center gap-2 rounded-lg px-6 text-sm font-medium transition-[filter] focus-visible:ring-2 focus-visible:outline-none',
                isWebsite
                  ? 'bg-gradient-secondary text-on-accent hover:brightness-110'
                  : 'border-border bg-gradient-surface text-foreground hover:bg-card border transition-colors',
              )}
            >
              Visit Website
              <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      </section>

      {/* ---- Cover + summary + metadata ---- */}
      <Section className="pt-0">
        <div className="border-border relative z-10 aspect-16/9 w-full overflow-hidden rounded-2xl border">
          <Image
            src={project.image}
            alt={project.name}
            fill
            preload
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-top"
          />
          {project.isPlaceholderCover && (
            <span className="bg-background/80 text-muted absolute bottom-3 left-3 rounded-md px-2 py-1 text-[11px] backdrop-blur-sm">
              Placeholder visual
            </span>
          )}
        </div>

        <div className="relative z-10 mt-10 w-full">
          <RecruiterSummary item={project} />
        </div>

        {tools.length > 0 && (
          <div className="relative z-10 mt-8 w-full">
            <h2 className="text-muted text-[11px] tracking-widest uppercase">Technology</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {tools.map((tool) => (
                <li
                  key={tool.slug}
                  className="border-border bg-background/60 text-muted rounded-md border px-3 py-1.5 text-sm"
                >
                  {tool.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        <SectionDivider className="mt-16" />
      </Section>

      {/* ---- Body ---- */}
      <Section className="pt-0">
        {sections.length > 0 ? (
          <div
            className={cn(
              'relative z-10 w-full',
              showChrome && 'lg:grid lg:grid-cols-[14rem_1fr] lg:gap-16',
            )}
          >
            {/* The nav needs a plain grid child around it: a grid item is
                stretched to the row height by default, and a sticky element
                that already fills its containing block has nowhere to travel.
                Wrapping it gives the sticky nav a tall parent to move within. */}
            {showChrome && (
              <div className="hidden lg:block">
                <ChapterNav chapters={chapters} projectSlug={project.slug} />
              </div>
            )}
            <div className="flex w-full min-w-0 flex-col gap-12">
              {sections.map((section) => (
                <SectionRenderer key={section._key} section={section} />
              ))}
            </div>
          </div>
        ) : (
          /* Honest about what is not here yet, rather than padding the page
             with invented process copy. */
          <div className="border-border bg-card/40 relative z-10 w-full rounded-2xl border border-dashed px-6 py-10 text-center">
            <p className="text-foreground font-heading text-lg font-semibold">
              Full case study in progress
            </p>
            <p className="text-muted mx-auto mt-2 max-w-md text-sm leading-relaxed">
              The research, process and outcomes for this project are being written up. In the
              meantime, I am happy to walk through it directly.
            </p>
            <div className="mt-6 flex justify-center">
              <ProjectContactCta slug={project.slug} label="Ask me about this project" />
            </div>
          </div>
        )}

        <SectionDivider className="mt-20" />
      </Section>

      {/* ---- Related ---- */}
      {related.length > 0 && (
        <Section className="pt-0">
          <h2 className="font-heading text-foreground w-full text-2xl font-semibold md:text-3xl">
            Related work
          </h2>
          <div className="relative z-10 mt-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProjectCard
                key={item.id}
                project={item}
                badge={item.badge}
                href={item.href}
                showMeta
                analyticsSource="work"
              />
            ))}
          </div>
          <SectionDivider className="mt-20" />
        </Section>
      )}

      <CTASection
        eyebrow="Let's build"
        title="Have a project in mind?"
        description="Let's turn complex ideas into intuitive, meaningful digital experiences."
        primaryLabel="Start a Project"
        primaryHref="/contact"
        secondaryAction={<ProjectContactCta slug={project.slug} label="Ask about this project" />}
      />
    </LightboxProvider>
  );
}
