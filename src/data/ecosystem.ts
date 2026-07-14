import { EcosystemCategory } from '@/types/ecosystem';

export const ecosystemCategories: EcosystemCategory[] = [
  {
    id: 'design-prototyping',
    label: 'Design & Prototyping',
    position: 'top-left',
    toolSlugs: ['figma', 'figjam', 'adobe-xd', 'illustrator', 'photoshop', 'sketch'],
  },
  {
    id: 'frontend-engineering',
    label: 'Frontend Engineering',
    position: 'top-right',
    toolSlugs: [
      'react',
      'nextdotjs',
      'tailwindcss',
      'javascript',
      'typescript',
      'framer',
      'framer-motion',
      'html5',
    ],
  },
  {
    id: 'collaboration-delivery',
    label: 'Collaboration & Delivery',
    position: 'bottom-left',
    toolSlugs: ['git', 'github', 'jira', 'trello', 'confluence', 'notion'],
  },
  {
    id: 'analytics-insights',
    label: 'Analytics & Insights',
    position: 'bottom-right',
    toolSlugs: ['mixpanel', 'amplitude', 'hotjar'],
  },
];
