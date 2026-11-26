import { getAllProjects, getProjectBySlug } from '@/lib/services/project';
import { getAllProducts } from '@/lib/services/product';
import { getCategoryLabel } from '@/lib/services/categories';
import { getToolsBySlug } from '@/lib/services/tools';
import { productCardStatus } from '@/sanity/mappers';
import {
  PROJECT_CATEGORIES,
  projectTypeForCategory,
  type Project,
  type ProjectType,
} from '@/types/project';
import { WORK_FILTER_ORDER, type WorkFilter, type WorkItem } from '@/types/work';

/**
 * Builds the flat list the Work page explorer filters over.
 *
 * Projects and SaaS products are different document types with different
 * fields, but the grid, the list and the Quick View all need the same handful
 * of things. Flattening once on the server means the client component does no
 * shape-juggling and the search haystack is built exactly once.
 */

/** Per the brief: the CTA wording depends on what the entry actually is. */
function primaryActionLabel(type: ProjectType): string {
  switch (type) {
    case 'uiux':
      return 'View Case Study';
    case 'saas':
      return 'Explore Product';
    default:
      return 'View Project';
  }
}

function buildSearchText(parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(' ').toLowerCase();
}

function projectToWorkItem(project: Project): WorkItem {
  const projectType = project.projectType ?? projectTypeForCategory(project.category);
  const liveUrl = 'liveUrl' in project ? project.liveUrl : undefined;
  const toolLabels = getToolsBySlug(project.toolSlugs).map((tool) => tool.label);

  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    description: project.description,
    category: project.category,
    toolSlugs: project.toolSlugs,
    image: project.image,
    projectType,
    year: project.year,
    status: project.status,
    featured: project.featured,
    isPlaceholderCover: project.isPlaceholderCover,
    client: project.client,
    caseStudySections: project.caseStudySections,
    // Interactive-experience projects have always opened their live site
    // directly rather than a detail page. That behaviour is preserved.
    liveUrl: liveUrl || undefined,
    kind: 'project',
    href:
      project.category === PROJECT_CATEGORIES.INTERACTIVE_EXPERIENCE && liveUrl
        ? liveUrl
        : `/projects/${project.slug}`,
    primaryActionLabel: primaryActionLabel(projectType),
    searchText: buildSearchText([
      project.name,
      project.description,
      getCategoryLabel(project.category),
      project.client,
      project.year,
      ...toolLabels,
    ]),
  };
}

/**
 * One project with its full body. The list query deliberately does not fetch
 * case-study sections — thirty projects' worth of Portable Text on the Work
 * page would be a large payload nobody reads.
 */
export async function getWorkItem(slug: string): Promise<WorkItem | undefined> {
  const project = await getProjectBySlug(slug);
  return project ? projectToWorkItem(project) : undefined;
}

export async function getWorkItems(): Promise<WorkItem[]> {
  const [projects, products] = await Promise.all([getAllProjects(), getAllProducts()]);

  const projectItems = projects.map(projectToWorkItem);

  const productItems: WorkItem[] = products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    // Products have no project category. The card falls back to this value
    // only for type-safety; `badge` below is what actually renders.
    category: PROJECT_CATEGORIES.FRONTEND_ENGINEERING,
    badge: { label: 'SaaS Product', color: 'purple' as const },
    toolSlugs: [],
    image: product.image,
    projectType: 'saas' as const,
    status: productCardStatus(product),
    featured: false,
    isPlaceholderCover: product.isPlaceholderCover,
    kind: 'product' as const,
    href: `/products/${product.slug}`,
    primaryActionLabel: primaryActionLabel('saas'),
    searchText: buildSearchText([
      product.name,
      product.description,
      'SaaS Product',
      ...product.targetIndustry,
    ]),
  }));

  return [...projectItems, ...productItems];
}

export function getWorkCounts(items: WorkItem[]): Record<WorkFilter, number> {
  const counts = Object.fromEntries(WORK_FILTER_ORDER.map((f) => [f, 0])) as Record<
    WorkFilter,
    number
  >;
  counts.all = items.length;
  for (const item of items) {
    const key = item.projectType;
    if (key && key in counts) counts[key as WorkFilter] += 1;
  }
  return counts;
}

/**
 * Which entry gets the spotlight.
 *
 * Preference order: the project chosen in Sanity, then the first featured
 * entry, then nothing — in which case the section is not rendered at all,
 * rather than spotlighting something arbitrary.
 */
export function pickSpotlight(items: WorkItem[], slug?: string): WorkItem | undefined {
  if (slug) {
    const chosen = items.find((item) => item.slug === slug);
    if (chosen) return chosen;
  }
  return items.find((item) => item.featured);
}
