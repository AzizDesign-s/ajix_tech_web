// Sanity environment configuration.
//
// Only three values are public and they are *meant* to be: the project ID,
// dataset and API version all ship in the browser bundle by design. Sanity's
// access control lives on the dataset and on tokens, never on these.
//
// Tokens (SANITY_API_READ_TOKEN, SANITY_REVALIDATE_SECRET, SANITY_WRITE_TOKEN)
// are read where they are used, server-side only, and never re-exported from
// this file — so there is no path by which one could reach a client bundle.

/**
 * Which source the project service reads from.
 *
 * 'local'  — the hardcoded array in src/data/project.ts. The default, so the
 *            site keeps working before Sanity is seeded and so CI can build
 *            without network access to the Content Lake.
 * 'sanity' — the Sanity Content Lake. Flip this once the content is reviewed.
 */
export const contentSource = process.env.CONTENT_SOURCE === 'sanity' ? 'sanity' : 'local';

export const usingSanity = contentSource === 'sanity';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

// Pin the API version to a date. Sanity treats this as "behave as the API did
// on this day", so bumping it is a deliberate choice rather than something that
// drifts underneath us.
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-11-01';

/** Cache tags. Every query is tagged so one webhook can purge precisely. */
export const CACHE_TAGS = {
  project: 'sanity:project',
  product: 'sanity:product',
  category: 'sanity:category',
  settings: 'sanity:siteSettings',
} as const;

/**
 * Fails loudly at module load if Sanity is switched on without a project ID.
 * Silently falling back to local content here would hide a misconfigured
 * deployment behind a page that looks fine.
 */
export function assertSanityConfigured(): void {
  if (!usingSanity) return;
  if (!projectId) {
    throw new Error(
      'CONTENT_SOURCE=sanity but NEXT_PUBLIC_SANITY_PROJECT_ID is not set. ' +
        'Add it to .env.local (and to your Vercel project), or set CONTENT_SOURCE=local.',
    );
  }
}
