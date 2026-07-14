import type { Metadata } from 'next';
import { AboutHero } from '@/components/sections/about/hero/aboutHero';
import { MyJourney } from '@/components/sections/about/journey/myJourney';
import { BeyondTheDesign } from '@/components/sections/about/grid/beyondTheDesign';
import { MyProcess } from '@/components/sections/about/process/myProcess';
import { ProductImpact } from '@/components/sections/about/impact/productImpact';
import { TheEcosystem } from '@/components/sections/about/tools/theEcosystem';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about Abdul Aziz, a UI/UX Designer and Frontend Engineer based in Dubai, UAE, with experience across enterprise product design and modern frontend development.',
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MyJourney />
      <BeyondTheDesign />
      <MyProcess />
      <ProductImpact />
      <TheEcosystem />
    </>
  );
}
