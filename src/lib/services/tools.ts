import { tools } from '@/data/tools';
import { Tool } from '@/types/tools';

export function getAllTools(): Tool[] {
  return tools;
}

// Used by Project detail pages (Phase 9) to resolve a project's
// tool slugs into full Tool objects (label + icon) from this one catalog.
export function getToolsBySlug(slugs: string[]): Tool[] {
  return slugs
    .map((slug) => tools.find((tool) => tool.slug === slug))
    .filter((tool): tool is Tool => Boolean(tool));
}
