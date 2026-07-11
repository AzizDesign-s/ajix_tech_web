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
];

export const toolsRowOne = tools.slice(0, 8);
export const toolsRowTwo = tools.slice(8, 16);
