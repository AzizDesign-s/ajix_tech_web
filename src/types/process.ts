import type { IconKey } from '@/lib/constants/icon';

export interface ProcessStep {
  id: string;
  number: string;
  icon: IconKey;
  image: string;
  title: string;
  description: string;
}
