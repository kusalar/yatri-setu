'use client';

import React from 'react';
import Link from 'next/link';
import { HiddenPlace } from '@/data/hidden-india/types';
import { ImageWithSkeleton } from '@/components/ImageWithSkeleton';
import { ArrowRight, Clock, Calendar, MapPin, Feather, Sparkles, Compass } from 'lucide-react';
import { motion } from 'motion/react';

interface HiddenPlaceCardProps {
  place: HiddenPlace;
  index?: number;
}

export function HiddenPlaceCard({ place, index = 0 }: HiddenPlaceCardProps) {
  const imageAltText =
    place.imageAlt ||
    `${place.name}, ${place.districtName}, ${place.stateName} landscape`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3) }}
      className="group relative flex flex-col rounded-3xl overflow-hidden bg-stone-900/70 border border-white/10 hover:border-amber-400/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 backdrop-blur-md"
    >
      {/* Destination Image */}
      <div className="relative h-60 sm:h-64 w-full overflow-hidden">
        <ImageWithSkeleton
          src={place.image}
          alt={imageAltText}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-950/85 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold tracking-wider text-amber-300 uppercase shadow-md">
            <Feather className="w-3 h-3 text-amber-400" />
            <span>{place.category}</span>
          </span>

          {place.isUnmapped ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-[10px] font-mono font-bold text-amber-300">
              <Compass className="w-2.5 h-2.5" />
              <span>Curation Pending</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-300">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Curated Sanctuary</span>
            </span>
          )}
        </div>

        {/* District & State banner */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs font-mono text-stone-300 pointer-events-none">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>{place.districtName}, {place.stateName}</span>
        </div>
      </div>

      {/* Place Details */}
      <div className="flex-1 flex flex-col justify-between p-6 space-y-4">
        <div className="space-y-2.5">
          <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-amber-300 transition-colors">
            {place.name}
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed line-clamp-3">
            {place.shortDescription}
          </p>

          {/* Quick Verified Travel Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {place.bestTime ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-800/80 border border-white/10 text-[11px] font-mono text-stone-300">
                <Calendar className="w-3 h-3 text-amber-400" />
                <span>{place.bestTime}</span>
              </span>
            ) : place.isUnmapped ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-stone-800/60 border border-white/5 text-[10px] font-mono text-stone-400">
                <span>Seasonal guide pending field verification</span>
              </span>
            ) : null}

            {place.duration && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-800/80 border border-white/10 text-[11px] font-mono text-stone-300">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>{place.duration}</span>
              </span>
            )}
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5 max-w-[60%]">
            {place.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-md bg-stone-800/60 text-stone-400 border border-white/5 truncate"
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            href={`/hidden-india/${place.stateSlug}/${place.districtSlug}/${place.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs tracking-wider uppercase transition-all shadow-md group-hover:shadow-amber-500/20 active:scale-95"
            aria-label={
              place.isUnmapped
                ? `Explore overview of ${place.name}`
                : `Read story and explore ${place.name}`
            }
          >
            <span>{place.isUnmapped ? 'Explore Overview' : 'Read Story'}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
