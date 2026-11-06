import React from 'react';
import { Volume2, VolumeX, RotateCcw, Award, Coins } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface TopNavProps {
  score: number;
  treasury: number;
  currentActivity: number;
  onSelectActivity: (id: number) => void;
  onResetGame: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  score,
  treasury,
  currentActivity,
  onSelectActivity,
  onResetGame,
  soundMuted,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              soundManager.playClick();
              onSelectActivity(1);
            }}
            className="flex items-center gap-2 text-left focus-visible:outline-sky-500 rounded-lg group"
          >
            <span className="text-2xl" aria-hidden="true">🌐</span>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors whitespace-nowrap">
                Global Trade Mission
              </span>
              <span className="hidden sm:inline-block text-[11px] text-sky-700 font-medium ml-2 bg-sky-50 px-2 py-0.5 rounded">
                Grade 8 Economics
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => {
              soundManager.playClick();
              onSelectActivity(1);
            }}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              currentActivity === 1 || currentActivity === 2
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Country & Products
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onSelectActivity(3);
            }}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              currentActivity === 3 || currentActivity === 4 || currentActivity === 5
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Trade Marketplace
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onSelectActivity(7);
            }}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              currentActivity === 6 || currentActivity === 7
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Crises & Treasury
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onSelectActivity(8);
            }}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              currentActivity === 8 || currentActivity === 9
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Surplus & Calculator
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onSelectActivity(10);
            }}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              currentActivity === 10
                ? 'border-amber-500 text-amber-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Final Exam
          </button>
        </nav>

        {/* Zone 3: 1 primary action cluster (Score, Treasury, Audio, Reset) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Treasury readout */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-semibold tabular-nums">
            <Coins className="w-4 h-4 text-emerald-600" />
            <span>${treasury.toLocaleString()}</span>
          </div>

          {/* Points readout */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-800 text-xs sm:text-sm font-semibold tabular-nums">
            <Award className="w-4 h-4 text-amber-600" />
            <span>{score} pts</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundMuted ? 'Turn Sound On' : 'Mute Sound'}
            aria-label="Toggle Sound"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-sky-600" />}
          </button>

          {/* Reset button */}
          <button
            onClick={onResetGame}
            title="Start New Mission"
            aria-label="Reset Mission"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
