'use client';

import React from 'react';
import Link from 'next/link';
import { StateInfo } from '@/data/hidden-india/types';
import { getStatePlaceCount } from '@/data/hidden-india';
import { ImageWithSkeleton } from '@/components/ImageWithSkeleton';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface StateCardProps {
  state: StateInfo;
  index?: number;
}

export function StateCard({ state, index = 0 }: StateCardProps) {
  const placeCount = getStatePlaceCount(state.slug);
  const districtCount = state.districts.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.3) }}
      className="group relative flex flex-col rounded-3xl overflow-hidden bg-stone-900/60 border border-white/10 hover:border-amber-400/40 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-amber-500/5 backdrop-blur-sm"
    >
      {/* State Image */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden">
        <ImageWithSkeleton
          src={state.heroImage}
          alt={`Landscapes of Hidden ${state.name}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold tracking-wider text-amber-300 uppercase shadow-md">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>{districtCount} Districts</span>
          </span>

          {placeCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-[10px] font-mono font-extrabold text-amber-300">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>{placeCount} Curated</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 flex flex-col justify-between p-6 -mt-6 relative z-10">
        <div className="space-y-2.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400/80">
            REGIONAL DIRECTORY
          </span>
          <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-amber-300 transition-colors">
            Hidden {state.name}
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 line-clamp-2 leading-relaxed">
            {state.tagline || state.description}
          </p>
        </div>

        {/* CTA link */}
        <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-400 group-hover:text-stone-200 transition-colors">
            Explore {state.name}
          </span>
          <Link
            href={`/hidden-india/${state.slug}`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-amber-400 text-stone-200 hover:text-stone-950 text-xs font-bold transition-all duration-200 group-hover:bg-amber-400 group-hover:text-stone-950 shadow-md"
            aria-label={`Explore districts and hidden destinations in ${state.name}`}
          >
            <span>Discover</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
