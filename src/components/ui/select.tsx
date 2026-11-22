import { type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { controlClasses } from '@/components/ui/field';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: readonly string[];
  placeholder?: string;
}

// A native <select>: it is keyboard accessible, screen-reader correct and uses
// the platform picker on mobile for free. A custom listbox would be a lot of
// ARIA for a worse result.
export function Select({ options, placeholder, className, ...props }: SelectProps) {
  return (
    <select className={cn(controlClasses, 'appearance-none pr-10', className)} {...props}>
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
