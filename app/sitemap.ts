import type { MetadataRoute } from 'next';
import { siteConfig, placeholderRoutes } from '@/config/site';
import { getWorkItems } from '@/lib/services/work';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Only routes with real content belong in the sitemap. Listing a "coming
  // soon" stub invites Google to index an empty page, which reads as thin
  // content and can drag down the whole site's quality signals.
  const staticRoutes = ['', '/about', '/contact', '/projects'].filter(
    (route) => !placeholderRoutes.includes(route),
  );

  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  // Project and product pages, but only the ones carrying real content.
  // A page still on a placeholder cover is visible on the Work page and
  // excluded here, which is the whole point of keeping "published" and
  // "ready for Google" as two separate decisions.
  const items = await getWorkItems();
  for (const item of items) {
    if (item.isPlaceholderCover) continue;
    // Interactive projects link straight to their live site and have no page
    // of their own to list.
    if (item.href.startsWith('http')) continue;

    entries.push({
      url: `${siteConfig.url}${item.href}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: item.featured ? 0.7 : 0.6,
    });
  }

  return entries;
}
