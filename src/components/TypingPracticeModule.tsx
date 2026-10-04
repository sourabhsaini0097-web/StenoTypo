import React, { useState, useEffect, useRef } from 'react';
import { PracticeLesson, HINDI_PRACTICE_LESSONS, ENGLISH_PRACTICE_LESSONS } from '../data/practiceLessons';
import { HindiKeyboardLayout, TestResult, User } from '../types/steno';
import { REMINGTON_GAIL_MAP } from '../utils/hindiKeyboard';
import { soundEffects } from '../utils/audioFeedback';
import { evaluateTyping } from '../services/evaluation';
import { StorageService } from '../services/storage';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Play,
  Award,
  Zap,
  CheckCircle,
  FileText,
  Send,
  ArrowRight,
  Printer,
  ChevronRight,
} from 'lucide-react';

interface TypingPracticeModuleProps {
  initialLanguage?: 'hindi' | 'english';
  currentUser?: User;
  onViewResult?: (result: TestResult) => void;
}

export const TypingPracticeModule: React.FC<TypingPracticeModuleProps> = ({
  initialLanguage = 'hindi',
  currentUser,
  onViewResult,
}) => {
  const [language, setLanguage] = useState<'hindi' | 'english'>(initialLanguage);
  const lessons = language === 'hindi' ? HINDI_PRACTICE_LESSONS : ENGLISH_PRACTICE_LESSONS;

  const [selectedLesson, setSelectedLesson] = useState<PracticeLesson>(lessons[0]);
  const [customText, setCustomText] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Active target text to type
  const targetText = isCustomMode ? customText || 'Type something here to practice...' : selectedLesson.text;

  // Typing practice state
  const [typedChars, setTypedChars] = useState<string>('');
  const [errorIndices, setErrorIndices] = useState<Set<number>>(new Set());
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Saved evaluation result after completion
  const [finalResult, setFinalResult] = useState<TestResult | null>(null);

  // Sound FX
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Keyboard layout for physical keyboard input
  const [keyboardLayout, setKeyboardLayout] = useState<HindiKeyboardLayout | 'english'>(
    language === 'hindi' ? 'remington_gail' : 'english'
  );

  const hiddenInputRef = useRef<HTMLTextAreaElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset practice when lesson or language changes
  const resetPractice = (newLesson?: PracticeLesson) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (newLesson) setSelectedLesson(newLesson);
    setTypedChars('');
    setErrorIndices(new Set());
    setStartTime(null);
    setTotalKeystrokes(0);
    setErrorCount(0);
    setIsCompleted(false);
    setElapsedSeconds(0);
    setFinalResult(null);

    setTimeout(() => {
      if (hiddenInputRef.current) {
        hiddenInputRef.current.focus();
      }
    }, 50);
  };

  // Timer loop
  useEffect(() => {
    if (startTime && !isCompleted) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isCompleted]);

  // Complete and calculate official evaluation result
  const completePracticeAndShowResult = (currentTypedText: string, finalSeconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsCompleted(true);
    soundEffects.playSuccessChime();

    const duration = Math.max(1, finalSeconds);
    const evaluation = evaluateTyping(targetText, currentTypedText, duration);

    const resultRecord: TestResult = {
      id: `practice_${Date.now()}`,
      studentId: currentUser?.id || 'practice_user',
      studentName: currentUser?.name || 'Practice Candidate',
      studentEmail: currentUser?.email || 'practice@candidate.com',
      testId: selectedLesson.id,
      testTitle: `Typing Practice: ${selectedLesson.title}`,
      type: 'typing',
      language: language,
      submittedAt: new Date().toISOString(),
      timeTakenSeconds: duration,
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
      backspaceCount: 0,
      passed: evaluation.passed,
      typedText: currentTypedText,
      diffAnalysis: evaluation.diffAnalysis,
    };

    setFinalResult(resultRecord);

    // Save practice result to database history if logged-in student
    if (currentUser) {
      StorageService.addResult(resultRecord);
    }
  };

  // Handle typing input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab to quickly restart
    if (e.key === 'Tab') {
      e.preventDefault();
      resetPractice();
      return;
    }

    if (isCompleted) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (typedChars.length > 0) {
        soundEffects.playKeyClick();
        const newTyped = typedChars.slice(0, -1);
        setTypedChars(newTyped);
        const newErrors = new Set(errorIndices);
        newErrors.delete(typedChars.length - 1);
        setErrorIndices(newErrors);
      }
      return;
    }

    // Ignore modifier keys
    if (e.key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) {
      return;
    }

    e.preventDefault();
    setTotalKeystrokes((prev) => prev + 1);

    let charToInsert = e.key;

    // Remington Gail conversion for Hindi
    if (language === 'hindi' && keyboardLayout === 'remington_gail') {
      const lower = e.key.toLowerCase();
      const mapped = REMINGTON_GAIL_MAP[lower] || REMINGTON_GAIL_MAP[e.key];
      if (mapped) {
        charToInsert = e.shiftKey ? mapped.shift : mapped.normal;
      }
    }

    const nextIndex = typedChars.length;
    const expectedChar = targetText[nextIndex];

    const isMatch = charToInsert === expectedChar;

    if (isMatch) {
      soundEffects.playKeyClick();
    } else {
      soundEffects.playErrorBeep();
      setErrorCount((prev) => prev + 1);
      setErrorIndices((prev) => new Set(prev).add(nextIndex));
    }

    const nextTyped = typedChars + charToInsert;
    setTypedChars(nextTyped);

    // Check completion when user reaches end of practice target text
    if (nextTyped.length >= targetText.length) {
      const finalSec = Math.max(1, Math.floor((Date.now() - (startTime || Date.now())) / 1000));
      completePracticeAndShowResult(nextTyped, finalSec);
    }
  };

  // Live Metrics
  const minutes = Math.max(0.05, elapsedSeconds / 60);
  const wordsTyped = typedChars.length / 5;
  const currentWpm = Math.round(wordsTyped / minutes);
  const accuracy = totalKeystrokes > 0
    ? Math.max(0, Math.round(((totalKeystrokes - errorCount) / totalKeystrokes) * 100))
    : 100;

  const progressPercent = Math.min(100, Math.round((typedChars.length / targetText.length) * 100));

  // Find next lesson
  const currentLessonIndex = lessons.findIndex((l) => l.id === selectedLesson.id);
  const nextLesson = currentLessonIndex >= 0 && currentLessonIndex + 1 < lessons.length
    ? lessons[currentLessonIndex + 1]
    : null;

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Language selector & layout */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center p-1 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold">
            <button
              onClick={() => {
                setLanguage('hindi');
                setKeyboardLayout('remington_gail');
                setIsCustomMode(false);
                resetPractice(HINDI_PRACTICE_LESSONS[0]);
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                language === 'hindi'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
            >
              Hindi (हिंदी)
            </button>
            <button
              onClick={() => {
                setLanguage('english');
                setKeyboardLayout('english');
                setIsCustomMode(false);
                resetPractice(ENGLISH_PRACTICE_LESSONS[0]);
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                language === 'english'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
            >
              English
            </button>
          </div>

          {/* Hindi Layout option */}
          {language === 'hindi' && (
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-500">Layout:</span>
              <button
                type="button"
                onClick={() => setKeyboardLayout('remington_gail')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                  keyboardLayout === 'remington_gail'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                }`}
              >
                Remington Gail
              </button>
              <button
                type="button"
                onClick={() => setKeyboardLayout('inscript')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                  keyboardLayout === 'inscript'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                }`}
              >
                Inscript / IME
              </button>
            </div>
          )}
        </div>

        {/* Audio Toggle, Reset, & Finish Early */}
        <div className="flex items-center gap-2">
          {typedChars.length > 5 && !isCompleted && (
            <button
              type="button"
              onClick={() => completePracticeAndShowResult(typedChars, elapsedSeconds)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
              title="Finish typing drill now and view results"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Finish & View Result</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              soundEffects.enabled = next;
            }}
            title={soundEnabled ? 'Mute Key Clicks' : 'Enable Key Clicks'}
            className={`p-2 rounded-lg text-xs font-mono border transition-colors flex items-center gap-1.5 ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Sound: On' : 'Muted'}</span>
          </button>

          <button
            type="button"
            onClick={() => resetPractice()}
            className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
            <span>Restart (Tab)</span>
          </button>
        </div>
      </div>

      {/* Lesson Selection Pills & Custom Text Toggle */}
      <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-900 font-bold">
            Select Practice Lesson / Drill:
          </span>

          <button
            type="button"
            onClick={() => {
              setIsCustomMode(!isCustomMode);
              resetPractice();
            }}
            className={`text-xs font-medium px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
              isCustomMode
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isCustomMode ? 'Return to Standard Drills' : 'Paste Custom Paragraph'}</span>
          </button>
        </div>

        {!isCustomMode ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => resetPractice(lesson)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedLesson.id === lesson.id
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'bg-emerald-50 text-slate-700 hover:bg-emerald-100/80 border border-emerald-200'
                }`}
              >
                {lesson.title}
                <span className="ml-1.5 text-[10px] opacity-75 font-mono">({lesson.targetWpm} WPM)</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            <textarea
              rows={3}
              value={customText}
              onChange={(e) => {
                setCustomText(e.target.value);
                resetPractice();
              }}
              placeholder="Paste your own Hindi or English paragraph, speech, or transcription text here to practice typing..."
              className="w-full p-3 rounded-lg bg-emerald-50/30 border border-emerald-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans leading-relaxed"
            />
          </div>
        )}
      </div>

      {/* Live Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-xs">
          <span className="text-xs font-mono uppercase text-slate-500 font-medium">Current Speed</span>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
            {currentWpm} <span className="text-xs text-slate-400 font-normal">WPM</span>
          </p>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            Target: {selectedLesson.targetWpm} WPM
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-xs">
          <span className="text-xs font-mono uppercase text-slate-500 font-medium">Accuracy</span>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-teal-700 mt-1 tabular-nums">
            {accuracy}%
          </p>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            Errors: <span className="text-rose-600 font-bold">{errorCount}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-xs">
          <span className="text-xs font-mono uppercase text-slate-500 font-medium">Time Elapsed</span>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-slate-800 mt-1 tabular-nums">
            {Math.floor(elapsedSeconds / 60)}:
            {elapsedSeconds % 60 < 10 ? '0' : ''}
            {elapsedSeconds % 60}
          </p>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            Total Keystrokes: {totalKeystrokes}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-xs">
          <span className="text-xs font-mono uppercase text-slate-500 font-medium">Progress</span>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
            {progressPercent}%
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-emerald-500 h-full transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Main Interactive Typing Area */}
      {!isCompleted && (
        <div
          onClick={() => hiddenInputRef.current?.focus()}
          className="relative p-6 sm:p-8 rounded-2xl bg-white border-2 border-emerald-200 shadow-sm min-h-[190px] flex flex-col justify-center cursor-text select-none group focus-within:border-emerald-600 transition-colors"
        >
          {/* Hidden textarea captures keyboard focus & converts Remington Gail */}
          <textarea
            ref={hiddenInputRef}
            value=""
            onChange={() => {}}
            onKeyDown={handleKeyDown}
            className="absolute inset-0 opacity-0 pointer-events-none"
            autoFocus
          />

          {/* Character-by-character visual rendering */}
          <div className="text-lg sm:text-xl md:text-2xl leading-relaxed tracking-wide font-sans font-normal break-words max-h-56 overflow-y-auto pr-2">
            {targetText.split('').map((char, idx) => {
              const isTyped = idx < typedChars.length;
              const isCurrent = idx === typedChars.length;
              const hasError = errorIndices.has(idx);

              let colorClass = 'text-slate-400';
              let bgClass = '';

              if (isTyped) {
                if (hasError) {
                  colorClass = 'text-rose-600 line-through';
                  bgClass = 'bg-rose-100 px-0.5 rounded';
                } else {
                  colorClass = 'text-emerald-700 font-medium';
                }
              } else if (isCurrent) {
                colorClass = 'text-slate-900 font-bold underline decoration-emerald-500 decoration-4';
                bgClass = 'bg-emerald-100/90 px-0.5 rounded';
              }

              return (
                <span key={idx} className={`${colorClass} ${bgClass} transition-colors inline-block`}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>
              {!startTime
                ? 'Click here and start typing directly from your keyboard...'
                : `${typedChars.length} / ${targetText.length} characters typed`}
            </span>
            <span className="text-emerald-700 font-semibold">Tab to restart drill</span>
          </div>
        </div>
      )}

      {/* DETAILED RESULT DISPLAY IN LAST (WHEN COMPLETED) */}
      {isCompleted && finalResult && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-emerald-300 shadow-lg space-y-6 animate-in fade-in">
          {/* Header of Result */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-display text-slate-900">
                    Practice Drill Result Analysis
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${
                      finalResult.passed
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {finalResult.passed ? 'QUALIFIED' : 'NEEDS PRACTICE'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Lesson: {selectedLesson.title} · {finalResult.language.toUpperCase()} · Completed in{' '}
                  {Math.floor(finalResult.timeTakenSeconds / 60)}m {finalResult.timeTakenSeconds % 60}s
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {onViewResult && (
                <button
                  type="button"
                  onClick={() => onViewResult(finalResult)}
                  className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Open Full Official Scorecard</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => resetPractice()}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
                <span>Practice Again</span>
              </button>

              {nextLesson && (
                <button
                  type="button"
                  onClick={() => resetPractice(nextLesson)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>Next Lesson</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Key Metric Scorecard Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
              <span className="text-xs font-mono uppercase text-slate-500 font-semibold">Net Speed</span>
              <p className="text-3xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
                {finalResult.netWpm} <span className="text-sm font-normal text-slate-500">WPM</span>
              </p>
              <span className="text-[11px] text-slate-400 font-mono">Gross: {finalResult.grossWpm} WPM</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
              <span className="text-xs font-mono uppercase text-slate-500 font-semibold">Accuracy</span>
              <p className="text-3xl font-bold font-mono text-teal-700 mt-1 tabular-nums">
                {finalResult.accuracy}%
              </p>
              <span className="text-[11px] text-slate-400 font-mono">
                {finalResult.correctWords}/{finalResult.totalWordsMaster} Words
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
              <span className="text-xs font-mono uppercase text-slate-500 font-semibold">Mistakes Count</span>
              <p className="text-3xl font-bold font-mono text-amber-600 mt-1 tabular-nums">
                {finalResult.totalMistakes}
              </p>
              <span className="text-[11px] text-slate-400 font-mono">
                Full: {finalResult.fullMistakes} · Half: {finalResult.halfMistakes} (×0.5)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
              <span className="text-xs font-mono uppercase text-slate-500 font-semibold">Mistake Rate</span>
              <p className="text-3xl font-bold font-mono text-rose-600 mt-1 tabular-nums">
                {finalResult.mistakePercentage}%
              </p>
              <span className="text-[11px] text-slate-400 font-mono">
                Standard Limit: ≤ 7.0%
              </span>
            </div>
          </div>

          {/* Word-by-Word Diff Evaluation in Last */}
          <div className="p-5 rounded-xl bg-white border border-emerald-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-emerald-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Word-by-Word Mistake Analysis</h4>
                <p className="text-xs text-slate-500">
                  Detailed inspection of correct keystrokes, full mistakes, half mistakes, and equivalent matches.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <span className="w-2 h-2 rounded bg-emerald-500" /> Correct
                </span>
                <span className="flex items-center gap-1 text-rose-600 font-medium">
                  <span className="w-2 h-2 rounded bg-rose-500" /> Full Mistake (1.0)
                </span>
                <span className="flex items-center gap-1 text-amber-600 font-medium">
                  <span className="w-2 h-2 rounded bg-amber-500" /> Half Mistake (0.5)
                </span>
                <span className="flex items-center gap-1 text-teal-700 font-medium">
                  <span className="w-2 h-2 rounded bg-teal-500" /> Accepted Equivalent
                </span>
              </div>
            </div>

            {/* Word Chips */}
            <div className="p-4 rounded-lg bg-emerald-50/30 border border-emerald-100 max-h-56 overflow-y-auto font-sans leading-relaxed text-sm flex flex-wrap gap-2">
              {finalResult.diffAnalysis.map((item, idx) => {
                if (item.mistakeType === 'ignored') {
                  return (
                    <span
                      key={idx}
                      title={item.mistakeReason || 'Accepted Equivalent'}
                      className="px-1.5 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-800 font-medium inline-flex items-center gap-1 text-xs"
                    >
                      <span>{item.typed || item.expected}</span>
                      <span className="text-[10px] text-teal-600 bg-teal-100 px-1 rounded font-mono">
                        ✓
                      </span>
                    </span>
                  );
                }

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

                if (item.isHalfMistake || item.mistakeType === 'half') {
                  return (
                    <span
                      key={idx}
                      title={item.mistakeReason || 'Half Mistake (0.5)'}
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

                if (item.status === 'missing') {
                  return (
                    <span
                      key={idx}
                      title={item.mistakeReason || 'Full Mistake: Omission'}
                      className="px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 font-medium line-through text-xs inline-flex items-center gap-1"
                    >
                      <span>[{item.expected}]</span>
                      <span className="text-[10px] bg-rose-200 text-rose-800 px-1 rounded font-mono font-bold no-underline">
                        Omitted
                      </span>
                    </span>
                  );
                }

                if (item.status === 'extra') {
                  return (
                    <span
                      key={idx}
                      title={item.mistakeReason || 'Full Mistake: Extra word'}
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
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-mono text-emerald-800">
              ✓ This drill result has been recorded in your permanent database history.
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => resetPractice()}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
                <span>Repeat This Drill</span>
              </button>

              {nextLesson && (
                <button
                  type="button"
                  onClick={() => resetPractice(nextLesson)}
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>Start Next Drill ({nextLesson.title})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
