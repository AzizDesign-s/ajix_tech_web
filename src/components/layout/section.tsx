import { cn } from '@/lib/utils/cn';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

// Standard homepage section wrapper — consistent max-width and vertical
// rhythm across every section. NOT used for the Hero section, which has
// its own full-bleed layout.
export function Section({ children, className, id }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'mx-auto flex max-w-7xl flex-col items-center px-6 pt-25 pb-25 md:px-10',
        className,
      )}
    >
      {children}
    </section>
  );
}
