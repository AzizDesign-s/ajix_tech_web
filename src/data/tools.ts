import { Tool } from '@/types/tools';

export const tools: Tool[] = [
  { slug: 'figma', label: 'Figma', type: 'icon' },
  { slug: 'photoshop', label: 'Photoshop', type: 'badge', badgeText: 'Ps' },
  { slug: 'illustrator', label: 'Illustrator', type: 'badge', badgeText: 'Ai' },
  { slug: 'adobe-xd', label: 'Adobe XD', type: 'badge', badgeText: 'Xd' },
  { slug: 'react', label: 'React', type: 'icon' },
  { slug: 'nextdotjs', label: 'Next.js', type: 'icon' },
  { slug: 'typescript', label: 'TypeScript', type: 'icon' },
  { slug: 'tailwindcss', label: 'Tailwind CSS', type: 'icon' },
  { slug: 'framer', label: 'Framer Motion', type: 'icon' },
  { slug: 'javascript', label: 'JavaScript', type: 'icon' },
  { slug: 'html5', label: 'HTML5', type: 'icon' },
  { slug: 'css', label: 'CSS3', type: 'icon' },
  { slug: 'git', label: 'Git', type: 'icon' },
  { slug: 'github', label: 'GitHub', type: 'icon' },
  { slug: 'behance', label: 'Behance', type: 'icon' },
  { slug: 'vercel', label: 'Vercel', type: 'icon' },

  // Design & Prototyping additions
  { slug: 'figjam', label: 'FigJam', type: 'badge', badgeText: 'FJ' },
  { slug: 'sketch', label: 'Sketch', type: 'icon' },
  { slug: 'framer-motion', label: 'Framer Motion', type: 'icon' }, // uses the same "framer" simple-icons logo as a visual mark

  // Frontend Engineering additions
  { slug: 'html5', label: 'HTML / CSS', type: 'icon' },

  // Collaboration & Delivery additions
  { slug: 'jira', label: 'Jira', type: 'icon' },
  { slug: 'trello', label: 'Trello', type: 'icon' },
  { slug: 'confluence', label: 'Confluence', type: 'icon' },
  { slug: 'notion', label: 'Notion', type: 'icon' },

  // Analytics & Insights additions
  { slug: 'mixpanel', label: 'Mixpanel', type: 'icon' },
  { slug: 'amplitude', label: 'Amplitude', type: 'badge', badgeText: 'Am' },
  { slug: 'hotjar', label: 'Hotjar', type: 'icon' },
];

export const toolsRowOne = tools.slice(0, 8);
export const toolsRowTwo = tools.slice(8, 16);
