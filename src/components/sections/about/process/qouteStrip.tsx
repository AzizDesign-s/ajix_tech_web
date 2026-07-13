import { ArrowUpRight } from 'lucide-react';

interface QuoteStripProps {
  quote: string;
  subtext: string;
}

export function QuoteStrip({ quote, subtext }: QuoteStripProps) {
  return (
    <div className="border-border bg-card/60 flex flex-col items-start justify-center gap-4 rounded-2xl border px-4 py-3 sm:flex-row sm:items-center">
      <span
        aria-hidden="true"
        className="bg-gradient-primary shadow-glow-blue flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
      >
        <ArrowUpRight size={16} className="text-foreground" />
      </span>
      <p className="text-sm">
        <span className="text-foreground font-semibold">{quote}</span>{' '}
        <span className="text-muted">{subtext}</span>
      </p>
    </div>
  );
}
