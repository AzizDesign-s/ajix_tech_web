'use client';

import { useState } from 'react';
import Image from 'next/image';
import { airaConfig } from '@/config/aira';
import { AiraPlaceholder } from '@/components/sections/contact/airaPlaceholder';

/**
 * Renders the real AIRA asset once one is configured, falling back to the
 * built-in placeholder if it fails to load. Only mounted when
 * `airaConfig.src` is set, so the page ships zero client JS for this while the
 * placeholder is in use.
 */
export function AiraPhoto({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) return <AiraPlaceholder />;

  return (
    <Image
      src={src}
      alt={airaConfig.alt}
      width={airaConfig.width}
      height={airaConfig.height}
      preload
      sizes="(max-width: 768px) 70vw, (max-width: 1280px) 40vw, 480px"
      className="h-full w-full object-contain object-bottom"
      onError={() => setFailed(true)}
    />
  );
}
