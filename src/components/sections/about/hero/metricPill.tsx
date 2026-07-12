import { AnimatedCounter } from '@/components/ui/animatedCounter';
import type { HeroMetric } from '@/types/metric';

interface MetricPillProps {
  metric: HeroMetric;
}

// Small stat pill — distinct from the homepage's MetricsStrip (which is
// a full-width divided glass bar). Reuses AnimatedCounter for the number,
// per the "don't recreate the counter" rule.
export function MetricPill({ metric }: MetricPillProps) {
  return (
    <div className="border-border bg-card/60 rounded-lg border px-4 py-3 backdrop-blur-sm">
      <p className="font-heading text-cyan text-2xl font-bold">
        <AnimatedCounter value={metric.value} suffix={metric.suffix} />
      </p>
      <p className="text-muted text-xs">{metric.label}</p>
    </div>
  );
}
