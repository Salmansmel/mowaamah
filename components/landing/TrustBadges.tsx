'use client';

import Image from 'next/image';

const badges = [
  { name: 'SAMA', src: '/logos/sama.svg', width: 90, height: 24 },
  { name: 'CMA', src: '/logos/cma.svg', width: 75, height: 24 },
  { name: 'PDPL', src: '/logos/pdpl.svg', width: 82, height: 24 },
];

export function TrustBadges() {
  return (
    <div className="mx-auto mt-16 flex max-w-3xl flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-10">
        {badges.map((badge) => (
          <Image
            key={badge.name}
            src={badge.src}
            alt={badge.name}
            width={badge.width}
            height={badge.height}
            className="opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
          />
        ))}
      </div>
    </div>
  );
}
