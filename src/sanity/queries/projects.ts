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

/**
 * An image inside a case-study block.
 *
 * Projected to a plain URL plus its intrinsic dimensions rather than the raw
 * asset reference, because these are rendered by components that take a `src`.
 * Sizing params are appended in TypeScript (src/sanity/mappers.ts), since GROQ
 * cannot call the image-URL builder.
 */
const SECTION_IMAGE = /* groq */ `{
  "url": asset->url,
  "alt": coalesce(alt, ""),
  "caption": caption,
  "decorative": coalesce(decorative, false),
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`;

/**
 * The case-study body.
 *
 * GROQ conditional projections, one per block type, so each block returns only
 * its own fields. Anything the renderer does not recognise simply arrives with
 * `_type` and is skipped — a block added in Studio before its renderer exists
 * leaves a gap rather than throwing on a live page.
 */
const CASE_STUDY_SECTIONS = /* groq */ `
  caseStudySections[]{
    _key,
    _type,
    heading,
    _type == "richTextSection" => { body },
    _type == "imageSection" => { "image": image${SECTION_IMAGE}, width },
    _type == "gallerySection" => { "images": images[]${SECTION_IMAGE}, columns },
    _type == "videoSection" => { url, "poster": poster${SECTION_IMAGE}, transcript },
    _type == "quoteSection" => { quote, attribution, role, "isVerified": coalesce(isVerified, false) },
    _type == "twoColumnSection" => { left, right },
    _type == "researchSection" => {
      method,
      participantCount,
      findings[]{ _key, insight, evidence },
      personas[]{ _key, name, role, context, goals, frustrations, "isComposite": coalesce(isComposite, true) }
    },
    _type == "journeySection" => {
      persona,
      stages[]{ _key, name, action, painPoint, opportunity }
    },
    _type == "timelineSection" => {
      phases[]{ _key, name, duration, summary, deliverables }
    },
    _type == "beforeAfterSection" => {
      "before": before${SECTION_IMAGE},
      "after": after${SECTION_IMAGE},
      summary
    },
    _type == "designSystemSection" => {
      intro,
      colors[]{ _key, name, value, usage },
      typography[]{ _key, name, spec },
      "components": components[]${SECTION_IMAGE}
    },
    _type == "prototypeSection" => {
      url,
      "poster": poster${SECTION_IMAGE},
      fallbackDescription
    },
    _type == "resultsSection" => {
      summary,
      metrics[]{ _key, value, label, source, "isEstimate": coalesce(isEstimate, false) }
    },
    _type == "reflectionSection" => { whatWorked, whatIdChange, keyLearning },
    _type == "featureGridSection" => { features[]{ _key, title, description } }
  }
`;

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
    ${PROJECT_CARD_FIELDS},
    ${CASE_STUDY_SECTIONS},
    "relatedSlugs": relatedProjects[]->slug.current,
    seo
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
