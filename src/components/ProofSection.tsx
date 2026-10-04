import React from 'react';
import { TESTIMONIALS } from '../data/content';
import { Quote } from 'lucide-react';

export const ProofSection: React.FC = () => {
  return (
    <section id="proof" className="py-20 md:py-28 border-t border-neutral-900 bg-neutral-950/60">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs uppercase font-mono tracking-widest text-neutral-400 mb-2">
            Verified Commercial Impact
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            Built for executives who evaluate code by its return on equity.
          </h2>
          <p className="mt-4 text-base text-neutral-300">
            We partner with founders, CIOs, and engineering leaders where system failure or sluggish conversion is unacceptable. Here is what they experienced.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-xl bg-neutral-900/70 border border-neutral-800 flex flex-col justify-between"
            >
              <div>
                {/* Metric pill replacement: clean unboxed typographic highlight */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800/80">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                    Documented Lift
                  </span>
                  <span className="text-sm font-bold font-mono text-white tabular-nums">
                    {t.impactMetric}
                  </span>
                </div>

                <p className="text-sm text-neutral-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Attribution */}
              <div className="mt-8 pt-4 border-t border-neutral-800/80">
                <div className="text-sm font-semibold text-white">
                  {t.author}
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  {t.role} · <span className="text-neutral-300">{t.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Operational Invariants Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-xs uppercase font-mono tracking-widest text-neutral-400 mb-4">
            Studio Operating Standards
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-lg font-bold text-white font-mono">Zero AI Slop</p>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Hand-architected component trees. No bloated unmaintained templates or generic purple gradients.
              </p>
            </div>
            <div>
              <p className="text-lg font-bold text-white font-mono">100% Type-Safe</p>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Strict TypeScript compilation with zero `any` evasions and resilient runtime schemas.
              </p>
            </div>
            <div>
              <p className="text-lg font-bold text-white font-mono">Sub-50ms TTFB</p>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Optimized edge delivery, asset compression, and clean DOM trees with zero layout thrash.
              </p>
            </div>
            <div>
              <p className="text-lg font-bold text-white font-mono">Direct IP Ownership</p>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                All source code, repository commits, and design tokens transfer immediately to your organization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
