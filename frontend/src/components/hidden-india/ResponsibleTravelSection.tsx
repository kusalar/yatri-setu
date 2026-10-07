'use client';

import React from 'react';
import { ResponsibleTravelGuideline } from '@/data/hidden-india/types';
import { ShieldCheck, HeartHandshake, Leaf, Trash2, Home, Compass } from 'lucide-react';

interface ResponsibleTravelSectionProps {
  guidelines?: ResponsibleTravelGuideline[];
}

const DEFAULT_GUIDELINES: ResponsibleTravelGuideline[] = [
  {
    title: 'Respect Local Customs & Sanctuaries',
    description: 'Honor community rituals, religious decorum, and village privacy. Always ask permission before photographing individuals.'
  },
  {
    title: 'Support Village Hosts Directly',
    description: 'Prefer homestays and local transport. Ensuring tourism income remains with rural families builds lasting local economic dignity.'
  },
  {
    title: 'Leave Zero Waste Behind',
    description: 'Carry all non-biodegradable plastics and personal trash back to towns with municipal waste processing.'
  },
  {
    title: 'Protect Fragile Natural Habitats',
    description: 'Stay on marked trails, refrain from disturbing wildlife or water bodies, and avoid taking natural artifacts or specimens.'
  }
];

const ICONS = [Compass, HeartHandshake, Trash2, Leaf, Home, ShieldCheck];

export function ResponsibleTravelSection({ guidelines }: ResponsibleTravelSectionProps) {
  const items = guidelines && guidelines.length > 0 ? guidelines : DEFAULT_GUIDELINES;

  return (
    <div className="relative rounded-3xl p-6 sm:p-8 bg-stone-900/60 border border-emerald-500/25 overflow-hidden backdrop-blur-md">
      {/* Subtle green ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                YATRI SETU ETHOS
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Responsible & Mindful Travel
              </h3>
            </div>
          </div>
          <p className="text-xs text-stone-400 max-w-sm sm:text-right">
            Hidden India flourishes when travelers arrive as mindful guests rather than consumers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            return (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-950/60 border border-white/5 hover:border-emerald-500/20 transition-colors"
              >
                <div className="p-2 rounded-xl bg-stone-900 text-emerald-400 border border-white/10 shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
