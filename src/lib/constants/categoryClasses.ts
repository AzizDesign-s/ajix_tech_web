import type { CategoryColor } from '@/types/category';

// Translates a color name to its Tailwind class. Pure color-name-to-class
// plumbing — no knowledge of categories, so it can't drift out of sync.
export const dotColorClass: Record<CategoryColor, string> = {
  cyan: 'bg-cyan',
  primary: 'bg-primary',
  violet: 'bg-violet',
  purple: 'bg-purple',
};

export const gradientColorClass: Record<CategoryColor, string> = {
  cyan: 'from-cyan/40 via-primary/20 to-transparent',
  primary: 'from-primary/40 via-violet/20 to-transparent',
  violet: 'from-violet/40 via-purple/20 to-transparent',
  purple: 'from-purple/40 via-cyan/20 to-transparent',
};
