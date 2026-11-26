import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/shared/sectionHeader';
import { SectionGlow } from '@/components/shared/sectionGlow';
import { SectionDivider } from '@/components/ui/sectionDivider';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/sections/home/project/projectCard';
import { getFeaturedProjects } from '@/lib/services/project';
import { getSiteSettings } from '@/lib/services/siteSettings';

// Server Component, so awaiting the content source costs no client JS and no
// loading state. The markup below is unchanged from the hardcoded version —
// only where the projects come from changed.
export async function SelectedProjects() {
  const { homepageFeaturedLimit } = await getSiteSettings();
  const featuredProjects = await getFeaturedProjects(homepageFeaturedLimit);

  const leftColumn = featuredProjects.filter((_, i) => i % 2 === 0);
  const rightColumn = featuredProjects.filter((_, i) => i % 2 !== 0);

  return (
    <Section className="relative">
      <SectionGlow />

      <SectionHeader
        eyebrow="Selected Projects"
        title="A Closer Look at My Work"
        description="A collection of enterprise products, SaaS platforms, and interactive digital experiences spanning UI/UX design, frontend engineering, and modern web development."
        align="left"
        action={
          <Button variant="surface" size="md" href="/projects">
            View All Work
          </Button>
        }
      />

      {featuredProjects.length === 0 ? (
        /* Stable empty state. If nothing is marked "Featured on homepage" the
           section keeps its header and CTA rather than collapsing to a gap,
           so the page never looks broken while content is being curated. */
        <p className="text-muted relative z-10 mt-16 max-w-xl text-sm leading-relaxed">
          Selected work is being updated. In the meantime, the full archive is on the work page.
        </p>
      ) : (
        <div className="relative z-10 mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="mt-0 flex flex-col gap-6">
            {leftColumn.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          <div className="mt-14 flex flex-col gap-6">
            {rightColumn.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}

      <SectionDivider className="mt-20" />
    </Section>
  );
}
