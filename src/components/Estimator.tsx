import React, { useState } from 'react';
import { Calculator, Check, ArrowRight, ShieldCheck, Clock, Zap } from 'lucide-react';

interface ProjectTypeOption {
  id: string;
  name: string;
  basePrice: number;
  baseWeeks: number;
  description: string;
}

interface AddonModule {
  id: string;
  name: string;
  price: number;
  weeks: number;
  description: string;
}

interface EstimatorProps {
  onApplyEstimate: (summary: {
    projectType: string;
    modules: string[];
    timelineWeeks: number;
    priceRange: string;
  }) => void;
}

export const Estimator: React.FC<EstimatorProps> = ({ onApplyEstimate }) => {
  const projectTypes: ProjectTypeOption[] = [
    {
      id: 'webapp',
      name: 'Custom Web Application',
      basePrice: 22000,
      baseWeeks: 6,
      description: 'End-to-end full-stack web software, auth systems, responsive interfaces, and API integrations.',
    },
    {
      id: 'marketing',
      name: 'Flagship Brand Platform',
      basePrice: 15000,
      baseWeeks: 4,
      description: 'Bespoke corporate showcase, conversion funnels, custom typography, and high-fidelity media.',
    },
    {
      id: 'designsystem',
      name: 'Design System & Token Architecture',
      basePrice: 12000,
      baseWeeks: 4,
      description: 'Production component library, Figma-to-code tokens, WCAG AA compliance, and living docs.',
    },
    {
      id: 'commerce',
      name: 'Flagship Digital Commerce',
      basePrice: 18000,
      baseWeeks: 5,
      description: 'Direct-to-consumer store with customized product storytelling, payment gateway, and cart.',
    },
  ];

  const modules: AddonModule[] = [
    {
      id: 'telemetry',
      name: 'Real-Time Telemetry & WebSockets',
      price: 4500,
      weeks: 1.5,
      description: 'Sub-50ms data streaming, live charts, and synchronization.',
    },
    {
      id: 'cms',
      name: 'Headless CMS & Content Pipeline',
      price: 2800,
      weeks: 1,
      description: 'Structured content modeling, multi-editor workflow, and preview builds.',
    },
    {
      id: 'visualizer',
      name: 'Interactive Canvas / 2D Simulation',
      price: 5200,
      weeks: 2,
      description: 'Custom hardware simulator or interactive mathematical model.',
    },
    {
      id: 'audit',
      name: 'Hardened Security & Performance Audit',
      price: 2500,
      weeks: 0.5,
      description: 'Penetration review, CSP enforcement, and Core Web Vitals optimization.',
    },
  ];

  const [selectedType, setSelectedType] = useState<string>('webapp');
  const [selectedModules, setSelectedModules] = useState<string[]>(['telemetry']);
  const [isAccelerated, setIsAccelerated] = useState<boolean>(false);

  const toggleModule = (id: string) => {
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const currentType = projectTypes.find((t) => t.id === selectedType) || projectTypes[0];
  const activeAddons = modules.filter((m) => selectedModules.includes(m.id));

  const totalBasePrice = currentType.basePrice + activeAddons.reduce((acc, m) => acc + m.price, 0);
  const multiplier = isAccelerated ? 1.25 : 1.0;
  const calculatedPrice = Math.round(totalBasePrice * multiplier);
  const minPrice = Math.round(calculatedPrice * 0.95);
  const maxPrice = Math.round(calculatedPrice * 1.12);

  const rawWeeks = currentType.baseWeeks + activeAddons.reduce((acc, m) => acc + m.weeks, 0);
  const calculatedWeeks = isAccelerated ? Math.max(3, Math.round(rawWeeks * 0.7)) : Math.ceil(rawWeeks);

  const priceRangeFormatted = `$${(minPrice / 1000).toFixed(1)}k – $${(maxPrice / 1000).toFixed(1)}k`;

  const handleApply = () => {
    onApplyEstimate({
      projectType: currentType.name,
      modules: activeAddons.map((m) => m.name),
      timelineWeeks: calculatedWeeks,
      priceRange: priceRangeFormatted,
    });
  };

  return (
    <section id="estimator" className="py-20 md:py-28 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs uppercase font-mono tracking-widest text-neutral-400 mb-2">
            Scope & Investment Calculator
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            Transparent engineering estimates. No hidden scope creep.
          </h2>
          <p className="mt-4 text-base text-neutral-300">
            Configure your technical requirements to generate an instant baseline timeline and investment budget.
          </p>
        </div>

        {/* Calculator Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Project Archetype */}
            <div>
              <label className="text-xs uppercase font-mono tracking-wider text-neutral-400 block mb-3">
                01. Core Architecture Blueprint
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projectTypes.map((type) => {
                  const isSelected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'bg-neutral-900 border-neutral-600 shadow-sm'
                          : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-white">{type.name}</span>
                        <span className="text-xs font-mono text-neutral-400 tabular-nums">
                          ${(type.basePrice / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {type.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: System Addons */}
            <div>
              <label className="text-xs uppercase font-mono tracking-wider text-neutral-400 block mb-3">
                02. Specialized Architecture Modules
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {modules.map((mod) => {
                  const isChecked = selectedModules.includes(mod.id);
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => toggleModule(mod.id)}
                      className={`p-4 rounded-lg border text-left flex items-start gap-3 transition-all ${
                        isChecked
                          ? 'bg-neutral-900 border-neutral-600'
                          : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                          isChecked
                            ? 'bg-white border-white text-neutral-950'
                            : 'border-neutral-700 bg-neutral-950'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white truncate">
                            {mod.name}
                          </span>
                          <span className="text-xs font-mono text-neutral-400 shrink-0 ml-2 tabular-nums">
                            +${(mod.price / 1000).toFixed(1)}k
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                          {mod.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Pace & Timeline */}
            <div>
              <label className="text-xs uppercase font-mono tracking-wider text-neutral-400 block mb-3">
                03. Delivery Cadence
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsAccelerated(false)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    !isAccelerated
                      ? 'bg-neutral-900 border-neutral-600'
                      : 'bg-neutral-900/40 border-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-white mb-1">
                    <Clock className="w-4 h-4 text-neutral-400" />
                    <span>Standard Studio Cadence</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Thorough milestone pacing with weekly design & engineering syncs.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAccelerated(true)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    isAccelerated
                      ? 'bg-neutral-900 border-neutral-600'
                      : 'bg-neutral-900/40 border-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-white mb-1">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Accelerated Fast-Track</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Dedicated dual-engineer pod to ship up to 35% faster (+25% sprint rate).
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Summary Card (Sticky) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="p-6 sm:p-8 rounded-xl bg-neutral-900 border border-neutral-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-neutral-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                    Calculated Estimation
                  </span>
                </div>
                <span className="text-xs text-neutral-500 font-mono">USD Net</span>
              </div>

              {/* Price & Timeline Headline */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-neutral-400 block">Estimated Investment Budget</span>
                  <div className="text-3xl sm:text-4xl font-bold font-mono text-white tracking-tight tabular-nums mt-1">
                    {priceRangeFormatted}
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-3 border-t border-neutral-800/80">
                  <div>
                    <span className="text-xs text-neutral-400 block">Estimated Timeline</span>
                    <span className="text-lg font-semibold font-mono text-white tabular-nums">
                      ~{calculatedWeeks} Weeks
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block">Deliverable Format</span>
                    <span className="text-lg font-semibold font-mono text-white">
                      Full IP Transfer
                    </span>
                  </div>
                </div>
              </div>

              {/* Scope Breakdown */}
              <div className="space-y-2 pt-4 border-t border-neutral-800 text-xs">
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="text-neutral-400">Core Architecture:</span>
                  <span className="font-semibold text-white">{currentType.name}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="text-neutral-400">Add-on Modules:</span>
                  <span className="text-neutral-300 font-mono">{activeAddons.length} selected</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="text-neutral-400">Pacing:</span>
                  <span className="text-neutral-300 font-mono">{isAccelerated ? 'Fast-Track Sprint' : 'Standard Cadence'}</span>
                </div>
              </div>

              {/* Guarantee */}
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-950 border border-neutral-800/80 text-xs text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Fixed-bid milestone contracts with milestone signoffs. Zero hidden overage fees.</span>
              </div>

              {/* Apply / Pre-populate CTA */}
              <button
                type="button"
                onClick={handleApply}
                className="w-full py-3 px-4 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-md transition-colors flex items-center justify-center gap-2 group"
              >
                <span>Populate Project Inquiry</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
