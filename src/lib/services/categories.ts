import { categories } from '@/data/categories';
import { Category, CategoryColor } from '@/types/category';
import { ProjectCategory } from '@/types/project';

export function getAllCategories(): Category[] {
  return categories;
}

export function getCategoryLabel(slug: ProjectCategory): string {
  return categories.find((category) => category.slug === slug)?.name ?? slug;
}

export function getCategoryColor(slug: ProjectCategory): CategoryColor {
  return categories.find((category) => category.slug === slug)?.color ?? 'primary';
}
