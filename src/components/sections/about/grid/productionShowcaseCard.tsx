import Image from 'next/image';

export function ProductionShowcaseCard() {
  return (
    <div className="group border-border bg-card relative h-full min-h-105 w-full overflow-hidden rounded-3xl border p-6">
      <Image
        src="/images/grid/production-showcase.png"
        alt="From idea to production"
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className="from-background via-background/30 absolute inset-0 bg-linear-to-t to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
        <h3 className="font-heading text-foreground text-xl font-bold lg:text-2xl">
          From Idea to Production
        </h3>
        <p className="text-muted mt-2 max-w-9/12 text-sm leading-relaxed">
          I turn ideas into intuitive user experiences and production-ready React applications
          through collaborative design, clear communication, and scalable engineering.
        </p>
      </div>
    </div>
  );
}
