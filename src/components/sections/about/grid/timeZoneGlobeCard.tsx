import { GridGlobe } from '@/components/sections/about/grid/gridGlobe';

export function TimezoneGlobeCard() {
  return (
    <div className="border-border bg-gradient-surface relative h-full overflow-hidden rounded-3xl border px-6 py-8 lg:px-8 lg:py-8">
      <div className="relative z-10">
        <h3 className="font-heading text-foreground max-w-9/12 text-lg font-bold lg:text-2xl">
          I&apos;m very flexible with time zone communications
        </h3>
      </div>
      <div className="absolute inset-0">
        <GridGlobe />
      </div>
    </div>
  );
}
