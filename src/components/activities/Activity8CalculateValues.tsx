import React, { useState } from 'react';
import { CountryId, TradeTransaction } from '../../types/trade';
import { COUNTRIES } from '../../data/countriesData';
import { soundManager } from '../../utils/audio';
import {
  Calculator,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface Activity8Props {
  userCountryId: CountryId;
  transactions: TradeTransaction[];
  onCalculationChallengeSolved: (points: number) => void;
  onProceedToScale: () => void;
}

export const Activity8CalculateValues: React.FC<Activity8Props> = ({
  userCountryId,
  transactions,
  onCalculationChallengeSolved,
  onProceedToScale,
}) => {
  const country = COUNTRIES[userCountryId];

  // Live game transactions math
  const exportTxs = transactions.filter((t) => t.type === 'EXPORT');
  const importTxs = transactions.filter((t) => t.type === 'IMPORT');

  const liveTotalExports = exportTxs.reduce((sum, t) => sum + t.totalValue, 0);
  const liveTotalImports = importTxs.reduce((sum, t) => sum + t.totalValue, 0);
  const liveBalance = liveTotalExports - liveTotalImports;

  // Grade 8 Practice Problem States
  const [q1Input, setQ1Input] = useState<string>('');
  const [q1State, setQ1State] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [q2Input, setQ2Input] = useState<string>('');
  const [q2State, setQ2State] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [q3Input, setQ3Input] = useState<string>('');
  const [q3Type, setQ3Type] = useState<'surplus' | 'deficit'>('surplus');
  const [q3State, setQ3State] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const checkQ1 = () => {
    // 500 tons * $300 = 150000
    const clean = Number(q1Input.replace(/[^0-9]/g, ''));
    if (clean === 150000) {
      soundManager.playSuccessChime();
      setQ1State('correct');
      onCalculationChallengeSolved(40);
    } else {
      soundManager.playBuzzer();
      setQ1State('wrong');
    }
  };

  const checkQ2 = () => {
    // 250 barrels * $80 = 20000
    const clean = Number(q2Input.replace(/[^0-9]/g, ''));
    if (clean === 20000) {
      soundManager.playSuccessChime();
      setQ2State('correct');
      onCalculationChallengeSolved(40);
    } else {
      soundManager.playBuzzer();
      setQ2State('wrong');
    }
  };

  const checkQ3 = () => {
    // $450,000 - $320,000 = $130,000 Surplus
    const clean = Number(q3Input.replace(/[^0-9]/g, ''));
    if (clean === 130000 && q3Type === 'surplus') {
      soundManager.playSuccessChime();
      setQ3State('correct');
      onCalculationChallengeSolved(50);
    } else {
      soundManager.playBuzzer();
      setQ3State('wrong');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧮</span>
            <h2 className="text-xl font-bold text-slate-900">
              Activity 8: Calculate Export & Import Values
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
            Formula: Value = Quantity × Price
          </span>
        </div>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Economists use precise arithmetic to track international commerce. Practice calculating product values and review your country's official trade ledger below.
        </p>
      </div>

      {/* Formula Cheat Sheet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 text-xs text-emerald-950">
          <div className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            <span>Total Export Value</span>
          </div>
          <div className="font-mono text-xs font-semibold bg-white p-2 rounded-lg border border-emerald-200 mb-1">
            Export Value = Quantity × Unit Price
          </div>
          <p className="text-[11px] text-emerald-800">
            Money received from foreign buyers into your economy.
          </p>
        </div>

        <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-200 text-xs text-sky-950">
          <div className="font-bold text-sky-900 flex items-center gap-1.5 mb-1">
            <ArrowDownRight className="w-4 h-4 text-sky-600" />
            <span>Total Import Value</span>
          </div>
          <div className="font-mono text-xs font-semibold bg-white p-2 rounded-lg border border-sky-200 mb-1">
            Import Value = Quantity × Unit Price
          </div>
          <p className="text-[11px] text-sky-800">
            Money paid to foreign sellers for products brought into your country.
          </p>
        </div>

        <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-200 text-xs text-indigo-950">
          <div className="font-bold text-indigo-900 flex items-center gap-1.5 mb-1">
            <Calculator className="w-4 h-4 text-indigo-600" />
            <span>Net Trade Balance</span>
          </div>
          <div className="font-mono text-xs font-semibold bg-white p-2 rounded-lg border border-indigo-200 mb-1">
            Balance = Total Exports - Total Imports
          </div>
          <p className="text-[11px] text-indigo-800">
            Positive number = Surplus; Negative number = Deficit.
          </p>
        </div>
      </div>

      {/* Live Game Trade Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <span>{country.flag}</span>
            <span>{country.name}'s Official Mission Trade Ledger</span>
          </h3>
          <span className="text-xs text-slate-500">
            {transactions.length} Recorded Deal{transactions.length !== 1 ? 's' : ''}
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm bg-slate-50 rounded-xl">
            No transactions yet. Complete buy and sell orders in Activities 3 & 4 to populate your real trade ledger!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Trading Partner</th>
                  <th className="py-2.5 px-3 text-right">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Total Trade Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => {
                  const partner = COUNTRIES[tx.partnerCountryId];
                  const isExport = tx.type === 'EXPORT';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                            isExport
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-sky-100 text-sky-800'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">
                        {tx.productName}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {partner?.flag} {partner?.name}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums text-slate-700">
                        {tx.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums text-slate-700">
                        ${tx.unitPrice.toLocaleString()}
                      </td>
                      <td
                        className={`py-2.5 px-3 text-right font-bold tabular-nums ${
                          isExport ? 'text-emerald-600' : 'text-sky-600'
                        }`}
                      >
                        {isExport ? '+' : '-'}${tx.totalValue.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 font-bold bg-slate-50 text-slate-900">
                  <td colSpan={5} className="py-3 px-3 text-right">
                    Calculated Trade Balance (Exports - Imports):
                  </td>
                  <td
                    className={`py-3 px-3 text-right text-sm tabular-nums ${
                      liveBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {liveBalance >= 0 ? `+$${liveBalance.toLocaleString()}` : `-$${Math.abs(liveBalance).toLocaleString()}`}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Grade 8 Interactive Math Calculation Challenges */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-slate-900">
            Interactive Grade 8 Trade Arithmetic Practice
          </h3>
        </div>

        {/* Problem 1 */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
          <div className="text-xs font-bold text-slate-800">
            Problem 1: Export Math
          </div>
          <p className="text-xs text-slate-600">
            Australia sells <strong>500 tons</strong> of wheat to Saudi Arabia at a negotiated price of <strong>$300 per ton</strong>. What is the total export earnings?
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-600">$</span>
              <input
                type="text"
                placeholder="e.g. 150000"
                value={q1Input}
                onChange={(e) => {
                  setQ1Input(e.target.value);
                  setQ1State('idle');
                }}
                className="w-36 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono tabular-nums focus:outline-sky-500"
              />
            </div>
            <button
              onClick={checkQ1}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-2xs"
            >
              Check Answer
            </button>
            {q1State === 'correct' && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Correct! 500 × $300 = $150,000 (+40 pts)</span>
              </span>
            )}
            {q1State === 'wrong' && (
              <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                <XCircle className="w-4 h-4 text-rose-500" />
                <span>Try again! Multiply 500 tons by 300 dollars.</span>
              </span>
            )}
          </div>
        </div>

        {/* Problem 2 */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
          <div className="text-xs font-bold text-slate-800">
            Problem 2: Import Bill Math
          </div>
          <p className="text-xs text-slate-600">
            South Korea purchases <strong>250 barrels</strong> of crude oil from Saudi Arabia at <strong>$80 per barrel</strong>. How much money leaves South Korea for this import?
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-600">$</span>
              <input
                type="text"
                placeholder="e.g. 20000"
                value={q2Input}
                onChange={(e) => {
                  setQ2Input(e.target.value);
                  setQ2State('idle');
                }}
                className="w-36 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono tabular-nums focus:outline-sky-500"
              />
            </div>
            <button
              onClick={checkQ2}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-2xs"
            >
              Check Answer
            </button>
            {q2State === 'correct' && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Correct! 250 × $80 = $20,000 (+40 pts)</span>
              </span>
            )}
            {q2State === 'wrong' && (
              <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                <XCircle className="w-4 h-4 text-rose-500" />
                <span>Try again! Multiply 250 by 80.</span>
              </span>
            )}
          </div>
        </div>

        {/* Problem 3 */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
          <div className="text-xs font-bold text-slate-800">
            Problem 3: Balance Calculation (Surplus or Deficit)
          </div>
          <p className="text-xs text-slate-600">
            Indonesia exports <strong>$450,000</strong> worth of nickel, but imports <strong>$320,000</strong> worth of machines. Calculate the difference and select whether it is a Surplus or Deficit.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-600">$</span>
              <input
                type="text"
                placeholder="e.g. 130000"
                value={q3Input}
                onChange={(e) => {
                  setQ3Input(e.target.value);
                  setQ3State('idle');
                }}
                className="w-36 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono tabular-nums focus:outline-sky-500"
              />
            </div>

            {/* Surplus/Deficit toggle */}
            <div className="flex rounded-lg border border-slate-300 overflow-hidden text-xs font-medium">
              <button
                onClick={() => setQ3Type('surplus')}
                className={`px-3 py-1.5 ${
                  q3Type === 'surplus'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Surplus
              </button>
              <button
                onClick={() => setQ3Type('deficit')}
                className={`px-3 py-1.5 ${
                  q3Type === 'deficit'
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Deficit
              </button>
            </div>

            <button
              onClick={checkQ3}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-2xs"
            >
              Check Answer
            </button>
            {q3State === 'correct' && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Correct! $450,000 - $320,000 = +$130,000 SURPLUS! (+50 pts)</span>
              </span>
            )}
            {q3State === 'wrong' && (
              <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                <XCircle className="w-4 h-4 text-rose-500" />
                <span>Check: Since Exports ($450k) {'>'} Imports ($320k), it is a positive Surplus!</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Proceed CTA */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={() => {
            soundManager.playClick();
            onProceedToScale();
          }}
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 text-xs sm:text-sm"
        >
          <span>See the Dynamic Seesaw Balance Scale (Activity 9)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
