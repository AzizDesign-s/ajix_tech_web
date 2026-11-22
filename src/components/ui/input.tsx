import { type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { controlClasses } from '@/components/ui/field';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlClasses, className)} {...props} />;
}
