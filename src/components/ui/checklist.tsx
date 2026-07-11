import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface CheckListProps {
  items: string[];
  className?: string;
}

// Reusable tick-list — wraps naturally based on item text length,
// matching the uneven row lengths in the Figma design.
export function CheckList({ items, className }: CheckListProps) {
  return (
    <ul className={cn('flex flex-wrap gap-x-8 gap-y-3', className)}>
      {items.map((item) => (
        <li
          key={item}
          className="text-foreground/80 flex items-center gap-2 text-sm whitespace-nowrap"
        >
          <span className="bg-cyan/20 text-cyan flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
            <Check size={12} strokeWidth={3} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
