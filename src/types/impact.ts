import type { IconKey } from '@/lib/constants/icon';

export interface ImpactMetric {
  id: string;
  number: string;
  icon: IconKey;
  value: number;
  suffix: string;
  title: string;
  description: string;
}
