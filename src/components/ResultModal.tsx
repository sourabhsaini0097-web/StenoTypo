import React, { useState } from 'react';
import { TestResult } from '../types/steno';
import { X, CheckCircle, AlertTriangle, Printer, RotateCcw, Award, Info, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface ResultModalProps {
  result: TestResult | null;
  onClose: () => void;
  onRetakeTest?: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ result, onClose, onRetakeTest }) => {
  const [filterMode, setFilterMode] = useState<'all' | 'mistakesOnly'>('all');
  const [showGuidelines, setShowGuidelines] = useState(false);

  if (!result) return null;

  const handlePrint = () => {
    window.print();
  };

  const visibleDiff = filterMode === 'mistakesOnly'
    ? result.diffAnalysis.filter((d) => d.status !== 'correct' || d.mistakeType === 'ignored')
    : result.diffAnalysis;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-emerald-950/40 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white border border-emerald-200 rounded-2xl shadow-2xl text-slate-800 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-100 bg-emerald-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Official Performance & Evaluation Scorecard
              </h2>
              <p className="text-xs text-emerald-800 font-mono">
                {result.testTitle} · {result.language.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGuidelines(!showGuidelines)}
              className="px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
              title="View Official Evaluation Rules"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Evaluation Rules</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2 text-slate-500 hover:text-emerald-800 rounded-lg hover:bg-emerald-100/60 transition-colors"
              title="Print Scorecard"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-emerald-100/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-[#fbfdfc]">
          {/* Candidate & Pass/Fail Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl bg-emerald-50/50 border border-emerald-200 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-semibold">Candidate</span>
              <p className="text-lg font-bold text-slate-900">{result.studentName}</p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Email: {result.studentEmail} · Date: {new Date(result.submittedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {/* Qualification outcome */}
            <div
              className={`px-5 py-3 rounded-lg border flex items-center gap-3 ${
                result.passed
                  ? 'bg-emerald-100/90 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {result.passed ? (
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
              )}
              <div>
                <p className="text-sm font-bold uppercase tracking-wider">
                  {result.passed ? 'QUALIFIED / PASSED' : 'NEEDS IMPROVEMENT'}
                </p>
                <p className="text-xs opacity-90">
                  {result.passed
                    ? 'Met SSC Steno error allowance criteria (≤ 7%)'
                    : 'Mistake percentage exceeded standard allowance (> 7%)'}
                </p>
              </div>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-xs">
              <span className="text-xs font-mono uppercase text-slate-500 font-medium">Net Speed</span>
              <p className="text-3xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
                {result.netWpm} <span className="text-sm font-normal text-slate-500">WPM</span>
              </p>
              <span className="text-[11px] text-slate-400 font-mono">Gross: {result.grossWpm} WPM</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-xs">
              <span className="text-xs font-mono uppercase text-slate-500 font-medium">Accuracy</span>
              <p className="text-3xl font-bold font-mono text-teal-700 mt-1 tabular-nums">
                {result.accuracy}%
              </p>
              <span className="text-[11px] text-slate-400 font-mono">
                {result.correctWords}/{result.totalWordsMaster} Words
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-xs">
              <span className="text-xs font-mono uppercase text-slate-500 font-medium">Total Mistakes</span>
              <p className="text-3xl font-bold font-mono text-amber-600 mt-1 tabular-nums">
                {result.totalMistakes}
              </p>
              <span className="text-[11px] text-slate-400 font-mono">
                Full: {result.fullMistakes} · Half: {result.halfMistakes} (×0.5)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-xs">
              <span className="text-xs font-mono uppercase text-slate-500 font-medium">Mistake Rate</span>
              <p className="text-3xl font-bold font-mono text-rose-600 mt-1 tabular-nums">
                {result.mistakePercentage}%
              </p>
              <span className="text-[11px] text-slate-400 font-mono">
                Backspaces: {result.backspaceCount}
              </span>
            </div>
          </div>

          {/* Official SSC/Court Mistakes Breakdown Banner */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-slate-700 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 pb-2">
              <span className="font-bold text-slate-900 font-display">
                Official Mistake Calculation Formula:
              </span>
              <span className="font-mono text-emerald-900 font-bold bg-white px-2.5 py-0.5 rounded border border-emerald-300">
                Total Mistakes = {result.fullMistakes} Full + ({result.halfMistakes} Half × 0.5) = {result.totalMistakes}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <span className="font-semibold text-rose-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Full Mistakes ({result.fullMistakes} count):
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Omissions, substitutions, additions of words, capital letter errors inside sentence, and missing spaces between words.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-amber-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Half Mistakes ({result.halfMistakes} count = {result.halfMistakes * 0.5} deduction):
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Singular/plural noun mismatch and small letter used at the beginning of sentence.
                </p>
              </div>
            </div>
          </div>

          {/* Collapsible Official Guidelines Panel (from user uploaded rules) */}
          {showGuidelines && (
            <div className="p-5 rounded-xl bg-white border-2 border-emerald-300 shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  Official SSC Steno & Court Evaluation Rules Reference
                </h4>
                <button
                  onClick={() => setShowGuidelines(false)}
                  className="text-xs text-slate-400 hover:text-slate-700"
                >
                  Hide
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Full Mistakes */}
                <div className="p-3.5 rounded-lg bg-rose-50/50 border border-rose-200 space-y-2">
                  <h5 className="font-bold text-rose-800 uppercase tracking-wider text-[11px]">
                    Full Mistakes (1.0 Mistake Each):
                  </h5>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-700 text-[11px] leading-relaxed">
                    <li>Every <strong>Omission</strong> of a word or figure.</li>
                    <li>Every <strong>Substitution</strong> of a word or figure in place of dictated text.</li>
                    <li>Every <strong>Addition</strong> of a word/figure not in the passage.</li>
                    <li>Wrong use of <strong>capital letter for small letter and vice-versa</strong>.</li>
                    <li>Where there is <strong>no space between two words</strong>.</li>
                    <li>Undesired space between a word and Full Stop(.) counts as 1 mistake.</li>
                  </ol>
                </div>

                {/* Half Mistakes & Notes */}
                <div className="p-3.5 rounded-lg bg-amber-50/50 border border-amber-200 space-y-2">
                  <h5 className="font-bold text-amber-800 uppercase tracking-wider text-[11px]">
                    Half-Mistakes (0.5 Mistake Each):
                  </h5>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-700 text-[11px] leading-relaxed">
                    <li>Using <strong>singular or plural noun and vice versa</strong> (e.g. boy/boys, लड़का/लड़के).</li>
                    <li>Using of <strong>small letter at the beginning of sentence</strong>.</li>
                  </ol>

                  <h5 className="font-bold text-emerald-800 uppercase tracking-wider text-[11px] pt-1">
                    Ignored / No Mistake (Permitted):
                  </h5>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-600 text-[11px] leading-relaxed">
                    <li>चंद्रबिंदु की जगह बिंदु या बिंदु की जगह चंद्रबिंदु (चांद/चाँद, हूँ/हूं).</li>
                    <li>हिन्दी में दो शब्दों के बीच लगे हाइफन (विचार-विमर्श, काम-काज).</li>
                    <li>Equivalent symbols: % (Percent), & (and), ₹ (Rs./Rupees), v/s (Versus), u/s (Under Section).</li>
                    <li>Date formatting variations: 04 July, 1990 or 04/07/1990 or 04.07.1990.</li>
                    <li>Paragraph indenting spaces.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Word by Word Diff Analysis */}
          <div className="p-5 rounded-xl bg-white border border-emerald-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Word-by-Word Diff Evaluation</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs mt-1">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Correct
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-600 font-medium">
                    <span className="w-2.5 h-2.5 rounded bg-rose-500" /> Full Mistake (1.0)
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500" /> Half Mistake (0.5)
                  </span>
                  <span className="flex items-center gap-1.5 text-teal-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded bg-teal-500" /> Accepted Equivalent
                  </span>
                </div>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-1 p-0.5 bg-emerald-50/80 rounded-lg border border-emerald-200 text-xs">
                <button
                  type="button"
                  onClick={() => setFilterMode('all')}
                  className={`px-3 py-1 rounded transition-colors ${
                    filterMode === 'all'
                      ? 'bg-emerald-600 text-white font-medium shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Words
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('mistakesOnly')}
                  className={`px-3 py-1 rounded transition-colors ${
                    filterMode === 'mistakesOnly'
                      ? 'bg-emerald-600 text-white font-medium shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Mistakes Only ({result.fullMistakes + result.halfMistakes})
                </button>
              </div>
            </div>

            {/* Render diff words */}
            <div className="p-4 rounded-lg bg-emerald-50/30 border border-emerald-100 max-h-64 overflow-y-auto font-sans leading-relaxed text-sm">
              {visibleDiff.length === 0 ? (
                <p className="text-slate-500 italic text-xs">No errors found in this passage! Flawless execution.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {visibleDiff.map((item, idx) => {
                    // Accepted equivalent (Chandrabindu / Hyphen / Symbol)
                    if (item.mistakeType === 'ignored') {
                      return (
                        <span
                          key={idx}
                          title={item.mistakeReason || 'Accepted Equivalent'}
                          className="px-1.5 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-800 font-medium inline-flex items-center gap-1 text-xs"
                        >
                          <span>{item.typed || item.expected}</span>
                          <span className="text-[10px] text-teal-600 bg-teal-100/80 px-1 rounded font-mono">
                            ✓ Equivalent
                          </span>
                        </span>
                      );
                    }

                    // Exact correct
                    if (item.status === 'correct') {
                      return (
                        <span
                          key={idx}
                          className="text-emerald-800 px-1.5 py-0.5 rounded bg-emerald-100/70 border border-emerald-200"
                        >
                          {item.expected}
                        </span>
                      );
                    }

                    // Half mistake (0.5)
                    if (item.isHalfMistake || item.mistakeType === 'half') {
                      return (
                        <span
                          key={idx}
                          title={item.mistakeReason || 'Half Mistake (0.5 mark deduction)'}
                          className="px-1.5 py-0.5 rounded bg-amber-50 border border-amber-300 text-amber-900 font-medium inline-flex items-center gap-1 text-xs"
                        >
                          <span className="line-through text-amber-500">{item.typed}</span>
                          <span className="font-bold text-amber-800">{item.expected}</span>
                          <span className="text-[10px] bg-amber-200 text-amber-800 px-1 rounded font-mono font-bold">
                            ½
                          </span>
                        </span>
                      );
                    }

                    // Full mistake wrong / substitution
                    if (item.status === 'wrong') {
                      return (
                        <span
                          key={idx}
                          title={item.mistakeReason || `Full Mistake: Expected "${item.expected}" | Typed "${item.typed}"`}
                          className="px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-800 font-medium inline-flex items-center gap-1 text-xs"
                        >
                          <span className="line-through text-rose-400">{item.typed}</span>
                          <span className="text-emerald-700 font-bold">{item.expected}</span>
                          <span className="text-[10px] bg-rose-200 text-rose-800 px-1 rounded font-mono font-bold">
                            1.0
                          </span>
                        </span>
                      );
                    }

                    // Omission (missing word)
                    if (item.status === 'missing') {
                      return (
                        <span
                          key={idx}
                          title={item.mistakeReason || 'Full Mistake: Omission of word'}
                          className="px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 font-medium line-through text-xs inline-flex items-center gap-1"
                        >
                          <span>[{item.expected}]</span>
                          <span className="text-[10px] bg-rose-200 text-rose-800 px-1 rounded font-mono font-bold no-underline">
                            Omitted
                          </span>
                        </span>
                      );
                    }

                    // Extra addition
                    if (item.status === 'extra') {
                      return (
                        <span
                          key={idx}
                          title={item.mistakeReason || 'Full Mistake: Addition of extra word'}
                          className="px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-800 font-medium text-xs inline-flex items-center gap-1"
                        >
                          <span>+{item.typed}</span>
                          <span className="text-[10px] bg-rose-200 text-rose-800 px-1 rounded font-mono font-bold">
                            Extra
                          </span>
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 px-6 border-t border-emerald-100 bg-emerald-50/50 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
          >
            Close Scorecard
          </button>

          {onRetakeTest && (
            <button
              onClick={() => {
                onClose();
                onRetakeTest();
              }}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake This Test</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
