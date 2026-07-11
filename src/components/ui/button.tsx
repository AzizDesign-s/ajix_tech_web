import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  'focus-visible:ring-ring focus-visible:ring-offset-background inline-flex items-center justify-center  font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        // Row 1 in your screenshot — gradient, glowing
        gradient:
          'bg-gradient-secondary text-foreground  hover:shadow-[0_0_40px_-6px_var(--color-primary)] hover:brightness-110 shadow-[0_0_30px_-8px_var(--color-primary)] ',
        // Row 2 — dark surface, bordered, subtle
        surface: 'border border-border bg-gradient-surface text-foreground hover:bg-card ',
        // Row 3 — solid brand blue
        primary: 'bg-primary text-foreground hover:bg-blue-light ',
      },
      size: {
        sm: 'h-9 px-4 text-sm rounded-md',
        md: 'h-11 px-6 text-sm rounded-lg',
        lg: 'h-13 px-8 text-base rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
    },
  },
);

interface ButtonBaseProps extends VariantProps<typeof buttonVariants> {
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
  href?: string; // if provided, renders as a Link instead of <button>
  download?: boolean;
}

type ButtonProps = ButtonBaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

export function Button({
  children,
  download,
  icon,
  variant,
  size,
  className,
  href,
  ...props
}: ButtonProps) {
  // Icon-only: no text passed in, just an icon — used for the square arrow buttons
  const isIconOnly = !children && Boolean(icon);

  const classes = cn(
    buttonVariants({ variant, size }),
    isIconOnly && (size === 'md' ? 'w-11 px-0' : 'w-14 px-0'),
    className,
  );

  const content = (
    <>
      {children}
      {icon}
    </>
  );

  if (href) {
    return (
      <Link href={href} download={download} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}
