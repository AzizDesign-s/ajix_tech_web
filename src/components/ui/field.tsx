import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface FieldProps {
  id: string;
  label: string;
  children: ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
}

/**
 * Wraps a control with its label, optional hint and error.
 *
 * The control is expected to read `aria-describedby={describedBy(id, ...)}` and
 * `aria-invalid`, which is why those ids are derived from one place.
 */
export function Field({ id, label, children, error, hint, required, className }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-foreground text-sm font-medium">
        {label}
        {required ? (
          <span className="text-primary ml-1" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="text-muted ml-2 text-xs font-normal">(optional)</span>
        )}
      </label>

      {hint && (
        <p id={`${id}-hint`} className="text-muted text-xs">
          {hint}
        </p>
      )}

      {children}

      {/* Announced as it appears, so a screen-reader user hears the problem
          without having to re-traverse the form. */}
      <p id={`${id}-error`} role="alert" className={cn('text-danger text-xs', !error && 'sr-only')}>
        {error ?? ''}
      </p>
    </div>
  );
}

export function describedBy(id: string, hasHint: boolean, hasError: boolean): string | undefined {
  const ids = [hasHint ? `${id}-hint` : null, hasError ? `${id}-error` : null].filter(Boolean);
  return ids.length ? ids.join(' ') : undefined;
}

export const controlClasses =
  'border-border bg-card text-foreground placeholder:text-muted/70 focus-visible:ring-ring w-full rounded-lg border px-4 py-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-danger';
