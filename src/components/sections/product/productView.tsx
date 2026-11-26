'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

/** Fires saas_product_view, so the page itself stays a Server Component. */
export function ProductView({ slug, status }: { slug: string; status: string }) {
  useEffect(() => {
    trackEvent('saas_product_view', { product: slug, status });
  }, [slug, status]);

  return null;
}
