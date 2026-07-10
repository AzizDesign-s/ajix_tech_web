import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merges conditional classNames (clsx) and resolves Tailwind conflicts (twMerge).
// e.g. cn("px-4", isActive && "px-6") correctly outputs "px-6", not both.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
