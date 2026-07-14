export interface EcosystemCategory {
  id: string;
  label: string;
  position: 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right';
  toolSlugs: string[];
}
