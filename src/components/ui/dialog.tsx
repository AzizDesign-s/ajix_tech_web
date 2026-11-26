'use client';

import { useCallback, useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** Rendered as the dialog's heading and used as its accessible name. */
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Modal dialog built on the native <dialog> element.
 *
 * Using the platform's `showModal()` rather than a hand-rolled overlay means
 * focus trapping, the inert background, Escape-to-close and the top-layer
 * stacking all come from the browser. A hand-rolled trap is the single most
 * commonly broken piece of accessible UI, and there is no reason to write one.
 *
 * What is added on top:
 *   - focus restored to whatever opened the dialog
 *   - a click on the backdrop closes it
 *   - the page behind does not scroll while it is open
 *   - a close transition that respects prefers-reduced-motion (CSS only)
 */
export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      // Remember who opened it so focus can go back there on close. Without
      // this, closing drops focus to <body> and a keyboard user loses their
      // place in the grid.
      openerRef.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (open) return;
    document.body.style.overflow = '';
    openerRef.current?.focus?.();
    openerRef.current = null;
  }, [open]);

  // Unmounting while open would leave the body unscrollable forever.
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      // Escape fires `cancel` before `close`; routing both through onClose
      // keeps React state and the DOM element in agreement.
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClose={close}
      onClick={(event) => {
        // A click that lands on the <dialog> itself rather than on its content
        // is a backdrop click — the element fills the viewport, the panel does
        // not.
        if (event.target === dialogRef.current) close();
      }}
      className={cn(
        'bg-card/95 text-foreground border-border backdrop:bg-background/80 m-auto w-[min(92vw,56rem)] rounded-2xl border p-0 shadow-2xl backdrop:backdrop-blur-sm',
        'open:animate-[hero-reveal_280ms_ease-out] motion-reduce:open:animate-none',
        className,
      )}
    >
      <div className="relative max-h-[86vh] overflow-y-auto p-6 md:p-8">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="border-border text-muted hover:text-foreground hover:bg-card focus-visible:ring-ring absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <X size={16} aria-hidden="true" />
        </button>

        <h2 id={titleId} className="font-heading pr-12 text-2xl font-semibold md:text-3xl">
          {title}
        </h2>

        {children}
      </div>
    </dialog>
  );
}
