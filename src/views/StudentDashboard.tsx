import React, { useState } from 'react';
import { User, TestPassage, TestResult, LanguageType, TestType } from '../types/steno';
import { StorageService } from '../services/storage';
import {
  Headphones,
  Keyboard,
  Award,
  Clock,
  CheckCircle,
  Play,
  TrendingUp,
  ShieldCheck,
  FileAudio,
  Calendar,
  Sparkles,
  Zap,
} from 'lucide-react';
import { TypingPracticeModule } from '../components/TypingPracticeModule';

interface StudentDashboardProps {
  currentUser: User;
  onStartTest: (passage: TestPassage) => void;
  onViewResult: (result: TestResult) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  onStartTest,
  onViewResult,
}) => {
  const [activeTab, setActiveTab] = useState<'practice' | 'dictation' | 'typing' | 'my_results'>('practice');
  const [languageFilter, setLanguageFilter] = useState<'all' | 'hindi' | 'english'>('all');

  const passages = StorageService.getPassages();
  const allResults = StorageService.getResults();
  const myResults = allResults.filter((r) => r.studentId === currentUser.id);

  // Calculate student averages
  const avgWpm =
    myResults.length > 0
      ? Math.round(myResults.reduce((acc, r) => acc + r.netWpm, 0) / myResults.length)
      : 0;

  const avgAccuracy =
    myResults.length > 0
      ? Math.round((myResults.reduce((acc, r) => acc + r.accuracy, 0) / myResults.length) * 10) / 10
      : 0;

  const passedCount = myResults.filter((r) => r.passed).length;

  // Filter passages
  const filteredPassages = passages.filter((p) => {
    const matchesTab = p.type === activeTab;
    const matchesLang = languageFilter === 'all' || p.language === languageFilter;
    return matchesTab && matchesLang;
  });

  const expiryDate = new Date(currentUser.subscriptionExpiry);
  const now = new Date();
  const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Student Welcome & Subscription Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 border border-emerald-700 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
              Welcome back, {currentUser.name}
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-700/80 text-emerald-100 border border-emerald-500">
              Verified Candidate
            </span>
          </div>
          <p className="text-xs text-emerald-100/80 font-mono">
            Roll No: {currentUser.rollNo || 'ST-2026-REG'} · Email: {currentUser.email}
          </p>
        </div>

        {/* Subscription validity card */}
        <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-4 text-xs font-mono">
          <div className="w-10 h-10 rounded-lg bg-emerald-700 border border-emerald-500 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white uppercase">{currentUser.subscriptionPlan} Plan</span>
              <span className="text-emerald-300 font-semibold">Active</span>
            </div>
            <p className="text-[11px] text-emerald-100 mt-0.5">
              Valid until{' '}
              {expiryDate.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}{' '}
              <span className="text-emerald-200 font-bold">({daysLeft} days remaining)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Aggregate Performance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-emerald-200 shadow-xs">
          <span className="text-xs font-mono uppercase text-slate-500 font-semibold">Average Net Speed</span>
          <p className="text-3xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
            {avgWpm} <span className="text-xs text-slate-400 font-normal">WPM</span>
          </p>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Across {myResults.length} completed sessions
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-white border border-emerald-200 shadow-xs">
          <span className="text-xs font-mono uppercase text-slate-500 font-semibold">Mean Accuracy</span>
          <p className="text-3xl font-bold font-mono text-teal-700 mt-1 tabular-nums">
            {avgAccuracy}%
          </p>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Target Standard: ≥ 93%
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-white border border-emerald-200 shadow-xs">
          <span className="text-xs font-mono uppercase text-slate-500 font-semibold">Tests Qualified</span>
          <p className="text-3xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
            {passedCount} / {myResults.length}
          </p>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            SSC / Court Standard Passed
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-white border border-emerald-200 shadow-xs">
          <span className="text-xs font-mono uppercase text-slate-500 font-semibold">Active Test Catalog</span>
          <p className="text-3xl font-bold font-mono text-amber-600 mt-1 tabular-nums">
            {passages.length}
          </p>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Dictations & Typing Drills
          </span>
        </div>
      </div>

      {/* Tabs & Language Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'practice'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Interactive Typing Practice</span>
          </button>

          <button
            onClick={() => setActiveTab('dictation')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'dictation'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>Audio Dictations</span>
          </button>

          <button
            onClick={() => setActiveTab('typing')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'typing'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span>Type Uploaded Paragraphs ({passages.filter(p => p.type === 'typing').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my_results')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'my_results'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>My Results ({myResults.length})</span>
          </button>
        </div>

        {/* Language selector for tests & practice */}
        {(activeTab === 'dictation' || activeTab === 'typing') && (
          <div className="flex items-center gap-1 p-0.5 bg-white border border-emerald-200 rounded-lg text-xs self-start sm:self-auto shadow-xs">
            <span className="px-2 text-slate-500 font-mono text-[11px]">Language:</span>
            <button
              onClick={() => setLanguageFilter('all')}
              className={`px-3 py-1 rounded transition-colors ${
                languageFilter === 'all'
                  ? 'bg-emerald-600 text-white font-medium'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setLanguageFilter('hindi')}
              className={`px-3 py-1 rounded transition-colors ${
                languageFilter === 'hindi'
                  ? 'bg-amber-600 text-white font-medium'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hindi (हिंदी)
            </button>
            <button
              onClick={() => setLanguageFilter('english')}
              className={`px-3 py-1 rounded transition-colors ${
                languageFilter === 'english'
                  ? 'bg-sky-600 text-white font-medium'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
          </div>
        )}
      </div>

      {/* TYPING PRACTICE TAB */}
      {activeTab === 'practice' && (
        <TypingPracticeModule
          initialLanguage={languageFilter === 'english' ? 'english' : 'hindi'}
          currentUser={currentUser}
          onViewResult={onViewResult}
        />
      )}

      {/* EXAM PASSAGES GRID (DICTATION OR TYPING TESTS) */}
      {(activeTab === 'dictation' || activeTab === 'typing') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPassages.length === 0 ? (
            <div className="col-span-2 py-12 text-center text-slate-500 italic bg-white rounded-xl border border-emerald-200 shadow-xs">
              No passages found for the selected filter.
            </div>
          ) : (
            filteredPassages.map((passage) => {
              const isHindi = passage.language === 'hindi';
              return (
                <div
                  key={passage.id}
                  className="p-6 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4 shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                        {passage.category}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          isHindi
                            ? 'bg-amber-50 border border-amber-200 text-amber-800'
                            : 'bg-sky-50 border border-sky-200 text-sky-800'
                        }`}
                      >
                        {passage.language} · {passage.type}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug">{passage.title}</h3>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-600">
                      <span className="text-emerald-700 font-bold">{passage.targetWpm} WPM</span>
                      <span>·</span>
                      <span>{passage.durationMinutes} Minutes</span>
                      <span>·</span>
                      <span className="capitalize">Backspace: {passage.backspaceRule}</span>
                    </div>

                    {passage.type === 'dictation' && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700 font-mono">
                        <Headphones className="w-3.5 h-3.5" />
                        <span>Listen to audio dictation & transcribe in real-time</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-emerald-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-mono">
                      ~{passage.masterText.split(/\s+/).length} Words Passage
                    </span>

                    <button
                      onClick={() => onStartTest(passage)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{passage.type === 'dictation' ? 'Start Audio Dictation' : 'Type This Paragraph'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* MY RESULTS TAB */}
      {activeTab === 'my_results' && (
        <div className="bg-white border border-emerald-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-emerald-50 text-emerald-950 font-mono uppercase text-[11px] border-b border-emerald-200 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Test Title</th>
                  <th className="py-3.5 px-4">Exam Format</th>
                  <th className="py-3.5 px-4">Language</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Net WPM</th>
                  <th className="py-3.5 px-4">Accuracy</th>
                  <th className="py-3.5 px-4">Mistake Rate</th>
                  <th className="py-3.5 px-4">Outcome</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100">
                {myResults.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-500 italic">
                      You have not taken any tests yet. Click "Type Uploaded Paragraphs" to begin your first practice session!
                    </td>
                  </tr>
                ) : (
                  myResults.map((r) => (
                    <tr key={r.id} className="hover:bg-emerald-50/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{r.testTitle}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold ${
                          r.type === 'dictation'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-teal-100 text-teal-800 border border-teal-300'
                        }`}>
                          {r.type === 'dictation' ? <Headphones className="w-3 h-3 text-emerald-700" /> : <Keyboard className="w-3 h-3 text-teal-700" />}
                          <span>{r.type === 'dictation' ? 'Dictation' : 'Typing'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          r.language === 'hindi'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-sky-50 text-sky-800 border border-sky-200'
                        }`}>
                          {r.language === 'hindi' ? 'Hindi (हिंदी)' : 'English'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {new Date(r.submittedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 tabular-nums">
                        {r.netWpm} WPM
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-700 font-semibold tabular-nums">
                        {r.accuracy}%
                      </td>
                      <td className="py-3 px-4 font-mono text-amber-700 tabular-nums">
                        <span className="font-bold">{r.mistakePercentage}%</span>
                        <span className="block text-[10px] text-slate-500 font-normal">
                          F: {r.fullMistakes ?? 0} · H: {r.halfMistakes ?? 0}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            r.passed
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-red-100 text-red-800 border border-red-300'
                          }`}
                        >
                          {r.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onViewResult(r)}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                        >
                          View Scorecard & Diff
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
