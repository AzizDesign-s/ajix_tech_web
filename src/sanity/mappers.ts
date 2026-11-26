import type { SanityImageSource } from '@sanity/image-url';

import type { CaseStudyImage, CaseStudySection } from '@/types/caseStudy';
import type { ProductStatus, SaasProduct } from '@/types/product';
export type { SaasProduct };
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
  /** Present only on the single-project query. */
  caseStudySections?: RawSection[] | null;
  relatedSlugs?: string[] | null;
  seo?: { title?: string; description?: string } | null;
}

/** A block as GROQ returns it, before image URLs are sized. */
type RawSection = Record<string, unknown> & { _key: string; _type: string };

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
    caseStudySections: toCaseStudySections(raw.caseStudySections),
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

// --- SaaS products -------------------------------------------------------

/** Exactly what PRODUCT_CARD_FIELDS in queries/products.ts returns. */
export interface RawSanityProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  cover: { image: SanityImageSource | null; alt: string | null; lqip: string | null } | null;
  coverIsPlaceholder: boolean;
  targetIndustry: string[] | null;
  developmentStatus: string;
  demoAvailable: boolean;
  pricingVisible: boolean;
  readyForIndexing: boolean;
  tagline?: string | null;
  businessProblems?: unknown;
  modules?: unknown;
  features?: unknown;
  workflow?: unknown;
  screenshots?: unknown;
  roadmap?: unknown;
  faq?: unknown;
}

const PRODUCT_STATUS_TO_PROJECT_STATUS: Record<string, ProjectStatus> = {
  concept: 'concept',
  'in-development': 'in-progress',
  beta: 'beta',
  live: 'live',
};

export function toProduct(raw: RawSanityProduct): SaasProduct {
  let image = `/images/project/placeholder/generic-${PROJECT_TYPES.SAAS}.svg`;
  if (raw.cover?.image) {
    try {
      image = cardCoverUrl(raw.cover.image);
    } catch {
      // A malformed asset reference costs one placeholder, not the page.
    }
  }

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    description: raw.description,
    image,
    isPlaceholderCover: raw.coverIsPlaceholder || !raw.cover?.image,
    tagline: raw.tagline ?? undefined,
    targetIndustry: raw.targetIndustry ?? [],
    developmentStatus: toProductStatus(raw.developmentStatus),
    demoAvailable: raw.demoAvailable,
    pricingVisible: raw.pricingVisible,
    readyForIndexing: raw.readyForIndexing,
    businessProblems: asArray(raw.businessProblems),
    modules: asArray(raw.modules),
    features: asArray(raw.features),
    workflow: asArray(raw.workflow),
    screenshots: toImages(raw.screenshots, 1600),
    roadmap: asArray(raw.roadmap),
    faq: asArray(raw.faq),
  };
}

const VALID_PRODUCT_STATUSES: string[] = ['concept', 'in-development', 'beta', 'live'];

function toProductStatus(value: string): ProductStatus {
  return (VALID_PRODUCT_STATUSES.includes(value) ? value : 'in-development') as ProductStatus;
}

/** GROQ can return null for an absent array; the renderers expect a list. */
function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function toProducts(raw: RawSanityProduct[]): SaasProduct[] {
  return raw.map(toProduct);
}

/** Maps a product's development status onto the card's status vocabulary. */
export function productCardStatus(product: SaasProduct): ProjectStatus | undefined {
  return PRODUCT_STATUS_TO_PROJECT_STATUS[product.developmentStatus];
}

// --- Case-study sections --------------------------------------------------

/**
 * Appends sizing to a Sanity asset URL.
 *
 * The CDN takes these as query params on the asset URL itself, so this does
 * not need the image-URL builder — which matters because GROQ hands us a
 * plain URL rather than an asset reference for these nested images.
 * A non-Sanity URL (a local placeholder, say) is returned untouched.
 */
function sizedUrl(url: string, width: number): string {
  if (!url.startsWith('https://cdn.sanity.io/')) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}auto=format&fit=max&w=${width}`;
}

function toImage(raw: unknown, width: number): CaseStudyImage | null {
  if (!raw || typeof raw !== 'object') return null;
  const value = raw as Partial<CaseStudyImage>;
  if (!value.url) return null;

  return {
    url: sizedUrl(value.url, width),
    alt: value.alt ?? '',
    caption: value.caption,
    decorative: value.decorative ?? false,
    width: value.width,
    height: value.height,
  };
}

function toImages(raw: unknown, width: number): CaseStudyImage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => toImage(item, width))
    .filter((img): img is CaseStudyImage => img !== null);
}

/**
 * Turns raw blocks into the typed union the renderer switches over.
 *
 * Blocks whose required media failed to resolve are dropped rather than
 * rendered half-built — a before/after with one image is not a comparison, and
 * a prototype embed with no poster would load a third-party iframe on sight.
 */
export function toCaseStudySections(raw: RawSection[] | null | undefined): CaseStudySection[] {
  if (!Array.isArray(raw)) return [];

  const sections: CaseStudySection[] = [];

  for (const block of raw) {
    switch (block._type) {
      case 'imageSection': {
        const image = toImage(block.image, 1600);
        if (image) sections.push({ ...block, image } as CaseStudySection);
        break;
      }
      case 'gallerySection': {
        const images = toImages(block.images, 1200);
        if (images.length) sections.push({ ...block, images } as CaseStudySection);
        break;
      }
      case 'videoSection': {
        const poster = toImage(block.poster, 1600) ?? undefined;
        sections.push({ ...block, poster } as CaseStudySection);
        break;
      }
      case 'beforeAfterSection': {
        const before = toImage(block.before, 1600);
        const after = toImage(block.after, 1600);
        if (before && after) sections.push({ ...block, before, after } as CaseStudySection);
        break;
      }
      case 'designSystemSection': {
        sections.push({
          ...block,
          components: toImages(block.components, 1200),
        } as CaseStudySection);
        break;
      }
      case 'prototypeSection': {
        const poster = toImage(block.poster, 1600);
        if (poster) sections.push({ ...block, poster } as CaseStudySection);
        break;
      }
      default:
        sections.push(block as unknown as CaseStudySection);
    }
  }

  return sections;
}
