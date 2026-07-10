// ─────────────────────────────────────────────
// Shared primitives — reused across multiple categories
// ─────────────────────────────────────────────

export interface Tool {
  name: string;
  icon: string; // icon key (mapped via an icon map, same pattern as your featureIconMap)
}

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

// ─────────────────────────────────────────────
// Category enum — single source of truth for category values
// ─────────────────────────────────────────────

export const PROJECT_CATEGORIES = {
  ENTERPRISE_PRODUCT_DESIGN: 'enterprise-product-design',
  FRONTEND_ENGINEERING: 'frontend-engineering',
  INTERACTIVE_EXPERIENCE: 'interactive-experience',
  BRAND_IDENTITY: 'brand-identity',
} as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[keyof typeof PROJECT_CATEGORIES];

// ─────────────────────────────────────────────
// Base fields — present on every project, used by the Card + homepage
// ─────────────────────────────────────────────

interface ProjectBase {
  id: string;
  slug: string;
  name: string;
  description: string; // full long description; Card component truncates for display
  category: ProjectCategory;
  tools: Tool[];
  image: string;
  featured: boolean; // drives the "max 6 on homepage" toggle
}

// ─────────────────────────────────────────────
// Category 1 — Enterprise Product Design (full case study page)
// ─────────────────────────────────────────────

export interface EnterpriseProductDesignProject extends ProjectBase {
  category: 'enterprise-product-design';
  links: {
    caseStudy?: string;
    architecture?: string;
    liveProject?: string;
  };
  overview: {
    heading: string;
    image: string;
    paragraph: string;
  };
  role: string;
  timeline: string;
  goals: {
    heading: string;
    list: string[];
    image: string;
  };
  research: {
    heading: string;
    content: string;
    image: string;
  };
  personas: [Persona, Persona, Persona, Persona]; // exactly 4
  journeyMap: {
    heading: string;
    steps: JourneyStep[];
  };
  wireframes: {
    heading: string;
    gallery: GalleryImage[];
  };
  designSystem: {
    heading: string;
    description: string;
    image: string;
  };
  highFidelityUI: {
    heading: string;
    gallery: GalleryImage[];
  };
  accessibility: {
    heading: string;
    description: string;
    image: string;
  };
  challenges: {
    heading: string;
    description: string;
    image: string;
  };
  businessResults: {
    heading: string;
    description: string;
    metrics: Metric[]; // max 4, enforced in the service layer
  };
  keyLearning: {
    heading: string;
    description: string;
    image: string;
  };
  relatedProjectSlugs: string[]; // max 2, enforced in the service layer
}

// ─────────────────────────────────────────────
// Category 2 — Frontend Engineering (build showcase page)
// ─────────────────────────────────────────────

export interface FrontendEngineeringProject extends ProjectBase {
  category: 'frontend-engineering';
  liveUrl: string;
  about: {
    heading: string;
    description: string;
    image: string;
  };
  keyFeatures: {
    heading: string;
    features: {
      icon: string;
      heading: string;
      description: string;
    }[];
  };
  relatedProjectSlugs: string[]; // max 2
}

// ─────────────────────────────────────────────
// Category 3 — Interactive Experience (no slug page — direct external link)
// ─────────────────────────────────────────────

export interface InteractiveExperienceProject extends ProjectBase {
  category: 'interactive-experience';
  liveUrl: string; // card click goes straight here, no /projects/[slug] route
}

// ─────────────────────────────────────────────
// Category 4 — Brand Identity (brand showcase page)
// ─────────────────────────────────────────────

export interface BrandIdentityProject extends ProjectBase {
  category: 'brand-identity';
  overview: {
    heading: string;
    description: string;
    image: string;
  };
  logos: {
    heading: string;
    light: string;
    dark: string;
  };
  colorPalette: {
    heading: string;
    colors: { name: string; hex: string }[];
  };
  typography: {
    heading: string;
    fonts: {
      name: string;
      sizes: string[];
      sampleText: string;
    }[];
  };
  gallery: {
    heading: string;
    images: GalleryImage[];
  };
  relatedProjectSlugs: string[]; // max 2
}

// ─────────────────────────────────────────────
// The union — this is what components/services actually work with
// ─────────────────────────────────────────────

export type Project =
  | EnterpriseProductDesignProject
  | FrontendEngineeringProject
  | InteractiveExperienceProject
  | BrandIdentityProject;

// Type guards — let components safely narrow the union
// e.g. `if (isEnterpriseProject(project)) { project.personas ... }`
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
