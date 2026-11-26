import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { Section } from '@/components/layout/section';
import { SectionDivider } from '@/components/ui/sectionDivider';
import { SectionGlow } from '@/components/shared/sectionGlow';
import { SpotlightCard } from '@/components/shared/spotlightCard';
import { GridBackground } from '@/components/shared/gridBackground';
import { Spotlight } from '@/components/shared/spotlight';
import { Icon } from '@/components/ui/icon';
import { ProductJsonLd } from '@/components/shared/JsonLd';
import { ProductEnquiryCta } from '@/components/sections/product/productEnquiryCta';
import { ProductView } from '@/components/sections/product/productView';
import { ProductFaq } from '@/components/sections/product/productFaq';
import { LightboxProvider } from '@/components/sections/caseStudy/lightbox';
import { MediaFigure } from '@/components/sections/caseStudy/mediaFigure';
import { getAllProducts, getProductBySlug } from '@/lib/services/product';
import { iconMap, type IconKey } from '@/lib/constants/icon';
import { siteConfig } from '@/config/site';
import { PRODUCT_STATUS_LABEL, ROADMAP_HORIZON_LABEL, type RoadmapHorizon } from '@/types/product';
import { cn } from '@/lib/utils/cn';

// The SaaS product page.
//
// Every section is optional and renders only when it has content, so a product
// at concept stage and one in beta use the same template without either
// showing an empty frame.
//
// What the page will not do: claim a capability that is not built, quote a
// price that does not exist, or offer a demo that cannot be given. The status
// badge, the "Planned features" heading and the CTA wording are all driven by
// fields, so honesty is enforced by the data rather than by remembering.

const HORIZONS: RoadmapHorizon[] = ['now', 'next', 'later'];

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product not found' };

  const image = product.image.startsWith('http')
    ? product.image
    : `${siteConfig.url}${product.image}`;

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    // Software in development stays out of Google until you say otherwise.
    robots: product.readyForIndexing ? undefined : { index: false, follow: true },
    openGraph: {
      title: `${product.name} — AJIX`,
      description: product.description,
      url: `/products/${product.slug}`,
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const statusLabel = PRODUCT_STATUS_LABEL[product.developmentStatus];
  const isShipped = product.developmentStatus === 'live';
  const roadmapByHorizon = HORIZONS.map((horizon) => ({
    horizon,
    items: (product.roadmap ?? []).filter((item) => (item.horizon ?? 'later') === horizon),
  })).filter((group) => group.items.length > 0);

  return (
    <LightboxProvider>
      <ProductJsonLd
        product={{
          name: product.name,
          slug: product.slug,
          description: product.description,
          image: product.image,
          status: statusLabel,
        }}
      />
      <ProductView slug={product.slug} status={product.developmentStatus} />

      <section className="relative w-full overflow-hidden px-6 pt-32 pb-12 md:px-10 lg:pt-40">
        <GridBackground />
        <div className="pointer-events-none absolute inset-0 z-1">
          <Spotlight className="-top-40 -left-10 h-screen md:-top-20 md:-left-32" fill="violet" />
          <Spotlight className="top-10 left-full h-[80vh] w-[50vw]" fill="purple" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link
              href="/projects?filter=saas"
              className="text-muted hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-2 rounded text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              Back to all work
            </Link>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className="border-border bg-background/60 text-muted inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
              <span className="bg-purple h-1.5 w-1.5 rounded-full" />
              SaaS Product
            </span>
            {/* The status is the first thing a visitor sees, deliberately. */}
            <span
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium',
                isShipped
                  ? 'border-success/40 bg-success/10 text-success'
                  : 'border-warning/40 bg-warning/10 text-warning',
              )}
            >
              {statusLabel}
            </span>
          </div>

          <h1 className="font-heading text-foreground mt-5 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            {product.name}
          </h1>
          {product.tagline && (
            <p className="text-foreground/90 mt-4 max-w-2xl text-lg md:text-xl">
              {product.tagline}
            </p>
          )}
          <p className="text-muted mt-4 max-w-2xl leading-relaxed">{product.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ProductEnquiryCta
              slug={product.slug}
              name={product.name}
              demoAvailable={product.demoAvailable}
            />
            {!product.demoAvailable && (
              <p className="text-muted text-sm">
                No live demo yet — register interest and I&apos;ll be in touch.
              </p>
            )}
          </div>

          {product.targetIndustry.length > 0 && (
            <div className="mt-10">
              <h2 className="text-muted text-[11px] tracking-widest uppercase">Built for</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {product.targetIndustry.map((industry) => (
                  <li
                    key={industry}
                    className="border-border bg-background/60 text-muted rounded-md border px-3 py-1.5 text-sm"
                  >
                    {industry}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <Section className="pt-0">
        <div className="border-border relative z-10 aspect-16/9 w-full overflow-hidden rounded-2xl border">
          <Image
            src={product.image}
            alt={product.name}
            fill
            preload
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-top"
          />
          {product.isPlaceholderCover && (
            <span className="bg-background/80 text-muted absolute bottom-3 left-3 rounded-md px-2 py-1 text-[11px] backdrop-blur-sm">
              Placeholder visual
            </span>
          )}
        </div>
        <SectionDivider className="mt-16" />
      </Section>

      {product.businessProblems?.length ? (
        <Section className="relative pt-0">
          <SectionGlow />
          <h2 className="font-heading text-foreground relative z-10 w-full text-2xl font-semibold tracking-tight md:text-3xl">
            The problems it addresses
          </h2>
          <ul className="relative z-10 mt-8 grid w-full gap-4 md:grid-cols-3">
            {product.businessProblems.map((problem) => (
              <li key={problem._key} className="border-border bg-card/40 rounded-xl border p-6">
                <h3 className="font-heading text-foreground text-lg font-semibold">
                  {problem.heading}
                </h3>
                {problem.description && (
                  <p className="text-muted mt-2 text-sm leading-relaxed">{problem.description}</p>
                )}
              </li>
            ))}
          </ul>
          <SectionDivider className="mt-20" />
        </Section>
      ) : null}

      {product.modules?.length ? (
        <Section className="relative pt-0">
          <h2 className="font-heading text-foreground relative z-10 w-full text-2xl font-semibold tracking-tight md:text-3xl">
            Product modules
          </h2>
          <ul className="relative z-10 mt-8 grid w-full gap-6 md:grid-cols-2 lg:grid-cols-4">
            {product.modules.map((module) => {
              const iconKey = module.icon as IconKey | undefined;
              const hasIcon = Boolean(iconKey && iconKey in iconMap);
              return (
                <li key={module._key}>
                  <SpotlightCard className="p-6">
                    {hasIcon && (
                      <span className="border-border text-primary bg-background/60 relative z-10 flex h-11 w-11 items-center justify-center rounded-xl border">
                        <Icon name={iconKey as IconKey} size={18} aria-hidden="true" />
                      </span>
                    )}
                    <h3 className="font-heading text-foreground relative z-10 mt-4 text-lg font-semibold">
                      {module.name}
                    </h3>
                    {module.description && (
                      <p className="text-muted relative z-10 mt-2 text-sm leading-relaxed">
                        {module.description}
                      </p>
                    )}
                  </SpotlightCard>
                </li>
              );
            })}
          </ul>
          <SectionDivider className="mt-20" />
        </Section>
      ) : null}

      {product.features?.length ? (
        <Section className="relative pt-0">
          <h2 className="font-heading text-foreground relative z-10 w-full text-2xl font-semibold tracking-tight md:text-3xl">
            {isShipped ? 'Features' : 'Planned features'}
          </h2>
          {!isShipped && (
            <p className="text-muted relative z-10 mt-3 w-full max-w-2xl text-sm">
              These describe what the product is being built to do. Nothing here is a claim about
              what it does today.
            </p>
          )}
          <ul className="relative z-10 mt-8 grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
            {product.features.map((feature) => (
              <li
                key={feature._key}
                className="border-border bg-card/40 flex gap-3 rounded-xl border p-5"
              >
                <Check size={16} aria-hidden="true" className="text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-foreground font-medium">{feature.heading}</h3>
                  {feature.description && (
                    <p className="text-muted mt-1 text-sm leading-relaxed">{feature.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <SectionDivider className="mt-20" />
        </Section>
      ) : null}

      {product.workflow?.length ? (
        <Section className="relative pt-0">
          <h2 className="font-heading text-foreground relative z-10 w-full text-2xl font-semibold tracking-tight md:text-3xl">
            How it works
          </h2>
          <ol className="border-border relative z-10 mt-8 w-full space-y-8 border-l pl-6">
            {product.workflow.map((step, index) => (
              <li key={step._key} className="relative">
                <span
                  aria-hidden="true"
                  className="bg-primary text-on-accent absolute top-0 -left-[35px] flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums"
                >
                  {index + 1}
                </span>
                <h3 className="font-heading text-foreground text-lg font-semibold">{step.title}</h3>
                {step.description && (
                  <p className="text-muted mt-1 text-sm leading-relaxed">{step.description}</p>
                )}
              </li>
            ))}
          </ol>
          <SectionDivider className="mt-20" />
        </Section>
      ) : null}

      {product.screenshots?.length ? (
        <Section className="relative pt-0">
          <h2 className="font-heading text-foreground relative z-10 w-full text-2xl font-semibold tracking-tight md:text-3xl">
            Screenshots
          </h2>
          <ul className="relative z-10 mt-8 grid w-full gap-4 sm:grid-cols-2">
            {product.screenshots.map((shot, index) => (
              <li key={`${shot.url}-${index}`}>
                <MediaFigure
                  image={shot}
                  className="aspect-16/10"
                  sizes="(max-width: 640px) 92vw, 560px"
                />
              </li>
            ))}
          </ul>
          <SectionDivider className="mt-20" />
        </Section>
      ) : null}

      {roadmapByHorizon.length > 0 && (
        <Section className="relative pt-0">
          <h2 className="font-heading text-foreground relative z-10 w-full text-2xl font-semibold tracking-tight md:text-3xl">
            Roadmap
          </h2>
          <p className="text-muted relative z-10 mt-3 w-full max-w-2xl text-sm">
            Where the work is now and what follows. No dates, because a date given now would be a
            guess.
          </p>
          <div className="relative z-10 mt-8 grid w-full gap-6 md:grid-cols-3">
            {roadmapByHorizon.map((group) => (
              <div key={group.horizon} className="border-border rounded-xl border p-5">
                <h3 className="text-muted text-[11px] tracking-widest uppercase">
                  {ROADMAP_HORIZON_LABEL[group.horizon]}
                </h3>
                <ul className="mt-4 space-y-4">
                  {group.items.map((item) => (
                    <li key={item._key}>
                      <p className="text-foreground font-medium">{item.title}</p>
                      {item.description && (
                        <p className="text-muted mt-1 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <SectionDivider className="mt-20" />
        </Section>
      )}

      {product.faq?.length ? (
        <Section className="relative pt-0">
          <h2 className="font-heading text-foreground relative z-10 w-full text-2xl font-semibold tracking-tight md:text-3xl">
            Questions
          </h2>
          <div className="relative z-10 mt-8 w-full max-w-3xl">
            <ProductFaq items={product.faq} />
          </div>
          <SectionDivider className="mt-20" />
        </Section>
      ) : null}

      <Section className="relative overflow-hidden pt-0">
        <SectionGlow />
        <div className="border-border bg-card/40 relative z-10 flex w-full flex-col items-center rounded-2xl border px-6 py-14 text-center">
          <h2 className="font-heading text-foreground text-2xl font-semibold tracking-tight md:text-3xl">
            Interested in {product.name}?
          </h2>
          <p className="text-muted mt-3 max-w-xl leading-relaxed">
            {product.demoAvailable
              ? 'Book a walkthrough and I will show you how it fits your operation.'
              : 'It is still being built. Register interest and I will come to you when there is something real to show — no mailing list, no automated sequence.'}
          </p>
          <div className="mt-8">
            <ProductEnquiryCta
              slug={product.slug}
              name={product.name}
              demoAvailable={product.demoAvailable}
            />
          </div>
          {!product.pricingVisible && (
            <p className="text-muted/80 mt-6 text-xs">No pricing published yet.</p>
          )}
        </div>
      </Section>
    </LightboxProvider>
  );
}
