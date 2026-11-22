import type { MetadataRoute } from 'next';
import { siteConfig, placeholderRoutes } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  // Only routes with real content belong in the sitemap. Listing a "coming
  // soon" stub invites Google to index an empty page, which reads as thin
  // content and can drag down the whole site's quality signals.
  const routes = ['', '/about'].filter((route) => !placeholderRoutes.includes(route));

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
}
