import type { Metadata } from 'next';
import { Amiri, Public_Sans } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site';
import { Navbar } from '@/components/layout/Navbar/navbar';
import { Footer } from '@/components/layout/Footer/footer';
import { PersonJsonLd } from '@/components/shared/JsonLd';

const amiri = Amiri({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'UI/UX Designer Dubai',
    'Product Designer UAE',
    'Frontend Developer UAE',
    'Frontend Engineer Dubai',
    'React Developer UAE',
    'Next.js Developer Dubai',
    'Enterprise SaaS Design',
    'Design Systems Engineer',
    'Abdul Aziz UI UX Designer',
  ],
  authors: [{ name: siteConfig.fullName, url: siteConfig.url }],
  creator: siteConfig.fullName,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.title}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${amiri.variable} ${publicSans.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <PersonJsonLd />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
