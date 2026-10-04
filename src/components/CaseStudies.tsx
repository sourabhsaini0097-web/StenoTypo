import React, { useState } from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { CASE_STUDIES } from '../data/content';
import { CaseStudy, ProjectCategory } from '../types';

interface CaseStudiesProps {
  onSelectCaseStudy: (study: CaseStudy) => void;
}

export const CaseStudies: React.FC<CaseStudiesProps> = ({ onSelectCaseStudy }) => {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');

  const filteredStudies = activeFilter === 'all'
    ? CASE_STUDIES
    : CASE_STUDIES.filter((item) => item.category === activeFilter);

  const filters: { key: ProjectCategory; label: string }[] = [
    { key: 'all', label: 'All Projects' },
    { key: 'fintech', label: 'Fintech & Capital' },
    { key: 'industrial', label: 'Hardware & Industrial' },
    { key: 'systems', label: 'Enterprise Systems' },
  ];

  return (
    <section id="work" className="py-20 md:py-28 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs uppercase font-mono tracking-widest text-neutral-400 mb-2">
              Selected Works · 2025–2026
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
              Production systems designed for measurable commercial leverage.
            </h2>
          </div>

          {/* Interactive filter tabs (functional buttons, clean segmented look) */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-lg self-start md:self-auto overflow-x-auto max-w-full">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeFilter === f.key
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {filteredStudies.map((study, idx) => {
            const isFeatured = idx === 0;
            return (
              <div
                key={study.id}
                onClick={() => onSelectCaseStudy(study)}
                className={`group cursor-pointer rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                  isFeatured ? 'lg:col-span-12 xl:grid xl:grid-cols-12 xl:gap-8' : 'lg:col-span-6'
                }`}
              >
                {/* Visual Asset Container */}
                <div
                  className={`relative overflow-hidden bg-neutral-950 ${
                    isFeatured ? 'xl:col-span-7 aspect-[16/10]' : 'aspect-[16/10]'
                  }`}
                >
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover object-center filter brightness-[0.9] transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* Corner affordance indicator */}
                  <div className="absolute top-4 right-4 p-2 rounded-md bg-neutral-950/70 border border-neutral-800 text-neutral-300 group-hover:text-white group-hover:border-neutral-700 transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Content Container */}
                <div
                  className={`p-6 sm:p-8 flex flex-col justify-between ${
                    isFeatured ? 'xl:col-span-5' : ''
                  }`}
                >
                  <div>
                    {/* Unboxed metadata discipline */}
                    <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-3">
                      <span>{study.categoryLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{study.year}</span>
                      <span aria-hidden="true">·</span>
                      <span>{study.client}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-neutral-200 transition-colors leading-snug">
                      {study.title}
                    </h3>

                    <p className="mt-3 text-sm text-neutral-300 leading-relaxed line-clamp-3">
                      {study.summary}
                    </p>
                  </div>

                  {/* Quantified Outcome Footer */}
                  <div className="mt-6 pt-6 border-t border-neutral-800/80 flex items-end justify-between">
                    <div>
                      <p className="text-xs uppercase font-mono tracking-wider text-neutral-500">
                        Primary Impact
                      </p>
                      <p className="text-lg sm:text-xl font-bold font-mono text-white mt-1 tabular-nums">
                        {study.headlineMetric}
                      </p>
                    </div>

                    <span className="text-xs font-medium text-neutral-400 group-hover:text-white flex items-center gap-1 transition-colors">
                      <span>View Specifications</span>
                      <span className="text-neutral-500">→</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
