import React, { useState } from 'react';
import { CountryId, TradeTransaction } from '../../types/trade';
import { COUNTRIES } from '../../data/countriesData';
import { soundManager } from '../../utils/audio';
import { Scale, TrendingUp, TrendingDown, ArrowRight, RefreshCw, Award } from 'lucide-react';

interface Activity9Props {
  userCountryId: CountryId;
  transactions: TradeTransaction[];
  onComplete: () => void;
  onProceedToExam: () => void;
}

export const Activity9SurplusDeficit: React.FC<Activity9Props> = ({
  userCountryId,
  transactions,
  onComplete,
  onProceedToExam,
}) => {
  const country = COUNTRIES[userCountryId];

  // Live game transactions
  const liveExports = transactions
    .filter((t) => t.type === 'EXPORT')
    .reduce((sum, t) => sum + t.totalValue, 0);

  const liveImports = transactions
    .filter((t) => t.type === 'IMPORT')
    .reduce((sum, t) => sum + t.totalValue, 0);

  // Fallback defaults if student jumped straight here
  const defaultExports = liveExports > 0 ? liveExports : 520000;
  const defaultImports = liveImports > 0 ? liveImports : 340000;

  // Interactive "What-If" simulation sliders
  const [simExports, setSimExports] = useState<number>(defaultExports);
  const [simImports, setSimImports] = useState<number>(defaultImports);

  // Compute balance
  const balance = simExports - simImports;
  const isSurplus = balance > 0;
  const isDeficit = balance < 0;
  const isEquilibrium = balance === 0;

  // Scale tilt angle (-15 deg for max surplus tilt, +15 deg for max deficit tilt)
  const maxDiff = 400000;
  const rawTilt = (balance / maxDiff) * -14; // negative rotates counter-clockwise (left dips down)
  const tiltAngle = Math.max(-15, Math.min(15, rawTilt));

  // Visual crate stacks count (1 to 5)
  const exportCrates = Math.min(5, Math.max(1, Math.round(simExports / 100000)));
  const importCrates = Math.min(5, Math.max(1, Math.round(simImports / 100000)));

  return (
    <div className="space-y-6">
      {/* Activity Overview Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            <h2 className="text-xl font-bold text-slate-900">
              Activity 9: Trade Surplus or Deficit?
            </h2>
          </div>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              isSurplus
                ? 'bg-emerald-100 text-emerald-800'
                : isDeficit
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            Status: {isSurplus ? 'Trade Surplus 📈' : isDeficit ? 'Trade Deficit 📉' : 'Equilibrium ⚖️'}
          </span>
        </div>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          The <strong>Balance of Trade</strong> compares what your country sells abroad versus what it buys from other nations. Watch the physical seesaw scale tip as money and products flow across international borders!
        </p>
      </div>

      {/* Main Dynamic Seesaw Scale Stage */}
      <div className="bg-gradient-to-b from-sky-950 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white border border-sky-800/40 shadow-xl overflow-hidden relative">
        {/* Scale Status Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-sky-500/30 text-xs font-semibold uppercase tracking-wider text-sky-200 mb-2">
            <span>{country.flag} {country.name}'s National Balance Scale</span>
          </div>

          <h3
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight transition-colors ${
              isSurplus
                ? 'text-emerald-400'
                : isDeficit
                ? 'text-amber-400'
                : 'text-sky-300'
            }`}
          >
            {isSurplus
              ? `TRADE SURPLUS (+ $${balance.toLocaleString()})`
              : isDeficit
              ? `TRADE DEFICIT (- $${Math.abs(balance).toLocaleString()})`
              : 'PERFECT TRADE EQUILIBRIUM ($0)'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-2">
            {isSurplus
              ? `${country.name} earned more from foreign exports than it spent on foreign imports. Foreign cash reserves are growing!`
              : isDeficit
              ? `${country.name} spent more on foreign imports than it earned from exports. Money is leaving the country.`
              : `Exports exactly equal Imports. Total incoming currency balances total outgoing currency.`}
          </p>
        </div>

        {/* Dynamic SVG Seesaw Balance Scale */}
        <div className="relative w-full max-w-2xl mx-auto py-8">
          <svg viewBox="0 0 700 360" className="w-full h-auto block select-none">
            <defs>
              <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <filter id="glowPlate">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Central Fulcrum Stand */}
            <polygon points="350,190 320,310 380,310" fill="#334155" stroke="#475569" strokeWidth="2" />
            <rect x="290" y="310" width="120" height="16" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            <circle cx="350" cy="190" r="14" fill="#cbd5e1" stroke="#0f172a" strokeWidth="3" />

            {/* Tilting Group: Pivot at (350, 190) */}
            <g
              transform={`rotate(${tiltAngle}, 350, 190)`}
              className="transition-transform duration-500 ease-out"
            >
              {/* Main Lever Beam */}
              <rect x="70" y="184" width="560" height="12" rx="6" fill="url(#beamGrad)" stroke="#475569" strokeWidth="1" />
              <circle cx="350" cy="190" r="6" fill="#0f172a" />

              {/* Left End Joint (Exports) at (100, 190) */}
              <g transform="translate(100, 190)">
                {/* Suspended chains */}
                <line x1="0" y1="0" x2="-35" y2="70" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="0" y1="0" x2="35" y2="70" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
                {/* Left Pan */}
                <path d="M -55 70 Q 0 88 55 70 Z" fill="#065f46" stroke="#34d399" strokeWidth="2.5" />

                {/* Left Cargo Box Stacks */}
                {Array.from({ length: exportCrates }).map((_, i) => (
                  <g key={i} transform={`translate(0, ${52 - i * 16})`}>
                    <rect x="-22" y="-12" width="44" height="14" rx="3" fill="#10b981" stroke="#047857" strokeWidth="1" />
                    <text x="0" y="-2" textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="bold" fill="#ffffff">
                      ${(simExports / 1000).toFixed(0)}k
                    </text>
                  </g>
                ))}

                {/* Left Label */}
                <text x="0" y="105" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#34d399">
                  EXPORTS
                </text>
                <text x="0" y="120" textAnchor="middle" fontSize="10" fill="#a7f3d0">
                  Goods OUT · Cash IN
                </text>
              </g>

              {/* Right End Joint (Imports) at (600, 190) */}
              <g transform="translate(600, 190)">
                {/* Suspended chains */}
                <line x1="0" y1="0" x2="-35" y2="70" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="0" y1="0" x2="35" y2="70" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
                {/* Right Pan */}
                <path d="M -55 70 Q 0 88 55 70 Z" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="2.5" />

                {/* Right Cargo Box Stacks */}
                {Array.from({ length: importCrates }).map((_, i) => (
                  <g key={i} transform={`translate(0, ${52 - i * 16})`}>
                    <rect x="-22" y="-12" width="44" height="14" rx="3" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
                    <text x="0" y="-2" textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="bold" fill="#ffffff">
                      ${(simImports / 1000).toFixed(0)}k
                    </text>
                  </g>
                ))}

                {/* Right Label */}
                <text x="0" y="105" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#38bdf8">
                  IMPORTS
                </text>
                <text x="0" y="120" textAnchor="middle" fontSize="10" fill="#bae6fd">
                  Goods IN · Cash OUT
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* Live Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-2">
          <div className="bg-emerald-950/60 p-4 rounded-xl border border-emerald-500/30 flex items-center justify-between">
            <div>
              <div className="text-xs text-emerald-300 font-semibold">Total Export Sales</div>
              <div className="text-xl font-bold text-white tabular-nums">${simExports.toLocaleString()}</div>
            </div>
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>

          <div className="bg-sky-950/60 p-4 rounded-xl border border-sky-500/30 flex items-center justify-between">
            <div>
              <div className="text-xs text-sky-300 font-semibold">Total Import Spending</div>
              <div className="text-xl font-bold text-white tabular-nums">${simImports.toLocaleString()}</div>
            </div>
            <TrendingDown className="w-6 h-6 text-sky-400" />
          </div>
        </div>
      </div>

      {/* Interactive "What-If" Policy Simulator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900">
              Interactive "What-If" Economic Policy Simulator
            </h3>
            <p className="text-xs text-slate-500">
              Drag the sliders below to see how increasing exports or cutting imports tips the national seesaw scale!
            </p>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              setSimExports(defaultExports);
              setSimImports(defaultImports);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Game Values</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Export slider */}
          <div className="space-y-2 p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <div className="flex justify-between items-center text-xs font-bold text-emerald-900">
              <span>National Export Sales:</span>
              <span className="text-sm tabular-nums">${simExports.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="900000"
              step="25000"
              value={simExports}
              onChange={(e) => setSimExports(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-emerald-700">
              <span>$50,000 (Low Exports)</span>
              <span>$900,000 (Booming Exports)</span>
            </div>
          </div>

          {/* Import slider */}
          <div className="space-y-2 p-4 rounded-xl bg-sky-50/60 border border-sky-200">
            <div className="flex justify-between items-center text-xs font-bold text-sky-900">
              <span>National Import Purchases:</span>
              <span className="text-sm tabular-nums">${simImports.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="900000"
              step="25000"
              value={simImports}
              onChange={(e) => setSimImports(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-sky-700">
              <span>$50,000 (Frugal Imports)</span>
              <span>$900,000 (Heavy Imports)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grade 8 Conceptual Explanation Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
          <div className="font-bold text-emerald-900 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Why is a Trade Surplus Helpful?</span>
          </div>
          <p className="leading-relaxed">
            When Exports {'>'} Imports, money flows into domestic factories. This creates local jobs, builds up foreign currency reserves, and strengthens the country's currency value.
          </p>
        </div>

        <div className="bg-sky-50 p-4 rounded-xl border border-sky-200 text-xs text-sky-950 space-y-1">
          <div className="font-bold text-sky-900 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-sky-600" />
            <span>Can a Trade Deficit Ever Be Good?</span>
          </div>
          <p className="leading-relaxed">
            Yes! If a country imports high-tech robotics, solar panels, or factory equipment, it is investing in its future productive capacity. However, long-term borrowing to fund consumer luxuries can lead to heavy national debt.
          </p>
        </div>
      </div>

      {/* CTA to Activity 10 */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={() => {
            soundManager.playSuccessChime();
            onComplete();
            onProceedToExam();
          }}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold rounded-xl shadow-xs transition-all flex items-center gap-2 text-xs sm:text-sm"
        >
          <Award className="w-5 h-5 text-slate-900" />
          <span>Ready for the Final Challenge & Trader Medal! (Activity 10)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
