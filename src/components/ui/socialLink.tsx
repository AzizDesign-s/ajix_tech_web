import type { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface SocialLinkProps {
  href: string;
  label: string;
  children: ReactNode;
  className?: string;
}

export function SocialLink({ href, label, children, className }: SocialLinkProps) {
  if (!href) return null; // same hide-if-empty pattern as the resume button

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        'border-border bg-card/60 text-foreground/70 hover:border-primary/60 hover:text-foreground flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300',
        className,
      )}
    >
      {children}
    </Link>
  );
}
