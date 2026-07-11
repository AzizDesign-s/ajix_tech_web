import type { LucideProps } from 'lucide-react';
import { iconMap, type IconKey } from '@/lib/constants/icon';

interface IconProps extends LucideProps {
  name: IconKey;
}

// Renders any registered icon by key. Add new icons to the map above —
// this component never needs to change.
export function Icon({ name, ...props }: IconProps) {
  const LucideIconComponent = iconMap[name];
  return <LucideIconComponent {...props} />;
}
