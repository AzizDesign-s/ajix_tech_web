'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { GradientBlob } from '@/components/ui/gradientBlob';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils/cn';

export function CopyEmailCard() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(siteConfig.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
            'text-foreground shadow-glow-blue bg-gradient-primary flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-transform duration-200',
            copied ? 'scale-105' : 'hover:scale-105',
          )}
        >
          {copied ? (
            <>
              <Check size={16} className="text-success" />
              Email is Copied!
            </>
          ) : (
            <>
              <Copy size={16} />
              Copy my E-mail
            </>
          )}
        </button>
      </div>
    </div>
  );
}
