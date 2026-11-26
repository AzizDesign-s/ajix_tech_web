// The canonical production origin. Override with NEXT_PUBLIC_SITE_URL when the
// real domain is ready — every canonical, OG URL, sitemap entry and JSON-LD
// field reads from here, so the switch is a one-line change.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ajix-tech-web.vercel.app').replace(
  /\/+$/,
  '',
);

export const siteConfig = {
  name: 'AJIX',
  fullName: 'Abdul Aziz V I',
  title: 'AJIX — UI/UX Designer & Frontend Engineer',
  description:
    'Premium product design and frontend engineering for enterprise teams and founders in the UAE.',
  url: siteUrl,
  resumeUrl: '/resume/resume.pdf', // "public/" prefix removed — public/ files are served from root
  email: 'aziaji46@gmail.com',
};

export const navLinks = [
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const socials = {
  linkedin: 'https://www.linkedin.com/in/abdul-aziz-517a741a0/',
  behance: 'https://www.behance.net/abdulaziz92',
  instagram: 'https://www.instagram.com/ajixdesign/',
  github: 'https://github.com/AzizDesign-s',
};

// Routes that exist only as "coming soon" placeholders. They are excluded from
// the sitemap and marked noindex so Google doesn't index empty pages. Delete an
// entry here the moment that page ships real content.
// /contact was removed when the Contact page shipped — it is now indexable and
// listed in the sitemap.
// /projects was removed when the Work page shipped — it is now indexable and
// listed in the sitemap alongside every project that is ready for indexing.
export const placeholderRoutes: string[] = [];

// /projects/[slug] now exists, so project cards link to it. Kept as a flag
// rather than deleted: if the route ever has to be pulled, flipping this back
// makes every card non-clickable again with no component changes.
export const projectDetailPagesEnabled = true;
