import type { Metadata } from 'next';
import { Hero } from '@/components/sections/home/hero/hero';
import { CategorySection } from '@/components/sections/home/category/categorySection';
import { WhatIDo } from '@/components/sections/home/service/whatIDo';
import { ToolsSection } from '@/components/sections/home/tools/toolsSection';
import { SelectedProjects } from '@/components/sections/home/project/selectedProjects';
import { WhyAjix } from '@/components/sections/home/why/whyAjix';
import { WhyHireAjix } from '@/components/sections/home/hire/whyHireAjix';
import { CTA } from '@/components/sections/home/cta/cta';

export const metadata: Metadata = {
  title: 'Abdul Aziz - UI/UX Designer',
  description:
    'Abdul Aziz — UI/UX Designer and Frontend Engineer crafting scalable digital products for startups, SaaS companies, and enterprise businesses across Dubai and the UAE.',
};

export default function Home() {
  return (
    <>
      <Hero />
      <CategorySection />
      <WhatIDo />
      <ToolsSection />
      <SelectedProjects />
      <WhyAjix />
      <WhyHireAjix />
      <CTA />
    </>
  );
}
