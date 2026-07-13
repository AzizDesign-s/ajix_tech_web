import Image from 'next/image';

export function DesignerDescriptionCard() {
  return (
    <div className="border-border bg-gradient-surface relative col-span-1 h-full overflow-hidden rounded-3xl border p-6 lg:p-8">
      <Image
        src="/images/grid/design.png"
        alt=""
        fill
        aria-hidden="true"
        sizes="50vw"
        className="object-contain object-bottom-left opacity-30"
      />
      <div className="relative z-10">
        <p className="text-foreground/90 font-heading max-w-sm text-sm leading-relaxed font-normal lg:text-lg">
          A product designer who combines UX thinking with frontend engineering to create fast,
          accessible, and scalable digital experiences.
        </p>
      </div>
    </div>
  );
}
