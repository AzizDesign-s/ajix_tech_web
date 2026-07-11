import { getPersonJsonLd } from '@/lib/constants/jsonLd';

export function PersonJsonLd() {
  const data = getPersonJsonLd();
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
