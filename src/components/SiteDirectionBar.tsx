import React, { useState } from 'react';
import { Palette, Sparkles, HelpCircle, X, ArrowRight, Layout, Check } from 'lucide-react';
import { ThemeMode } from '../types';

interface SiteDirectionBarProps {
  theme: ThemeMode;
  onThemeChange: (t: ThemeMode) => void;
  onSelectConcept: (concept: string) => void;
}

export const SiteDirectionBar: React.FC<SiteDirectionBarProps> = ({
  theme,
  onThemeChange,
  onSelectConcept,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const concepts = [
    {
      title: 'Digital Agency & Engineering Studio',
      description: 'High-craft services, technical capabilities, case studies with quantifiable outcomes, and interactive project budget estimator.',
      status: 'Active Preview',
      isCurrent: true,
    },
    {
      title: 'SaaS & Enterprise Product Platform',
      description: 'Feature matrix, interactive pricing tiers, developer docs showcase, API latency benchmarks, and self-serve onboarding.',
      status: 'Ready to Transform',
      isCurrent: false,
    },
    {
      title: 'Executive Portfolio & Case Studies',
      description: 'Curated creative leadership, design systems leadership, interactive prototype showreel, and advisory booking.',
      status: 'Ready to Transform',
      isCurrent: false,
    },
    {
      title: 'High-End E-Commerce & Product Drop',
      description: 'Visual product configurator, direct checkout funnels, inventory allocation, and brand narrative.',
      status: 'Ready to Transform',
      isCurrent: false,
    },
  ];

  return (
    <>
      {/* Floating Minimalist Utility Indicator */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-2.5 bg-neutral-900/90 hover:bg-neutral-800 text-white text-xs font-mono font-medium rounded-full shadow-lg border border-neutral-700/80 backdrop-blur-md transition-all hover:scale-105"
        >
          <Layout className="w-3.5 h-3.5 text-neutral-300" />
          <span>Customize Website Concept</span>
        </button>
      </div>

      {/* Slide-over Drawer */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md h-full bg-neutral-900 border-l border-neutral-800 p-6 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div>
                  <h3 className="text-base font-bold font-display text-white">
                    Website Customization Guide
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5 font-mono">
                    Explore different website styles & tell the AI what you need
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Theme Selector */}
              <div>
                <label className="text-xs uppercase font-mono tracking-wider text-neutral-400 block mb-3">
                  Aesthetic Theme Palette
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onThemeChange('obsidian')}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      theme === 'obsidian'
                        ? 'bg-neutral-950 border-neutral-400 text-white ring-1 ring-neutral-400'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-black border border-neutral-700 mb-2" />
                    <p className="text-xs font-semibold">Obsidian</p>
                    <p className="text-[10px] text-neutral-500 font-mono">Jet Black</p>
                  </button>

                  <button
                    onClick={() => onThemeChange('slate')}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      theme === 'slate'
                        ? 'bg-slate-900 border-sky-400 text-white ring-1 ring-sky-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-700 mb-2" />
                    <p className="text-xs font-semibold">Slate</p>
                    <p className="text-[10px] text-slate-500 font-mono">Cool Navy</p>
                  </button>

                  <button
                    onClick={() => onThemeChange('cream')}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      theme === 'cream'
                        ? 'bg-[#1a1917] border-amber-300 text-white ring-1 ring-amber-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-[#e8e4d8] border border-amber-200 mb-2" />
                    <p className="text-xs font-semibold">Cream</p>
                    <p className="text-[10px] text-neutral-500 font-mono">Editorial</p>
                  </button>
                </div>
              </div>

              {/* Website Archetypes */}
              <div>
                <label className="text-xs uppercase font-mono tracking-wider text-neutral-400 block mb-3">
                  Website Archetypes You Can Ask For
                </label>
                <div className="space-y-3">
                  {concepts.map((c, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg border transition-all ${
                        c.isCurrent
                          ? 'bg-neutral-950 border-neutral-700'
                          : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white">{c.title}</span>
                        {c.isCurrent ? (
                          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              onSelectConcept(c.title);
                              setIsOpen(false);
                            }}
                            className="text-[10px] font-mono text-neutral-400 hover:text-white underline underline-offset-2"
                          >
                            Explore brief
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                        {c.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Prompt Ideas for the User */}
              <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 space-y-2">
                <p className="font-semibold text-white font-display">Have a specific website in mind?</p>
                <p className="text-neutral-400 leading-relaxed">
                  Reply to the chat and tell me:
                </p>
                <ul className="space-y-1 list-disc list-inside text-neutral-300 font-mono text-[11px]">
                  <li>Your industry (e.g. AI startup, architecture firm, doctor clinic, restaurant, portfolio)</li>
                  <li>Preferred pages/features (e.g. blog, booking, shop)</li>
                  <li>Any branding, colors, or copy preferences</li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-800">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-md transition-colors"
              >
                Close Drawer & Explore Site
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
