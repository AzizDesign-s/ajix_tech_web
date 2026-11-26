import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * The shell every card in the contact sidebar shares.
 *
 * A Server Component on purpose: these cards are mostly static content, and
 * only the few genuinely interactive pieces inside them (the clock, the copy
 * button) are client components. Keeping the shell on the server means the
 * sidebar costs almost nothing in JavaScript.
 */
export function SideCard({
  eyebrow,
  title,
  badge,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  /** Top-right slot — the availability dot, an icon. */
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  // Derived from the title rather than useId(): hooks are not available in a
  // Server Component, and these titles are fixed and unique on the page.
  const headingId = `card-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`;

  return (
    // aria-labelledby is load-bearing. A <section> is exposed as a landmark
    // only when it has an accessible name; without one these were generic
    // containers that landmark navigation skipped entirely.
    <section
      aria-labelledby={headingId}
      className={cn('border-border bg-card shadow-card rounded-2xl border p-6 md:p-7', className)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-eyebrow text-[11px] font-bold tracking-[0.12em] uppercase">
            {eyebrow}
          </p>
          <h2
            id={headingId}
            className="font-heading text-foreground mt-1.5 text-xl font-semibold text-balance"
          >
            {title}
          </h2>
        </div>
        {badge && <div className="shrink-0 pt-1">{badge}</div>}
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Hairline rule between blocks inside a card. */
export function CardDivider() {
  return <hr className="border-border my-5 border-t" />;
}

/** A small label above a value or group. */
export function CardLabel({ children }: { children: ReactNode }) {
  return <p className="text-muted mb-2 text-xs font-medium">{children}</p>;
}
