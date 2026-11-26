'use client';

import Image from 'next/image';
import { Maximize2 } from 'lucide-react';
import { useLightbox } from '@/components/sections/caseStudy/lightbox';
import type { CaseStudyImage } from '@/types/caseStudy';
import { cn } from '@/lib/utils/cn';

interface MediaFigureProps {
  image: CaseStudyImage;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

/**
 * A case-study image that can be opened full size.
 *
 * It is a real <button>, not a div with a click handler, so it is reachable by
 * keyboard and announced as something that can be activated. A decorative
 * image gets an empty alt and is not made interactive at all — there is
 * nothing in it worth enlarging.
 */
export function MediaFigure({ image, sizes, className, priority = false }: MediaFigureProps) {
  const openLightbox = useLightbox();

  const picture = (
    <Image
      src={image.url}
      alt={image.decorative ? '' : image.alt}
      fill
      {...(priority ? { preload: true } : {})}
      sizes={sizes ?? '(max-width: 768px) 92vw, 900px'}
      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
    />
  );

  if (image.decorative) {
    return (
      <div className={cn('border-border relative overflow-hidden rounded-xl border', className)}>
        {picture}
      </div>
    );
  }

  return (
    <figure className="w-full">
      <button
        type="button"
        onClick={() => openLightbox(image)}
        className={cn(
          'group border-border focus-visible:ring-ring relative block w-full cursor-zoom-in overflow-hidden rounded-xl border focus-visible:ring-2 focus-visible:outline-none',
          className,
        )}
      >
        {picture}
        <span
          aria-hidden="true"
          className="bg-background/70 text-foreground absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-md opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
        >
          <Maximize2 size={14} />
        </span>
        <span className="sr-only">Open {image.alt} full size</span>
      </button>
      {image.caption && (
        <figcaption className="text-muted mt-3 text-sm">{image.caption}</figcaption>
      )}
    </figure>
  );
}
