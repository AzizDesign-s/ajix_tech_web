'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { Dialog } from '@/components/ui/dialog';
import type { CaseStudyImage } from '@/types/caseStudy';

// One dialog for the whole page rather than one per image. A case study with
// thirty screenshots would otherwise mount thirty modals, each with its own
// listeners and its own focus bookkeeping.

const LightboxContext = createContext<(image: CaseStudyImage) => void>(() => {});

export function useLightbox() {
  return useContext(LightboxContext);
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [image, setImage] = useState<CaseStudyImage | null>(null);
  const open = useCallback((next: CaseStudyImage) => setImage(next), []);

  return (
    <LightboxContext.Provider value={open}>
      {children}
      <Dialog
        open={Boolean(image)}
        onClose={() => setImage(null)}
        title={image?.caption || image?.alt || 'Image'}
        className="w-[min(96vw,80rem)]"
      >
        {image && (
          <figure className="mt-6">
            <div className="border-border relative w-full overflow-hidden rounded-xl border">
              {/* Unconstrained height: a screenshot is usually taller than it
                  is wide, and cropping it to a fixed ratio defeats the point
                  of opening it full size. */}
              <Image
                src={image.url}
                alt={image.decorative ? '' : image.alt}
                width={image.width ?? 2000}
                height={image.height ?? 1400}
                sizes="92vw"
                className="h-auto w-full object-contain"
              />
            </div>
            {image.caption && (
              <figcaption className="text-muted mt-3 text-sm">{image.caption}</figcaption>
            )}
          </figure>
        )}
      </Dialog>
    </LightboxContext.Provider>
  );
}
