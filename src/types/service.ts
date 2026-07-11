import type { IconKey } from '@/lib/constants/icon';

export interface Service {
  id: string;
  number: string;
  icon: IconKey;
  title: string;
  description: string;
}
