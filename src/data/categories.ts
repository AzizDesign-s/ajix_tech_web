import { Category } from '@/types/category';
import { PROJECT_CATEGORIES } from '@/types/project';

const product = '/images/category/product-design.png';
const frontend = '/images/category/frontend-engineer.png';
const framer = '/images/category/framer-dev.png';
const branding = '/images/category/branding.png';

export const categories: Category[] = [
  {
    slug: PROJECT_CATEGORIES.ENTERPRISE_PRODUCT_DESIGN,
    number: '01',
    name: 'Enterprise UI/UX Design',
    description:
      'End-to-end UX case studies for enterprise SaaS platforms, dashboards, & business app.',
    image: product,
    color: 'cyan',
  },
  {
    slug: PROJECT_CATEGORIES.FRONTEND_ENGINEERING,
    number: '02',
    name: 'Frontend Engineering',
    description: 'Production-ready React applications built from design systems to deployment.',
    image: frontend,
    color: 'primary',
  },
  {
    slug: PROJECT_CATEGORIES.INTERACTIVE_EXPERIENCE,
    number: '03',
    name: 'Interactive Experience',
    description:
      'Interactive user experiences powered by Framer Motion, GSAP, and modern web animation.',
    image: framer,
    color: 'violet',
  },
  {
    slug: PROJECT_CATEGORIES.BRAND_IDENTITY,
    number: '04',
    name: 'Brand Identity',
    description: 'Visual identities, logo systems, typography, and scalable brand guidelines.',
    image: branding,
    color: 'purple',
  },
];
