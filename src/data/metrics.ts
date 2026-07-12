import { SiteMetric } from '@/types/metric';
import { HeroMetric } from '@/types/metric';

export const siteMetrics: SiteMetric[] = [
  { id: 'years-experience', value: 4, suffix: '+', label: 'Years of Experience' },
  { id: 'digital-products', value: 10, suffix: '+', label: 'Digital Products' },
  { id: 'ui-screens', value: 1000, suffix: '+', label: 'UI Screens Designed' },
  { id: 'enterprise-projects', value: 8, suffix: '+', label: 'Enterprise Projects' },
  { id: 'responsive-design', value: 100, suffix: '%', label: 'Responsive Design' },
];

export const heroMetrics: HeroMetric[] = [
  { id: 'digital-products', value: 10, suffix: '+', label: 'Digital Products Designed' },
  { id: 'years-experience', value: 4, suffix: '+', label: 'years of Experience' },
  { id: 'enterprise-projects', value: 8, suffix: '+', label: 'Enterprise Projects' },
  { id: 'industries-served', value: 3, suffix: '+', label: 'Industries Served' },
];
