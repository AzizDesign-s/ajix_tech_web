/**
 * Seed content for the AJIX Content Lake.
 *
 * Rules this file follows, deliberately:
 *   - No invented live URLs. `liveUrl` is empty unless it was already in the
 *     repository and verified.
 *   - No invented tech stacks. `tools` is empty for every project whose stack
 *     has not been confirmed; the six migrated projects keep the slugs that
 *     were already committed.
 *   - No invented years, clients, metrics or outcomes.
 *   - Every placeholder summary says so in its first two words, so an entry
 *     that reaches production unfinished is obviously unfinished.
 *
 * `seedKey` is what makes re-running the seed safe: the script looks a
 * document up by this key and patches it instead of creating a second copy.
 * Sanity still generates the real `_id`.
 */

export type SeedProjectType = 'uiux' | 'website' | 'saas';

export interface SeedProject {
  seedKey: string;
  title: string;
  slug: string;
  projectType: SeedProjectType;
  categorySlug: string;
  summary: string;
  tools: string[];
  /** Repo-relative path to a real cover to upload, if one exists. */
  coverFile?: string;
  coverIsPlaceholder: boolean;
  liveUrl?: string;
  status?: 'concept' | 'in-progress' | 'completed' | 'live' | 'beta';
  homepageFeatured: boolean;
  homepageOrder: number;
  featured: boolean;
  readyForIndexing: boolean;
}

const draft = (what: string) => `Draft summary — replace before publishing. ${what}`;

export const seedCategories = [
  {
    seedKey: 'cat-enterprise',
    title: 'Enterprise Product Design',
    slug: 'enterprise-product-design',
    description: 'End-to-end product design for complex, multi-role business systems.',
    displayOrder: 1,
  },
  {
    seedKey: 'cat-frontend',
    title: 'Frontend Engineering',
    slug: 'frontend-engineering',
    description: 'Production frontend builds in React, Next.js and TypeScript.',
    displayOrder: 2,
  },
  {
    seedKey: 'cat-interactive',
    title: 'Interactive Experience',
    slug: 'interactive-experience',
    description: 'Motion-led websites where the interaction is the product.',
    displayOrder: 3,
  },
  {
    seedKey: 'cat-brand',
    title: 'Brand Identity',
    slug: 'brand-identity',
    description: 'Visual identity systems. Kept available for future work.',
    displayOrder: 4,
  },
];

// --- A. UI/UX case studies (7) ------------------------------------------
const uiux: SeedProject[] = [
  {
    seedKey: 'proj-qr-ordering',
    title: 'QR - Ordering (Digital System)',
    slug: 'qr-ordering-digital-system',
    projectType: 'uiux',
    categorySlug: 'enterprise-product-design',
    summary:
      'A SaaS-based restaurant ordering platform that streamlines menu browsing, QR ordering, payments, and order management with an intuitive customer and admin experience.',
    tools: ['figma', 'nextdotjs', 'javascript', 'tailwindcss'],
    coverFile: 'public/images/project/qr.png',
    coverIsPlaceholder: false,
    homepageFeatured: true,
    homepageOrder: 1,
    featured: true,
    readyForIndexing: false,
  },
  {
    seedKey: 'proj-smart-hr',
    title: 'Smart HR Management System',
    slug: 'smart-hr-management-system',
    projectType: 'uiux',
    categorySlug: 'enterprise-product-design',
    summary:
      'An enterprise HR platform designed to simplify employee management, attendance, payroll, leave tracking, and organizational workflows through a scalable dashboard experience.',
    tools: ['figma', 'nextdotjs', 'typescript', 'tailwindcss'],
    coverFile: 'public/images/project/hrms.png',
    coverIsPlaceholder: false,
    homepageFeatured: true,
    homepageOrder: 2,
    featured: true,
    readyForIndexing: false,
  },
  {
    seedKey: 'proj-point-of-sales',
    title: 'Point of Sales System',
    slug: 'point-of-sales-system',
    projectType: 'uiux',
    categorySlug: 'enterprise-product-design',
    summary: draft('A point of sales product design case study.'),
    tools: [],
    coverIsPlaceholder: true,
    homepageFeatured: false,
    homepageOrder: 11,
    featured: false,
    readyForIndexing: false,
  },
  {
    seedKey: 'proj-interactive-kiosk',
    title: 'Interactive Kiosk System',
    slug: 'interactive-kiosk-system',
    projectType: 'uiux',
    categorySlug: 'enterprise-product-design',
    summary: draft('A self-service kiosk interface case study.'),
    tools: [],
    coverIsPlaceholder: true,
    homepageFeatured: false,
    homepageOrder: 12,
    featured: false,
    readyForIndexing: false,
  },
  {
    seedKey: 'proj-patient-portal',
    title: 'Smart Patient Portal & Token System',
    slug: 'smart-patient-portal-token-system',
    projectType: 'uiux',
    categorySlug: 'enterprise-product-design',
    summary: draft('A patient portal and queue token system case study.'),
    tools: [],
    coverIsPlaceholder: true,
    homepageFeatured: false,
    homepageOrder: 13,
    featured: false,
    readyForIndexing: false,
  },
  {
    seedKey: 'proj-ancestry',
    title: 'Ancestry & Family Tree',
    slug: 'ancestry-family-tree',
    projectType: 'uiux',
    categorySlug: 'enterprise-product-design',
    summary: draft('An ancestry and family tree application case study.'),
    tools: [],
    coverIsPlaceholder: true,
    homepageFeatured: false,
    homepageOrder: 14,
    featured: false,
    readyForIndexing: false,
  },
  {
    seedKey: 'proj-event-booking',
    title: 'Event Booking Ecosystem Application',
    slug: 'event-booking-ecosystem-application',
    projectType: 'uiux',
    categorySlug: 'enterprise-product-design',
    summary: draft('An event booking ecosystem case study. Currently in progress.'),
    tools: [],
    coverIsPlaceholder: true,
    status: 'in-progress',
    homepageFeatured: false,
    homepageOrder: 15,
    featured: false,
    readyForIndexing: false,
  },
];

// --- B. Websites and web apps (24) --------------------------------------
const websiteNames: Array<[key: string, title: string, slug: string]> = [
  ['bank', 'Bank Website', 'bank-website'],
  ['restaurant', 'Restaurant Website', 'restaurant-website'],
  ['hushlush-tech', 'Hush Lush Technologies Website', 'hush-lush-technologies-website'],
  ['hushlush-events', 'Hush Lush Events Website', 'hush-lush-events-website'],
  ['afaq-interiors', 'Afaq Al Manzel Interiors Website', 'afaq-al-manzel-interiors-website'],
  ['afaq-properties', 'Afaq Al Manzil Properties Website', 'afaq-al-manzil-properties-website'],
  ['afaq-barakha', 'Afaq Al Barakha Investment Website', 'afaq-al-barakha-investment-website'],
  [
    'afaq-khaleej',
    'Afaq Al Khaleej Management Consultant Website',
    'afaq-al-khaleej-management-consultant-website',
  ],
  ['wedding', 'Wedding E-Invitation', 'wedding-e-invitation'],
  ['crypto', 'Crypto Website', 'crypto-website'],
  ['logistics', 'Logistics Website', 'logistics-website'],
  ['shake-the-nation', 'Shake the Nation Website', 'shake-the-nation-website'],
  ['bridge-media', 'Bridge Media Website', 'bridge-media-website'],
  ['qasr-al-hajar', 'Qasr Al Hajar Website', 'qasr-al-hajar-website'],
  ['lee-and-dawn', 'Lee and Dawn Website', 'lee-and-dawn-website'],
  ['midas-apparel', 'Midas Apparel Website', 'midas-apparel-website'],
  ['mission-316', 'Mission 3:16 Website', 'mission-3-16-website'],
  ['triton-tech-labs', 'Triton Tech Labs Website', 'triton-tech-labs-website'],
  ['novellah', 'Novellah Website', 'novellah-website'],
  ['souq-district', 'Souq District Website', 'souq-district-website'],
];

const websites: SeedProject[] = [
  {
    seedKey: 'proj-dubai-sky-taxi',
    title: 'Dubai Sky Taxi MVP',
    slug: 'dubai-sky-taxi',
    projectType: 'website',
    categorySlug: 'frontend-engineering',
    summary:
      "A modern booking experience for Dubai's future air mobility service, featuring route selection, digital ticketing, and Nol Card integration with responsive frontend development.",
    tools: ['react', 'tailwindcss', 'framer', 'figma'],
    coverFile: 'public/images/project/taxi.png',
    coverIsPlaceholder: false,
    homepageFeatured: true,
    homepageOrder: 3,
    featured: true,
    readyForIndexing: false,
  },
  {
    seedKey: 'proj-albatographia',
    title: 'Albatographia Website',
    slug: 'albatographia',
    projectType: 'website',
    categorySlug: 'interactive-experience',
    summary:
      'A motion-driven website for a social media agency focused on storytelling, engaging animations, and conversion-focused user experiences.',
    tools: ['framer', 'javascript', 'css3', 'figma'],
    coverFile: 'public/images/project/alba.png',
    coverIsPlaceholder: false,
    homepageFeatured: true,
    homepageOrder: 4,
    featured: true,
    readyForIndexing: false,
  },
  {
    // Carries over Elysian Realty's committed copy and cover. If these are in
    // fact two different projects, rename this one in Studio and create the
    // other — nothing else depends on the title.
    seedKey: 'proj-real-estate',
    title: 'Real Estate Website',
    slug: 'real-estate-website',
    projectType: 'website',
    categorySlug: 'interactive-experience',
    summary:
      'A premium real estate website showcasing luxury properties through immersive layouts, smooth interactions, and a refined user experience.',
    tools: ['react', 'framer', 'tailwindcss', 'figma'],
    coverFile: 'public/images/project/real.png',
    coverIsPlaceholder: false,
    homepageFeatured: true,
    homepageOrder: 5,
    featured: true,
    readyForIndexing: false,
  },
  {
    seedKey: 'proj-bmw-dashboard',
    title: 'BMW Dashboard Simulation Application',
    slug: 'bmw-dashboard-simulation-application',
    projectType: 'website',
    categorySlug: 'frontend-engineering',
    summary: draft(
      'An automotive dashboard simulation built as a frontend engineering exercise. Not affiliated with or endorsed by BMW.',
    ),
    tools: [],
    coverIsPlaceholder: true,
    homepageFeatured: false,
    homepageOrder: 21,
    featured: false,
    readyForIndexing: false,
  },
  ...websiteNames.map<SeedProject>(([key, title, slug], index) => ({
    seedKey: `proj-${key}`,
    title,
    slug,
    projectType: 'website' as const,
    categorySlug: 'frontend-engineering',
    summary: draft(`A website project: ${title.replace(/ Website$/, '')}.`),
    tools: [],
    coverIsPlaceholder: true,
    homepageFeatured: false,
    homepageOrder: 22 + index,
    featured: false,
    readyForIndexing: false,
  })),
];

export const seedProjects: SeedProject[] = [...uiux, ...websites];

// --- C. SaaS product (1) -------------------------------------------------
export const seedProducts = [
  {
    seedKey: 'prod-showroom-garage-crm',
    title: 'Showroom & Garage CRM',
    slug: 'showroom-garage-crm',
    tagline: 'One system for vehicle sales and workshop operations.',
    summary: draft('A CRM for automotive showrooms and service garages, currently in development.'),
    targetIndustry: ['Automotive retail', 'Vehicle servicing'],
    developmentStatus: 'in-development' as const,
    demoAvailable: false,
    pricingVisible: false,
    coverIsPlaceholder: true,
    readyForIndexing: false,
  },
];

export const seedSiteSettings = {
  availabilityLevel: 'available' as const,
  homepageFeaturedLimit: 6,
};
