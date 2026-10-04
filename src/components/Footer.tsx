import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-900 bg-neutral-950 text-neutral-400 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-900">
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-4">
            <span className="text-xl font-bold font-display text-white tracking-tight">
              Vanguard
            </span>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Bespoke digital architecture, design engineering, and mission-critical web platforms for high-leverage enterprises.
            </p>
            <div className="text-xs font-mono text-neutral-500">
              Operating out of Tokyo · Zurich · San Francisco
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            <div>
              <p className="font-mono uppercase tracking-wider text-neutral-300 font-semibold mb-3">
                Index
              </p>
              <ul className="space-y-2">
                <li><a href="#work" className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a></li>
                <li><a href="#proof" className="hover:text-white transition-colors">Verified Impact</a></li>
                <li><a href="#estimator" className="hover:text-white transition-colors">Scope Estimator</a></li>
                <li><a href="#insights" className="hover:text-white transition-colors">Engineering Journal</a></li>
              </ul>
            </div>

            <div>
              <p className="font-mono uppercase tracking-wider text-neutral-300 font-semibold mb-3">
                Standards
              </p>
              <ul className="space-y-2">
                <li className="text-neutral-500">WCAG 2.1 AA Certified</li>
                <li className="text-neutral-500">Sub-50ms TTFB Baseline</li>
                <li className="text-neutral-500">Full IP Assignment</li>
                <li className="text-neutral-500">Two-Way Mutual NDA</li>
              </ul>
            </div>

            <div>
              <p className="font-mono uppercase tracking-wider text-neutral-300 font-semibold mb-3">
                Communications
              </p>
              <ul className="space-y-2">
                <li><a href="#contact" className="hover:text-white transition-colors">Project Briefing</a></li>
                <li className="text-neutral-500">Client Portal (Private)</li>
                <li className="text-neutral-500">Security Inquiries</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quiet Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <p>© {new Date().getFullYear()} Vanguard Digital Systems LLC. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-white transition-colors py-1 px-2 rounded hover:bg-neutral-900"
          >
            <span>Top of System</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
