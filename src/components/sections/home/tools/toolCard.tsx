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
        // One locally-hosted SVG per tool. The muted resting state and the
        // brand-colour hover are done with a CSS filter (see .tool-icon in
        // globals.css) instead of loading two images from a third-party CDN.
        <Image
          src={`/icons/tools/${tool.slug}.svg`}
          alt={tool.label}
          width={28}
          height={28}
          className="tool-icon relative z-10 h-7 w-7 object-contain"
        />
      ) : (
        <span className="text-muted group-hover:text-primary relative z-10 text-lg font-bold transition-colors duration-300">
          {tool.badgeText}
        </span>
      )}
    </div>
  );
}
