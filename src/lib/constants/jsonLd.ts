import { siteConfig, socials } from '@/config/site';

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
    // numbers, no fabricated hours.
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Business enquiries',
      email: siteConfig.email,
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
