'use client';

import { useEffect, useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { GradientBlob } from '@/components/ui/gradientBlob';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils/cn';
import { trackEvent } from '@/lib/analytics';

type CopyState = 'idle' | 'copied' | 'error';

export function CopyEmailCard() {
  const [state, setState] = useState<CopyState>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleCopy() {
    // The result used to be assumed: the card said "Email is Copied!" even when
    // the clipboard write was rejected (insecure context, denied permission),
    // and the rejection surfaced as an unhandled promise error.
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setState('copied');
      trackEvent('email_copy');
    } catch {
      setState('error');
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setState('idle'), 2500);
  }

  const label =
    state === 'copied'
      ? 'Email is Copied!'
      : state === 'error'
        ? `Copy failed — ${siteConfig.email}`
        : 'Copy my E-mail';

  return (
    <div className="border-border relative col-span-1 flex h-full items-center justify-center overflow-hidden rounded-3xl border p-4 lg:p-8">
      <GradientBlob />
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <h3 className="font-heading text-foreground text-lg font-bold lg:text-2xl">
          Let&apos;s Build Together
        </h3>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            'text-foreground shadow-glow-blue bg-gradient-primary focus-visible:ring-ring flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-transform duration-200 focus-visible:ring-2 focus-visible:outline-none',
            state === 'idle' ? 'hover:scale-105' : 'scale-105',
          )}
        >
          {state === 'copied' ? (
            <Check size={16} aria-hidden="true" className="text-success" />
          ) : (
            <Copy size={16} aria-hidden="true" />
          )}
          {label}
        </button>
        {/* Announces the outcome to screen readers, which otherwise got no
            confirmation that anything had happened. */}
        <span role="status" aria-live="polite" className="sr-only">
          {state === 'copied'
            ? 'Email address copied to clipboard'
            : state === 'error'
              ? `Could not copy automatically. The address is ${siteConfig.email}`
              : ''}
        </span>
      </div>
    </div>
  );
}
