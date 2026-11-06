import React, { useState } from 'react';
import { CountryId } from '../../types/trade';
import { COUNTRIES, GRADE_8_QUIZ_QUESTIONS } from '../../data/countriesData';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  Printer,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface Activity10Props {
  userCountryId: CountryId;
  totalGameScore: number;
  treasury: number;
  onAddScore: (points: number) => void;
  onRestartMission: () => void;
}

export const Activity10FinalChallenge: React.FC<Activity10Props> = ({
  userCountryId,
  totalGameScore,
  treasury,
  onAddScore,
  onRestartMission,
}) => {
  const country = COUNTRIES[userCountryId];

  // Quiz state
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isExamCompleted, setIsExamCompleted] = useState<boolean>(false);

  // Certificate state
  const [studentName, setStudentName] = useState<string>('Grade 8 Global Trader');

  const currentQ = GRADE_8_QUIZ_QUESTIONS[currentQIndex];
  const isAnswered = userAnswers[currentQ.id] !== undefined;
  const isCorrect = userAnswers[currentQ.id] === currentQ.correctIndex;

  const handleSelectOption = (index: number) => {
    if (showFeedback) return;

    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: index }));
    setShowFeedback(true);

    if (index === currentQ.correctIndex) {
      soundManager.playSuccessChime();
      onAddScore(100);
    } else {
      soundManager.playBuzzer();
    }
  };

  const handleNextQuestion = () => {
    soundManager.playClick();
    setShowFeedback(false);

    if (currentQIndex < GRADE_8_QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex((i) => i + 1);
    } else {
      // Completed exam!
      setIsExamCompleted(true);
      soundManager.playFanfare();
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 300);
    } catch {
      // safe fallback
    }
  };

  // Calculate quiz score
  const correctCount = GRADE_8_QUIZ_QUESTIONS.filter(
    (q) => userAnswers[q.id] === q.correctIndex
  ).length;

  const examScore = correctCount * 100;
  const finalTotalPoints = totalGameScore + (isExamCompleted ? 0 : 0);

  // Certificate Rank Title
  let rankTitle = 'Distinguished Global Trade Envoy';
  if (finalTotalPoints >= 600) {
    rankTitle = 'Grand Master of International Commerce 🏅';
  } else if (finalTotalPoints >= 450) {
    rankTitle = 'Senior Maritime Trade Diplomat 🥈';
  }

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Activity Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <h2 className="text-xl font-bold text-slate-900">
              Activity 10: Complete the Final Challenge & Earn Your Medal
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
            Grade 8 Certification Exam
          </span>
        </div>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Put all your international trade knowledge to the test! Answer 5 essential Grade 8 questions on exports, imports, tariffs, and trade balances to earn your official Trader License and Certificate.
        </p>
      </div>

      {!isExamCompleted ? (
        /* Quiz Card in Progress */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm print:hidden">
          {/* Progress Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                Question {currentQIndex + 1} of {GRADE_8_QUIZ_QUESTIONS.length}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Topic: {currentQ.topic}
              </span>
            </div>
            <div className="text-xs font-semibold text-amber-700 tabular-nums">
              Correct so far: {correctCount} / {currentQIndex + (showFeedback ? 1 : 0)}
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options List */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = userAnswers[currentQ.id] === optIdx;
              const isCorrectOpt = optIdx === currentQ.correctIndex;

              let btnStyle = 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50/30';
              if (showFeedback) {
                if (isCorrectOpt) {
                  btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                } else if (isSelected && !isCorrectOpt) {
                  btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 opacity-50';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-start gap-3 ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-full bg-slate-200/80 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {showFeedback && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {showFeedback && isSelected && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback Drawer */}
          {showFeedback && (
            <div
              className={`p-4 rounded-xl mb-6 border text-xs leading-relaxed ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              <div className="font-bold text-sm mb-1 flex items-center gap-1.5">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Brilliant! That's Correct (+100 pts)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-amber-600" />
                    <span>Learning Opportunity:</span>
                  </>
                )}
              </div>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          {/* Action button */}
          {showFeedback && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 text-xs sm:text-sm"
              >
                <span>
                  {currentQIndex < GRADE_8_QUIZ_QUESTIONS.length - 1
                    ? 'Next Question'
                    : 'View Final Score & Claim Certificate!'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Completed Screen & Printable Certificate */
        <div className="space-y-6">
          {/* Celebration Summary Bar */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 p-6 rounded-2xl text-slate-900 shadow-md flex flex-wrap items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🎉</span>
              <div>
                <h3 className="text-xl font-black">
                  Congratulations, Trade Commissioner!
                </h3>
                <p className="text-xs sm:text-sm text-amber-950">
                  You successfully mastered all 10 activities of the Global Trade Mission!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-center shadow-xs">
                <div className="text-[10px] text-amber-300 font-bold uppercase">Final Score</div>
                <div className="text-xl font-black tabular-nums">{totalGameScore} pts</div>
              </div>
              <button
                onClick={triggerConfetti}
                className="px-3.5 py-2 bg-white/90 hover:bg-white text-slate-900 font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Celebrate</span>
              </button>
            </div>
          </div>

          {/* Certificate Name Input (before printing) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-2">
              <label htmlFor="studentName" className="text-xs font-bold text-slate-700">
                Student Name for Certificate:
              </label>
              <input
                id="studentName"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your name"
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-sky-500 min-w-[200px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Certificate</span>
              </button>
              <button
                onClick={onRestartMission}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Play as Another Country</span>
              </button>
            </div>
          </div>

          {/* The Official Printable Certificate Document */}
          <div className="bg-amber-50/40 p-8 sm:p-12 rounded-3xl border-8 border-double border-amber-600/60 shadow-xl max-w-4xl mx-auto relative overflow-hidden text-center text-slate-900 print:shadow-none print:border-amber-600">
            {/* Corner Ornamental Accents */}
            <div className="absolute top-3 left-4 text-2xl text-amber-600/50">✦</div>
            <div className="absolute top-3 right-4 text-2xl text-amber-600/50">✦</div>
            <div className="absolute bottom-3 left-4 text-2xl text-amber-600/50">✦</div>
            <div className="absolute bottom-3 right-4 text-2xl text-amber-600/50">✦</div>

            {/* Seal & Header */}
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-4 border-amber-600 flex items-center justify-center text-3xl shadow-sm">
                🏅
              </div>
            </div>

            <div className="text-xs font-extrabold tracking-widest text-amber-800 uppercase mb-1">
              International Trade & Economics Council
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
              CERTIFICATE OF TRADE MASTERY
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 italic mb-6">
              This official diploma certifies that
            </p>

            {/* Student Name */}
            <div className="border-b-2 border-slate-900/60 max-w-md mx-auto pb-1 mb-6">
              <span className="text-2xl sm:text-3xl font-extrabold text-sky-950 font-serif">
                {studentName || 'Grade 8 Global Trader'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed mb-6">
              has successfully completed all 10 economic missions as Chief Trade Envoy for{' '}
              <strong>{country.flag} {country.name}</strong>, demonstrating mastery in product specialization, export revenues, import customs, international negotiation, and trade surplus calculations.
            </p>

            {/* Honors Badges & Metric Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto mb-8 text-xs">
              <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Appointed Nation</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">
                  {country.flag} {country.name}
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Honorary Rank</div>
                <div className="font-bold text-amber-800 text-xs mt-0.5">
                  {rankTitle}
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Total Mission Score</div>
                <div className="font-extrabold text-emerald-700 text-sm mt-0.5 tabular-nums">
                  {totalGameScore} Points
                </div>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="pt-6 border-t border-amber-200/80 flex flex-wrap items-end justify-between max-w-lg mx-auto text-xs text-slate-500 gap-4">
              <div className="text-center">
                <div className="font-serif italic font-semibold text-slate-800 text-sm">
                  {country.traderName}
                </div>
                <div className="border-t border-slate-400 pt-1 mt-1 text-[10px]">
                  {country.name} Commerce Envoy
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-amber-700 font-bold text-[11px] bg-amber-100/60 px-3 py-1.5 rounded-full border border-amber-300">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>OFFICIALLY VERIFIED</span>
              </div>

              <div className="text-center">
                <div className="font-mono text-slate-700 text-xs">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <div className="border-t border-slate-400 pt-1 mt-1 text-[10px]">
                  Date of Certification
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
