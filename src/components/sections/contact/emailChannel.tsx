'use client';

import { useEffect, useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { contactChannels } from '@/config/contact';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils/cn';

type CopyState = 'idle' | 'copied' | 'error';

export function EmailChannelAction() {
  const [state, setState] = useState<CopyState>('idle');
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );

  async function copy() {
    // The outcome is reported, not assumed — a rejected clipboard write says so
    // and shows the address instead.
    try {
      await navigator.clipboard.writeText(contactChannels.email);
      setState('copied');
      trackEvent('contact_email_click', { method: 'copy' });
    } catch {
      setState('error');
    }
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setState('idle'), 2500);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={`mailto:${contactChannels.email}`}
        onClick={() => trackEvent('contact_email_click', { method: 'mailto' })}
        className="text-primary focus-visible:ring-ring rounded text-sm font-medium underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
      >
        {contactChannels.email}
      </a>
      <button
        type="button"
        onClick={copy}
        className={cn(
          'border-border text-muted hover:text-foreground focus-visible:ring-ring inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
          state === 'copied' && 'text-success border-success/40',
        )}
      >
        {state === 'copied' ? (
          <Check size={14} aria-hidden="true" />
        ) : (
          <Copy size={14} aria-hidden="true" />
        )}
        {state === 'copied' ? 'Copied' : state === 'error' ? 'Copy failed' : 'Copy'}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === 'copied'
          ? 'Email address copied to clipboard'
          : state === 'error'
            ? `Could not copy automatically. The address is ${contactChannels.email}`
            : ''}
      </span>
    </div>
  );
}
