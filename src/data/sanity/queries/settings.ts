import { defineQuery } from 'groq';

/**
 * siteSettings is a singleton pinned to a known ID by the Studio's desk
 * structure, so this is a direct document fetch rather than a type scan.
 */
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0] {
    "availabilityLevel": coalesce(availability.level, null),
    "availabilityLabel": availability.label,
    "availabilityDescription": availability.description,
    "availabilityResponseTime": availability.responseTime,
    "homepageFeaturedLimit": coalesce(homepageFeaturedLimit, 6),
    "spotlightProjectSlug": spotlightProject->slug.current
  }
`);
