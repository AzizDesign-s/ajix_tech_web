import type { Tool } from '@/types/tools';

export interface GalleryImage {
  src: string;
  alt: string;
  size: 'square' | 'landscape' | 'portrait';
}

export interface Metric {
  label: string;
  value: string;
}

export interface Persona {
  name: string;
  location: string;
  role: string;
  goal: string;
  frustration: string;
  image?: string;
}

export interface JourneyStep {
  title: string;
  description: string;
}

export const PROJECT_CATEGORIES = {
  ENTERPRISE_PRODUCT_DESIGN: 'enterprise-product-design',
  FRONTEND_ENGINEERING: 'frontend-engineering',
  INTERACTIVE_EXPERIENCE: 'interactive-experience',
  BRAND_IDENTITY: 'brand-identity',
} as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[keyof typeof PROJECT_CATEGORIES];

interface ProjectBase {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ProjectCategory;
  toolSlugs: string[]; // references src/data/tools.ts by slug
  image: string;
  featured: boolean;
  isDummy?: boolean;
}

export interface EnterpriseProductDesignProject extends ProjectBase {
  category: 'enterprise-product-design';
  links?: {
    caseStudy?: string;
    architecture?: string;
    liveProject?: string;
  };
  overview?: { heading: string; image: string; paragraph: string };
  role?: string;
  timeline?: string;
  goals?: { heading: string; list: string[]; image: string };
  research?: { heading: string; content: string; image: string };
  personas?: [Persona, Persona, Persona, Persona];
  journeyMap?: { heading: string; steps: JourneyStep[] };
  wireframes?: { heading: string; gallery: GalleryImage[] };
  designSystem?: { heading: string; description: string; image: string };
  highFidelityUI?: { heading: string; gallery: GalleryImage[] };
  accessibility?: { heading: string; description: string; image: string };
  challenges?: { heading: string; description: string; image: string };
  businessResults?: {
    heading: string;
    description: string;
    metrics: Metric[];
  };
  keyLearning?: { heading: string; description: string; image: string };
  relatedProjectSlugs?: string[];
}

export interface FrontendEngineeringProject extends ProjectBase {
  category: 'frontend-engineering';
  liveUrl: string; // required — button hides if empty, same pattern as resumeUrl
  about?: { heading: string; description: string; image: string };
  keyFeatures?: {
    heading: string;
    features: { icon: string; heading: string; description: string }[];
  };
  relatedProjectSlugs?: string[];
}

export interface InteractiveExperienceProject extends ProjectBase {
  category: 'interactive-experience';
  liveUrl: string; // required — card click goes straight here, no slug page
}

export interface BrandIdentityProject extends ProjectBase {
  category: 'brand-identity';
  overview?: { heading: string; description: string; image: string };
  logos?: { heading: string; light: string; dark: string };
  colorPalette?: { heading: string; colors: { name: string; hex: string }[] };
  typography?: {
    heading: string;
    fonts: { name: string; sizes: string[]; sampleText: string }[];
  };
  gallery?: { heading: string; images: GalleryImage[] };
  relatedProjectSlugs?: string[];
}

export type Project =
  | EnterpriseProductDesignProject
  | FrontendEngineeringProject
  | InteractiveExperienceProject
  | BrandIdentityProject;

export function isEnterpriseProject(project: Project): project is EnterpriseProductDesignProject {
  return project.category === PROJECT_CATEGORIES.ENTERPRISE_PRODUCT_DESIGN;
}
export function isFrontendProject(project: Project): project is FrontendEngineeringProject {
  return project.category === PROJECT_CATEGORIES.FRONTEND_ENGINEERING;
}
export function isInteractiveProject(project: Project): project is InteractiveExperienceProject {
  return project.category === PROJECT_CATEGORIES.INTERACTIVE_EXPERIENCE;
}
export function isBrandIdentityProject(project: Project): project is BrandIdentityProject {
  return project.category === PROJECT_CATEGORIES.BRAND_IDENTITY;
}
