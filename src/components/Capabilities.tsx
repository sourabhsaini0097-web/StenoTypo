import React, { useState } from 'react';
import { ArrowRight, Check, Code, Layers, Sparkles } from 'lucide-react';
import { CAPABILITIES } from '../data/content';

interface CapabilitiesProps {
  onSelectServiceForInquiry: (serviceName: string) => void;
}

export const Capabilities: React.FC<CapabilitiesProps> = ({ onSelectServiceForInquiry }) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const activeCap = CAPABILITIES[selectedIdx];

  return (
    <section id="capabilities" className="py-20 md:py-28 border-t border-neutral-900 bg-neutral-950/40">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs uppercase font-mono tracking-widest text-neutral-400 mb-2">
            Capabilities & Disciplines
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            Integrated engineering and design from day zero.
          </h2>
          <p className="mt-4 text-base text-neutral-300 leading-relaxed">
            We don't hand off static mockups for engineers to decipher. Design systems, backend architectures, and interaction physics are conceived and built as unified software units.
          </p>
        </div>

        {/* Capabilities Layout: Left Navigation + Right Detailed Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Numbered Selector */}
          <div className="lg:col-span-5 space-y-3">
            {CAPABILITIES.map((cap, i) => {
              const isSelected = i === selectedIdx;
              return (
                <div
                  key={cap.index}
                  onClick={() => setSelectedIdx(i)}
                  className={`p-5 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-neutral-900 border-neutral-700 shadow-md'
                      : 'bg-neutral-900/40 border-neutral-800/80 hover:bg-neutral-900/70 hover:border-neutral-700/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-neutral-400">
                      {cap.index}
                    </span>
                    <span className="text-xs font-mono text-neutral-500">
                      {cap.timeline}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-2 font-display">
                    {cap.title}
                  </h3>

                  <p className="text-xs text-neutral-400 mt-1.5 line-clamp-2">
                    {cap.lead}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Deep-Dive Panel */}
          <div className="lg:col-span-7 bg-neutral-900/70 border border-neutral-800 rounded-xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  Discipline {activeCap.index}
                </span>
                <h3 className="text-2xl font-bold font-display text-white mt-1">
                  {activeCap.title}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-neutral-400 block">Typical Sprint</span>
                <span className="text-sm font-semibold font-mono text-white tabular-nums">
                  {activeCap.timeline}
                </span>
              </div>
            </div>

            <div className="py-6 space-y-6">
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                {activeCap.description}
              </p>

              <div>
                <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-400 mb-3">
                  Scope of Deliverables
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeCap.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
                      <Check className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-neutral-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-400 mb-3">
                  Core Technologies & Standards
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeCap.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs font-mono text-neutral-300 bg-neutral-950 border border-neutral-800 rounded-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-mono">
                Standard NDA & IP Transfer Included
              </span>
              <button
                onClick={() => onSelectServiceForInquiry(activeCap.title)}
                className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-md transition-colors flex items-center gap-2"
              >
                <span>Scope This Discipline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
