import { services } from '@/data/services';
import { Service } from '@/types/service';

export function getAllServices(): Service[] {
  return services;
}
