import type { Metadata } from 'next';
import { AboutHero } from '@/components/sections/about/hero/aboutHero';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about Abdul Aziz, a UI/UX Designer and Frontend Engineer based in Dubai, UAE, with experience across enterprise product design and modern frontend development.',
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
    </>
  );
}
