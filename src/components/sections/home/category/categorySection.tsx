'use client';

import { useState } from 'react';
import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/shared/sectionHeader';
import { SectionGlow } from '@/components/shared/sectionGlow';
import { SectionDivider } from '@/components/ui/sectionDivider';
import { CategoryCard } from '@/components/sections/home/category/categoryCard';
import { Button } from '@/components/ui/button';
import { getAllCategories } from '@/lib/services/categories';

export function CategorySection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const categories = getAllCategories();

  return (
    <Section className="relative">
      <SectionGlow />

      <SectionHeader
        eyebrow="Selected Work"
        title="Explore by Discipline"
        description="Explore projects spanning UI/UX design, enterprise SaaS platforms, dashboards, CRM, ERP, POS systems, and frontend engineering."
        align="left"
        action={
          <Button variant="surface" size="md" href="/projects">
            View All Projects
          </Button>
        }
      />

      <div className="relative z-10 mt-16 grid max-w-96 grid-cols-1 gap-8 sm:max-w-full sm:grid-cols-2 md:w-full lg:grid-cols-4">
        {categories.map((category, index) => (
          <CategoryCard
            key={category.slug}
            category={category}
            index={index}
            hoveredIndex={hoveredIndex}
            onHover={setHoveredIndex}
          />
        ))}
      </div>

      <SectionDivider />
    </Section>
  );
}
