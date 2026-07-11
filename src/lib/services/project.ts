import { projects } from '@/data/project';
import { Project, ProjectCategory } from '@/types/project';

export function getAllProjects(): Project[] {
  return projects;
}

export function getFeaturedProjects(limit = 6): Project[] {
  return projects.filter((project) => project.featured).slice(0, limit);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return projects.filter((project) => project.category === category);
}
