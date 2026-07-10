import { getCurrentAvailability, availabilityDotColor } from '@/config/availability';
import { cn } from '../../lib/utils/cn';

interface AvailabilityBadgeProps {
  className?: string;
}

export function AvailabilityBadge({ className }: AvailabilityBadgeProps) {
  const availability = getCurrentAvailability();
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
