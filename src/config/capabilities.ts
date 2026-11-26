import type { IconKey } from '@/lib/constants/icon';

/**
 * Section 06 of the Work page.
 *
 * Descriptions say what the work involves, not what it achieved — no metrics,
 * no client outcomes, nothing that would need a source.
 */
export interface Capability {
  id: string;
  title: string;
  description: string;
  icon: IconKey;
}

export const capabilities: Capability[] = [
  {
    id: 'product-strategy',
    title: 'Product Strategy',
    description:
      'Framing the problem before the interface — scope, constraints, success criteria and what the product should deliberately not do.',
    icon: 'capability-product-strategy',
  },
  {
    id: 'ux-research',
    title: 'UX Research',
    description:
      'Interviews, task analysis and journey mapping, turned into decisions a team can act on rather than a deck nobody reopens.',
    icon: 'capability-ux-research',
  },
  {
    id: 'interface-design',
    title: 'Interface Design',
    description:
      'High-fidelity screens for dense, multi-role software, where hierarchy and state matter more than decoration.',
    icon: 'capability-interface-design',
  },
  {
    id: 'design-systems',
    title: 'Design Systems',
    description:
      'Tokens, components and documentation that stay consistent across a product as it grows and as more people build in it.',
    icon: 'capability-design-systems',
  },
  {
    id: 'frontend-engineering',
    title: 'Frontend Engineering',
    description:
      'Production React and Next.js — accessible, measured against Core Web Vitals, and shipped rather than prototyped.',
    icon: 'capability-frontend-engineering',
  },
  {
    id: 'saas-development',
    title: 'SaaS Product Development',
    description:
      'Taking business software from concept through module design to a working product, including the parts nobody demos.',
    icon: 'capability-saas-development',
  },
];
