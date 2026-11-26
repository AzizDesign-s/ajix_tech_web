import type { SanityImageSource } from '@sanity/image-url';

import {
  PROJECT_CATEGORIES,
  PROJECT_STATUSES,
  PROJECT_TYPES,
  projectTypeForCategory,
  type Project,
  type ProjectCategory,
  type ProjectStatus,
  type ProjectType,
} from '@/types/project';

import { cardCoverUrl } from './image';

/** Exactly what PROJECT_CARD_FIELDS in queries/projects.ts returns. */
export interface RawSanityProject {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string | null;
  toolSlugs: string[] | null;
  cover: { image: SanityImageSource | null; alt: string | null; lqip: string | null } | null;
  coverIsPlaceholder: boolean;
  projectType: string | null;
  year: string | null;
  status: string | null;
  client: string | null;
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
  homepageFeatured: boolean;
  homepageOrder: number;
  readyForIndexing: boolean;
}

const VALID_CATEGORIES = Object.values(PROJECT_CATEGORIES) as string[];
const VALID_TYPES = Object.values(PROJECT_TYPES) as string[];
const VALID_STATUSES = Object.values(PROJECT_STATUSES) as string[];

function toCategory(value: string | null): ProjectCategory {
  return VALID_CATEGORIES.includes(value ?? '')
    ? (value as ProjectCategory)
    : PROJECT_CATEGORIES.FRONTEND_ENGINEERING;
}

function toType(value: string | null, category: ProjectCategory): ProjectType {
  return VALID_TYPES.includes(value ?? '')
    ? (value as ProjectType)
    : projectTypeForCategory(category);
}

function toStatus(value: string | null): ProjectStatus | undefined {
  return VALID_STATUSES.includes(value ?? '') ? (value as ProjectStatus) : undefined;
}

/**
 * Cover fallback. Every project gets *a* cover even with nothing uploaded, so
 * a card can never render a broken image. The generic files are committed to
 * the repo, so this path always resolves.
 */
function fallbackCover(type: ProjectType): string {
  return `/images/project/placeholder/generic-${type}.svg`;
}

function resolveCover(raw: RawSanityProject, type: ProjectType): string {
  if (!raw.cover?.image) return fallbackCover(type);
  try {
    return cardCoverUrl(raw.cover.image);
  } catch {
    // A malformed asset reference should cost one broken card, not the page.
    return fallbackCover(type);
  }
}

/**
 * Turns a raw Sanity result into the `Project` union the existing components
 * already consume.
 *
 * The union is discriminated on `category`, and two of its members require a
 * `liveUrl`, so the narrowing is done explicitly rather than with a cast.
 */
export function toProject(raw: RawSanityProject): Project {
  const category = toCategory(raw.category);
  const projectType = toType(raw.projectType, category);

  const base = {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    description: raw.description,
    toolSlugs: raw.toolSlugs ?? [],
    image: resolveCover(raw, projectType),
    featured: raw.featured,
    projectType,
    homepageFeatured: raw.homepageFeatured,
    homepageOrder: raw.homepageOrder,
    year: raw.year ?? undefined,
    status: toStatus(raw.status),
    client: raw.client ?? undefined,
    repoUrl: raw.repoUrl || undefined,
    isPlaceholderCover: raw.coverIsPlaceholder || !raw.cover?.image,
    readyForIndexing: raw.readyForIndexing,
  };

  switch (category) {
    case PROJECT_CATEGORIES.ENTERPRISE_PRODUCT_DESIGN:
      return { ...base, category };
    case PROJECT_CATEGORIES.BRAND_IDENTITY:
      return { ...base, category };
    case PROJECT_CATEGORIES.INTERACTIVE_EXPERIENCE:
      return { ...base, category, liveUrl: raw.liveUrl };
    default:
      return { ...base, category: PROJECT_CATEGORIES.FRONTEND_ENGINEERING, liveUrl: raw.liveUrl };
  }
}

export function toProjects(raw: RawSanityProject[]): Project[] {
  return raw.map(toProject);
}
