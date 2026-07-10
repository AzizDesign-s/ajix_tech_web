import { categories } from '@/data/categories';
import { Category } from '@/types/category';

export function getAllCategories(): Category[] {
  return categories;
}
