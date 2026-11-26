import type { CaseStudyImage } from '@/types/caseStudy';

/**
 * A SaaS product.
 *
 * `developmentStatus`, `demoAvailable` and `pricingVisible` exist to stop the
 * page claiming more than is true: software in development is described as
 * software in development, the CTA only offers a demo when one can actually be
 * given, and no price renders until a real one exists.
 */
export const PRODUCT_STATUSES = {
  CONCEPT: 'concept',
  IN_DEVELOPMENT: 'in-development',
  BETA: 'beta',
  LIVE: 'live',
} as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[keyof typeof PRODUCT_STATUSES];

export const PRODUCT_STATUS_LABEL: Record<ProductStatus, string> = {
  concept: 'Concept',
  'in-development': 'In Development',
  beta: 'Private Beta',
  live: 'Live',
};

export type RoadmapHorizon = 'now' | 'next' | 'later';

export const ROADMAP_HORIZON_LABEL: Record<RoadmapHorizon, string> = {
  now: 'In progress',
  next: 'Next',
  later: 'Later',
};

export interface ProductListItem {
  _key: string;
  heading?: string;
  description?: string;
}

export interface ProductModule {
  _key: string;
  name?: string;
  description?: string;
  /** A key from src/lib/constants/icon.ts. Unknown keys fall back silently. */
  icon?: string;
}

export interface ProductStep {
  _key: string;
  title?: string;
  description?: string;
}

export interface ProductRoadmapItem {
  _key: string;
  title?: string;
  description?: string;
  horizon?: RoadmapHorizon;
}

export interface ProductFaqItem {
  _key: string;
  question?: string;
  answer?: string;
}

export interface SaasProduct {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  image: string;
  isPlaceholderCover: boolean;
  targetIndustry: string[];
  developmentStatus: ProductStatus;
  /** False means the CTA reads "Request early access", not "Book a demo". */
  demoAvailable: boolean;
  pricingVisible: boolean;
  readyForIndexing: boolean;

  businessProblems?: ProductListItem[];
  modules?: ProductModule[];
  features?: ProductListItem[];
  workflow?: ProductStep[];
  screenshots?: CaseStudyImage[];
  roadmap?: ProductRoadmapItem[];
  faq?: ProductFaqItem[];
}
