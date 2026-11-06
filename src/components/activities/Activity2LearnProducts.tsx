import React, { useState } from 'react';
import { CountryId, Product } from '../../types/trade';
import { COUNTRIES } from '../../data/countriesData';
import { soundManager } from '../../utils/audio';
import { Lightbulb, DollarSign, Sparkles, CheckCircle2 } from 'lucide-react';

interface Activity2Props {
  countryId: CountryId;
  onComplete: () => void;
}

export const Activity2LearnProducts: React.FC<Activity2Props> = ({
  countryId,
  onComplete,
}) => {
  const country = COUNTRIES[countryId];
  const [selectedProduct, setSelectedProduct] = useState<Product>(country.domesticProducts[0]);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const profitMargin = selectedProduct.baseMarketPrice - selectedProduct.productionCost;
  const markupPercent = Math.round((profitMargin / selectedProduct.productionCost) * 100);

  const handleAnswerQuiz = (index: number) => {
    setSelectedAnswer(index);
    if (index === 1) {
      soundManager.playSuccessChime();
      setQuizAnswered(true);
    } else {
      soundManager.playBuzzer();
    }
  };

  return (
    <div className="space-y-6">
      {/* Activity Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{country.flag}</span>
            <h2 className="text-xl font-bold text-slate-900">
              Activity 2: Product Specialization & Advantage
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-100 text-sky-800">
            Grade 8 Concept: Comparative Advantage
          </span>
        </div>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Why doesn't every country make everything? Because of <strong>Specialization</strong>! A country exports products it can make cheaply and efficiently due to its natural climate, mineral wealth, or advanced factories. Explore {country.name}'s key products below.
        </p>
      </div>

      {/* Main Product Explorer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Product Selector Tabs */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wide px-1">
            {country.name}'s Key Domestic Products
          </div>
          {country.domesticProducts.map((p) => {
            const isSelected = selectedProduct.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedProduct(p);
                }}
                className={`w-full text-left p-3.5 rounded-xl transition-all border flex items-center justify-between ${
                  isSelected
                    ? 'bg-sky-50 border-sky-600 ring-2 ring-sky-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-sky-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 rounded-lg bg-slate-50 border border-slate-200">
                    {p.icon}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{p.name}</div>
                    <div className="text-xs text-slate-500">{p.category}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-emerald-600 tabular-nums">
                    ${p.baseMarketPrice.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">per {p.unit}</div>
                </div>
              </button>
            );
          })}

          {/* Quick Concept Box */}
          <div className="bg-amber-50/80 rounded-xl p-4 border border-amber-200 text-xs text-amber-950 mt-4 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Did You Know?</span>
            </div>
            <p>
              When a country produces a good at a lower opportunity cost than its trading partners, economists call it a <strong>Comparative Advantage</strong>!
            </p>
          </div>
        </div>

        {/* Right: Detailed Product Dossier Card */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-4xl p-2 rounded-xl bg-sky-50 border border-sky-100">
                  {selectedProduct.icon}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedProduct.name}</h3>
                  <div className="text-xs text-slate-500">
                    Category: <span className="font-medium text-slate-700">{selectedProduct.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Global Market Value</div>
                  <div className="text-xl font-bold text-emerald-600 tabular-nums">
                    ${selectedProduct.baseMarketPrice.toLocaleString()} <span className="text-xs text-slate-500 font-normal">/ {selectedProduct.unit}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Uses */}
            <div className="mt-5 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Product Overview
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-sky-50/60 p-3.5 rounded-xl border border-sky-100">
                  <h4 className="text-xs font-bold text-sky-900 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    <span>Why {country.name} Excels Here</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedProduct.whyWeProduce}
                  </p>
                </div>

                <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
                  <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Where It Is Used Everyday</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedProduct.everydayUses}
                  </p>
                </div>
              </div>

              {/* Cost vs Price Math Bar */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Domestic Cost: ${selectedProduct.productionCost.toLocaleString()}</span>
                  <span className="text-emerald-700 font-bold">
                    Export Profit Margin: +${profitMargin.toLocaleString()} (+{markupPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex">
                  <div
                    className="bg-slate-400 h-full"
                    style={{ width: `${Math.round((selectedProduct.productionCost / selectedProduct.baseMarketPrice) * 100)}%` }}
                    title="Production Cost"
                  ></div>
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${Math.min(100, Math.round((profitMargin / selectedProduct.baseMarketPrice) * 100))}%` }}
                    title="Export Margin"
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Factory / Extraction Expense</span>
                  <span>National Trade Profit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Check Question */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-4">
              <div className="text-xs font-bold text-indigo-900 mb-2">
                Quick Check: If {country.name} produces {selectedProduct.name} cheaper than other countries, what should it do?
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleAnswerQuiz(0)}
                  disabled={quizAnswered}
                  className={`p-2.5 rounded-lg text-left border transition-all ${
                    selectedAnswer === 0
                      ? 'bg-rose-100 border-rose-300 text-rose-900'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  A. Stop producing it and import from rivals.
                </button>
                <button
                  onClick={() => handleAnswerQuiz(1)}
                  disabled={quizAnswered}
                  className={`p-2.5 rounded-lg text-left border transition-all ${
                    selectedAnswer === 1 || quizAnswered
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-semibold'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  B. Specialize in it and export it to foreign buyers! ✓
                </button>
              </div>

              {quizAnswered && (
                <div className="mt-3 flex items-center justify-between text-xs text-emerald-800 bg-emerald-100/70 p-2.5 rounded-lg border border-emerald-300">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Correct! Specialization lets countries trade their surplus for goods they lack. (+50 pts)</span>
                  </div>
                  <button
                    onClick={() => {
                      soundManager.playSuccessChime();
                      onComplete();
                    }}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-2xs whitespace-nowrap"
                  >
                    Proceed to Import Goods →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
