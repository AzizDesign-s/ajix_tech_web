import { getToolsBySlug } from '@/lib/services/tools';
import type { EcosystemCategory } from '@/types/ecosystem';

interface EcosystemCardProps {
  category: EcosystemCategory;
}

export function EcosystemCard({ category }: EcosystemCardProps) {
  const tools = getToolsBySlug(category.toolSlugs);

  return (
    <div className="border-border bg-card/60 w-full max-w-[220px] rounded-2xl border p-4 backdrop-blur-sm sm:max-w-[240px]">
      <p className="text-cyan mb-3 text-xs font-semibold tracking-wide uppercase">
        {category.label}
      </p>
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <span
            key={tool.slug}
            className="border-border bg-background/60 text-foreground flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs"
          >
            {tool.type === 'icon' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://cdn.simpleicons.org/${tool.slug === 'framer-motion' ? 'framer' : tool.slug}/94a3b8`}
                alt=""
                className="h-3 w-3"
              />
            ) : (
              <span className="text-muted text-[9px] font-bold">{tool.badgeText}</span>
            )}
            {tool.label}
          </span>
        ))}
      </div>
    </div>
  );
}
