import { Suspense } from 'react';
import type { Metadata } from 'next';
import { WorkHero } from '@/components/sections/work/workHero';
import { FeaturedSpotlight } from '@/components/sections/work/featuredSpotlight';
import { ProjectExplorer } from '@/components/sections/work/projectExplorer';
import { CapabilitiesSection } from '@/components/sections/work/capabilitiesSection';
import { CTASection } from '@/components/shared/ctaSection';
import { WorkPageJsonLd } from '@/components/shared/JsonLd';
import { WorkPageView } from '@/components/sections/work/workPageView';
import { getSiteSettings } from '@/lib/services/siteSettings';
import { getWorkCounts, getWorkItems, pickSpotlight } from '@/lib/services/work';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Selected product design, UX and frontend engineering work by Abdul Aziz — enterprise systems, SaaS platforms and interactive websites built for teams in Dubai and the wider UAE.',
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'Work — AJIX',
    description:
      'Enterprise product design, UX strategy and frontend engineering. Case studies, websites and SaaS products.',
    url: '/projects',
    type: 'website',
  },
};

export default async function ProjectsPage() {
  const [items, settings] = await Promise.all([getWorkItems(), getSiteSettings()]);

  const counts = getWorkCounts(items);
  const spotlight = pickSpotlight(items, settings.spotlightProjectSlug);

  // No <main> here: the route-group layout already provides the single main
  // landmark for the page.
  return (
    <>
      <WorkPageJsonLd items={items} />
      <WorkPageView projectCount={items.length} />

      <WorkHero counts={counts} />

      {/* Rendered only when there is something to spotlight. An empty
          spotlight frame would be worse than no section. */}
      {spotlight && <FeaturedSpotlight item={spotlight} />}

      {/* useSearchParams() needs a Suspense boundary for the rest of the page
          to stay statically prerendered. Without it Next opts the whole route
          into dynamic rendering, and the hero stops being static HTML. */}
      <Suspense fallback={<ExplorerFallback />}>
        <ProjectExplorer items={items} />
      </Suspense>

      <CapabilitiesSection />

      <CTASection
        eyebrow="Let's build"
        title="Have a project in mind?"
        description="Let's turn complex ideas into intuitive, meaningful digital experiences."
        primaryLabel="Start a Project"
        primaryHref="/contact"
        secondaryLabel="Hire Me"
        secondaryHref="/contact?intent=hire"
      />
    </>
  );
}

/** Reserves the explorer's vertical space so nothing jumps when it hydrates. */
function ExplorerFallback() {
  return <div aria-hidden="true" className="min-h-[60vh] w-full" />;
}
