import React, { useEffect } from 'react';
import { X, ArrowUpRight, CheckCircle2, Cpu, Layers } from 'lucide-react';
import { CaseStudy } from '../types';

interface CaseStudyModalProps {
  caseStudy: CaseStudy | null;
  onClose: () => void;
  onSelectForInquiry: (projectName: string) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  caseStudy,
  onClose,
  onSelectForInquiry,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (caseStudy) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [caseStudy, onClose]);

  if (!caseStudy) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/95 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span>Case Study</span>
            <span aria-hidden="true">·</span>
            <span>{caseStudy.client}</span>
            <span aria-hidden="true">·</span>
            <span>{caseStudy.year}</span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close case study details"
            className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Main Title & Role */}
          <div>
            <h2 id="case-study-modal-title" className="text-2xl sm:text-3xl font-bold font-display text-white">
              {caseStudy.title}
            </h2>
            <p className="mt-2 text-sm text-neutral-400 font-mono">
              Role: {caseStudy.role}
            </p>
          </div>

          {/* Media preview */}
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950">
            <img
              src={caseStudy.image}
              alt={caseStudy.title}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Key Metric Spotlight */}
          <div className="p-6 rounded-lg bg-neutral-950 border border-neutral-800">
            <p className="text-xs uppercase font-mono tracking-wider text-neutral-400">Marquee Outcome</p>
            <p className="text-3xl sm:text-4xl font-bold font-mono text-white mt-1.5 tabular-nums">
              {caseStudy.headlineMetric}
            </p>
            <p className="text-sm text-neutral-400 mt-1">
              {caseStudy.headlineMetricContext}
            </p>
          </div>

          {/* Narrative Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-base font-semibold text-white mb-2">The Operational Challenge</h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {caseStudy.challenge}
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-2">Our Engineering Solution</h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {caseStudy.solution}
              </p>
            </div>
          </div>

          {/* Quantified Results */}
          <div>
            <h3 className="text-base font-semibold text-white mb-4">Quantified Impact Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {caseStudy.results.map((res, i) => (
                <div key={i} className="p-4 rounded-md bg-neutral-950/60 border border-neutral-800/80">
                  <p className="text-2xl font-bold font-mono text-white tabular-nums">{res.metric}</p>
                  <p className="text-xs text-neutral-400 mt-1">{res.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack & Deliverables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-neutral-800">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <Cpu className="w-4 h-4 text-neutral-400" />
                <span>Production Stack</span>
              </div>
              <ul className="space-y-1.5 text-xs text-neutral-300 font-mono">
                {caseStudy.techStack.map((tech, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-neutral-500">›</span>
                    <span>{tech}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <Layers className="w-4 h-4 text-neutral-400" />
                <span>Delivered Systems</span>
              </div>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                {caseStudy.deliverables.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-400">
              Inspired by this architecture? We can engineer a comparable solution for your team.
            </p>
            <button
              onClick={() => {
                onSelectForInquiry(caseStudy.title);
                onClose();
              }}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-md transition-colors whitespace-nowrap flex items-center justify-center gap-2"
            >
              <span>Request Project Architecture Brief</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
