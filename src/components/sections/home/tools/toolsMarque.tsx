import type { CSSProperties } from 'react';
import { ToolCard } from '@/components/sections/home/tools/toolCard';
import type { Tool } from '@/types/tools';
import { cn } from '@/lib/utils/cn';

interface ToolsMarqueeProps {
  tools: Tool[];
  direction?: 'left' | 'right';
  duration?: number;
}

export function ToolsMarquee({ tools, direction = 'left', duration = 32 }: ToolsMarqueeProps) {
  return (
    <div className="marquee-row relative overflow-hidden">
      <div
        className={cn(
          'flex w-max gap-4',
          direction === 'left' ? 'marquee-track' : 'marquee-track-reverse',
        )}
        style={{ '--marquee-duration': `${duration}s` } as CSSProperties}
      >
        {/* The set is rendered twice so the track can loop seamlessly. The
            second copy is purely visual — hidden from assistive tech so a
            screen reader does not read every tool name twice. */}
        {tools.map((tool, index) => (
          <ToolCard key={`${tool.slug}-${index}`} tool={tool} />
        ))}
        <div aria-hidden="true" className="flex gap-4">
          {tools.map((tool, index) => (
            <ToolCard key={`dup-${tool.slug}-${index}`} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  );
}
