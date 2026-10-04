import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Rewind, Volume2, VolumeX, Mic } from 'lucide-react';
import { LanguageType } from '../types/steno';

interface AudioDictationPlayerProps {
  audioUrl?: string;
  masterText: string;
  language: LanguageType;
  targetWpm?: number;
  onAudioEnded?: () => void;
}

export const AudioDictationPlayer: React.FC<AudioDictationPlayerProps> = ({
  audioUrl,
  masterText,
  language,
  targetWpm = 80,
  onAudioEnded,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(1);
  const [usingSpeechSynthesis, setUsingSpeechSynthesis] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Determine if we should use Web Speech Synthesis (when audioUrl is not available or empty)
  const isSynthetic = !audioUrl;

  useEffect(() => {
    setUsingSpeechSynthesis(isSynthetic);
  }, [audioUrl, isSynthetic]);

  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Set up speech synthesis
  const startSpeechSynthesis = () => {
    if (!('speechSynthesis' in window)) {
      alert('Your browser does not support Speech Synthesis audio.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(masterText);
    utterance.lang = language === 'hindi' ? 'hi-IN' : 'en-IN';
    const calculatedRate = (targetWpm / 110) * playbackSpeed;
    utterance.rate = Math.max(0.5, Math.min(2.0, calculatedRate));

    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find((v) =>
      language === 'hindi'
        ? v.lang.includes('hi')
        : v.lang.includes('en')
    );
    if (targetVoice) utterance.voice = targetVoice;

    utterance.onend = () => {
      setIsPlaying(false);
      if (onAudioEnded) onAudioEnded();
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const stopSpeechSynthesis = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (usingSpeechSynthesis) {
      if (isPlaying) {
        stopSpeechSynthesis();
      } else {
        startSpeechSynthesis();
      }
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => {
          console.error("Audio playback error:", err);
        });
      }
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current && !usingSpeechSynthesis) {
      audioRef.current.playbackRate = speed;
    } else if (usingSpeechSynthesis && isPlaying) {
      stopSpeechSynthesis();
      setTimeout(startSpeechSynthesis, 100);
    }
  };

  const handleSeek = (deltaSeconds: number) => {
    if (audioRef.current && !usingSpeechSynthesis) {
      audioRef.current.currentTime = Math.max(
        0,
        Math.min(audioRef.current.duration || 1, audioRef.current.currentTime + deltaSeconds)
      );
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="w-full bg-white border border-emerald-200 rounded-2xl p-4 sm:p-5 shadow-xs text-slate-800">
      {/* Hidden audio element if real audio URL is used */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
              setDuration(audioRef.current.duration || 1);
            }
          }}
          onEnded={() => {
            setIsPlaying(false);
            if (onAudioEnded) onAudioEnded();
          }}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Audio status banner */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isPlaying ? 'bg-emerald-600 text-white animate-pulse' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Steno Dictation Audio Engine</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                {targetWpm} WPM · {language.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {usingSpeechSynthesis
                ? 'High-Fidelity Neural Dictation Synthesizer'
                : 'Studio Recorded Dictation Track'}
            </p>
          </div>
        </div>

        {/* Speed presets */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-xs text-slate-500 font-mono mr-1">Speed:</span>
          {[0.75, 0.85, 1.0, 1.15, 1.25].map((speed) => (
            <button
              key={speed}
              type="button"
              onClick={() => handleSpeedChange(speed)}
              className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                playbackSpeed === speed
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-emerald-50 text-slate-600 hover:text-slate-900 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Main player controls & progress bar */}
      <div className="mt-4 pt-3 border-t border-emerald-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Seek Back 5s */}
            {!usingSpeechSynthesis && (
              <button
                type="button"
                onClick={() => handleSeek(-5)}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-emerald-50 transition-colors"
                title="Rewind 5s"
              >
                <Rewind className="w-4 h-4" />
              </button>
            )}

            {/* Play/Pause */}
            <button
              type="button"
              onClick={togglePlay}
              className={`px-5 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 shadow-xs transition-all ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause Dictation' : 'Play Dictation Audio'}</span>
            </button>

            {/* Seek Forward 5s */}
            {!usingSpeechSynthesis && (
              <button
                type="button"
                onClick={() => handleSeek(5)}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-emerald-50 transition-colors"
                title="Forward 5s"
              >
                <FastForward className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Time display */}
          {!usingSpeechSynthesis && (
            <div className="text-xs font-mono text-slate-500 tabular-nums">
              <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
            </div>
          )}

          {usingSpeechSynthesis && isPlaying && (
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span>Dictating in Progress...</span>
            </div>
          )}
        </div>

        {/* Progress Bar (for audio file) */}
        {!usingSpeechSynthesis && (
          <div className="w-full bg-emerald-100 h-1.5 rounded-full overflow-hidden cursor-pointer">
            <div
              className="bg-emerald-600 h-full transition-all"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
