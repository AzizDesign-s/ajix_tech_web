import { Project, PROJECT_CATEGORIES } from '@/types/project';

const qr = '/images/project/qr.png';
const hrms = '/images/project/hrms.png';
const alba = '/images/project/alba.png';
const apex = '/images/project/apex.png';
const real = '/images/project/real.png';
const taxi = '/images/project/taxi.png';

export const projects: Project[] = [
  // ─────────────────────────────────────────────
  // ENTERPRISE PRODUCT DESIGN (6 total — 2 real, 4 dummy)
  // ─────────────────────────────────────────────
  {
    id: 'qr-ordering',
    slug: 'qr-ordering-digital-system',
    name: 'QR - Ordering (Digital System)',
    description:
      'A SaaS-based restaurant ordering platform that streamlines menu browsing, QR ordering, payments, and order management with an intuitive customer and admin experience.',
    category: PROJECT_CATEGORIES.ENTERPRISE_PRODUCT_DESIGN,
    toolSlugs: ['figma', 'nextdotjs', 'javascript', 'tailwindcss'],
    image: qr,
    featured: true,
  },
  {
    id: 'smart-hr',
    slug: 'smart-hr-management-system',
    name: 'Smart HR Management System',
    description:
      'An enterprise HR platform designed to simplify employee management, attendance, payroll, leave tracking, and organizational workflows through a scalable dashboard experience.',
    category: PROJECT_CATEGORIES.ENTERPRISE_PRODUCT_DESIGN,
    toolSlugs: ['figma', 'nextdotjs', 'typescript', 'tailwindcss'],
    image: hrms,
    featured: true,
  },
  {
    id: 'dummy-epd-1',
    slug: 'clinic-patient-management-system',
    name: 'Clinic Patient Management System',
    description:
      'Placeholder project — a healthcare admin platform concept for managing patient records, appointments, and billing workflows.',
    category: PROJECT_CATEGORIES.ENTERPRISE_PRODUCT_DESIGN,
    toolSlugs: ['figma', 'react', 'tailwindcss'],
    image: '/images/projects/placeholder.jpg',
    featured: false,
    isDummy: true,
  },
  {
    id: 'dummy-epd-2',
    slug: 'logistics-fleet-dashboard',
    name: 'Logistics Fleet Dashboard',
    description:
      'Placeholder project — a fleet tracking and logistics management dashboard concept for enterprise shipping operations.',
    category: PROJECT_CATEGORIES.ENTERPRISE_PRODUCT_DESIGN,
    toolSlugs: ['figma', 'react', 'typescript'],
    image: '/images/projects/placeholder.jpg',
    featured: false,
    isDummy: true,
  },
  {
    id: 'dummy-epd-3',
    slug: 'retail-pos-system',
    name: 'Retail POS System',
    description:
      'Placeholder project — a point-of-sale and inventory management concept for multi-branch retail businesses.',
    category: PROJECT_CATEGORIES.ENTERPRISE_PRODUCT_DESIGN,
    toolSlugs: ['figma', 'tailwindcss'],
    image: '/images/projects/placeholder.jpg',
    featured: false,
    isDummy: true,
  },
  {
    id: 'dummy-epd-4',
    slug: 'insurance-claims-portal',
    name: 'Insurance Claims Portal',
    description:
      'Placeholder project — a claims submission and tracking portal concept designed for insurance enterprise clients.',
    category: PROJECT_CATEGORIES.ENTERPRISE_PRODUCT_DESIGN,
    toolSlugs: ['figma', 'react', 'tailwindcss'],
    image: '/images/projects/placeholder.jpg',
    featured: false,
    isDummy: true,
  },

  // ─────────────────────────────────────────────
  // FRONTEND ENGINEERING (7 total — 2 real, 5 dummy)
  // ─────────────────────────────────────────────
  {
    id: 'dubai-sky-taxi',
    slug: 'dubai-sky-taxi',
    name: 'Dubai Sky Taxi',
    description:
      "A modern booking experience for Dubai's future air mobility service, featuring route selection, digital ticketing, and Nol Card integration with responsive frontend development.",
    category: PROJECT_CATEGORIES.FRONTEND_ENGINEERING,
    toolSlugs: ['react', 'tailwindcss', 'framer', 'figma'],
    image: taxi,
    featured: true,
    liveUrl: '',
  },
  {
    id: 'apex-driveos',
    slug: 'apex-driveos',
    name: 'Apex DriveOS',
    description:
      'A React-powered enterprise SaaS dashboard for automotive dealerships, including inventory, CRM, customer management, service operations, and analytics.',
    category: PROJECT_CATEGORIES.FRONTEND_ENGINEERING,
    toolSlugs: ['react', 'typescript', 'tailwindcss'],
    image: apex,
    featured: true,
    liveUrl: '',
  },
  {
    id: 'dummy-fe-1',
    slug: 'bmw-m-dashboard-simulator',
    name: 'BMW M Dashboard Simulator',
    description:
      'Placeholder project — a physics-based automotive dashboard simulator built with custom React hooks for speed, fuel, and sound.',
    category: PROJECT_CATEGORIES.FRONTEND_ENGINEERING,
    toolSlugs: ['react', 'tailwindcss', 'framer'],
    image: '/images/projects/placeholder.jpg',
    featured: false,
    isDummy: true,
    liveUrl: '',
  },
  {
    id: 'dummy-fe-2',
    slug: 'portfolio-analytics-widget',
    name: 'Portfolio Analytics Widget',
    description:
      'Placeholder project — an embeddable, data-driven analytics widget concept built with a component-driven architecture.',
    category: PROJECT_CATEGORIES.FRONTEND_ENGINEERING,
    toolSlugs: ['react', 'typescript'],
    image: '/images/projects/placeholder.jpg',
    featured: false,
    isDummy: true,
    liveUrl: '',
  },
  {
    id: 'dummy-fe-3',
    slug: 'recipe-finder-app',
    name: 'Recipe Finder App',
    description:
      'Placeholder project — a fast, filterable recipe discovery app concept with a clean component library.',
    category: PROJECT_CATEGORIES.FRONTEND_ENGINEERING,
    toolSlugs: ['react', 'tailwindcss'],
    image: '/images/projects/placeholder.jpg',
    featured: false,
    isDummy: true,
    liveUrl: '',
  },
  {
    id: 'dummy-fe-4',
    slug: 'event-booking-platform',
    name: 'Event Booking Platform',
    description:
      'Placeholder project — a ticketing and event booking platform concept with seat selection and payment flows.',
    category: PROJECT_CATEGORIES.FRONTEND_ENGINEERING,
    toolSlugs: ['react', 'typescript', 'tailwindcss'],
    image: '/images/projects/placeholder.jpg',
    featured: false,
    isDummy: true,
    liveUrl: '',
  },
  {
    id: 'dummy-fe-5',
    slug: 'fitness-tracker-dashboard',
    name: 'Fitness Tracker Dashboard',
    description:
      'Placeholder project — a data visualization dashboard concept for tracking workouts and progress over time.',
    category: PROJECT_CATEGORIES.FRONTEND_ENGINEERING,
    toolSlugs: ['react', 'tailwindcss', 'framer'],
    image: '/images/projects/placeholder.jpg',
    featured: false,
    isDummy: true,
    liveUrl: '',
  },

  // ─────────────────────────────────────────────
  // INTERACTIVE EXPERIENCE (6 total — 2 real, 4 dummy)
  // ─────────────────────────────────────────────
  {
    id: 'albatographia',
    slug: 'albatographia',
    name: 'Albatographia',
    description:
      'A motion-driven website for a social media agency focused on storytelling, engaging animations, and conversion-focused user experiences.',
    category: PROJECT_CATEGORIES.INTERACTIVE_EXPERIENCE,
    toolSlugs: ['framer', 'javascript', 'css3', 'figma'],
    image: alba,
    featured: true,
    liveUrl: '',
  },
  {
    id: 'elysian-realty',
    slug: 'elysian-realty',
    name: 'Elysian Realty',
    description:
      'A premium real estate website showcasing luxury properties through immersive layouts, smooth interactions, and a refined user experience.',
    category: PROJECT_CATEGORIES.INTERACTIVE_EXPERIENCE,
    toolSlugs: ['react', 'framer', 'tailwindcss', 'figma'],
    image: real,
    featured: true,
    liveUrl: '',
  },
  {
    id: 'dummy-ix-1',
    slug: 'aurora-music-festival',
    name: 'Aurora Music Festival',
    description:
      'Placeholder project — an immersive event microsite concept with scroll-triggered animation and a bold visual identity.',
    category: PROJECT_CATEGORIES.INTERACTIVE_EXPERIENCE,
    toolSlugs: ['framer', 'javascript'],
    image: '/images/projects/placeholder.jpg',
    featured: false,
    isDummy: true,
    liveUrl: '',
  },
  {
    id: 'dummy-ix-2',
    slug: 'nova-studio-portfolio',
    name: 'Nova Studio Portfolio',
    description:
      'Placeholder project — a creative studio portfolio concept with cursor-driven interactions and cinematic transitions.',
    category: PROJECT_CATEGORIES.INTERACTIVE_EXPERIENCE,
    toolSlugs: ['framer', 'css3'],
    image: '/images/projects/placeholder.jpg',
    featured: false,
    isDummy: true,
    liveUrl: '',
  },
  {
    id: 'dummy-ix-3',
    slug: 'horizon-travel-experience',
    name: 'Horizon Travel Experience',
    description:
      'Placeholder project — an interactive travel storytelling concept using parallax scroll and dynamic imagery.',
    category: PROJECT_CATEGORIES.INTERACTIVE_EXPERIENCE,
    toolSlugs: ['react', 'framer'],
    image: '/images/projects/placeholder.jpg',
    featured: false,
    isDummy: true,
    liveUrl: '',
  },
  {
    id: 'dummy-ix-4',
    slug: 'lumen-product-launch',
    name: 'Lumen Product Launch',
    description:
      'Placeholder project — a product launch landing page concept with 3D-style visuals and micro-interactions.',
    category: PROJECT_CATEGORIES.INTERACTIVE_EXPERIENCE,
    toolSlugs: ['framer', 'javascript', 'css3'],
    image: '/images/projects/placeholder.jpg',
    featured: false,
    isDummy: true,
    liveUrl: '',
  },

  // ─────────────────────────────────────────────
  // BRAND IDENTITY (4 total — 0 real, 4 dummy)
  // ─────────────────────────────────────────────
  {
    id: 'dummy-brand-1',
    slug: 'solace-wellness-branding',
    name: 'Solace Wellness',
    description:
      'Placeholder project — a calming, nature-inspired brand identity concept for a wellness and mindfulness studio.',
    category: PROJECT_CATEGORIES.BRAND_IDENTITY,
    toolSlugs: ['figma', 'illustrator'],
    image: '/images/projects/placeholder.jpg',
    featured: false,
    isDummy: true,
  },
  {
    id: 'dummy-brand-2',
    slug: 'forge-coffee-co-branding',
    name: 'Forge Coffee Co.',
    description:
      'Placeholder project — a bold, artisanal brand identity concept for a specialty coffee roastery.',
    category: PROJECT_CATEGORIES.BRAND_IDENTITY,
    toolSlugs: ['figma', 'illustrator', 'photoshop'],
    image: '/images/projects/placeholder.jpg',
    featured: false,
    isDummy: true,
  },
  {
    id: 'dummy-brand-3',
    slug: 'vertex-fitness-branding',
    name: 'Vertex Fitness',
    description:
      'Placeholder project — a high-energy brand identity concept for a boutique fitness and strength training brand.',
    category: PROJECT_CATEGORIES.BRAND_IDENTITY,
    toolSlugs: ['figma', 'illustrator'],
    image: '/images/projects/placeholder.jpg',
    featured: false,
    isDummy: true,
  },
  {
    id: 'dummy-brand-4',
    slug: 'atlas-finance-branding',
    name: 'Atlas Finance',
    description:
      'Placeholder project — a trustworthy, modern brand identity concept for a fintech startup.',
    category: PROJECT_CATEGORIES.BRAND_IDENTITY,
    toolSlugs: ['figma', 'illustrator'],
    image: '/images/projects/placeholder.jpg',
    featured: false,
    isDummy: true,
  },
];
