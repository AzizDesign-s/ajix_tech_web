import type { ProjectCategory } from '@/types/project';

export type CategoryColor = 'cyan' | 'primary' | 'violet' | 'purple';

export interface Category {
  slug: ProjectCategory;
  number: string;
  name: string;
  description: string;
  image: string;
  color: CategoryColor;
}
