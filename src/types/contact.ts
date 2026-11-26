// Four states, matching the switch managed in Sanity (siteSettings).
// 'limited' keeps its original key so no stored value has to be migrated; its
// label is what changed.
export type AvailabilityLevel = 'available' | 'limited' | 'busy' | 'unavailable';

export interface AvailabilityState {
  level: AvailabilityLevel;
  label: string;
  description: string;
  responseTime: string;
}
