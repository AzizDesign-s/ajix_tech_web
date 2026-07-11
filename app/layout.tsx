import type { Metadata } from 'next';
import { Amiri, Public_Sans } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site';
import { Navbar } from '@/components/layout/Navbar/navbar';

// Heading font — used for hero titles, section titles, major headings
const amiri = Amiri({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

// Body font — used for paragraphs, buttons, nav, forms, UI text
const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
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
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
