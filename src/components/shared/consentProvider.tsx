'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  readConsent,
  writeConsent,
  DENY_ALL,
  type ConsentCategories,
  type ConsentChoice,
} from '@/lib/consent';

/**
 * localStorage is an external store, so this subscribes to it with
 * useSyncExternalStore rather than copying it into state inside an effect.
 *
 * Three reasons that matters here: React handles the server/client snapshot
 * split itself, so there is no hydration mismatch and no flash of the banner
 * for someone who already answered; the 'storage' event means answering in
 * one tab updates every other open tab; and there is no effect writing state
 * on mount, which is what `react-hooks/set-state-in-effect` exists to prevent.
 *
 * The snapshot is a STRING, not an object. useSyncExternalStore compares
 * snapshots by reference, so returning a fresh `{ analytics, marketing }`
 * object on every read would re-render forever. Serialising to
 * "granted|denied" gives value semantics for free.
 */

/** 'pending' is the server snapshot — "not known yet", distinct from "unset". */
type Snapshot = string;

const PENDING: Snapshot = 'pending';
const UNSET: Snapshot = 'unset';

const listeners = new Set<() => void>();
let cached: Snapshot | null = null;

function emit() {
  cached = null;
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Fires when another tab writes. Same-tab writes go through emit() directly,
  // because the storage event does not fire in the tab that caused it.
  const onStorage = () => emit();
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}

function getSnapshot(): Snapshot {
  if (cached === null) {
    const record = readConsent();
    cached = record ? `${record.analytics}|${record.marketing}` : UNSET;
  }
  return cached;
}

function getServerSnapshot(): Snapshot {
  return PENDING;
}

function parse(snapshot: Snapshot): ConsentCategories | null {
  if (snapshot === PENDING || snapshot === UNSET) return null;
  const [analytics, marketing] = snapshot.split('|');
  return {
    analytics: analytics === 'granted' ? 'granted' : 'denied',
    marketing: marketing === 'granted' ? 'granted' : 'denied',
  };
}

interface ConsentValue {
  /** 'denied' until a choice is made, so nothing can load on the strength of null. */
  analytics: ConsentChoice;
  marketing: ConsentChoice;
  /** Null means not answered — distinct from answered-and-declined. */
  decided: ConsentCategories | null;
  /** False until the stored value is known, so nothing flashes on first paint. */
  ready: boolean;
  setConsent: (categories: ConsentCategories) => void;
  /** Reopens the banner so a choice can be changed. */
  reopen: () => void;
  bannerOpen: boolean;
}

const ConsentContext = createContext<ConsentValue>({
  analytics: 'denied',
  marketing: 'denied',
  decided: null,
  ready: false,
  setConsent: () => {},
  reopen: () => {},
  bannerOpen: false,
});

export function useConsent() {
  return useContext(ConsentContext);
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [reopened, setReopened] = useState(false);

  const ready = snapshot !== PENDING;
  const decided = parse(snapshot);
  const current = decided ?? DENY_ALL;

  const setConsent = useCallback((categories: ConsentCategories) => {
    writeConsent(categories);
    setReopened(false);
    emit();

    // Tell Google about the change if its tag is already on the page. Going
    // from granted back to denied has to reach gtag, or the earlier grant
    // keeps applying for the rest of the session.
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: categories.analytics,
        ad_storage: categories.marketing,
        ad_user_data: categories.marketing,
        ad_personalization: categories.marketing,
      });
    }

    // Meta's equivalent. Revoking matters more than granting here: the pixel
    // script cannot be unloaded once injected, so this is what actually stops
    // it reporting for the rest of the session.
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('consent', categories.marketing === 'granted' ? 'grant' : 'revoke');
    }
  }, []);

  const value = useMemo<ConsentValue>(
    () => ({
      analytics: current.analytics,
      marketing: current.marketing,
      decided,
      ready,
      setConsent,
      reopen: () => setReopened(true),
      bannerOpen: ready && (decided === null || reopened),
    }),
    [current.analytics, current.marketing, decided, ready, setConsent, reopened],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}
