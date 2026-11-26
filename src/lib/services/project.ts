import { projects as localProjects } from '@/data/project';
import { sanityFetch } from '@/sanity/client';
import { CACHE_TAGS, usingSanity } from '@/sanity/env';
import { toProjects, type RawSanityProject } from '@/sanity/mappers';
import {
  ALL_PROJECTS_QUERY,
  HOMEPAGE_FEATURED_PROJECTS_QUERY,
  PROJECTS_BY_CATEGORY_QUERY,
  PROJECT_BY_SLUG_QUERY,
} from '@/sanity/queries/projects';
import type { Project, ProjectCategory } from '@/types/project';

// The seam between the site and its content source.
//
// Every function keeps the name it had before Sanity; only the return type
// gained a Promise. Callers are Server Components, so awaiting costs nothing.
//
// CONTENT_SOURCE decides which branch runs. It defaults to 'local' so the site
// keeps rendering the committed array until the Sanity content has been
// reviewed and you deliberately flip the switch. There is no silent fallback
// from Sanity back to local: if a query fails, the client logs it and returns
// empty, so a broken CMS looks broken rather than looking like last month's
// content.

const PROJECT_TAGS = [CACHE_TAGS.project, CACHE_TAGS.category];

export async function getAllProjects(): Promise<Project[]> {
  if (!usingSanity) return localProjects;

  const raw = await sanityFetch<RawSanityProject[]>(ALL_PROJECTS_QUERY, {}, [], {
    tags: PROJECT_TAGS,
  });
  return toProjects(raw);
}

/**
 * The Homepage row.
 *
 * Local source filters on `featured`, which is the only flag the committed
 * array has. Sanity uses `homepageFeatured`, which is curated separately from
 * `featured` so that changing the Homepage never changes the Work page.
 */
export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  if (!usingSanity) {
    return localProjects.filter((project) => project.featured).slice(0, limit);
  }

  const raw = await sanityFetch<RawSanityProject[]>(HOMEPAGE_FEATURED_PROJECTS_QUERY, {}, [], {
    tags: PROJECT_TAGS,
  });
  // GROQ slice bounds must be constant, so the query caps at 12 and the
  // configured limit is applied here.
  return toProjects(raw).slice(0, limit);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  if (!usingSanity) return localProjects.find((project) => project.slug === slug);

  const raw = await sanityFetch<RawSanityProject | null>(PROJECT_BY_SLUG_QUERY, { slug }, null, {
    tags: PROJECT_TAGS,
  });
  return raw ? toProjects([raw])[0] : undefined;
}

export async function getProjectsByCategory(category: ProjectCategory): Promise<Project[]> {
  if (!usingSanity) return localProjects.filter((project) => project.category === category);

  const raw = await sanityFetch<RawSanityProject[]>(PROJECTS_BY_CATEGORY_QUERY, { category }, [], {
    tags: PROJECT_TAGS,
  });
  return toProjects(raw);
}
