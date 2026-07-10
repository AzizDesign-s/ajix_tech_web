export type AvailabilityLevel = 'available' | 'limited' | 'busy';

export interface AvailabilityState {
  level: AvailabilityLevel;
  label: string;
  description: string;
  responseTime: string;
}
