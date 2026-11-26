'use client';

import { createContext, useContext, type ReactNode } from 'react';

import { getCurrentAvailability } from '@/config/availability';
import type { AvailabilityState } from '@/types/contact';

// AvailabilityBadge is rendered inside Client Components (the navbar and the
// About flip card), so it cannot await a Sanity read itself. The route-group
// layouts are Server Components: they fetch once and hand the value down
// through this context.
//
// The default is the local config, so the badge still renders correctly if a
// provider is ever missing — it degrades to the committed value rather than
// to nothing.
const AvailabilityContext = createContext<AvailabilityState>(getCurrentAvailability());

export function AvailabilityProvider({
  value,
  children,
}: {
  value: AvailabilityState;
  children: ReactNode;
}) {
  return <AvailabilityContext.Provider value={value}>{children}</AvailabilityContext.Provider>;
}

export function useAvailability(): AvailabilityState {
  return useContext(AvailabilityContext);
}
