import React from 'react';
import { ArrowUpRight, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { ASSETS } from '../data/content';

interface HeroProps {
  onOpenInquiry: () => void;
  onScrollToEstimator: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenInquiry, onScrollToEstimator }) => {
  return (
    <section id="top" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Editorial Sub-lead (unboxed, no pill badges) */}
        <div className="mb-6 flex items-center gap-3 text-xs md:text-sm tracking-wide text-neutral-400 font-mono">
          <span>Digital Architecture & Systems</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>Bespoke Engineering</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>Tokyo / Zurich / San Francisco</span>
        </div>

        {/* Primary Headline with text-wrap: balance */}
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] font-display [text-wrap:balance]">
            We engineer uncompromising web platforms for high-consequence industries.
          </h1>
          <p className="mt-8 text-lg sm:text-xl text-neutral-300 max-w-2xl font-normal leading-relaxed">
            From sub-50ms institutional fintech consoles to flagship industrial hardware experiences, we build resilient, high-craft web systems with zero boilerplate and total aesthetic discipline.
          </p>
        </div>

        {/* Action Row */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            onClick={onOpenInquiry}
            className="px-6 py-3.5 text-sm font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-md transition-all flex items-center gap-2 group whitespace-nowrap"
          >
            <span>Initiate Project</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          <button
            onClick={onScrollToEstimator}
            className="px-6 py-3.5 text-sm font-medium text-neutral-300 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 rounded-md transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <SlidersHorizontal className="w-4 h-4 text-neutral-400" />
            <span>Interactive Scope & Budget Tool</span>
          </button>
        </div>

        {/* Hero Visual Anchor: 16:9 Architectural Studio Perspective */}
        <div className="mt-14 relative rounded-xl overflow-hidden border border-neutral-800/80 bg-neutral-900 group">
          <div className="aspect-[16/9] w-full relative">
            <img
              src={ASSETS.hero}
              alt="Vanguard Digital Studio architectural engineering space"
              className="w-full h-full object-cover object-center filter saturate-[0.9] brightness-[0.88] transition-transform duration-700 group-hover:scale-[1.01]"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Zero broken image policy: fallback gracefully
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Measured contrast scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent pointer-events-none" />

            {/* In-image caption overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">Studio Focus</p>
                <p className="text-sm sm:text-base font-semibold text-white mt-1">
                  Precision Systems, Micro-Latencies & Scalable Brand Systems
                </p>
              </div>
              <div className="text-xs text-neutral-400 font-mono">
                Active Client Cohort · Q3–Q4 2026
              </div>
            </div>
          </div>
        </div>

        {/* Quantitative Proof Adjacency Banner */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-neutral-900">
          <div>
            <p className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white tabular-nums">
              42ms
            </p>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-400 font-normal">
              Median Time-to-Interactive
            </p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white tabular-nums">
              +182%
            </p>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-400 font-normal">
              Institutional Conversion Lift
            </p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white tabular-nums">
              $18.4M+
            </p>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-400 font-normal">
              Client Volume Processed
            </p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white tabular-nums">
              100%
            </p>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-400 font-normal">
              On-Schedule Production Delivery
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
