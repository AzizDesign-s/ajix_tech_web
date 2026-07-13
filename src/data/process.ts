import { ProcessStep } from '@/types/process';

export const processSteps: ProcessStep[] = [
  {
    id: 'understand',
    number: '01',
    icon: 'process-understand',
    image: '/images/process/p1.png',
    title: 'Understand',
    description: 'Research users, business goals, and product challenges.',
  },
  {
    id: 'define',
    number: '02',
    icon: 'process-define',
    image: '/images/process/p1.png',
    title: 'Define',
    description: 'Turn insights into clear problems, flows, and priorities.',
  },
  {
    id: 'design',
    number: '03',
    icon: 'process-design',
    image: '/images/process/p1.png',
    title: 'Design',
    description: 'Craft intuitive interfaces focused on clarity and usability.',
  },
  {
    id: 'validate-build',
    number: '04',
    icon: 'process-validate',
    image: '/images/process/p1.png',
    title: 'Validate & Build',
    description: 'Test, refine, and collaborate to deliver production-ready products.',
  },
];
