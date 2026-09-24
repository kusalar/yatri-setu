'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  MoveHorizontal,
  X,
  Compass,
  Footprints,
  Trees,
  Landmark,
  Eye,
  CheckCircle2,
  Clock,
  Compass as CompassIcon,
  ShieldCheck,
  Feather,
  Home as HomeIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export interface HiddenPlace {
  id: string;
  num: string;
  place: string;
  district: string;
  whyFeature: string;
  yatriAngle: string;
  yatriAngleEmoji: string;
  tags: string[];
  crowdScore: number;
  crowdStatus: string;
  elevation: string;
  bestSeason: string;
  routeInfo: string;
  highlights: string[];
  image: string;
  query: string;
}

export const HIDDEN_PLACES: HiddenPlace[] = [
  {
    id: 'chatakpur',
    num: '01',
    place: 'Chatakpur',
    district: 'Darjeeling',
    whyFeature: 'Quiet Himalayan village, Kanchenjunga views, eco-tourism & homestays',
    yatriAngle: 'Community + Eco Tourism',
    yatriAngleEmoji: '🌿',
    tags: ['7,887 FT', 'KANCHENJUNGA VIEWS', 'ECO-VILLAGE', 'HOMESTAYS'],
    crowdScore: 12,
    crowdStatus: 'Pristine Low Footfall',
    elevation: '7,887 ft (2,404 m)',
    bestSeason: 'October to May',
    routeInfo: '18 km from Ghoom / Darjeeling, via Senchal Wildlife Sanctuary forest road',
    highlights: [
      'Unobstructed 180° sunrise vistas of Mount Kanchenjunga ridge',
      'Panchayat-registered wooden eco-homestays with authentic farm meals',
      'Senchal Wildlife Sanctuary guided nature trails and birdwatching',
      'Direct community revenue retention supporting local mountain families'
    ],
    image: '/hidden-india/chatakpur.jpg',
    query: 'chatakpur'
  },
  {
    id: 'gajoldoba',
    num: '02',
    place: 'Gajoldoba',
    district: 'Jalpaiguri',
    whyFeature: 'Teesta reservoir, migratory birds, forest surroundings',
    yatriAngle: 'Birding + Nature',
    yatriAngleEmoji: '🦜',
    tags: ['TEESTA RESERVOIR', 'MIGRATORY BIRDS', 'DOOARS FORESTS'],
    crowdScore: 18,
    crowdStatus: 'Peaceful Wetland',
    elevation: '420 ft (128 m)',
    bestSeason: 'November to March',
    routeInfo: '28 km from Siliguri / NJP, scenic drive along Teesta Canal Road',
    highlights: [
      'Teesta Barrage reservoir hosting thousands of migratory waterfowl each winter',
      'Quiet wooden country boat excursions guided by local river fishermen',
      'Baikunthapur forest trails with stunning Himalayan snowline horizon',
      'Untouched wetlands offering peaceful alternatives to crowded hill stations'
    ],
    image: '/hidden-india/gajoldoba.jpg',
    query: 'gajoldoba'
  },
  {
    id: 'buxa-fort',
    num: '03',
    place: 'Buxa Fort / Buxa',
    district: 'Alipurduar',
    whyFeature: 'Forest, trekking and historic fort',
    yatriAngle: 'Adventure + Heritage',
    yatriAngleEmoji: '🥾',
    tags: ['HISTORIC FORT', 'JUNGLE TREK', 'BUXA TIGER RESERVE'],
    crowdScore: 22,
    crowdStatus: 'Wilderness Solitude',
    elevation: '2,844 ft (867 m)',
    bestSeason: 'October to April',
    routeInfo: '2.6 km uphill forest trail hike starting from Santalabari base camp',
    highlights: [
      'Legendary stone fortress ruins steeped in Bhutanese and freedom struggle history',
      'Exhilarating canopy hike through the heart of Buxa Tiger Reserve',
      'Scenic onwards trail up to the picturesque Lepchakha plateau with Bhutan border views',
      'Community forest guides and certified indigenous tribal eco-lodges'
    ],
    image: '/hidden-india/buxa-fort.jpg',
    query: 'buxa'
  },
  {
    id: 'lepchajagat',
    num: '04',
    place: 'Lepchajagat',
    district: 'Darjeeling',
    whyFeature: 'Forested hill destination with Himalayan views',
    yatriAngle: 'Slow Travel + Nature',
    yatriAngleEmoji: '🌲',
    tags: ['6,959 FT', 'PINE & OAK FORESTS', 'HIMALAYAN SILENCE'],
    crowdScore: 24,
    crowdStatus: 'Serene Ridge Sanctuary',
    elevation: '6,959 ft (2,121 m)',
    bestSeason: 'September to May',
    routeInfo: '14 km from Darjeeling town via Ghoom & Sukhiapokhri road',
    highlights: [
      'Mystical old-growth oak, rhododendron and pine forest trails',
      'Tranquil mountain retreat relieving congested Darjeeling Mall Road',
      'Breathtaking sunrise and twilight vistas of Kanchenjunga through misty pine branches',
      'Warm family-run homestays with local cuisine and evening hearth conversations'
    ],
    image: '/hidden-india/lepchajagat.jpg',
    query: 'lepchajagat'
  },
  {
    id: 'amadpur',
    num: '05',
    place: 'Amadpur',
    district: 'Purba Bardhaman',
    whyFeature: 'Heritage structures, terracotta temples and rural Bengal atmosphere',
    yatriAngle: 'Heritage + Rural Culture',
    yatriAngleEmoji: '🏛️',
    tags: ['350-YR TERRACOTTA', 'ZAMINDAR ESTATE', 'RURAL BENGAL'],
    crowdScore: 8,
    crowdStatus: 'Undiscovered Cultural Haven',
    elevation: '115 ft (35 m)',
    bestSeason: 'July to March',
    routeInfo: '90 km from Kolkata via NH19, or 5 km from Memari Railway Station',
    highlights: [
      'Cluster of 350-year-old terracotta temples featuring intricate mythological carvings',
      'Restored ancestral Baithak-khana heritage mansion beside serene lotus dighis (ponds)',
      'Authentic Bengal rural village life with traditional bell-metal artisans & weaving',
      'Preserving rural Bengal cultural tourism away from commercial urban circuits'
    ],
    image: '/hidden-india/amadpur.jpg',
    query: 'amadpur'
  }
];

export default function HimalayanThemesGallery() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [parallax, setParallax] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedPlace, setSelectedPlace] = useState<HiddenPlace | null>(null);
  const [isSectionFocused, setIsSectionFocused] = useState<boolean>(false);

  const dragStartXRef = useRef<number>(0);
  const isPointerDownRef = useRef<boolean>(false);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Listen for navigation event from "Hidden India" button click
  useEffect(() => {
    const handleActivate = () => {
      setIsSectionFocused(true);
      setActiveIdx(0);
      setHasInteracted(true);
      setTimeout(() => setIsSectionFocused(false), 2400);
    };

    window.addEventListener('activate-hidden-india', handleActivate);
    return () => window.removeEventListener('activate-hidden-india', handleActivate);
  }, []);

  // Subtle image parallax on active card
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, index: number) => {
      if (prefersReducedMotion || index !== activeIdx) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      setParallax({
        x: Math.round(relX * 16),
        y: Math.round(relY * 16),
      });
    },
    [activeIdx, prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    setParallax({ x: 0, y: 0 });
  }, []);

  // Pointer drag for Desktop
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    isPointerDownRef.current = true;
    dragStartXRef.current = e.clientX;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const diff = e.clientX - dragStartXRef.current;
    setDragOffset(diff * 0.22);
  };

  const handlePointerEnd = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsDragging(false);

    const diff = e.clientX - dragStartXRef.current;
    const threshold = 45;

    if (diff < -threshold && activeIdx < HIDDEN_PLACES.length - 1) {
      setActiveIdx((prev) => prev + 1);
      setHasInteracted(true);
    } else if (diff > threshold && activeIdx > 0) {
      setActiveIdx((prev) => prev - 1);
      setHasInteracted(true);
    }

    setDragOffset(0);
  };

  // Mobile scroll observer
  const handleMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    setHasInteracted(true);
    const container = mobileScrollRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.clientWidth * 0.82;
    const newIdx = Math.min(
      HIDDEN_PLACES.length - 1,
      Math.max(0, Math.round(scrollLeft / itemWidth))
    );
    if (newIdx !== activeIdx) {
      setActiveIdx(newIdx);
    }
  };

  const scrollMobileTo = (index: number) => {
    setActiveIdx(index);
    setHasInteracted(true);
    if (mobileScrollRef.current) {
      const container = mobileScrollRef.current;
      const card = container.children[index] as HTMLElement;
      if (card) {
        card.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIdx = Math.min(HIDDEN_PLACES.length - 1, index + 1);
      setActiveIdx(nextIdx);
      setHasInteracted(true);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIdx = Math.max(0, index - 1);
      setActiveIdx(prevIdx);
      setHasInteracted(true);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveIdx(index);
      setHasInteracted(true);
    }
  };

  const currentPlace = HIDDEN_PLACES[activeIdx];

  return (
    <section
      id="hidden-india"
      className={cn(
        'relative w-full py-20 lg:py-28 z-10 overflow-hidden transition-all duration-700',
        isSectionFocused ? 'ring-2 ring-amber-400/40 bg-stone-950/40 rounded-3xl' : ''
      )}
      aria-label="Hidden India: Curated Off-Beat Destinations"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/8 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ==================================================
            SECTION HEADER
            ================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-stone-200/80 dark:border-stone-800/80">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
              <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-amber-500 dark:text-amber-400">
                HIDDEN INDIA • CURATED ESCAPES
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                5 UNCHARTED SANCTUARIES
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-stone-950 dark:text-white tracking-tight leading-tight">
              EXPLORE <span className="font-editorial italic font-normal text-amber-400">HIDDEN INDIA</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row md:items-end gap-6 md:gap-10"
          >
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-md leading-relaxed">
              Travel beyond congested mountain ridges. Five peaceful, community-led sanctuaries handpicked to relieve high-density hotspots and celebrate authentic local heritage.
            </p>

            {/* Counter 01 / 05 */}
            <div
              className="flex items-baseline font-mono self-start sm:self-auto bg-stone-100/80 dark:bg-stone-900/90 px-4 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-800 select-none shadow-sm backdrop-blur-md"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="relative h-7 w-7 overflow-hidden inline-flex items-center justify-center font-black text-xl sm:text-2xl text-amber-500 dark:text-amber-400">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={currentPlace.num}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.35,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="absolute"
                  >
                    {currentPlace.num}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-stone-400 dark:text-stone-500 text-sm sm:text-base font-semibold ml-1.5 tracking-wider">
                / 05
              </span>
            </div>
          </motion.div>
        </div>

        {/* ==================================================
            MAIN INTERACTIVE GALLERY: DESKTOP & TABLET
            ================================================== */}
        <div className="hidden md:block">
          <div
            ref={galleryRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            className="relative h-[550px] lg:h-[600px] flex gap-3.5 select-none rounded-[2rem] p-1.5 cursor-grab active:cursor-grabbing transition-transform duration-150"
            style={{
              transform: `translateX(${dragOffset}px)`,
            }}
          >
            {HIDDEN_PLACES.map((item, index) => {
              const isActive = index === activeIdx;

              return (
                <motion.div
                  key={item.id}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isActive}
                  aria-label={`${item.place}, ${item.district} — ${item.yatriAngle}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 + index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onMouseEnter={() => {
                    setActiveIdx(index);
                    setHasInteracted(true);
                  }}
                  onMouseMove={(e) => handleMouseMove(e, index)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => {
                    setActiveIdx(index);
                    setHasInteracted(true);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={cn(
                    'group relative h-full rounded-[1.75rem] overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-400',
                    'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between p-6 lg:p-7',
                    isActive
                      ? 'border border-amber-400/60 shadow-2xl shadow-stone-950/40 ring-1 ring-amber-400/30'
                      : 'border border-stone-200/80 dark:border-white/10 hover:border-amber-400/30 dark:hover:border-white/20'
                  )}
                  style={{
                    flex: isActive ? '4.8 1 0%' : '1 1 0%',
                    minWidth: isActive ? '360px' : '76px',
                    transition: prefersReducedMotion
                      ? 'none'
                      : 'flex 700ms cubic-bezier(0.16, 1, 0.3, 1), min-width 700ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {/* Background Image: Grayscale -> Vibrant Cinematic Color Transition */}
                  <div className="absolute inset-0 overflow-hidden bg-stone-950 pointer-events-none">
                    <img
                      src={item.image}
                      alt={`${item.place}, ${item.district}`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover will-change-transform"
                      style={{
                        filter: isActive
                          ? 'grayscale(0%) brightness(1.02) contrast(1.06)'
                          : 'grayscale(85%) brightness(0.72) contrast(1.02)',
                        transform:
                          isActive && !prefersReducedMotion
                            ? `scale(1.06) translate3d(${parallax.x}px, ${parallax.y}px, 0)`
                            : 'scale(1) translate3d(0, 0, 0)',
                        transition: isDragging
                          ? 'none'
                          : prefersReducedMotion
                          ? 'none'
                          : 'filter 750ms cubic-bezier(0.16, 1, 0.3, 1), transform 750ms cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />

                    {/* Rich Dark Cinematic Gradient Overlays */}
                    <div
                      className={cn(
                        'absolute inset-0 transition-opacity duration-700 ease-out',
                        isActive
                          ? 'bg-gradient-to-t from-stone-950 via-stone-950/50 to-stone-950/20'
                          : 'bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/40 group-hover:from-stone-950/80'
                      )}
                    />
                  </div>

                  {/* Top Bar: District Badge & Number */}
                  <div className="relative z-10 flex items-center justify-between pointer-events-none">
                    <div
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-md transition-all duration-500 font-medium text-xs',
                        isActive
                          ? 'bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-400/25'
                          : 'bg-black/50 text-stone-200 border border-white/15'
                      )}
                    >
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="whitespace-nowrap">{item.district}</span>
                    </div>

                    <span
                      className={cn(
                        'font-mono text-xs font-bold tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md transition-all duration-500',
                        isActive
                          ? 'bg-black/70 text-amber-300 border border-amber-400/40 shadow-xs'
                          : 'bg-black/40 text-white/70 border border-white/10'
                      )}
                    >
                      {item.num}
                    </span>
                  </div>

                  {/* INACTIVE STATE: Clean Vertical Typographic Strip */}
                  {!isActive && (
                    <div className="relative z-10 mt-auto pointer-events-none transition-opacity duration-500 pb-2">
                      <div
                        className="flex items-center gap-3.5"
                        style={{
                          writingMode: 'vertical-rl',
                          transform: 'rotate(180deg)',
                        }}
                      >
                        <span className="text-sm font-mono font-bold tracking-widest text-amber-400/90">
                          {item.num}
                        </span>
                        <span className="text-base select-none">
                          {item.yatriAngleEmoji}
                        </span>
                        <p className="font-extrabold text-sm lg:text-base text-white/90 tracking-wide uppercase group-hover:text-amber-300 transition-colors whitespace-nowrap">
                          {item.place}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ACTIVE STATE: Rich Animated Place Profile */}
                  {isActive && (
                    <div className="relative z-10 mt-auto space-y-3 pointer-events-auto">
                      {/* Gold Accent Bar */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 48 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="h-1 bg-amber-400 rounded-full mb-1"
                      />

                      {/* Yatri Setu Angle Badge */}
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900/85 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide shadow-sm">
                        <span className="text-sm">{item.yatriAngleEmoji}</span>
                        <span>Yatri Setu Angle:</span>
                        <span className="text-white font-extrabold">{item.yatriAngle}</span>
                      </div>

                      {/* Animated Title */}
                      <div className="overflow-hidden">
                        <AnimatePresence mode="wait">
                          <motion.h3
                            key={`title-${item.id}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{
                              duration: prefersReducedMotion ? 0 : 0.45,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-md"
                          >
                            {item.place}
                          </motion.h3>
                        </AnimatePresence>
                      </div>

                      {/* Why feature it? */}
                      <motion.div
                        key={`why-${item.id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: prefersReducedMotion ? 0 : 0.5,
                          delay: 0.08,
                          ease: 'easeOut',
                        }}
                        className="bg-black/40 backdrop-blur-sm rounded-xl p-3 border border-white/10"
                      >
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400/90 block mb-0.5">
                          Why feature it?
                        </span>
                        <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-medium">
                          &ldquo;{item.whyFeature}&rdquo;
                        </p>
                      </motion.div>

                      {/* Tags & Telemetry */}
                      <motion.div
                        key={`meta-${item.id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: prefersReducedMotion ? 0 : 0.5,
                          delay: 0.15,
                          ease: 'easeOut',
                        }}
                        className="flex flex-wrap items-center gap-2 pt-0.5"
                      >
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-[10px] font-mono tracking-wider font-bold text-emerald-300">
                          ⚡ {item.crowdScore}/100 • {item.crowdStatus}
                        </span>
                        {item.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono tracking-wider font-bold text-stone-300 uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </motion.div>

                      {/* Interactive Actions */}
                      <motion.div
                        key={`cta-${item.id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: prefersReducedMotion ? 0 : 0.5,
                          delay: 0.22,
                          ease: 'easeOut',
                        }}
                        className="flex items-center gap-3 pt-2"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPlace(item);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-lg shadow-amber-500/20 group/btn cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Quick View</span>
                        </button>

                        <Link
                          href={`/destinations?query=${encodeURIComponent(item.query)}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white border border-white/20 font-bold text-xs tracking-wider uppercase transition-all duration-300"
                        >
                          <span>Explore</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ==================================================
            MOBILE HORIZONTAL SWIPE GALLERY
            ================================================== */}
        <div className="block md:hidden">
          <div
            ref={mobileScrollRef}
            onScroll={handleMobileScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 px-1 -mx-4 px-4 scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {HIDDEN_PLACES.map((item, index) => {
              const isActive = index === activeIdx;

              return (
                <div
                  key={item.id}
                  onClick={() => scrollMobileTo(index)}
                  className={cn(
                    'snap-center shrink-0 w-[85vw] max-w-[350px] min-h-[500px] rounded-3xl overflow-hidden relative flex flex-col justify-between p-6 transition-all duration-500',
                    isActive
                      ? 'border-2 border-amber-400/80 shadow-2xl shadow-stone-950/50'
                      : 'border border-stone-800 opacity-80'
                  )}
                >
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={`${item.place}, ${item.district}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                    style={{
                      filter: isActive
                        ? 'grayscale(0%) brightness(1)'
                        : 'grayscale(75%) brightness(0.75)',
                      transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/25" />

                  {/* Top Bar */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1 rounded-xl backdrop-blur-md text-xs font-bold',
                        isActive
                          ? 'bg-amber-400 text-stone-950'
                          : 'bg-black/50 text-stone-200 border border-white/20'
                      )}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.district}</span>
                    </div>

                    <span className="font-mono text-xs font-bold tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-amber-300">
                      {item.num}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-amber-400/30 text-[11px] font-bold text-amber-300">
                      <span>{item.yatriAngleEmoji}</span>
                      <span>{item.yatriAngle}</span>
                    </div>

                    <h3 className="text-2xl font-black text-white tracking-tight">
                      {item.place}
                    </h3>

                    <div className="bg-black/50 backdrop-blur-xs rounded-xl p-2.5 border border-white/10">
                      <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block mb-0.5">
                        Why feature it?
                      </span>
                      <p className="text-xs text-stone-200 leading-relaxed">
                        {item.whyFeature}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                        ⚡ {item.crowdScore}/100 Footfall
                      </span>
                      {item.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-black/60 border border-white/15 text-[9px] font-mono font-bold text-stone-300 uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlace(item);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-amber-400 text-stone-950 font-bold text-xs tracking-wider uppercase shadow-md cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick View</span>
                      </button>

                      <Link
                        href={`/destinations?query=${encodeURIComponent(item.query)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center p-2.5 rounded-full bg-stone-900 border border-white/20 text-white"
                        aria-label="Explore destination"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================================================
            FILM STRIP TRACK & INTERACTIVE CONTROLS
            ================================================== */}
        <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          {/* Subtle Drag / Swipe Hint */}
          <div
            className={cn(
              'text-[11px] font-mono tracking-widest uppercase transition-opacity duration-700 flex items-center gap-2 text-stone-500 dark:text-stone-400 font-medium',
              hasInteracted ? 'opacity-0 pointer-events-none' : 'opacity-100'
            )}
          >
            <MoveHorizontal className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span className="hidden sm:inline">← Drag or hover to explore 5 sanctuaries →</span>
            <span className="sm:hidden">Swipe to explore 5 sanctuaries →</span>
          </div>

          {/* Minimal Editorial Film Strip: 01 Chatakpur ━ 02 Gajoldoba ... */}
          <div
            className="flex items-center gap-1 sm:gap-2 mx-auto sm:mx-0 font-mono text-xs overflow-x-auto max-w-full pb-1"
            role="tablist"
            aria-label="Hidden India destination selector"
          >
            {HIDDEN_PLACES.map((item, i) => {
              const isActive = i === activeIdx;
              return (
                <React.Fragment key={`track-${item.id}`}>
                  <button
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Select ${item.place}`}
                    onClick={() => {
                      scrollMobileTo(i);
                      setActiveIdx(i);
                      setHasInteracted(true);
                    }}
                    className={cn(
                      'px-2.5 py-1.5 rounded-lg transition-all duration-300 cursor-pointer font-bold inline-flex items-center gap-1.5',
                      isActive
                        ? 'text-amber-400 scale-105 bg-amber-400/15 border border-amber-400/30'
                        : 'text-stone-400 dark:text-stone-500 hover:text-stone-200'
                    )}
                  >
                    <span>{item.num}</span>
                    <span className="hidden lg:inline text-[11px] font-sans font-semibold">
                      {item.place}
                    </span>
                  </button>

                  {i < HIDDEN_PLACES.length - 1 && (
                    <div className="w-4 sm:w-6 h-[2px] rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden shrink-0">
                      <div
                        className={cn(
                          'h-full transition-all duration-500',
                          i < activeIdx
                            ? 'w-full bg-amber-400/70'
                            : i === activeIdx
                            ? 'w-1/2 bg-amber-400'
                            : 'w-0'
                        )}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==================================================
          INTERACTIVE SANCTUARY QUICK-VIEW MODAL
          ================================================== */}
      <AnimatePresence>
        {selectedPlace && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedPlace(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedPlace.place} Details`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-stone-900 border border-stone-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto text-white"
            >
              {/* Modal Hero Image */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                <img
                  src={selectedPlace.image}
                  alt={selectedPlace.place}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-black/30" />

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedPlace(null)}
                  className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer z-10"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Badges on Hero */}
                <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-bold tracking-wide mb-2 shadow-sm">
                      <span>{selectedPlace.yatriAngleEmoji}</span>
                      <span>{selectedPlace.yatriAngle}</span>
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {selectedPlace.place}
                    </h3>
                    <p className="text-sm text-stone-300 font-medium flex items-center gap-1.5 pt-0.5">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <span>{selectedPlace.district}, West Bengal</span>
                      <span className="text-stone-500">•</span>
                      <span>{selectedPlace.elevation}</span>
                    </p>
                  </div>

                  <div className="hidden sm:block text-right">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block font-bold">
                      Crowd Density
                    </span>
                    <span className="font-mono text-xl font-black text-emerald-400">
                      {selectedPlace.crowdScore}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Why Feature It */}
                <div className="rounded-2xl p-4 bg-stone-950/60 border border-amber-400/20">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Why Feature It?
                  </h4>
                  <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-medium">
                    &ldquo;{selectedPlace.whyFeature}&rdquo;
                  </p>
                </div>

                {/* Key Highlights */}
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Sanctuary Highlights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedPlace.highlights.map((highlight, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-800/50 border border-stone-700/50 text-xs text-stone-300 leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practical Travel Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-stone-800/40 border border-stone-700/40">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-400 uppercase mb-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Best Season
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {selectedPlace.bestSeason}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-800/40 border border-stone-700/40">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-400 uppercase mb-1">
                      <CompassIcon className="w-3.5 h-3.5 text-amber-400" />
                      Route & Access
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {selectedPlace.routeInfo}
                    </p>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    href={`/destinations?query=${encodeURIComponent(selectedPlace.query)}`}
                    onClick={() => setSelectedPlace(null)}
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-amber-500/20"
                  >
                    <span>View Destination Guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/homestays"
                    onClick={() => setSelectedPlace(null)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-sm transition-all border border-stone-700"
                  >
                    <HomeIcon className="w-4 h-4 text-amber-400" />
                    <span>Browse Homestays</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
