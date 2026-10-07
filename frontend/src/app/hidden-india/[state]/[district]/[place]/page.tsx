'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ImageWithSkeleton } from '@/components/ImageWithSkeleton';
import { ResponsibleTravelSection } from '@/components/hidden-india/ResponsibleTravelSection';
import { HiddenPlaceCard } from '@/components/hidden-india/HiddenPlaceCard';
import { UnmappedDestinationNotice } from '@/components/hidden-india/UnmappedDestinationNotice';
import {
  getStateBySlug,
  getDistrictBySlug,
  getPlaceBySlug,
  getRelatedPlaces
} from '@/data/hidden-india';
import { CircuitDestinationNode } from '@/components/YatriMap';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Compass,
  MapPin,
  Sparkles,
  Feather,
  CheckCircle2,
  BookOpen,
  Home,
  Info,
  Footprints,
  Camera,
  Utensils,
  Users,
  Backpack,
  Heart,
  FileCheck
} from 'lucide-react';

// Dynamically import YatriMap with ssr: false to prevent maplibre window errors
const YatriMap = dynamic(
  () => import('@/components/YatriMap').then((mod) => mod.YatriMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[360px] w-full rounded-2xl bg-stone-900 border border-white/10 flex items-center justify-center text-xs text-stone-400">
        Loading regional map...
      </div>
    )
  }
);

// Map experience types to icons
const getExperienceIcon = (type: string) => {
  switch (type) {
    case 'Walk':
      return Footprints;
    case 'Taste':
      return Utensils;
    case 'Meet':
      return Users;
    case 'Explore':
      return Compass;
    case 'Learn':
      return BookOpen;
    case 'Photograph':
      return Camera;
    case 'Trek':
      return Backpack;
    case 'Craft':
      return Feather;
    default:
      return Sparkles;
  }
};

export default function PlaceDetailPage() {
  const params = useParams();
  const stateSlug = typeof params?.state === 'string' ? params.state : '';
  const districtSlug = typeof params?.district === 'string' ? params.district : '';
  const placeSlug = typeof params?.place === 'string' ? params.place : '';

  const state = useMemo(() => getStateBySlug(stateSlug), [stateSlug]);
  const district = useMemo(
    () => (state ? getDistrictBySlug(state.slug, districtSlug) : undefined),
    [state, districtSlug]
  );
  const place = useMemo(
    () => (state && district ? getPlaceBySlug(state.slug, district.slug, placeSlug) : undefined),
    [state, district, placeSlug]
  );

  const relatedPlaces = useMemo(
    () => (place ? getRelatedPlaces(place, 3) : []),
    [place]
  );

  // Map node for existing YatriMap if coordinates exist and place is verified
  const mapNode: CircuitDestinationNode[] = useMemo(() => {
    if (!place?.coordinates || place.isUnmapped) return [];
    return [
      {
        id: place.id,
        name: place.name,
        coordinates: place.coordinates,
        altitude_ft: place.elevation ? parseInt(place.elevation.replace(/[^0-9]/g, '')) || undefined : undefined,
        crowd_score: 15,
        crowd_level: 'LOW',
        capacity_status: 'HEALTHY',
        access_status: 'OPEN',
        tagline: place.shortDescription
      }
    ];
  }, [place]);

  // Handle place not found
  if (!state || !district || !place) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 py-16 px-4">
        <div className="max-w-md mx-auto text-center space-y-6 bg-stone-900/60 p-8 rounded-3xl border border-white/10">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Destination Not Found</h1>
            <p className="text-xs text-stone-400">
              The place &quot;{placeSlug}&quot; could not be found in {district?.name || districtSlug}, {state?.name || stateSlug}.
            </p>
          </div>
          <Link
            href={
              state && district
                ? `/hidden-india/${state.slug}/${district.slug}`
                : '/hidden-india'
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to {district ? district.name : 'Hidden India'}</span>
          </Link>
        </div>
      </div>
    );
  }

  const imageAltText =
    place.imageAlt ||
    `${place.name}, ${place.districtName}, ${place.stateName} landscape`;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-amber-500/5 blur-[160px] pointer-events-none rounded-full" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-14 relative z-10">
        <Breadcrumbs />

        {/* ==================================================
            1. HERO SECTION
            ================================================== */}
        <section className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-stone-900/50">
          <div className="relative h-80 sm:h-[460px] w-full">
            <ImageWithSkeleton
              src={place.image}
              alt={imageAltText}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

            {/* Badges */}
            <div className="absolute top-6 left-6 right-6 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-950/85 backdrop-blur-md border border-white/20 text-amber-300 text-[11px] font-mono font-bold tracking-widest uppercase shadow-md">
                <Feather className="w-3.5 h-3.5 text-amber-400" />
                <span>{place.category}</span>
              </span>

              {place.isUnmapped ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-[10px] font-mono font-bold text-amber-300">
                  <Compass className="w-3 h-3" />
                  <span>Field Curation Pending</span>
                </span>
              ) : place.elevation ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-950/85 backdrop-blur-md border border-white/15 text-[10px] font-mono text-stone-300">
                  <span>Elevation: {place.elevation}</span>
                </span>
              ) : null}
            </div>

            {/* Title & Location */}
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 space-y-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-stone-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <Link
                  href={`/hidden-india/${place.stateSlug}/${place.districtSlug}`}
                  className="hover:text-amber-300 transition-colors underline-offset-4 hover:underline"
                >
                  {place.districtName}
                </Link>
                <span>•</span>
                <Link
                  href={`/hidden-india/${place.stateSlug}`}
                  className="hover:text-amber-300 transition-colors underline-offset-4 hover:underline"
                >
                  {place.stateName}
                </Link>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                {place.name}
              </h1>

              <p className="text-sm sm:text-base text-stone-200 max-w-3xl leading-relaxed">
                {place.shortDescription}
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================
            2. QUICK INFORMATION SECTION (Only verified facts)
            ================================================== */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-stone-900/60 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/80 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>Location</span>
            </span>
            <p className="text-xs sm:text-sm font-semibold text-white">
              {place.districtName}, {place.stateName}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/60 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/80 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Best Season</span>
            </span>
            <p className="text-xs sm:text-sm font-semibold text-white">
              {place.bestTime ? place.bestTime : 'Pending field verification'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/60 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/80 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Ideal Duration</span>
            </span>
            <p className="text-xs sm:text-sm font-semibold text-white">
              {place.duration ? place.duration : 'Day excursion / under mapping'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/60 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/80 flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>Category</span>
            </span>
            <p className="text-xs sm:text-sm font-semibold text-white line-clamp-2">
              {place.category} Sanctuary
            </p>
          </div>
        </section>

        {/* Accessibility note if present */}
        {place.accessibility && (
          <div className="p-4 rounded-2xl bg-stone-900/40 border border-white/5 flex items-start gap-3 text-xs text-stone-300">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-white font-semibold">Route &amp; Access:</strong>{' '}
              {place.accessibility}
            </p>
          </div>
        )}

        {/* ==================================================
            UNMAPPED STATE OR VERIFIED STORY CONTENT
            ================================================== */}
        {place.isUnmapped ? (
          /* ==============================================
             UNMAPPED DESTINATION EXPERIENCE (NO FABRICATED FACTS)
             ============================================== */
          <section className="space-y-8">
            {/* The exact requested unmapped notice component */}
            <UnmappedDestinationNotice
              districtName={place.districtName}
              placeName={place.name}
            />

            {/* Structured Curation Status Panel */}
            <div className="rounded-3xl p-6 sm:p-8 bg-stone-900/60 border border-white/10 space-y-6">
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                    FIELD VERIFICATION IN PROGRESS
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Sanctuary Curation Status
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-stone-800 text-[11px] font-mono text-stone-400 border border-white/5">
                  Content Status: Pre-Publish
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-950/60 border border-white/5 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase">
                    <BookOpen className="w-4 h-4" />
                    <span>Local Story &amp; Oral History</span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Still being mapped. Our community researchers record firsthand oral histories with village elders before publishing.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-950/60 border border-white/5 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase">
                    <Calendar className="w-4 h-4" />
                    <span>Seasonal Guidelines</span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Still being verified. Precise weather, wildlife nesting periods, and tide calendars are validated with forest rangers.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-950/60 border border-white/5 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                    <FileCheck className="w-4 h-4" />
                    <span>Responsible Travel Directives</span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Still being curated in coordination with local Panchayats to ensure visiting travelers respect resident communities.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-950/60 border border-white/5 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase">
                    <Home className="w-4 h-4" />
                    <span>Rural Host Network</span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Homestay verification and ethical host onboarding in {place.districtName} will be announced once field visits conclude.
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* ==============================================
             VERIFIED DESTINATION CONTENT (FULL DETAIL)
             ============================================== */
          <>
            {/* LOCAL STORY */}
            {place.localStory && (
              <section className="rounded-3xl p-6 sm:p-10 bg-stone-900/70 border border-white/10 shadow-xl space-y-6">
                <div className="space-y-2 border-b border-white/10 pb-4">
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                    <BookOpen className="w-4 h-4" />
                    <span>THE LIVING NARRATIVE</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    Local Story
                  </h2>
                  {place.localStory.headline && (
                    <p className="text-base sm:text-lg text-amber-300/90 font-medium italic">
                      &ldquo;{place.localStory.headline}&rdquo;
                    </p>
                  )}
                </div>

                {/* Paragraphs */}
                <div className="prose prose-invert max-w-none space-y-4 text-stone-300 text-sm sm:text-base leading-relaxed">
                  {place.localStory.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {/* Community & Cultural Insights */}
                {(place.localStory.culturalSignificance || place.localStory.communityConnection) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    {place.localStory.culturalSignificance && (
                      <div className="p-4 rounded-2xl bg-stone-950/60 border border-white/5 space-y-1">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                          Cultural Significance
                        </div>
                        <p className="text-xs text-stone-300 leading-relaxed">
                          {place.localStory.culturalSignificance}
                        </p>
                      </div>
                    )}
                    {place.localStory.communityConnection && (
                      <div className="p-4 rounded-2xl bg-stone-950/60 border border-white/5 space-y-1">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                          Community Connection
                        </div>
                        <p className="text-xs text-stone-300 leading-relaxed">
                          {place.localStory.communityConnection}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* WHY VISIT */}
            {place.whyVisit && place.whyVisit.length > 0 && (
              <section className="space-y-5">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                    DISTINCTIVE CHARACTER
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Why Visit {place.name}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {place.whyVisit.map((reason, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-2xl bg-stone-900/60 border border-white/10 text-xs sm:text-sm text-stone-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{reason}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* WHAT TO EXPERIENCE */}
            {place.experiences && place.experiences.length > 0 && (
              <section className="space-y-5">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                    LOCAL TOUCHPOINTS
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    What to Experience
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-400 mt-1">
                    Authentic, respectful activities guided or hosted by local residents.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {place.experiences.map((exp, idx) => {
                    const Icon = getExperienceIcon(exp.type);
                    return (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-stone-900/70 border border-white/10 space-y-2.5 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-400 uppercase font-bold">
                              <Icon className="w-3 h-3" />
                              <span>{exp.type}</span>
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-white tracking-tight">
                            {exp.title}
                          </h4>
                          <p className="text-xs text-stone-300 leading-relaxed">
                            {exp.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* MORE ABOUT THIS PLACE */}
            {place.moreAbout && Object.values(place.moreAbout).some(Boolean) && (
              <section className="space-y-5">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                    DEEP CONTEXT
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    More About {place.name}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {place.moreAbout.history && (
                    <div className="p-5 rounded-2xl bg-stone-900/60 border border-white/10 space-y-2">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>Historical Archive</span>
                      </h4>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {place.moreAbout.history}
                      </p>
                    </div>
                  )}

                  {place.moreAbout.nature && (
                    <div className="p-5 rounded-2xl bg-stone-900/60 border border-white/10 space-y-2">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>Ecology &amp; Wildlife</span>
                      </h4>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {place.moreAbout.nature}
                      </p>
                    </div>
                  )}

                  {place.moreAbout.culture && (
                    <div className="p-5 rounded-2xl bg-stone-900/60 border border-white/10 space-y-2">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>Cultural Folklore</span>
                      </h4>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {place.moreAbout.culture}
                      </p>
                    </div>
                  )}

                  {place.moreAbout.crafts && (
                    <div className="p-5 rounded-2xl bg-stone-900/60 border border-white/10 space-y-2">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>Artisanal Tradition</span>
                      </h4>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {place.moreAbout.crafts}
                      </p>
                    </div>
                  )}

                  {place.moreAbout.food && (
                    <div className="p-5 rounded-2xl bg-stone-900/60 border border-white/10 space-y-2">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>Local Culinary Heritage</span>
                      </h4>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {place.moreAbout.food}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* MAP INTEGRATION (If verified coordinates exist) */}
            {place.coordinates && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                      GEOSPATIAL REFERENCE
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      Explore on Regional Map
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-stone-400">
                    [{place.coordinates[1].toFixed(4)}° N, {place.coordinates[0].toFixed(4)}° E]
                  </span>
                </div>

                <div className="rounded-3xl overflow-hidden border border-white/10 shadow-xl">
                  <YatriMap
                    center={place.coordinates}
                    zoom={9}
                    nodes={mapNode}
                    selectedDestinationId={place.id}
                    height="380px"
                  />
                </div>
              </section>
            )}

            {/* RESPONSIBLE TRAVEL ETHOS */}
            <ResponsibleTravelSection guidelines={place.responsibleTravel} />
          </>
        )}

        {/* ==================================================
            HOMESTAYS & COMMUNITY INTEGRATION
            ================================================== */}
        <section className="p-6 sm:p-8 rounded-3xl bg-stone-900/60 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
              <Home className="w-4 h-4" />
              <span>Yatri Setu Homestay Network</span>
            </div>
            <h4 className="text-xl font-bold text-white tracking-tight">
              Stay with Verified Rural Hosts
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Experience authentic hospitality where over 90% of your booking fee stays directly with the host family,
              supporting rural livelihoods and local conservation.
            </p>
          </div>

          <Link
            href="/homestays"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shrink-0"
          >
            <span>Browse Homestays</span>
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </section>

        {/* ==================================================
            RELATED HIDDEN PLACES
            ================================================== */}
        {relatedPlaces.length > 0 && (
          <section className="space-y-6 pt-4 border-t border-white/10">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                RELATED SANCTUARIES
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                More Places Nearby &amp; Similar Escapes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPlaces.map((relPlace, idx) => (
                <HiddenPlaceCard key={relPlace.id} place={relPlace} index={idx} />
              ))}
            </div>
          </section>
        )}

        {/* Back Link to District */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <Link
            href={`/hidden-india/${place.stateSlug}/${place.districtSlug}`}
            className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {place.districtName}</span>
          </Link>

          <Link
            href="/hidden-india"
            className="text-xs font-mono text-stone-400 hover:text-white transition-colors"
          >
            Hidden India Index ↑
          </Link>
        </div>
      </main>
    </div>
  );
}
