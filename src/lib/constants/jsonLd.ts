import { siteConfig, socials } from '@/config/site';
import { contactChannels } from '@/config/contact';

// Person structured data — helps Google understand who you are and
// can power rich results (knowledge panel eligibility, etc).
//
// Everything here must be verifiable from the site itself. No ratings, no
// review counts, no awards that aren't real — fabricated structured data is a
// manual-action risk and gains nothing.
export function getPersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteConfig.url}/#person`,
    name: siteConfig.fullName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    image: `${siteConfig.url}/og-image.jpg`,
    jobTitle: 'UI/UX Designer & Frontend Engineer',
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dubai',
      addressCountry: 'AE',
    },
    sameAs: Object.values(socials).filter(Boolean),
    // Factual and already published on the Contact page. No invented phone
    // numbers, no fabricated hours. `telephone` appears only when a real
    // number is configured, and is the same one shown on the page.
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Business enquiries',
      email: siteConfig.email,
      ...(contactChannels.phone ? { telephone: contactChannels.phone } : {}),
      areaServed: 'AE',
      availableLanguage: ['English'],
    },
    knowsAbout: [
      'UI/UX Design',
      'Frontend Development',
      'Product Design',
      'Frontend Engineering',
      'React',
      'Next.js',
      'Design Systems',
      'Enterprise SaaS Design',
    ],
  };
}

// WebSite ties the whole domain together and lets Google associate the site
// with the Person above.
export function getWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: 'en',
    publisher: { '@id': `${siteConfig.url}/#person` },
  };
}

// ProfilePage marks /about as the canonical page *about* the Person, which is
// exactly what this schema type is for.
export function getProfilePageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${siteConfig.url}/about#profilepage`,
    url: `${siteConfig.url}/about`,
    name: `About ${siteConfig.fullName}`,
    isPartOf: { '@id': `${siteConfig.url}/#website` },
    mainEntity: { '@id': `${siteConfig.url}/#person` },
  };
}

// ContactPage marks /contact as the page carrying contact details for the
// Person above, which is exactly what this schema type is for.
export function getContactPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${siteConfig.url}/contact#contactpage`,
    url: `${siteConfig.url}/contact`,
    name: `Contact ${siteConfig.fullName}`,
    isPartOf: { '@id': `${siteConfig.url}/#website` },
    mainEntity: { '@id': `${siteConfig.url}/#person` },
  };
}

// --- Work page ------------------------------------------------------------

interface WorkListEntry {
  name: string;
  slug: string;
  description: string;
  kind: 'project' | 'product';
}

/**
 * CollectionPage for /projects.
 *
 * Deliberately *not* emitting aggregateRating, review or offers anywhere in
 * this file: none of it is real, and fabricated structured data is a
 * manual-action risk that gains nothing.
 */
export function getWorkPageJsonLd(entries: WorkListEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${siteConfig.url}/projects#collection`,
    url: `${siteConfig.url}/projects`,
    name: `Work — ${siteConfig.name}`,
    description:
      'Selected product design, UX and frontend engineering work — enterprise systems, SaaS platforms and interactive websites.',
    isPartOf: { '@id': `${siteConfig.url}/#website` },
    about: { '@id': `${siteConfig.url}/#person` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: entries.length,
      itemListElement: entries.map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteConfig.url}/${entry.kind === 'product' ? 'products' : 'projects'}/${entry.slug}`,
        name: entry.name,
      })),
    },
  };
}

/** Breadcrumbs. One shared builder so every trail is shaped identically. */
export function getBreadcrumbJsonLd(trail: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${siteConfig.url}${crumb.path}`,
    })),
  };
}

/** CreativeWork for a single project page. */
export function getProjectJsonLd(project: {
  name: string;
  slug: string;
  description: string;
  image: string;
  category: string;
  year?: string;
}) {
  const absoluteImage = project.image.startsWith('http')
    ? project.image
    : `${siteConfig.url}${project.image}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${siteConfig.url}/projects/${project.slug}#work`,
    url: `${siteConfig.url}/projects/${project.slug}`,
    name: project.name,
    description: project.description,
    image: absoluteImage,
    genre: project.category,
    ...(project.year ? { dateCreated: project.year } : {}),
    author: { '@id': `${siteConfig.url}/#person` },
    creator: { '@id': `${siteConfig.url}/#person` },
    isPartOf: { '@id': `${siteConfig.url}/projects#collection` },
  };
}

/**
 * SoftwareApplication for a SaaS product page.
 *
 * Deliberately emits no `offers`, no `aggregateRating` and no `review`. The
 * product has no price, no ratings and no reviews; marking up any of them
 * would be fabricated structured data, which is a manual-action risk and gains
 * nothing. `applicationCategory` and the status in the description are the
 * honest parts, so those are what ships.
 */
export function getProductJsonLd(product: {
  name: string;
  slug: string;
  description: string;
  image: string;
  status: string;
}) {
  const absoluteImage = product.image.startsWith('http')
    ? product.image
    : `${siteConfig.url}${product.image}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${siteConfig.url}/products/${product.slug}#software`,
    url: `${siteConfig.url}/products/${product.slug}`,
    name: product.name,
    description: `${product.description} Current status: ${product.status}.`,
    image: absoluteImage,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    author: { '@id': `${siteConfig.url}/#person` },
    creator: { '@id': `${siteConfig.url}/#person` },
  };
}

/**
 * FAQPage, for the Contact page's questions.
 *
 * Worth being clear about what this does and does not buy. Google restricted
 * FAQ rich results to government and health sites in August 2023 and
 * deprecated them outright on 7 May 2026 — they are gone for everyone, and
 * the Search Console reporting for them went with it. So this will never draw
 * expandable answers under a search listing.
 *
 * It is here for the other reason: FAQPage remains valid markup that Google
 * ingests and that LLM-backed answer surfaces read, and it gives them an
 * unambiguous question-and-answer structure to quote from. That is where a
 * growing share of "product designer dubai"-style queries now get answered.
 * Google has confirmed unused structured data carries no ranking penalty, so
 * the only cost is a few hundred bytes.
 *
 * The answers come from the same builder the page renders, so the markup can
 * never describe something different from what a visitor reads — which is the
 * thing that actually gets a site penalised.
 */
export function getFaqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
