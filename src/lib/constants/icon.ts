import {
  Palette,
  Code2,
  LayoutGrid,
  Sparkles,
  Users,
  ClipboardCheck,
  Accessibility,
  Search,
  Target,
  PenTool,
  Rocket,
  Waypoints,
  Zap,
  ListTree,
  Accessibility as AccessibilityIcon, // "accessibility" key already exists from Phase 7 — aliased to avoid collision
  Component,
  Inbox,
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
  'process-understand': Search,
  'process-define': Target,
  'process-design': PenTool,
  'process-validate': Rocket,
  'impact-user-flows': Waypoints,
  'impact-workflows': Zap,
  'impact-information-architecture': ListTree,
  'impact-accessibility': AccessibilityIcon,
  'impact-design-systems': Component,
  'impact-lead-response': Inbox,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof iconMap;
