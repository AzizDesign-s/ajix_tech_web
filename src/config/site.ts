// Central source of truth for site-wide values.
// Navbar, Footer, and SEO metadata all read from here —
// change something once, it updates everywhere.

export const siteConfig = {
  name: 'AJIX',
  fullName: 'Abdul Aziz V I',
  title: 'AJIX — UI/UX Designer & Frontend Engineer',
  description:
    'Premium product design and frontend engineering for enterprise teams and founders in the UAE.',
  url: 'https://ajix-tech-web.vercel.app/', // update once custom domain is live
  resumeUrl: '/resume/resume.pdf', // add link when ready
  email: 'aziaji46@gmail.com', // add contact email when ready
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
