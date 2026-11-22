'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const World = dynamic(() => import('./world').then((m) => m.World), {
  ssr: false,
});

const BRAND_COLORS = ['#22D3EE', '#2563EB', '#4F46E5'];

// Hoisted to module scope. These were previously rebuilt on every render, which
// handed `World` new object/array identities each time and re-ran the globe's
// effects — including the expensive hexPolygon tessellation of every country.
const GLOBE_CONFIG = {
  pointSize: 4,
  globeColor: '#050D24', // --color-card
  showAtmosphere: true,
  atmosphereColor: '#22D3EE',
  atmosphereAltitude: 0.15,
  emissive: '#0F1D3D', // --color-border
  emissiveIntensity: 0.15,
  shininess: 0.9,
  polygonColor: 'rgba(148, 163, 184, 100)', // --color-muted, translucent
  ambientLight: '#22D3EE',
  directionalLeftLight: '#2563EB',
  directionalTopLight: '#4F46E5',
  pointLight: '#ffffff',
  arcTime: 1500,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 25.2048, lng: 55.2708 }, // Dubai
  autoRotate: true,
  autoRotateSpeed: 0.5,
} as const;

// Dubai as the hub, connecting to major business/timezone regions.
// Colours are assigned deterministically from the arc index rather than
// Math.random(), so the same arc keeps the same colour between renders.
const ARC_ROUTES = [
  { order: 1, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.3 }, // Singapore
  { order: 1, endLat: 28.6139, endLng: 77.209, arcAlt: 0.2 }, // India
  { order: 2, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.4 }, // London
  { order: 2, endLat: 40.7128, endLng: -74.006, arcAlt: 0.6 }, // New York
  { order: 3, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.4 }, // Tokyo
  { order: 3, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.5 }, // Sydney
];

const DUBAI_ARCS = ARC_ROUTES.map((route, index) => ({
  ...route,
  startLat: 25.2048,
  startLng: 55.2708,
  color: BRAND_COLORS[index % BRAND_COLORS.length],
}));

export function GridGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  // `shouldLoad` latches on once the card first approaches the viewport, so the
  // ~2.5 MB three.js + GeoJSON chunk is never downloaded by a visitor who does
  // not scroll this far. `isVisible` tracks the current state and drives the
  // render loop, so the globe costs nothing while it is off-screen.
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // IntersectionObserver is supported across the whole browserslist target
    // in package.json (Chrome/Edge 91+, Firefox 90+, Safari 15+), so there is
    // no fallback path to maintain here.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShouldLoad(true);
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Stop rendering entirely when the tab is backgrounded.
  useEffect(() => {
    function handleVisibility() {
      if (document.hidden) setIsVisible(false);
    }
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-36 -left-5 flex h-full w-full items-center justify-center md:top-40"
    >
      <div className="relative mx-auto h-96 w-full max-w-7xl overflow-hidden px-4">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-40 w-full bg-linear-to-b from-transparent to-black select-none" />

        {/* touch-action: pan-y hands vertical swipes back to the page. Without
            it OrbitControls captured the gesture and the card trapped scrolling
            on touch devices. */}
        <div className="absolute z-10 h-72 w-full touch-pan-y md:h-full">
          {shouldLoad && <World data={DUBAI_ARCS} globeConfig={GLOBE_CONFIG} active={isVisible} />}
        </div>
      </div>
    </div>
  );
}
