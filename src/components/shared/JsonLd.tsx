import {
  getPersonJsonLd,
  getWebSiteJsonLd,
  getProfilePageJsonLd,
  getContactPageJsonLd,
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
