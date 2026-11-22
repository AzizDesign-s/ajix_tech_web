import Image from 'next/image';
import { getToolsBySlug } from '@/lib/services/tools';
import type { EcosystemCategory } from '@/types/ecosystem';

interface EcosystemCardProps {
  category: EcosystemCategory;
}

export function EcosystemCard({ category }: EcosystemCardProps) {
  const tools = getToolsBySlug(category.toolSlugs);

  return (
    <div className="border-border bg-card/60 w-full max-w-full rounded-2xl border p-4 backdrop-blur-sm sm:max-w-60">
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
              <Image
                src={`/icons/tools/${tool.slug}.svg`}
                alt=""
                aria-hidden="true"
                width={12}
                height={12}
                className="tool-icon-static h-3 w-3"
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
