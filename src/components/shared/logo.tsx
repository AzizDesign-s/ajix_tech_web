import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface LogoProps {
  className?: string;
  priority?: boolean;
}

const logo = '/logo/ajix-icon-dark.svg';

export function Logo({ className, priority = false }: LogoProps) {
  return (
    <Link href="/" aria-label="AJIX — Home" className={cn('inline-flex', className)}>
      <Image
        src={logo}
        alt="AJIX"
        width={30}
        height={30}
        priority={priority}
        className="h-auto w-10"
      />
    </Link>
  );
}
