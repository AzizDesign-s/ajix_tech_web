import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

import { dataset, projectId } from './env';

// Built on first use, for the same reason the client is: constructing it with
// an empty projectId at module scope would run on every build, including builds
// that never touch Sanity.
let cachedBuilder: ReturnType<typeof createImageUrlBuilder> | null = null;

function builderFor() {
  cachedBuilder ??= createImageUrlBuilder({ projectId, dataset });
  return cachedBuilder;
}

/**
 * Build a URL for a Sanity image.
 *
 * Always pass explicit dimensions at the call site. Sanity serves the original
 * at full size by default, and an un-sized 4000px cover would blow the LCP
 * budget on the Homepage cards.
 */
export function urlFor(source: SanityImageSource) {
  return builderFor().image(source).auto('format').fit('max');
}

/** Card covers: matches the ProjectCard's h-48 slot at 2x on a 600px column. */
export function cardCoverUrl(source: SanityImageSource): string {
  return builderFor().image(source).auto('format').width(1200).height(768).fit('crop').url();
}

/** Open Graph images. 1200x630 is the size every social platform crops from. */
export function ogImageUrl(source: SanityImageSource): string {
  return builderFor().image(source).auto('format').width(1200).height(630).fit('crop').url();
}

/**
 * The shape a GROQ projection returns for an image field. Kept here so the
 * queries and the components agree on one contract.
 */
export interface ResolvedImage {
  url: string;
  alt: string;
  /** Base64 LQIP from Sanity's metadata, fed straight to next/image. */
  blurDataURL: string | null;
}
