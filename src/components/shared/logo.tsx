import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { SiteTheme } from '@/types/theme';

interface LogoProps {
  className?: string;
  preload?: boolean;
  theme?: SiteTheme;
}

// Asset naming follows the existing convention: "-dark" is the white mark for
// dark backgrounds, "-light" is the #000614 mark for light backgrounds.
const LOGO_SRC: Record<SiteTheme, string> = {
  dark: '/logo/ajix-icon-dark.svg',
  light: '/logo/ajix-icon-light.svg',
};

export function Logo({ className, preload = false, theme = 'dark' }: LogoProps) {
  return (
    <Link href="/" aria-label="AJIX — Home" className={cn('inline-flex', className)}>
      <Image
        src={LOGO_SRC[theme]}
        alt="AJIX"
        width={30}
        height={30}
        preload={preload}
        className="h-auto w-10"
      />
    </Link>
  );
}
