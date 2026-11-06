import React from 'react';
import { CountryId } from '../../types/trade';
import { COUNTRIES } from '../../data/countriesData';
import { soundManager } from '../../utils/audio';
import { Coins, Package, Compass, Check } from 'lucide-react';

interface Activity1Props {
  selectedCountryId: CountryId;
  onSelectCountry: (id: CountryId) => void;
  onConfirmChoice: () => void;
}

export const Activity1ChooseCountry: React.FC<Activity1Props> = ({
  selectedCountryId,
  onSelectCountry,
  onConfirmChoice,
}) => {
  const current = COUNTRIES[selectedCountryId];

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card with Generated Art */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white shadow-lg border border-sky-800/40">
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <img
            src="/src/assets/images/hero_global_trade_map_1793953915021.jpg"
            alt="Global Trade Globe"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative p-6 sm:p-8 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-300 tracking-wide uppercase mb-2">
            <span>Activity 1 of 10</span>
            <span aria-hidden="true">·</span>
            <span>Grade 8 Economics Briefing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3">
            Choose Your Trading Nation
          </h1>
          <p className="text-sm sm:text-base text-sky-100 leading-relaxed mb-4">
            Welcome, Commissioner! In this simulation, you will manage international trade for one of five dynamic countries. Your goal is to export domestic goods, import vital supplies, negotiate smart deals, and build a healthy <strong>Trade Surplus</strong>!
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-800/60 border border-sky-400/30 text-xs text-sky-200">
            <Compass className="w-4 h-4 text-sky-300" />
            <span>Select a country below to review its economic dossier and starting treasury.</span>
          </div>
        </div>
      </div>

      {/* Country Selection Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span>Choose Your Nation</span>
          <span className="text-xs text-slate-500 font-normal">(Tap a card to switch)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {(Object.keys(COUNTRIES) as CountryId[]).map((cid) => {
            const country = COUNTRIES[cid];
            const isSelected = selectedCountryId === cid;

            return (
              <button
                key={cid}
                onClick={() => {
                  soundManager.playClick();
                  onSelectCountry(cid);
                }}
                className={`text-left p-4 rounded-xl transition-all relative flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-sky-50/90 border-sky-600 ring-2 ring-sky-500/30 shadow-md'
                    : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-xs'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}

                <div>
                  <div className="text-4xl mb-2" aria-hidden="true">{country.flag}</div>
                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {country.name}
                  </h3>
                  <div className="text-xs text-slate-500 mb-2">
                    Capital: {country.capital}
                  </div>
                  <div className="text-xs text-slate-600 line-clamp-3 mb-3">
                    {country.economicSummary}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium text-emerald-700">
                    ${(country.startingTreasury / 1000).toFixed(0)}k Start
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {country.region}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Country Profile Dossier */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-4">
            <div className="text-5xl sm:text-6xl p-2 rounded-2xl bg-slate-50 border border-slate-200">
              {current.flag}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-slate-900">{current.name}</h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {current.region}
                </span>
              </div>
              <p className="text-xs text-slate-500 italic mt-0.5">"{current.motto}"</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                <span className="text-lg">{current.traderAvatar}</span>
                <span>Led by <strong>{current.traderName}</strong> ({current.traderRole})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 self-start md:self-center">
            <div className="text-left sm:text-right">
              <div className="text-xs text-slate-500">Starting Treasury</div>
              <div className="text-xl font-bold text-emerald-600 tabular-nums flex items-center sm:justify-end gap-1">
                <Coins className="w-5 h-5" />
                ${current.startingTreasury.toLocaleString()}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="text-left sm:text-right">
              <div className="text-xs text-slate-500">Warehouse Space</div>
              <div className="text-xl font-bold text-sky-600 tabular-nums flex items-center sm:justify-end gap-1">
                <Package className="w-5 h-5" />
                {current.initialWarehouseSlots} Units
              </div>
            </div>
          </div>
        </div>

        {/* Economic Advantage Deep Dive for Grade 8 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200/80">
            <div className="text-xs font-bold text-emerald-900 uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <span>🌟 Domestic Strengths (Exports)</span>
            </div>
            <p className="text-xs text-emerald-950 mb-3">
              {current.name} produces these products efficiently at low domestic cost:
            </p>
            <div className="space-y-2">
              {current.domesticProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-xs bg-white/80 p-2 rounded-lg border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{p.icon}</span>
                    <span className="font-semibold text-slate-800">{p.name}</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    Produces at ${p.productionCost.toLocaleString()}/{p.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/80">
            <div className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <span>🔍 What We Must Import (Scarcity)</span>
            </div>
            <p className="text-xs text-amber-950 mb-3">
              No country can make everything alone. {current.name} relies on trade partners for:
            </p>
            <div className="space-y-2">
              {current.neededImports.map((imp, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-white/80 p-2 rounded-lg border border-amber-100">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{imp.icon}</span>
                    <div>
                      <div className="font-semibold text-slate-800">{imp.productName}</div>
                      <div className="text-[10px] text-slate-500">From {imp.bestSupplier}</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
                    Import Need
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={() => {
              soundManager.playSuccessChime();
              onConfirmChoice();
            }}
            className="w-full sm:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Confirm & Start as {current.name}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
