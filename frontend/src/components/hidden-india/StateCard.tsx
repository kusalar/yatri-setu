'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StateInfo } from '@/data/hidden-india/types';
import { getPlacesForState } from '@/data/hidden-india';
import { ImageWithSkeleton } from '@/components/ImageWithSkeleton';
import { ArrowRight, MapPin, Sparkles, Compass } from 'lucide-react';
import { motion } from 'motion/react';

interface StateCardProps {
  state: StateInfo;
  index?: number;
}

export function StateCard({ state, index = 0 }: StateCardProps) {
  const router = useRouter();

  const places = useMemo(() => getPlacesForState(state.slug), [state.slug]);
  const placeCount = places.length;
  const districtCount = state.districts.length;

  const featuredDistrict = useMemo(() => {
    if (places.length > 0) {
      const match = state.districts.find((d) => d.slug === places[0].districtSlug);
      if (match) return match;
    }
    return state.districts[0];
  }, [state.districts, places]);

  const targetUrl = featuredDistrict
    ? `/hidden-india/${state.slug}/${featuredDistrict.slug}`
    : `/hidden-india`;

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
      <div className="flex-1 flex flex-col justify-between p-6 -mt-6 relative z-10 space-y-4">
        <div className="space-y-2.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400/80">
            REGIONAL DIRECTORY
          </span>
          <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-amber-300 transition-colors">
            <Link href={targetUrl} className="hover:underline">
              Hidden {state.name}
            </Link>
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 line-clamp-2 leading-relaxed">
            {state.tagline || state.description}
          </p>
        </div>

        {/* District Navigation Controls */}
        <div className="space-y-3 pt-3 border-t border-white/10">
          {/* Quick district selector */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-400 shrink-0">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>District:</span>
            </div>
            <select
              aria-label={`Select district to explore in ${state.name}`}
              value={featuredDistrict?.slug}
              onChange={(e) => {
                if (e.target.value) {
                  router.push(`/hidden-india/${state.slug}/${e.target.value}`);
                }
              }}
              className="bg-stone-950/90 text-stone-200 text-xs px-2.5 py-1 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-amber-500 max-w-[180px] truncate"
            >
              {state.districts.map((d) => (
                <option key={d.id} value={d.slug} className="bg-stone-900 text-white">
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick district pill links */}
          <div className="flex flex-wrap items-center gap-1.5">
            {state.districts.slice(0, 3).map((dist) => (
              <Link
                key={dist.id}
                href={`/hidden-india/${state.slug}/${dist.slug}`}
                className="px-2 py-0.5 rounded-lg bg-stone-800/80 hover:bg-stone-700/80 text-[10px] font-mono text-stone-300 hover:text-white border border-white/5 transition-colors truncate max-w-[110px]"
                title={`Explore ${dist.name} district`}
              >
                {dist.name}
              </Link>
            ))}
            {state.districts.length > 3 && (
              <span className="text-[10px] font-mono text-stone-500">
                +{state.districts.length - 3} more
              </span>
            )}
          </div>

          {/* CTA Link */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400 group-hover:text-stone-200 transition-colors">
              Explore {featuredDistrict ? featuredDistrict.name : state.name}
            </span>
            <Link
              href={targetUrl}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-amber-400 text-stone-200 hover:text-stone-950 text-xs font-bold transition-all duration-200 group-hover:bg-amber-400 group-hover:text-stone-950 shadow-md"
              aria-label={`Explore districts and hidden destinations in ${state.name}`}
            >
              <span>Discover</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
