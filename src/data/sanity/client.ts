import 'server-only';

import { createClient, type QueryParams, type SanityClient } from '@sanity/client';

import { apiVersion, assertSanityConfigured, dataset, projectId, usingSanity } from './env';

/**
 * The read client, built on first use rather than at module load.
 *
 * `createClient` throws when it has no projectId, so constructing it at module
 * scope would break `next build` for anyone running with CONTENT_SOURCE=local
 * and no Sanity environment variables — which is the default, and is how CI
 * builds this repo. Lazily means the throw can only happen on a code path that
 * genuinely needs Sanity.
 */
let cachedClient: SanityClient | null = null;

function readClient(): SanityClient {
  if (cachedClient) return cachedClient;

  assertSanityConfigured();

  // `perspective: 'published'` is deliberate and load-bearing: without it a
  // request carrying a token could return draft documents, which would leak
  // unpublished case studies onto the public site. Drafts get their own client
  // below, reachable only from inside a draftMode() branch.
  //
  // `useCdn: true` serves from Sanity's edge cache. With Next's cache tags on
  // top, a normal page view costs zero Sanity API requests.
  cachedClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    perspective: 'published',
    stega: false,
  });

  return cachedClient;
}

/**
 * Draft client — only ever used inside a draftMode() branch, never on a public
 * render. Reads the token at call time so it is never captured at module scope.
 */
function draftClient(): SanityClient {
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!token) {
    throw new Error('SANITY_API_READ_TOKEN is required to preview drafts.');
  }
  return readClient().withConfig({
    token,
    useCdn: false,
    perspective: 'drafts',
    stega: false,
  });
}

interface FetchOptions {
  /** Cache tags this query belongs to, so the webhook can purge it. */
  tags: string[];
  /** Read drafts instead of published content. Caller must be in draftMode(). */
  draft?: boolean;
}

/**
 * Every read in the app goes through here.
 *
 * On failure it logs and returns the caller's fallback rather than throwing. A
 * thrown error during `next build` would fail a whole deployment because one
 * CMS request timed out; an empty section is visible, recoverable, and obvious
 * in the build log.
 */
export async function sanityFetch<T>(
  query: string,
  params: QueryParams,
  fallback: T,
  { tags, draft = false }: FetchOptions,
): Promise<T> {
  if (!usingSanity) return fallback;

  try {
    const client = draft ? draftClient() : readClient();
    return await client.fetch<T>(query, params, {
      // Drafts must never be cached — they change constantly and are
      // per-request by nature.
      ...(draft ? { cache: 'no-store' as const } : { next: { tags, revalidate: false as const } }),
    });
  } catch (error) {
    console.error(
      `[sanity] query failed (tags: ${tags.join(', ')}) — falling back to empty content.`,
      error instanceof Error ? error.message : error,
    );
    return fallback;
  }
}
