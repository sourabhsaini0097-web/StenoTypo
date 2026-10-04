import React, { useState } from 'react';
import { ArrowUpRight, BookOpen, ChevronDown } from 'lucide-react';
import { INSIGHTS } from '../data/content';
import { InsightArticle } from '../types';

export const Insights: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="insights" className="py-20 md:py-28 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs uppercase font-mono tracking-widest text-neutral-400 mb-2">
              Engineering Journal & Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
              Perspectives on interface physics, latency, and craft.
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-400 self-start md:self-auto">
            Volume IV · 2026 Editions
          </span>
        </div>

        <div className="space-y-4">
          {INSIGHTS.map((article) => {
            const isExpanded = expandedId === article.id;
            return (
              <div
                key={article.id}
                className="p-6 sm:p-8 rounded-xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 transition-all"
              >
                <div
                  onClick={() => toggleExpand(article.id)}
                  className="cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    {/* Unboxed metadata */}
                    <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                      <span>{article.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{article.date}</span>
                      <span aria-hidden="true">·</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white font-display hover:text-neutral-200 transition-colors">
                      {article.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    aria-label={`Expand article summary for ${article.title}`}
                    className="p-2 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white self-start md:self-center transition-colors"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-neutral-800/80 animate-in fade-in duration-200">
                    <p className="text-sm text-neutral-300 leading-relaxed max-w-4xl">
                      {article.summary}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-xs font-mono text-neutral-400">
                      <span>Full transcript available via internal studio whitepaper repository.</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
