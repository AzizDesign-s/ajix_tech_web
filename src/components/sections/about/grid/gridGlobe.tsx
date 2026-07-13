'use client';

import dynamic from 'next/dynamic';

const World = dynamic(() => import('./world').then((m) => m.World), {
  ssr: false,
});

const BRAND_COLORS = ['#22D3EE', '#2563EB', '#4F46E5'];

function randomColor() {
  return BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)];
}

export function GridGlobe() {
  const globeConfig = {
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
  };

  // Dubai as the hub, connecting to major business/timezone regions
  const dubaiArcs = [
    {
      order: 1,
      startLat: 25.2048,
      startLng: 55.2708,
      endLat: 1.3521,
      endLng: 103.8198,
      arcAlt: 0.3,
      color: randomColor(),
    }, // Singapore
    {
      order: 1,
      startLat: 25.2048,
      startLng: 55.2708,
      endLat: 28.6139,
      endLng: 77.209,
      arcAlt: 0.2,
      color: randomColor(),
    }, // India
    {
      order: 2,
      startLat: 25.2048,
      startLng: 55.2708,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.4,
      color: randomColor(),
    }, // London
    {
      order: 2,
      startLat: 25.2048,
      startLng: 55.2708,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.6,
      color: randomColor(),
    }, // New York
    {
      order: 3,
      startLat: 25.2048,
      startLng: 55.2708,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.4,
      color: randomColor(),
    }, // Tokyo
    {
      order: 3,
      startLat: 25.2048,
      startLng: 55.2708,
      endLat: -33.8688,
      endLng: 151.2093,
      arcAlt: 0.5,
      color: randomColor(),
    }, // Sydney
  ];

  return (
    <div className="absolute top-36 -left-5 flex h-full w-full items-center justify-center md:top-40">
      <div className="relative mx-auto h-96 w-full max-w-7xl overflow-hidden px-4">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-40 w-full bg-linear-to-b from-transparent to-white select-none dark:to-black" />

        <div className="absolute z-10 h-72 w-full md:h-full">
          <World data={dubaiArcs} globeConfig={globeConfig} />
        </div>
      </div>
    </div>
  );
}
