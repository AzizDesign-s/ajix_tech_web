import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface LogoProps {
  className?: string;
}

const logo = '/logo/ajix-icon-dark.svg';

// Wraps the brand mark in a Link to Home — used in Navbar now,
// reusable anywhere else the logo needs to appear (e.g. Footer).
export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" aria-label="AJIX — Home" className={cn('inline-flex', className)}>
      <Image src={logo} alt="AJIX" width={44} height={30} priority />
    </Link>
  );
}
