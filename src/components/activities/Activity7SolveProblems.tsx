import React, { useState } from 'react';
import { CountryId } from '../../types/trade';
import { TRADE_PROBLEMS } from '../../data/countriesData';
import { soundManager } from '../../utils/audio';
import { AlertTriangle, CheckCircle2, Award, ArrowRight, RotateCcw } from 'lucide-react';

interface Activity7Props {
  userCountryId: CountryId;
  onApplyProblemImpact: (costImpact: number, scorePoints: number) => void;
  onProceedToCalculator: () => void;
}

export const Activity7SolveProblems: React.FC<Activity7Props> = ({
  userCountryId,
  onApplyProblemImpact,
  onProceedToCalculator,
}) => {
  const [currentEventIndex, setCurrentEventIndex] = useState<number>(0);
  const [resolvedEvents, setResolvedEvents] = useState<
    Record<string, { choiceIndex: number; feedback: string; score: number }>
  >({});

  const activeEvent = TRADE_PROBLEMS[currentEventIndex];
  const isCurrentResolved = resolvedEvents[activeEvent.id] !== undefined;

  const handleChooseOption = (optIndex: number) => {
    if (isCurrentResolved) return;

    const opt = activeEvent.options[optIndex];
    if (opt.scorePoints >= 80) {
      soundManager.playSuccessChime();
    } else {
      soundManager.playClick();
    }

    setResolvedEvents((prev) => ({
      ...prev,
      [activeEvent.id]: {
        choiceIndex: optIndex,
        feedback: opt.feedback,
        score: opt.scorePoints,
      },
    }));

    onApplyProblemImpact(opt.costImpact, opt.scorePoints);
  };

  const handleNextEvent = () => {
    soundManager.playClick();
    if (currentEventIndex < TRADE_PROBLEMS.length - 1) {
      setCurrentEventIndex((i) => i + 1);
    }
  };

  const handlePrevEvent = () => {
    soundManager.playClick();
    if (currentEventIndex > 0) {
      setCurrentEventIndex((i) => i - 1);
    }
  };

  const totalProblemsSolved = Object.keys(resolvedEvents).length;

  return (
    <div className="space-y-6">
      {/* Activity Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <h2 className="text-xl font-bold text-slate-900">
              Activity 7: Solve International Trade Problems
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
            Concept: Trade Disruptions, Tariffs & Supply Chains
          </span>
        </div>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          International trade does not always sail smoothly! Wars, storms, canal blockages, sudden tariffs, and droughts can disrupt the flow of goods. As Trade Commissioner, make diplomatic and economic choices to protect your citizens and keep commerce moving.
        </p>
      </div>

      {/* Problem Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {TRADE_PROBLEMS.map((evt, idx) => {
          const isDone = resolvedEvents[evt.id] !== undefined;
          const isSelected = idx === currentEventIndex;

          return (
            <button
              key={evt.id}
              onClick={() => {
                soundManager.playClick();
                setCurrentEventIndex(idx);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span>{evt.icon}</span>
              <span>Case {idx + 1}: {evt.category}</span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-1 inline" />}
            </button>
          );
        })}
      </div>

      {/* Active Dilemma Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-2.5 rounded-2xl bg-amber-50 border border-amber-200">
              {activeEvent.imageIcon}
            </span>
            <div>
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                Trade Crisis Dossier #{currentEventIndex + 1} · {activeEvent.category}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                {activeEvent.title}
              </h3>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Case {currentEventIndex + 1} of {TRADE_PROBLEMS.length}
          </div>
        </div>

        {/* Problem Description */}
        <div className="space-y-4 mb-6">
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {activeEvent.description}
          </p>

          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950">
              <strong className="block font-bold mb-0.5">Economic Impact:</strong>
              {activeEvent.impactSummary}
            </div>
          </div>
        </div>

        {/* Policy Choices */}
        <div className="space-y-3 mb-6">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            How Should Your Trade Ministry Respond?
          </div>

          <div className="grid grid-cols-1 gap-3">
            {activeEvent.options.map((opt, oIdx) => {
              const isSelectedChoice =
                resolvedEvents[activeEvent.id]?.choiceIndex === oIdx;

              return (
                <button
                  key={oIdx}
                  onClick={() => handleChooseOption(oIdx)}
                  disabled={isCurrentResolved}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    isSelectedChoice
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/40 shadow-xs'
                      : isCurrentResolved
                      ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                      : 'bg-white border-slate-200 hover:border-sky-400 hover:bg-sky-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-sm text-slate-900 mb-1">
                    <span>
                      Option {String.fromCharCode(65 + oIdx)}: {opt.label}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {opt.costImpact === 0
                        ? '$0 Cost'
                        : opt.costImpact < 0
                        ? `Cost: $${Math.abs(opt.costImpact).toLocaleString()}`
                        : `Revenue: +$${opt.costImpact.toLocaleString()}`}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {opt.explanation}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Section once resolved */}
        {isCurrentResolved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 mb-6">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Policy Decision Recorded</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                <Award className="w-3.5 h-3.5" />
                <span>+{resolvedEvents[activeEvent.id].score} Problem-Solver Points</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
              {resolvedEvents[activeEvent.id].feedback}
            </p>
          </div>
        )}

        {/* Navigation / Next Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevEvent}
              disabled={currentEventIndex === 0}
              className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              ← Previous Case
            </button>
            <button
              onClick={handleNextEvent}
              disabled={currentEventIndex === TRADE_PROBLEMS.length - 1}
              className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              Next Case →
            </button>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onProceedToCalculator();
            }}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>Proceed to Calculate Trade Values (Activity 8)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
