import {
  getPersonJsonLd,
  getWebSiteJsonLd,
  getProfilePageJsonLd,
  getContactPageJsonLd,
  getWorkPageJsonLd,
  getBreadcrumbJsonLd,
  getProjectJsonLd,
  getProductJsonLd,
  getFaqJsonLd,
} from '@/lib/constants/jsonLd';

// The payload is built entirely from siteConfig — no user or remote input ever
// reaches it, so the serialised JSON is safe to inject.
function JsonLdScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

/** Person + WebSite — rendered once in the root layout. */
export function PersonJsonLd() {
  return (
    <>
      <JsonLdScript data={getPersonJsonLd()} />
      <JsonLdScript data={getWebSiteJsonLd()} />
    </>
  );
}

/** ProfilePage — rendered on /about only. */
export function ProfilePageJsonLd() {
  return <JsonLdScript data={getProfilePageJsonLd()} />;
}

/** ContactPage — rendered on /contact only. */
export function ContactPageJsonLd() {
  return <JsonLdScript data={getContactPageJsonLd()} />;
}

/** FAQPage — rendered wherever a visible FAQ exists, with the same content.
 *  Marking up questions that are not on the page is a structured-data
 *  violation, so this always takes the rendered items as its input. */
export function FaqJsonLd({ items }: { items: Array<{ question: string; answer: string }> }) {
  if (items.length === 0) return null;
  return <JsonLdScript data={getFaqJsonLd(items)} />;
}

/** CollectionPage + BreadcrumbList — rendered on /projects only. */
export function WorkPageJsonLd({
  items,
}: {
  items: Array<{ name: string; slug: string; description: string; kind: 'project' | 'product' }>;
}) {
  return (
    <>
      <JsonLdScript data={getWorkPageJsonLd(items)} />
      <JsonLdScript
        data={getBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/projects' },
        ])}
      />
    </>
  );
}

/** CreativeWork + BreadcrumbList — rendered on /projects/[slug]. */
export function ProjectJsonLd({
  project,
}: {
  project: {
    name: string;
    slug: string;
    description: string;
    image: string;
    category: string;
    year?: string;
  };
}) {
  return (
    <>
      <JsonLdScript data={getProjectJsonLd(project)} />
      <JsonLdScript
        data={getBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/projects' },
          { name: project.name, path: `/projects/${project.slug}` },
        ])}
      />
    </>
  );
}

/** SoftwareApplication + BreadcrumbList — rendered on /products/[slug]. */
export function ProductJsonLd({
  product,
}: {
  product: { name: string; slug: string; description: string; image: string; status: string };
}) {
  return (
    <>
      <JsonLdScript data={getProductJsonLd(product)} />
      <JsonLdScript
        data={getBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/projects' },
          { name: product.name, path: `/products/${product.slug}` },
        ])}
      />
    </>
  );
}
