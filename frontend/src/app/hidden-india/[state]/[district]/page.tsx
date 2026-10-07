'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { HiddenPlaceCard } from '@/components/hidden-india/HiddenPlaceCard';
import { UnmappedDestinationNotice } from '@/components/hidden-india/UnmappedDestinationNotice';
import {
  getStateBySlug,
  getDistrictBySlug,
  getPlacesForDistrict,
  getDistrictsForState
} from '@/data/hidden-india';
import { ImageWithSkeleton } from '@/components/ImageWithSkeleton';
import { ArrowLeft, Compass, Sparkles, MapPin, Layers } from 'lucide-react';

export default function DistrictDetailPage() {
  const params = useParams();
  const stateSlug = typeof params?.state === 'string' ? params.state : '';
  const districtSlug = typeof params?.district === 'string' ? params.district : '';

  const state = useMemo(() => getStateBySlug(stateSlug), [stateSlug]);
  const district = useMemo(
    () => (state ? getDistrictBySlug(state.slug, districtSlug) : undefined),
    [state, districtSlug]
  );

  const places = useMemo(
    () => (state && district ? getPlacesForDistrict(state.slug, district.slug) : []),
    [state, district]
  );

  const siblingDistricts = useMemo(
    () => (state ? getDistrictsForState(state.slug).filter((d) => d.slug !== district?.slug) : []),
    [state, district]
  );

  const hasUnmappedPlaces = useMemo(
    () => places.some((p) => p.isUnmapped),
    [places]
  );

  // Error state for invalid state or district
  if (!state || !district) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 py-16 px-4">
        <div className="max-w-md mx-auto text-center space-y-6 bg-stone-900/60 p-8 rounded-3xl border border-white/10">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">District Not Found</h1>
            <p className="text-xs text-stone-400">
              We couldn&apos;t find district &quot;{districtSlug}&quot; in {state?.name || stateSlug}.
            </p>
          </div>
          <Link
            href={state ? `/hidden-india/${state.slug}` : '/hidden-india'}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to {state ? state.name : 'Hidden India'}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/5 blur-[160px] pointer-events-none rounded-full" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 relative z-10">
        <Breadcrumbs />

        {/* ==================================================
            DISTRICT HERO SECTION
            ================================================== */}
        <section className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-stone-900/40">
          <div className="relative h-64 sm:h-80 w-full">
            <ImageWithSkeleton
              src={district.heroImage}
              alt={`Landscapes of ${district.name}, ${state.name}`}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/hidden-india/${state.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-white/20 text-stone-300 hover:text-amber-300 text-[11px] font-mono font-bold tracking-widest uppercase transition-colors"
                >
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{state.name}</span>
                </Link>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-[10px] font-mono font-bold text-amber-300">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>
                    {places.length > 0
                      ? `${places.length} Mapped ${places.length === 1 ? 'Sanctuary' : 'Sanctuaries'}`
                      : 'Field Curation In Progress'}
                  </span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {district.name}
              </h1>

              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                {district.description}
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================
            HIDDEN PLACES SECTION
            ================================================== */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                DISTRICT DESTINATIONS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Hidden Places in {district.name}
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Lesser-known heritage settlements, cultural hubs, and nature sanctuaries.
              </p>
            </div>
            <span className="text-xs font-mono text-stone-400">
              {places.length} {places.length === 1 ? 'place' : 'places'} listed
            </span>
          </div>

          {places.length === 0 ? (
            /* Elegant Empty State for districts with no individual places yet */
            <div className="py-8 max-w-2xl mx-auto space-y-6">
              <UnmappedDestinationNotice districtName={district.name} />

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={`/hidden-india/${state.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md hover:bg-amber-300 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Explore Other {state.name} Districts</span>
                </Link>

                <Link
                  href="/hidden-india"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 text-stone-200 font-bold text-xs uppercase tracking-wider hover:bg-stone-700 transition-all border border-white/10"
                >
                  <span>Browse All States</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {places.map((place, idx) => (
                  <HiddenPlaceCard key={place.id} place={place} index={idx} />
                ))}
              </div>

              {/* Exact Unmapped Destination Notice when detailed content is still being curated */}
              {hasUnmappedPlaces && (
                <div className="pt-2">
                  <UnmappedDestinationNotice districtName={district.name} />
                </div>
              )}
            </div>
          )}
        </section>

        {/* ==================================================
            EXPLORE NEIGHBORING DISTRICTS IN STATE
            ================================================== */}
        {siblingDistricts.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  More Districts in {state.name}
                </h3>
              </div>
              <Link
                href={`/hidden-india/${state.slug}`}
                className="text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors"
              >
                View all {state.districts.length} →
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {siblingDistricts.slice(0, 10).map((sib) => (
                <Link
                  key={sib.id}
                  href={`/hidden-india/${state.slug}/${sib.slug}`}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-white/10 text-xs font-medium transition-colors"
                >
                  {sib.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back Link */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <Link
            href={`/hidden-india/${state.slug}`}
            className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {state.name} Districts</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
