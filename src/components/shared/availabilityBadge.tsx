'use client';

import { availabilityDotColor } from '@/config/availability';
import { useAvailability } from '@/components/shared/availabilityProvider';
import { cn } from '../../lib/utils/cn';

interface AvailabilityBadgeProps {
  className?: string;
}

export function AvailabilityBadge({ className }: AvailabilityBadgeProps) {
  // Supplied by <AvailabilityProvider> in the route-group layout, which reads
  // it from Sanity. Falls back to the local config when no provider is above.
  const availability = useAvailability();
  const dotColor = availabilityDotColor[availability.level];

  return (
    <div
      className={cn(
        'border-border bg-card text-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium',
        className,
      )}
    >
      <span className={cn('h-2 w-2 rounded-full', dotColor)} />
      {availability.label}
    </div>
  );
}
