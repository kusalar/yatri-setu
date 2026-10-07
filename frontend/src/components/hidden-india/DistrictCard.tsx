'use client';

import React from 'react';
import Link from 'next/link';
import { DistrictInfo } from '@/data/hidden-india/types';
import { getDistrictPlaceCount } from '@/data/hidden-india';
import { ImageWithSkeleton } from '@/components/ImageWithSkeleton';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface DistrictCardProps {
  district: DistrictInfo;
  index?: number;
}

export function DistrictCard({ district, index = 0 }: DistrictCardProps) {
  const placeCount = getDistrictPlaceCount(district.stateSlug, district.slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.25) }}
      className="group relative flex flex-col rounded-3xl overflow-hidden bg-stone-900/60 border border-white/10 hover:border-amber-400/40 transition-all duration-300 shadow-md hover:shadow-xl backdrop-blur-sm"
    >
      {/* Representative Image */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden">
        <ImageWithSkeleton
          src={district.heroImage}
          alt={`District of ${district.name}, ${district.stateName}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold tracking-wider text-stone-300 uppercase">
            <Compass className="w-3 h-3 text-amber-400" />
            <span>{district.stateName}</span>
          </span>

          {placeCount > 0 ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-[10px] font-mono font-extrabold text-amber-300">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>{placeCount} {placeCount === 1 ? 'Sanctuary' : 'Sanctuaries'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-stone-800/80 text-[10px] font-mono text-stone-400 border border-white/5">
              Mapping in progress
            </span>
          )}
        </div>
      </div>

      {/* District Info */}
      <div className="flex-1 flex flex-col justify-between p-5 -mt-4 relative z-10">
        <div className="space-y-2">
          <h4 className="text-xl font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
            {district.name}
          </h4>
          <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
            {district.description}
          </p>
        </div>

        {/* Link Button */}
        <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] font-mono text-stone-400">
            {placeCount > 0 ? `${placeCount} Hidden Places` : 'Discover District'}
          </span>
          <Link
            href={`/hidden-india/${district.stateSlug}/${district.slug}`}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-amber-400 text-stone-200 hover:text-stone-950 text-xs font-bold transition-all duration-200 group-hover:bg-amber-400 group-hover:text-stone-950"
            aria-label={`Explore hidden places in ${district.name}`}
          >
            <span>Explore</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
