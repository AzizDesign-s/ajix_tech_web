import {
  Palette,
  Code2,
  LayoutGrid,
  Sparkles,
  Users,
  PenTool,
  ClipboardCheck,
  Accessibility,
  type LucideIcon,
} from 'lucide-react';

// Central icon registry — add new entries here as future sections need
// icons (Tools, tech stacks, etc). Components reference icons by key,
// never by importing lucide-react directly for content-driven icons.
export const iconMap = {
  'product-design': Palette,
  'frontend-engineering': Code2,
  'design-systems': LayoutGrid,
  'motion-interaction': Sparkles,
  'user-research': Users,
  'wireframing-prototyping': PenTool,
  'usability-testing': ClipboardCheck,
  accessibility: Accessibility,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof iconMap;
