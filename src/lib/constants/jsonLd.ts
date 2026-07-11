import { siteConfig, socials } from '@/config/site';

// Person structured data — helps Google understand who you are and
// can power rich results (knowledge panel eligibility, etc).
export function getPersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
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
    knowsAbout: [
      'UI/UX Design',
      'Fronend Developer',
      'Product Design',
      'Frontend Engineering',
      'React',
      'Next.js',
      'Design Systems',
      'Enterprise SaaS Design',
    ],
  };
}
