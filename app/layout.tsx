import type { Metadata, Viewport } from 'next';
import { Amiri, Public_Sans } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site';
import { PersonJsonLd } from '@/components/shared/JsonLd';
import { MotionProvider } from '@/components/shared/motionProvider';
import { Analytics } from '@/components/shared/analytics';
import { ConsentProvider } from '@/components/shared/consentProvider';
import { ConsentBanner } from '@/components/shared/consentBanner';

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
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
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

// Next.js emits the width/initial-scale meta tag by default; this adds the
// browser-chrome colour so mobile Chrome/Safari match the dark UI instead of
// flashing white, and declares the colour scheme for native form controls.
export const viewport: Viewport = {
  themeColor: '#01040e',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${amiri.variable} ${publicSans.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <PersonJsonLd />
        {/* Keyboard users land here first and can jump straight past the
            navbar — visually hidden until it receives focus. */}
        <a
          href="#main-content"
          className="bg-card text-foreground focus-visible:ring-ring sr-only rounded-md px-4 py-2 text-sm font-medium focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-100 focus-visible:ring-2 focus-visible:outline-none"
        >
          Skip to main content
        </a>
        {/* Navbar, <main> and Footer are rendered by the route-group layouts
            (app/(dark) and app/(light)) so each group supplies its own theme. */}
        {/* ConsentProvider wraps both the page and Analytics, because the
            footer's settings control and the script gating read the same
            value. The banner renders last so it is last in the tab order. */}
        <ConsentProvider>
          <MotionProvider>{children}</MotionProvider>
          <Analytics />
          <ConsentBanner />
        </ConsentProvider>
      </body>
    </html>
  );
}
