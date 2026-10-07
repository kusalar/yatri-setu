'use client';

import React, { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { DistrictCard } from '@/components/hidden-india/DistrictCard';
import { HiddenPlaceCard } from '@/components/hidden-india/HiddenPlaceCard';
import { getStateBySlug, getPlacesForState, getAllStates } from '@/data/hidden-india';
import { ImageWithSkeleton } from '@/components/ImageWithSkeleton';
import { ArrowLeft, MapPin, Compass, Search, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function StateDetailPage() {
  const params = useParams();
  const stateSlug = typeof params?.state === 'string' ? params.state : '';

  const state = useMemo(() => getStateBySlug(stateSlug), [stateSlug]);
  const statePlaces = useMemo(() => (state ? getPlacesForState(state.slug) : []), [state]);
  const [districtQuery, setDistrictQuery] = useState('');

  // Handle unknown state gracefully
  if (!state) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 py-16 px-4">
        <div className="max-w-md mx-auto text-center space-y-6 bg-stone-900/60 p-8 rounded-3xl border border-white/10">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">State Not Found</h1>
            <p className="text-xs text-stone-400">
              We couldn&apos;t find an Indian state matching &quot;{stateSlug}&quot;. Please check the directory.
            </p>
          </div>
          <Link
            href="/hidden-india"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Hidden India</span>
          </Link>
        </div>
      </div>
    );
  }

  const filteredDistricts = useMemo(() => {
    if (!districtQuery.trim()) return state.districts;
    const q = districtQuery.toLowerCase().trim();
    return state.districts.filter(
      (d) => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
    );
  }, [state.districts, districtQuery]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Background glow */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-amber-500/5 blur-[160px] pointer-events-none rounded-full" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 relative z-10">
        <Breadcrumbs />

        {/* ==================================================
            STATE HERO SECTION
            ================================================== */}
        <section className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-stone-900/40">
          <div className="relative h-72 sm:h-96 w-full">
            <ImageWithSkeleton
              src={state.heroImage}
              alt={`Hidden ${state.name} landscapes and heritage`}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-white/20 text-amber-300 text-[11px] font-mono font-bold tracking-widest uppercase">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>STATE DIRECTORY • {state.districts.length} DISTRICTS</span>
              </div>

              <h1 className="text-3xl sm:text-6xl font-black text-white tracking-tight leading-tight">
                Hidden <span className="italic font-normal text-amber-400">{state.name}</span>
              </h1>

              <p className="text-sm sm:text-base text-stone-200 max-w-2xl leading-relaxed">
                {state.description}
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================
            CURATED PLACES IN THIS STATE (IF ANY)
            ================================================== */}
        {statePlaces.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                  CURATED DESTINATIONS
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Featured Sanctuaries in {state.name}
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Documented offbeat settlements, ancient craft traditions, and natural wonders.
                </p>
              </div>
              <span className="text-xs font-mono text-stone-400">
                {statePlaces.length} documented {statePlaces.length === 1 ? 'place' : 'places'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {statePlaces.map((place, idx) => (
                <HiddenPlaceCard key={place.id} place={place} index={idx} />
              ))}
            </div>
          </section>
        )}

        {/* ==================================================
            DISTRICT EXPLORER (ALL DISTRICTS OF THE STATE)
            ================================================== */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                ADMINISTRATIVE REGIONS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Explore {state.name} Districts
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Browse through all {state.districts.length} official administrative districts of {state.name}.
              </p>
            </div>

            {/* Quick District Search Filter */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={districtQuery}
                onChange={(e) => setDistrictQuery(e.target.value)}
                placeholder={`Search ${state.name} districts...`}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-900/90 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 border border-white/10 text-white placeholder:text-stone-500"
              />
            </div>
          </div>

          {filteredDistricts.length === 0 ? (
            <div className="text-center py-12 px-4 bg-stone-900/40 rounded-3xl border border-white/10 space-y-3">
              <Compass className="w-8 h-8 text-stone-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No Districts Matched</h3>
              <p className="text-xs text-stone-400">
                No district in {state.name} matched &quot;{districtQuery}&quot;.
              </p>
              <button
                type="button"
                onClick={() => setDistrictQuery('')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs"
              >
                Clear Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredDistricts.map((district, idx) => (
                <DistrictCard key={district.id} district={district} index={idx} />
              ))}
            </div>
          )}
        </section>

        {/* Back Link */}
        <div className="pt-8 border-t border-white/10 flex items-center justify-between">
          <Link
            href="/hidden-india"
            className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All 28 States</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
