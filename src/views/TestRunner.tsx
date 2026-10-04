import React, { useState, useEffect, useRef } from 'react';
import { User, TestPassage, TestResult, HindiKeyboardLayout } from '../types/steno';
import { evaluateTyping } from '../services/evaluation';
import { StorageService } from '../services/storage';
import { REMINGTON_GAIL_MAP } from '../utils/hindiKeyboard';
import { AudioDictationPlayer } from '../components/AudioDictationPlayer';
import {
  Clock,
  Send,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  CheckCircle,
  FileText,
  Type,
} from 'lucide-react';

interface TestRunnerProps {
  passage: TestPassage;
  currentUser: User;
  onFinishTest: (result: TestResult) => void;
  onCancelTest: () => void;
}

export const TestRunner: React.FC<TestRunnerProps> = ({
  passage,
  currentUser,
  onFinishTest,
  onCancelTest,
}) => {
  const isHindi = passage.language === 'hindi';
  const totalSeconds = passage.durationMinutes * 60;

  // Test state
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalSeconds);
  const [testStarted, setTestStarted] = useState<boolean>(false);
  const [typedText, setTypedText] = useState<string>('');
  const [backspaceCount, setBackspaceCount] = useState<number>(0);
  const [keyboardLayout, setKeyboardLayout] = useState<HindiKeyboardLayout | 'english'>(
    isHindi ? 'remington_gail' : 'english'
  );
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');

  // Confirmation dialog
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (testStarted && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            handleCompleteSubmission();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [testStarted, secondsRemaining]);

  // Handle keydown for backspace rules and Remington Gail conversion
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!testStarted) {
      setTestStarted(true);
    }

    // Backspace rules enforcement
    if (e.key === 'Backspace') {
      if (passage.backspaceRule === 'disabled') {
        e.preventDefault();
        return;
      }
      setBackspaceCount((prev) => prev + 1);
      return;
    }

    // If Hindi Remington Gail layout is selected and not a modifier key
    if (
      isHindi &&
      keyboardLayout === 'remington_gail' &&
      !e.ctrlKey &&
      !e.altKey &&
      !e.metaKey &&
      e.key.length === 1
    ) {
      const lowerChar = e.key.toLowerCase();
      const mapEntry = REMINGTON_GAIL_MAP[lowerChar] || REMINGTON_GAIL_MAP[e.key];

      if (mapEntry) {
        e.preventDefault();
        const hindiChar = e.shiftKey ? mapEntry.shift : mapEntry.normal;

        const target = e.currentTarget;
        const start = target.selectionStart;
        const end = target.selectionEnd;
        const currentVal = target.value;

        const newVal = currentVal.substring(0, start) + hindiChar + currentVal.substring(end);
        setTypedText(newVal);

        // Advance cursor position
        requestAnimationFrame(() => {
          target.selectionStart = target.selectionEnd = start + hindiChar.length;
        });
      }
    }
  };

  // Submit test and calculate final scores
  const handleCompleteSubmission = () => {
    const timeTakenSeconds = totalSeconds - secondsRemaining || 1;
    const evaluation = evaluateTyping(passage.masterText, typedText, timeTakenSeconds);

    const resultRecord: TestResult = {
      id: `result_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      testId: passage.id,
      testTitle: passage.title,
      type: passage.type,
      language: passage.language,
      keyboardLayout: isHindi ? (keyboardLayout as HindiKeyboardLayout) : undefined,
      submittedAt: new Date().toISOString(),
      timeTakenSeconds,
      totalWordsMaster: evaluation.totalWordsMaster,
      typedWordsCount: evaluation.typedWordsCount,
      grossWpm: evaluation.grossWpm,
      netWpm: evaluation.netWpm,
      accuracy: evaluation.accuracy,
      correctWords: evaluation.correctWords,
      fullMistakes: evaluation.fullMistakes,
      halfMistakes: evaluation.halfMistakes,
      totalMistakes: evaluation.totalMistakes,
      mistakePercentage: evaluation.mistakePercentage,
      backspaceCount,
      passed: evaluation.passed,
      typedText,
      diffAnalysis: evaluation.diffAnalysis,
    };

    // Save permanently in database
    StorageService.addResult(resultRecord);
    onFinishTest(resultRecord);
  };

  // Live calculation approximations
  const wordsTyped = typedText.trim() ? typedText.trim().split(/\s+/).length : 0;
  const elapsedMinutes = Math.max(0.1, (totalSeconds - secondsRemaining) / 60);
  const liveGrossWpm = Math.round((typedText.length / 5) / elapsedMinutes);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Test Header & Timer Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                isHindi
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {passage.language} · {passage.type}
            </span>
            <span className="text-xs font-mono text-slate-500">
              Target: {passage.targetWpm} WPM · Backspace: {passage.backspaceRule}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">{passage.title}</h2>
        </div>

        {/* Live Counters & Controls */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Live countdown timer */}
          <div className="flex items-center gap-2 p-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 font-mono shadow-xs">
            <Clock
              className={`w-4 h-4 ${
                secondsRemaining < 60 ? 'text-rose-600 animate-pulse' : 'text-emerald-700'
              }`}
            />
            <span
              className={`text-xl font-bold tabular-nums ${
                secondsRemaining < 60 ? 'text-rose-600' : 'text-emerald-950'
              }`}
            >
              {formatTimer(secondsRemaining)}
            </span>
          </div>

          {/* Quick live stats */}
          <div className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-600">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Typed</span>
              <span className="text-slate-900 font-bold">{wordsTyped} words</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Live Speed</span>
              <span className="text-emerald-700 font-bold">{liveGrossWpm} WPM</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Backspaces</span>
              <span className="text-amber-700 font-bold">{backspaceCount}</span>
            </div>
          </div>

          {/* Finish / Submit button */}
          <button
            type="button"
            onClick={() => setShowConfirmSubmit(true)}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Exam</span>
          </button>
        </div>
      </div>

      {/* DICTATION AUDIO PLAYER (IF DICTATION TEST) */}
      {passage.type === 'dictation' && (
        <AudioDictationPlayer
          audioUrl={passage.audioUrl}
          masterText={passage.masterText}
          language={passage.language}
          targetWpm={passage.targetWpm}
        />
      )}

      {/* TYPING REFERENCE & INPUT WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Master Reference Box (Uploaded Paragraph) */}
        <div className="flex flex-col rounded-2xl bg-white border border-emerald-200 overflow-hidden shadow-xs">
          <div className="px-5 py-3 border-b border-emerald-100 bg-emerald-50/70 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span className="font-mono uppercase font-bold text-emerald-950">
                {passage.type === 'dictation'
                  ? 'Master Dictation Transcript'
                  : 'Admin Uploaded Paragraph to Type'}
              </span>
            </div>

            {/* Font size toggle for easy reading */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Type className="w-3.5 h-3.5 text-slate-400" />
              <button
                type="button"
                onClick={() => setFontSize('normal')}
                className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                  fontSize === 'normal' ? 'bg-emerald-600 text-white font-bold' : 'hover:text-slate-900'
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('large')}
                className={`px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                  fontSize === 'large' ? 'bg-emerald-600 text-white font-bold' : 'hover:text-slate-900'
                }`}
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-0.5 rounded text-sm font-mono font-bold ${
                  fontSize === 'xlarge' ? 'bg-emerald-600 text-white font-bold' : 'hover:text-slate-900'
                }`}
              >
                A++
              </button>
            </div>
          </div>

          <div
            className={`p-6 overflow-y-auto max-h-[460px] font-sans text-slate-800 leading-relaxed select-none ${
              fontSize === 'normal'
                ? 'text-sm'
                : fontSize === 'large'
                ? 'text-base sm:text-lg'
                : 'text-lg sm:text-xl'
            }`}
          >
            {passage.masterText}
          </div>

          <div className="p-3 px-5 border-t border-emerald-100 bg-emerald-50/40 text-xs font-mono text-slate-500 flex items-center justify-between">
            <span>Passage Length: ~{passage.masterText.split(/\s+/).length} Words</span>
            <span>Target Speed: {passage.targetWpm} WPM</span>
          </div>
        </div>

        {/* Candidate Typing Workspace */}
        <div className="flex flex-col rounded-2xl bg-white border border-emerald-200 overflow-hidden shadow-xs">
          <div className="px-5 py-3 border-b border-emerald-100 bg-emerald-50/60 flex items-center justify-between text-xs">
            <span className="font-mono uppercase font-semibold text-emerald-800">
              Candidate Typing Workspace
            </span>

            {/* Hindi layout selector if Hindi passage */}
            {isHindi ? (
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <span className="text-slate-500 mr-1">Hindi:</span>
                <button
                  type="button"
                  onClick={() => setKeyboardLayout('remington_gail')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    keyboardLayout === 'remington_gail'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Remington Gail
                </button>
                <button
                  type="button"
                  onClick={() => setKeyboardLayout('inscript')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    keyboardLayout === 'inscript'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Inscript
                </button>
              </div>
            ) : (
              <span className="text-xs font-mono text-slate-500">Standard QWERTY Physical Keyboard</span>
            )}
          </div>

          <div className="p-4 flex-1 flex flex-col">
            <textarea
              ref={textareaRef}
              autoFocus
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isHindi
                  ? keyboardLayout === 'remington_gail'
                    ? 'यहाँ टाइप करें... (रेमिंगटन गेल कीबोर्ड एक्टिव है - अपने सामान्य कीबोर्ड से टाइप करें, देवनागरी अपने आप टाइप होगी)'
                    : 'यहाँ हिंदी टाइप करें...'
                  : 'Start typing the uploaded paragraph here...'
              }
              className={`w-full flex-1 min-h-[380px] p-4 rounded-xl bg-emerald-50/20 border border-emerald-200 text-slate-900 font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none ${
                fontSize === 'normal'
                  ? 'text-sm'
                  : fontSize === 'large'
                  ? 'text-base sm:text-lg'
                  : 'text-lg sm:text-xl'
              }`}
            />

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span className="text-slate-800 font-semibold">{wordsTyped} words typed</span>
              {passage.backspaceRule === 'disabled' ? (
                <span className="text-rose-600 font-bold">⚠ Backspace disabled for this exam</span>
              ) : (
                <span>Backspaces used: {backspaceCount}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRM SUBMISSION MODAL */}
      {showConfirmSubmit && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-md bg-white border border-emerald-200 rounded-2xl p-6 shadow-2xl text-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Submit Examination?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Are you ready to submit your transcription for official evaluation?
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2 text-xs font-mono text-slate-700 mb-6">
              <div className="flex justify-between">
                <span>Words Typed:</span>
                <span className="text-slate-900 font-bold">{wordsTyped} words</span>
              </div>
              <div className="flex justify-between">
                <span>Time Remaining:</span>
                <span className="text-slate-900 font-bold">{formatTimer(secondsRemaining)}</span>
              </div>
              <div className="flex justify-between">
                <span>Backspaces Used:</span>
                <span className="text-amber-700 font-bold">{backspaceCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg bg-slate-100 hover:bg-slate-200"
              >
                Continue Typing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmSubmit(false);
                  handleCompleteSubmission();
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
              >
                Yes, Final Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
