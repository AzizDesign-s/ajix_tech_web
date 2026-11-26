import type { CategoryColor } from '@/types/category';
import type { CaseStudySection } from '@/types/caseStudy';
import type { ProjectCardItem } from '@/components/sections/home/project/projectCard';

/**
 * The four filters on the Work page.
 *
 * These map onto `projectType`, not onto `category`. Category drives the badge
 * text and accent colour on the card and was left alone deliberately — renaming
 * the four categories would have changed the visible design of cards that are
 * already approved.
 */
export const WORK_FILTERS = {
  ALL: 'all',
  UIUX: 'uiux',
  WEBSITE: 'website',
  SAAS: 'saas',
} as const;

export type WorkFilter = (typeof WORK_FILTERS)[keyof typeof WORK_FILTERS];

export const WORK_FILTER_LABELS: Record<WorkFilter, string> = {
  all: 'All Work',
  uiux: 'UI/UX Case Studies',
  website: 'Websites & Web Apps',
  saas: 'SaaS Products',
};

export const WORK_FILTER_ORDER: WorkFilter[] = ['all', 'uiux', 'website', 'saas'];

export function isWorkFilter(value: string | null | undefined): value is WorkFilter {
  return WORK_FILTER_ORDER.includes(value as WorkFilter);
}

export type WorkView = 'grid' | 'list';

export function isWorkView(value: string | null | undefined): value is WorkView {
  return value === 'grid' || value === 'list';
}

/**
 * One entry in the explorer — a project or a SaaS product, flattened so the
 * grid, the list and the Quick View all read the same shape.
 */
export interface WorkItem extends ProjectCardItem {
  kind: 'project' | 'product';
  /** Where the primary CTA goes. */
  href: string;
  /** Overrides the card's category badge. Set for products, which have none. */
  badge?: { label: string; color: CategoryColor };
  /** The label the primary CTA shows — category-specific, per the spec. */
  primaryActionLabel: string;
  /** Lower-cased haystack, built once on the server so search costs nothing. */
  searchText: string;
  /** The case-study body. Only populated on the single-project query. */
  caseStudySections?: CaseStudySection[];
  /** Slugs of the related projects chosen in Sanity. */
  relatedSlugs?: string[];
  client?: string;
}
