'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  placeholderText: string;
  className?: string;
}

export function ImageWithFallback({ src, alt, placeholderText, className }: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5 ${className ?? ''}`}
    >
      {failed ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-text-muted">
          <ImageOff size={28} />
          <span className="text-xs">{placeholderText}</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
