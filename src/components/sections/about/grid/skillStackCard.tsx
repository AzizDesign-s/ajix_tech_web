import { skillStackLeft, skillStackRight } from '@/data/skillStack';
import { cn } from '@/lib/utils/cn';

interface SkillColumnProps {
  items: string[];
  direction: 'up' | 'down';
  duration: number;
}

function SkillColumn({ items, direction, duration }: SkillColumnProps) {
  return (
    <div className="marquee-row relative h-full overflow-hidden">
      <div
        className={cn(
          'flex flex-col gap-3',
          direction === 'up' ? 'marquee-vertical-track' : 'marquee-vertical-track-reverse',
        )}
        style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="text-foreground bg-card border-border rounded-lg border px-3 py-2 text-center text-xs whitespace-nowrap lg:px-4 lg:py-6 lg:text-sm"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SkillStackCard() {
  return (
    <div className="border-border bg-gradient-surface relative col-span-1 h-full overflow-hidden rounded-3xl border px-6 py-8 lg:px-8 lg:py-8">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14"
        style={{ maskImage: 'linear-gradient(to bottom, black, transparent)' }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12"
        style={{ maskImage: 'linear-gradient(to top, black, transparent)' }}
      />

      <p className="text-muted text-xs font-medium">I constantly try to improve</p>
      <h3 className="font-heading text-foreground mt-1 text-lg font-bold lg:text-2xl">
        My Skill Stack
      </h3>

      <div className="absolute top-0 right-6 flex h-full gap-4 lg:right-8 lg:gap-5">
        <SkillColumn items={skillStackLeft} direction="up" duration={22} />
        <SkillColumn items={skillStackRight} direction="down" duration={26} />
      </div>
    </div>
  );
}
