import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/shared/sectionHeader';
import { SectionGlow } from '@/components/shared/sectionGlow';
import { SectionDivider } from '@/components/ui/sectionDivider';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/sections/home/project/projectCard';
import { getFeaturedProjects } from '@/lib/services/project';

export function SelectedProjects() {
  const featuredProjects = getFeaturedProjects(6);
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

      <SectionDivider className="mt-20" />
    </Section>
  );
}
