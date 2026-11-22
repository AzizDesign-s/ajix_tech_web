'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { SiteTheme } from '@/types/theme';

const LOGO_SRC: Record<SiteTheme, string> = {
  dark: '/logo/ajix-full-dark.svg',
  light: '/logo/ajix-full-light.svg',
};

export function FooterWordmark({ theme = 'dark' }: { theme?: SiteTheme }) {
  const logo = LOGO_SRC[theme];

  return (
    <div className="flex flex-col items-center gap-4 py-10">
      {/* Wipe reveal — clips left-to-right as it scrolls into view */}
      <motion.div
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      >
        <Image
          src={logo}
          alt="AJIX"
          width={751}
          height={146}
          className="pointer-events-none h-auto w-48 sm:w-[320px] md:w-105 lg:w-130"
          priority
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, delay: 0.9, ease: 'easeOut' }}
        className="text-muted mt-3 text-xs font-medium tracking-[0.3em] uppercase"
      >
        A Journey Into Experience
      </motion.p>
    </div>
  );
}
