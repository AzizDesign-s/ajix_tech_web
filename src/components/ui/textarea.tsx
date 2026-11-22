import { type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { controlClasses } from '@/components/ui/field';

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(controlClasses, 'min-h-32 resize-y', className)} {...props} />;
}
