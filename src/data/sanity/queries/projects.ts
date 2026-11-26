import { defineQuery } from 'groq';

/**
 * The fields every project card and listing needs.
 *
 * Projected into the shape `src/types/project.ts` already describes, so the
 * existing ProjectCard and SelectedProjects components need no changes — the
 * mapper in src/sanity/mappers.ts finishes the job by turning the raw image
 * object into a URL.
 */
const PROJECT_CARD_FIELDS = /* groq */ `
  "id": coalesce(seedKey, _id),
  "slug": slug.current,
  "name": title,
  "description": coalesce(summary, ""),
  "category": category->slug.current,
  "toolSlugs": coalesce(tools, []),
  "cover": {
    "image": coverImage,
    "alt": coalesce(coverImage.alt, title),
    "lqip": coverImage.asset->metadata.lqip
  },
  "coverIsPlaceholder": coalesce(coverIsPlaceholder, false),
  projectType,
  year,
  status,
  client,
  "liveUrl": coalesce(liveUrl, ""),
  "repoUrl": coalesce(repoUrl, ""),
  "featured": coalesce(featured, false),
  "homepageFeatured": coalesce(homepageFeatured, false),
  "homepageOrder": coalesce(homepageOrder, 99),
  "readyForIndexing": coalesce(readyForIndexing, false)
`;

/**
 * Only documents with a slug and a resolvable category are renderable. Both
 * are required in the schema, but a reference can still dangle if the target
 * is deleted, and a card with no category would render an empty badge.
 */
const RENDERABLE = `_type == "project" && defined(slug.current) && defined(category->slug.current)`;

export const ALL_PROJECTS_QUERY = defineQuery(`
  *[${RENDERABLE}] | order(coalesce(homepageOrder, 99) asc, title asc) {
    ${PROJECT_CARD_FIELDS}
  }
`);

/**
 * Homepage row.
 *
 * The slice bound is a literal because GROQ requires a constant there — the
 * configured limit is applied in TypeScript after the fetch. 12 is a safe
 * ceiling: the Homepage shows 6 and nobody curates more than a dozen.
 */
export const HOMEPAGE_FEATURED_PROJECTS_QUERY = defineQuery(`
  *[${RENDERABLE} && homepageFeatured == true]
    | order(coalesce(homepageOrder, 99) asc, title asc)[0...12] {
    ${PROJECT_CARD_FIELDS}
  }
`);

export const PROJECTS_BY_CATEGORY_QUERY = defineQuery(`
  *[${RENDERABLE} && category->slug.current == $category]
    | order(coalesce(homepageOrder, 99) asc, title asc) {
    ${PROJECT_CARD_FIELDS}
  }
`);

export const PROJECT_BY_SLUG_QUERY = defineQuery(`
  *[${RENDERABLE} && slug.current == $slug][0] {
    ${PROJECT_CARD_FIELDS}
  }
`);

/**
 * Slugs for generateStaticParams. Kept separate and minimal so the build does
 * not pull every field of every project just to learn their paths.
 */
export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[${RENDERABLE}].slug.current
`);

/** Counts per filter, for the Work page's category chips. */
export const PROJECT_COUNTS_QUERY = defineQuery(`
  {
    "all": count(*[${RENDERABLE}]),
    "uiux": count(*[${RENDERABLE} && projectType == "uiux"]),
    "website": count(*[${RENDERABLE} && projectType == "website"]),
    "saas": count(*[_type == "product" && defined(slug.current)])
  }
`);
