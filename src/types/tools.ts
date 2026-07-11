export type ToolType = 'icon' | 'badge';

export interface Tool {
  slug: string; // simple-icons slug (used for the CDN icon URL) or a unique key for badge-type tools
  label: string;
  type: ToolType;
  badgeText?: string; // only used when type is "badge" — for tools without a simple-icons entry
}
