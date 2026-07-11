import Image from 'next/image';
import type { Tool } from '@/types/tools';

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <div
      title={tool.label}
      className="group border-border bg-card/40 hover:border-primary/60 relative flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border backdrop-blur-sm transition-colors duration-300"
    >
      <div
        aria-hidden="true"
        className="absolute -top-1/3 -left-1/3 h-2/3 w-2/3 rotate-12 rounded-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:translate-x-4 group-hover:translate-y-2"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent"
      />

      {tool.type === 'icon' ? (
        <div className="relative z-10 h-7 w-7">
          {/* Default state — forced to a fixed muted color, so it's
              always visible no matter what the brand's real color is */}
          <Image
            src={`https://cdn.simpleicons.org/${tool.slug}/94a3b8`}
            alt={tool.label}
            fill
            unoptimized
            className="object-contain opacity-60 transition-opacity duration-300 group-hover:opacity-0"
          />
          {/* True brand-color version — fades in on hover */}
          <Image
            src={`https://cdn.simpleicons.org/${tool.slug}`}
            alt=""
            aria-hidden="true"
            fill
            unoptimized
            className="object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </div>
      ) : (
        <span className="text-foreground/50 group-hover:text-primary relative z-10 text-lg font-bold opacity-50 transition-all duration-300 group-hover:opacity-100">
          {tool.badgeText}
        </span>
      )}
    </div>
  );
}
