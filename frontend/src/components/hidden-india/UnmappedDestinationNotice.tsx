'use client';

import React from 'react';
import { Compass, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnmappedDestinationNoticeProps {
  districtName: string;
  placeName?: string;
  message?: string;
  className?: string;
  compact?: boolean;
}

export function UnmappedDestinationNotice({
  districtName,
  placeName,
  message,
  className,
  compact = false
}: UnmappedDestinationNoticeProps) {
  const entityLabel = placeName || districtName;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-amber-500/30 bg-stone-900/80 backdrop-blur-xl shadow-xl transition-all',
        compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8 md:p-10',
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/5 blur-[90px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 blur-[90px] pointer-events-none rounded-full" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
        {/* Visual Badge Icon */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-amber-400 shrink-0 shadow-inner">
          <Compass className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse" />
        </div>

        {/* Message Content */}
        <div className="space-y-2.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Curation in progress</span>
            </span>

            {placeName && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-stone-400">
                <MapPin className="w-3 h-3 text-stone-500" />
                <span>{placeName} • {districtName}</span>
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            This part of Hidden India is still being mapped
          </h3>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
            {message ? (
              message
            ) : (
              <>
                Our destination team is working to add authentic local stories and responsible travel guidance for <strong className="text-amber-300 font-semibold">{entityLabel}</strong>.
              </>
            )}
          </p>

          <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-stone-400">
            <span className="text-amber-400">✦</span>
            <span>Verified field data and community guidelines are prioritized to protect fragile ecosystems before publishing.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
