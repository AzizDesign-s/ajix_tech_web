import {
  availabilityStates,
  getCurrentAvailability,
  toAvailabilityLevel,
} from '@/config/availability';
import { sanityFetch } from '@/sanity/client';
import { CACHE_TAGS, usingSanity } from '@/sanity/env';
import { SITE_SETTINGS_QUERY } from '@/sanity/queries/settings';
import type { AvailabilityState } from '@/types/contact';

export interface SiteSettings {
  availability: AvailabilityState;
  /** How many projects the Homepage row shows. */
  homepageFeaturedLimit: number;
  /** Which project the Work page spotlights. Used from Delivery 2 onward. */
  spotlightProjectSlug?: string;
}

interface RawSiteSettings {
  availabilityLevel: string | null;
  availabilityLabel: string | null;
  availabilityDescription: string | null;
  availabilityResponseTime: string | null;
  homepageFeaturedLimit: number;
  spotlightProjectSlug: string | null;
}

const LOCAL_SETTINGS: SiteSettings = {
  availability: getCurrentAvailability(),
  homepageFeaturedLimit: 6,
};

/**
 * One read per request, shared by both route-group layouts.
 *
 * The availability copy is overridable per field in Sanity but falls back to
 * the wording in src/config/availability.ts, so switching the level in Studio
 * is enough on its own — you only type copy if you want to say something
 * different from the default for that state.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!usingSanity) return LOCAL_SETTINGS;

  const raw = await sanityFetch<RawSiteSettings | null>(SITE_SETTINGS_QUERY, {}, null, {
    tags: [CACHE_TAGS.settings],
  });

  if (!raw) return LOCAL_SETTINGS;

  const level = toAvailabilityLevel(raw.availabilityLevel);
  const preset = availabilityStates[level];

  return {
    availability: {
      level,
      label: raw.availabilityLabel || preset.label,
      description: raw.availabilityDescription || preset.description,
      responseTime: raw.availabilityResponseTime || preset.responseTime,
    },
    homepageFeaturedLimit: raw.homepageFeaturedLimit || 6,
    spotlightProjectSlug: raw.spotlightProjectSlug ?? undefined,
  };
}
