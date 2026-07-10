import type { ProjectCategory } from '@/types/project';

export interface Category {
  slug: ProjectCategory;
  number: string; // "01", "02", etc.
  name: string;
  description: string;
  image: string;
}
