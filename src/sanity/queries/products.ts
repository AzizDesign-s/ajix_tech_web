import { defineQuery } from 'groq';

const PRODUCT_CARD_FIELDS = /* groq */ `
  "id": coalesce(seedKey, _id),
  "slug": slug.current,
  "name": title,
  "description": coalesce(summary, ""),
  "cover": {
    "image": coverImage,
    "alt": coalesce(coverImage.alt, title),
    "lqip": coverImage.asset->metadata.lqip
  },
  "coverIsPlaceholder": coalesce(coverIsPlaceholder, false),
  "targetIndustry": coalesce(targetIndustry, []),
  "developmentStatus": coalesce(developmentStatus, "concept"),
  "demoAvailable": coalesce(demoAvailable, false),
  "pricingVisible": coalesce(pricingVisible, false),
  "readyForIndexing": coalesce(readyForIndexing, false)
`;

const RENDERABLE_PRODUCT = `_type == "product" && defined(slug.current)`;

export const ALL_PRODUCTS_QUERY = defineQuery(`
  *[${RENDERABLE_PRODUCT}] | order(title asc) { ${PRODUCT_CARD_FIELDS} }
`);

export const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[${RENDERABLE_PRODUCT} && slug.current == $slug][0] {
    ${PRODUCT_CARD_FIELDS},
    businessProblems[]{ _key, heading, description },
    modules[]{ _key, name, description, icon },
    features[]{ _key, heading, description },
    workflow[]{ _key, title, description },
    faq[]{ _key, question, answer },
    roadmap[]{ _key, title, description, horizon },
    screenshots[]{ _key, "image": @, "alt": coalesce(alt, "") },
    seo
  }
`);

export const PRODUCT_SLUGS_QUERY = defineQuery(`*[${RENDERABLE_PRODUCT}].slug.current`);
