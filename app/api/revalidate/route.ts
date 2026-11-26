import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';
import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

import { CACHE_TAGS } from '@/sanity/env';

// On-demand revalidation. Sanity POSTs here whenever a project, product,
// category or the site settings change, and we purge only the tags that are
// affected rather than rebuilding the site.
//
// The endpoint is authenticated by Sanity's HMAC signature, not by a bearer
// token in a query string: a query string ends up in access logs and browser
// history, and anyone who read one could force unlimited cache purges.

export const runtime = 'nodejs';
// Never prerender or cache this route — it must run per request.
export const dynamic = 'force-dynamic';

/** Document _type -> the cache tags that must be purged when it changes. */
const TAGS_FOR_TYPE: Record<string, string[]> = {
  project: [CACHE_TAGS.project],
  product: [CACHE_TAGS.product],
  // A category rename changes every card badge, so projects go too.
  category: [CACHE_TAGS.category, CACHE_TAGS.project],
  siteSettings: [CACHE_TAGS.settings],
};

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    // Misconfiguration, not a client error — and deliberately not described in
    // the response body, which is public.
    console.error('[revalidate] SANITY_REVALIDATE_SECRET is not set; rejecting webhook.');
    return NextResponse.json({ message: 'Not configured' }, { status: 500 });
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature) {
    return NextResponse.json({ message: 'Missing signature' }, { status: 401 });
  }

  // The raw text, not a re-encoded JSON string: re-encoding changes byte order
  // and whitespace, and the HMAC would never match.
  const body = await request.text();

  if (!(await isValidSignature(body, signature, secret))) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  }

  let payload: { _type?: string; slug?: string };
  try {
    payload = JSON.parse(body) as { _type?: string; slug?: string };
  } catch {
    return NextResponse.json({ message: 'Malformed payload' }, { status: 400 });
  }

  const documentType = payload._type;
  const tags = documentType ? TAGS_FOR_TYPE[documentType] : undefined;

  if (!tags) {
    // A type we do not render. Answer 200 so Sanity does not retry forever.
    return NextResponse.json({ revalidated: false, reason: 'Unhandled type', documentType });
  }

  // Next 16 requires a cache-life profile. `{ expire: 0 }` expires the entry
  // immediately, so the very next request re-fetches and the editor sees the
  // change on their first refresh. The recommended `'max'` profile is
  // stale-while-revalidate, which would serve one more stale response first —
  // correct for a high-traffic site, confusing for someone testing a publish.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });

  return NextResponse.json({ revalidated: true, tags, documentType, now: Date.now() });
}

/** A GET is never valid here; answering explicitly beats a framework 405 page. */
export function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
