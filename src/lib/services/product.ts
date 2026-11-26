import { products as localProducts } from '@/data/product';
import { sanityFetch } from '@/sanity/client';
import { CACHE_TAGS, usingSanity } from '@/sanity/env';
import { toProducts, type RawSanityProduct, type SaasProduct } from '@/sanity/mappers';
import { ALL_PRODUCTS_QUERY, PRODUCT_BY_SLUG_QUERY } from '@/sanity/queries/products';

// Same seam as the project service: a committed array until you deliberately
// switch CONTENT_SOURCE to 'sanity'. No silent fallback from Sanity back to
// local — a failed query returns empty and logs, so a broken CMS looks broken.

export async function getAllProducts(): Promise<SaasProduct[]> {
  if (!usingSanity) return localProducts;

  const raw = await sanityFetch<RawSanityProduct[]>(ALL_PRODUCTS_QUERY, {}, [], {
    tags: [CACHE_TAGS.product],
  });
  return toProducts(raw);
}

export async function getProductBySlug(slug: string): Promise<SaasProduct | undefined> {
  if (!usingSanity) return localProducts.find((product) => product.slug === slug);

  const raw = await sanityFetch<RawSanityProduct | null>(PRODUCT_BY_SLUG_QUERY, { slug }, null, {
    tags: [CACHE_TAGS.product],
  });
  return raw ? toProducts([raw])[0] : undefined;
}
