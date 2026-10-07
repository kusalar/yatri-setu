'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { StateCard } from '@/components/hidden-india/StateCard';
import { HiddenPlaceCard } from '@/components/hidden-india/HiddenPlaceCard';
import { getAllStates, HIDDEN_PLACES_DATA } from '@/data/hidden-india';
import { HiddenPlaceCategory } from '@/data/hidden-india/types';
import { Search, Compass, Sparkles, MapPin, Feather, Filter, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const CATEGORIES: Array<HiddenPlaceCategory | 'ALL'> = [
  'ALL',
  'Nature',
  'Heritage',
  'Culture',
  'Village',
  'Craft',
  'Wildlife',
  'Adventure'
];

export default function HiddenIndiaLandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HiddenPlaceCategory | 'ALL'>('ALL');

  const states = useMemo(() => getAllStates(), []);
  const curatedPlaces = useMemo(() => HIDDEN_PLACES_DATA, []);

  // Filtered states based on search
  const filteredStates = useMemo(() => {
    if (!searchQuery.trim()) return states;
    const q = searchQuery.toLowerCase().trim();
    return states.filter((s) => {
      const matchState = s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.tagline.toLowerCase().includes(q);
      const matchDistrict = s.districts.some((d) => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
      return matchState || matchDistrict;
    });
  }, [states, searchQuery]);

  // Filtered places based on category and search
  const filteredPlaces = useMemo(() => {
    return curatedPlaces.filter((place) => {
      const matchesCategory = selectedCategory === 'ALL' || place.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        place.name.toLowerCase().includes(q) ||
        place.districtName.toLowerCase().includes(q) ||
        place.stateName.toLowerCase().includes(q) ||
        place.shortDescription.toLowerCase().includes(q) ||
        place.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [curatedPlaces, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Ambient glow backgrounds */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-[160px] pointer-events-none rounded-full" />
      <div className="fixed bottom-20 right-10 w-[600px] h-[300px] bg-emerald-500/5 blur-[140px] pointer-events-none rounded-full" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 relative z-10">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs />

        {/* ==================================================
            EDITORIAL HERO SECTION
            ================================================== */}
        <section className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 border-b border-white/10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 font-mono text-xs uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Yatri Setu Discovery Layer</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight">
              Hidden <span className="italic font-normal text-amber-400">India</span>
            </h1>

            <p className="text-lg sm:text-2xl text-stone-300 font-light leading-relaxed">
              Discover the places India hasn’t put on every map yet.
            </p>

            <p className="text-xs sm:text-base text-stone-400 leading-relaxed max-w-2xl pt-1">
              Step beyond overcrowded tourist corridors. An intelligent discovery index connecting you to
              living craft traditions, ancient village water systems, indigenous forest custodians, and tranquil
              rural sanctuaries across India&apos;s 28 states.
            </p>
          </motion.div>

          {/* Search & Category Filter Bar */}
          <div className="bg-stone-900/80 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-white/10 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search states, districts or hidden places (e.g., 'Kutch', 'Chatakpur', 'Dholavira')..."
                  className="w-full pl-11 pr-4 py-3.5 bg-stone-950/90 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 border border-white/10 text-white placeholder:text-stone-500"
                />
              </div>

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-stone-400 hover:text-white px-4 py-3 rounded-xl hover:bg-white/10 transition-all self-end sm:self-auto"
                >
                  Clear Search
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-400 uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5 text-amber-400" />
                <span>Filter By Experience & Theme:</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                          : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700/80 hover:text-white border border-white/5'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            CURATED HIDDEN SANCTUARIES (FEATURED PLACES)
            ================================================== */}
        {filteredPlaces.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                  DEEP DISCOVERY
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Curated Sanctuaries & Stories
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Verified destinations with deep community roots, local stories, and responsible guidelines.
                </p>
              </div>
              <span className="text-xs font-mono text-stone-400">
                Showing {filteredPlaces.length} of {curatedPlaces.length} destinations
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map((place, idx) => (
                <HiddenPlaceCard key={place.id} place={place} index={idx} />
              ))}
            </div>
          </section>
        )}

        {/* ==================================================
            STATE DIRECTORY (ALL 28 STATES)
            ================================================== */}
        <section className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                ALL 28 STATES OF INDIA
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                State Directory
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Select a state to explore its complete administrative district network and offbeat destinations.
              </p>
            </div>
            <div className="text-xs font-mono text-stone-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{filteredStates.length} States available</span>
            </div>
          </div>

          {filteredStates.length === 0 ? (
            <div className="text-center py-16 px-4 bg-stone-900/40 rounded-3xl border border-white/10 space-y-3">
              <Compass className="w-10 h-10 text-stone-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No States Found</h3>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                No state matched your search &quot;{searchQuery}&quot;. Clear your search query to browse all 28 states.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStates.map((state, idx) => (
                <StateCard key={state.id} state={state} index={idx} />
              ))}
            </div>
          )}
        </section>

        {/* ==================================================
            ETHOS / SUSTAINABLE DISCOVERY PROMISE
            ================================================== */}
        <section className="rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-stone-900/90 to-stone-900/40 border border-white/10 text-stone-300 space-y-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
              SUSTAINABLE TOURISM MANIFESTO
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Why Hidden India Matters
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              When overtourism concentrates on a handful of fragile hill stations and monuments, it damages ecology,
              drives up local living costs, and homogenizes the travel experience. Hidden India is Yatri Setu’s
              commitment to decentralized discovery: redirecting curiosity to places with rich heritage that welcome
              mindful visitors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-stone-950/60 border border-white/5 space-y-1.5">
              <div className="text-amber-400 font-bold text-sm">Community Retention</div>
              <p className="text-xs text-stone-400">
                Direct spending with village hosts, homestays, and local guides keeps economic returns in the community.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-stone-950/60 border border-white/5 space-y-1.5">
              <div className="text-amber-400 font-bold text-sm">Ecological Balance</div>
              <p className="text-xs text-stone-400">
                Spreading footfall relieves overburdened mountain water systems and waste collection infrastructure.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-stone-950/60 border border-white/5 space-y-1.5">
              <div className="text-amber-400 font-bold text-sm">Living Cultural Memory</div>
              <p className="text-xs text-stone-400">
                Supporting generational artisans keeps endangered crafts and local oral histories alive.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
