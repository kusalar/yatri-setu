'use client';

import React, { useState } from 'react';
import { Compass, Image as ImageIcon } from 'lucide-react';

interface ImageWithSkeletonProps {
  src?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  loading?: 'lazy' | 'eager';
  fallbackLabel?: string;
}

export function ImageWithSkeleton({
  src,
  alt,
  className = '',
  containerClassName = '',
  loading = 'lazy',
  fallbackLabel
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isMissing = !src || src.trim() === '';

  if (isMissing || hasError) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 border border-white/5 flex flex-col items-center justify-center p-6 text-center select-none ${containerClassName}`}
        aria-label={alt}
        role="img"
      >
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-2 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-2xl bg-stone-800/80 border border-white/10 flex items-center justify-center text-amber-400/80 shadow-inner">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-semibold line-clamp-1 max-w-[200px]">
            {fallbackLabel || alt || 'Regional Landscape'}
          </span>
          <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">
            Visual pending field curation
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-stone-900 ${containerClassName}`}>
      {/* Shimmer Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 animate-pulse" />
      )}

      {/* Image */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setIsLoaded(true);
          setHasError(true);
        }}
        className={`transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 scale-100 filter-none' : 'opacity-0 scale-105 blur-sm'
        } ${className}`}
      />
    </div>
  );
}
