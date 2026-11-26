import { PRODUCT_STATUSES, type SaasProduct } from '@/types/product';

/**
 * Local product content, so /products/[slug] renders before Sanity is
 * switched on and so the route can be tested.
 *
 * Read the copy: this describes a product in development and says so in every
 * section that would otherwise imply a shipped capability. Nothing here claims
 * a feature exists, quotes a price, names a customer or cites a number — the
 * brief rules all of those out, and a product page that oversells software
 * that is not finished costs more in lost trust than it earns in enquiries.
 *
 * Once the real content is in Sanity, set CONTENT_SOURCE=sanity and this file
 * stops being read. Delete it in the same commit as src/data/project.ts.
 */
export const products: SaasProduct[] = [
  {
    id: 'showroom-garage-crm',
    slug: 'showroom-garage-crm',
    name: 'Showroom & Garage CRM',
    tagline: 'One system for vehicle sales and workshop operations.',
    description:
      'A CRM being built for automotive showrooms and service garages, bringing enquiries, vehicles, jobs and customer history into one place instead of several disconnected spreadsheets.',
    image: '/images/project/placeholder/generic-saas.svg',
    isPlaceholderCover: true,
    targetIndustry: ['Automotive retail', 'Vehicle servicing', 'Fleet operators'],
    developmentStatus: PRODUCT_STATUSES.IN_DEVELOPMENT,
    // No demo exists yet, so the CTA asks for early access rather than
    // offering something that cannot be delivered.
    demoAvailable: false,
    pricingVisible: false,
    readyForIndexing: false,

    businessProblems: [
      {
        _key: 'problem-1',
        heading: 'Enquiries live in too many places',
        description:
          'Draft. Describe how leads currently arrive — walk-ins, calls, messages — and where they get lost.',
      },
      {
        _key: 'problem-2',
        heading: 'Sales and workshop do not share a record',
        description:
          'Draft. Describe what happens when the showroom and the service bay keep separate histories for the same vehicle.',
      },
      {
        _key: 'problem-3',
        heading: 'Nobody can see the month until it ends',
        description:
          'Draft. Describe the reporting gap — what owners want to know weekly and cannot currently answer.',
      },
    ],

    modules: [
      {
        _key: 'module-1',
        name: 'Enquiries',
        description: 'Planned. Capturing and assigning leads from every channel.',
        icon: 'intent-project',
      },
      {
        _key: 'module-2',
        name: 'Vehicles',
        description: 'Planned. One record per vehicle, shared by sales and service.',
        icon: 'impact-workflows',
      },
      {
        _key: 'module-3',
        name: 'Jobs',
        description: 'Planned. Workshop jobs, their status and who is on them.',
        icon: 'process-validate',
      },
      {
        _key: 'module-4',
        name: 'Customers',
        description: 'Planned. History across both sides of the business.',
        icon: 'user-research',
      },
    ],

    features: [
      {
        _key: 'feature-1',
        heading: 'Shared customer timeline',
        description: 'Planned. Draft — one line on what it does once built.',
      },
      {
        _key: 'feature-2',
        heading: 'Job status at a glance',
        description: 'Planned. Draft — one line on what it does once built.',
      },
      {
        _key: 'feature-3',
        heading: 'Role-based access',
        description: 'Planned. Draft — one line on what it does once built.',
      },
    ],

    workflow: [
      {
        _key: 'step-1',
        title: 'An enquiry arrives',
        description: 'Draft. What the system does with it.',
      },
      {
        _key: 'step-2',
        title: 'It becomes a vehicle record',
        description: 'Draft. How sales and service pick it up.',
      },
      {
        _key: 'step-3',
        title: 'Work is tracked to completion',
        description: 'Draft. What gets logged and what the owner sees.',
      },
    ],

    roadmap: [
      {
        _key: 'road-1',
        title: 'Core data model',
        description: 'Draft. What is being built now.',
        horizon: 'now',
      },
      {
        _key: 'road-2',
        title: 'Workshop scheduling',
        description: 'Draft. What comes after the core.',
        horizon: 'next',
      },
      {
        _key: 'road-3',
        title: 'Reporting',
        description: 'Draft. What is deliberately deferred.',
        horizon: 'later',
      },
    ],

    faq: [
      {
        _key: 'faq-1',
        question: 'Can I use it today?',
        answer:
          'Not yet. It is in development. You can register interest and I will get in touch when there is something real to show.',
      },
      {
        _key: 'faq-2',
        question: 'What does it cost?',
        answer:
          'There is no pricing yet, because there is no product to price. Anything quoted now would be a guess.',
      },
      {
        _key: 'faq-3',
        question: 'Can it be built for my business specifically?',
        answer:
          'Draft. Answer this honestly once you know whether you are building one product or bespoke installations.',
      },
    ],
  },
];
