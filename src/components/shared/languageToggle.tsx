'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface LanguageToggleProps {
  className?: string;
}

// UI-only for now — will wire into next-intl routing once
// Arabic localization is implemented in a later phase.
export function LanguageToggle({ className }: LanguageToggleProps) {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const nextLanguageLabel = language === 'en' ? 'AR' : 'EN';

  return (
    <button
      type="button"
      onClick={() => setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'))}
      className={cn(
        'border-border bg-card text-foreground hover:bg-border focus-visible:ring-ring flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
      aria-label="Switch language"
    >
      {nextLanguageLabel}
    </button>
  );
}
