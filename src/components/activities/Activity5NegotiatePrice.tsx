import React, { useState } from 'react';
import { CountryId } from '../../types/trade';
import { COUNTRIES } from '../../data/countriesData';
import { soundManager } from '../../utils/audio';
import { Handshake, MessageSquare, Award, CheckCircle2, RotateCcw } from 'lucide-react';

interface Activity5Props {
  userCountryId: CountryId;
  onNegotiationSuccess: (bonusPoints: number, savings: number) => void;
  onProceedToWarehouse: () => void;
}

interface DealScenario {
  id: string;
  partnerId: CountryId;
  dealType: 'IMPORT' | 'EXPORT';
  title: string;
  item: string;
  unit: string;
  quantity: number;
  initialUnitPrice: number;
  targetDiscount: number; // acceptable discount range
}

export const Activity5NegotiatePrice: React.FC<Activity5Props> = ({
  userCountryId,
  onNegotiationSuccess,
  onProceedToWarehouse,
}) => {
  const partnerIds = (Object.keys(COUNTRIES) as CountryId[]).filter((id) => id !== userCountryId);

  // Default scenario: Negotiating import of partner goods or export of domestic goods
  const [selectedPartnerId, setSelectedPartnerId] = useState<CountryId>(partnerIds[0]);
  const partner = COUNTRIES[selectedPartnerId];

  // Scenario config
  const scenario: DealScenario = {
    id: 'scen_1',
    partnerId: selectedPartnerId,
    dealType: 'IMPORT',
    title: `Bulk Purchase of ${partner.name} Specialty Cargo`,
    item: partner.domesticProducts[0].name,
    unit: partner.domesticProducts[0].unit,
    quantity: 25,
    initialUnitPrice: partner.domesticProducts[0].baseMarketPrice,
    targetDiscount: -10, // acceptable baseline
  };

  const [counterPercent, setCounterPercent] = useState<number>(-8); // Slider percentage (-25% to +15%)
  const [selectedTactics, setSelectedTactics] = useState<string[]>([]);
  const [dealStatus, setDealStatus] = useState<'negotiating' | 'accepted' | 'rejected'>('negotiating');
  const [negotiationRounds, setNegotiationRounds] = useState<number>(0);

  // Tactics that students can choose to bolster their argument
  const TACTICS = [
    {
      id: 'bulk',
      title: 'Offer Bulk Order Guarantee',
      desc: 'Promise to buy 30% more volume next quarter.',
      moodBonus: 5,
    },
    {
      id: 'fta',
      title: 'Cite Free Trade Agreement (FTA)',
      desc: 'Remind them of our mutual zero-tariff diplomatic treaty.',
      moodBonus: 7,
    },
    {
      id: 'fast_berth',
      title: 'Provide Priority Port Docking',
      desc: 'Waive seaport waiting fees for their cargo freighters.',
      moodBonus: 6,
    },
    {
      id: 'cash_advance',
      title: 'Immediate Wire Payment in Trade Credits',
      desc: 'Pay 100% upfront so their factories avoid debt interest.',
      moodBonus: 4,
    },
  ];

  const toggleTactic = (id: string) => {
    soundManager.playClick();
    setSelectedTactics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  // Compute partner mood score
  // If player asks for -20% discount without tactics, partner gets mad!
  // If player adds tactics, partner accepts up to -16% discount!
  const tacticsBonus = selectedTactics.reduce((sum, tid) => {
    const t = TACTICS.find((item) => item.id === tid);
    return sum + (t ? t.moodBonus : 0);
  }, 0);

  // Total balance: positive = pleased, negative = resistant
  const moodScore = 15 + counterPercent + tacticsBonus;

  let moodEmoji = '😐';
  let moodLabel = 'Considering Your Proposal';
  let moodColor = 'text-slate-600';
  let partnerQuote = `"We are open to business, but your price needs economic justification."`;

  if (moodScore >= 20) {
    moodEmoji = '😍';
    moodLabel = 'Thrilled! Outstanding Deal';
    moodColor = 'text-emerald-600';
    partnerQuote = `"Your diplomatic arguments and port cooperation make this a fantastic win-win partnership! Let's sign!"`;
  } else if (moodScore >= 10) {
    moodEmoji = '😊';
    moodLabel = 'Receptive & Friendly';
    moodColor = 'text-emerald-600';
    partnerQuote = `"That is a fair compromise. Our ministry will approve this adjusted pricing."`;
  } else if (moodScore >= 0) {
    moodEmoji = '🤨';
    moodLabel = 'Skeptical / Needs Incentive';
    moodColor = 'text-amber-600';
    partnerQuote = `"You're asking for a substantial discount. Can you offer bulk volume or port benefits in return?"`;
  } else {
    moodEmoji = '😡';
    moodLabel = 'Offended / Unacceptable Lowball';
    moodColor = 'text-rose-600';
    partnerQuote = `"This offer doesn't even cover our raw factory production costs! We cannot trade at a loss!"`;
  }

  const calculatedUnitPrice = Math.round(
    scenario.initialUnitPrice * (1 + counterPercent / 100)
  );
  const totalBase = scenario.quantity * scenario.initialUnitPrice;
  const totalProposed = scenario.quantity * calculatedUnitPrice;
  const savings = totalBase - totalProposed;

  const handleProposeDeal = () => {
    setNegotiationRounds((r) => r + 1);

    if (moodScore >= 10) {
      soundManager.playGavel();
      setTimeout(() => soundManager.playSuccessChime(), 250);
      setDealStatus('accepted');
      onNegotiationSuccess(75, Math.abs(savings));
    } else {
      soundManager.playBuzzer();
      setDealStatus('rejected');
    }
  };

  const handleResetNegotiation = () => {
    soundManager.playClick();
    setCounterPercent(-8);
    setSelectedTactics([]);
    setDealStatus('negotiating');
  };

  return (
    <div className="space-y-6">
      {/* Activity Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤝</span>
            <h2 className="text-xl font-bold text-slate-900">
              Activity 5: Negotiate Product Prices
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
            Concept: Trade Diplomacy & Win-Win Bargaining
          </span>
        </div>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          In real international commerce, posted prices are rarely set in stone! Countries negotiate price discounts, bulk concessions, and tariff exemptions. Bargain with the foreign delegate below.
        </p>
      </div>

      {/* Select Partner Envoy */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
          Select Diplomatic Partner to Negotiate With:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {partnerIds.map((pid) => {
            const p = COUNTRIES[pid];
            const isSelected = selectedPartnerId === pid;
            return (
              <button
                key={pid}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedPartnerId(pid);
                  setDealStatus('negotiating');
                  setSelectedTactics([]);
                }}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-indigo-300'
                }`}
              >
                <span className="text-3xl">{p.flag}</span>
                <div>
                  <div className="text-sm font-bold text-slate-900">{p.traderName}</div>
                  <div className="text-[11px] text-slate-500">{p.name}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Negotiation Chamber */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Partner Envoy Card & Mood Meter */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
              <span className="text-4xl p-2 rounded-xl bg-slate-100 border border-slate-200">
                {partner.traderAvatar}
              </span>
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                  <span>{partner.traderName}</span>
                  <span className="text-lg">{partner.flag}</span>
                </h3>
                <div className="text-xs text-slate-500">{partner.traderRole}</div>
                <div className="text-[11px] text-indigo-700 font-medium">Represents {partner.name}</div>
              </div>
            </div>

            {/* Speech Bubble / Quote */}
            <div className="relative bg-slate-100 rounded-2xl p-4 mb-5 border border-slate-200">
              <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                <span>Partner Delegate Response:</span>
              </div>
              <p className="text-sm text-slate-800 italic leading-relaxed">
                {partnerQuote}
              </p>
            </div>

            {/* Partner Emotion & Mood Meter */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-600">Partner Sentiment:</span>
                <span className={`font-bold flex items-center gap-1 text-sm ${moodColor}`}>
                  <span className="text-xl">{moodEmoji}</span>
                  <span>{moodLabel}</span>
                </span>
              </div>

              {/* Progress Bar of Acceptance */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    moodScore >= 10 ? 'bg-emerald-500' : moodScore >= 0 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.max(5, Math.min(100, (moodScore + 15) * 2.5))}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0% Deal Refusal</span>
                <span>50% Compromise</span>
                <span>100% Deal Stamp</span>
              </div>
            </div>
          </div>

          {/* Handshake Art Visual */}
          <div className="mt-5 rounded-xl overflow-hidden border border-slate-200 relative h-28 hidden sm:block">
            <img
              src="/src/assets/images/trade_deal_handshake_1793953916323.jpg"
              alt="International Trade Agreement"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-slate-900/30 flex items-end p-2.5">
              <span className="text-[11px] text-white font-medium bg-slate-900/70 px-2 py-0.5 rounded">
                Bilateral Trade Negotiation Protocol
              </span>
            </div>
          </div>
        </div>

        {/* Right: Negotiation Controls, Counter-offer Slider, Tactics */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Handshake className="w-5 h-5 text-indigo-600" />
                <span>Bargaining Desk</span>
              </h3>
              <span className="text-xs text-slate-500">
                Item: <strong>{scenario.item}</strong> ({scenario.quantity} {scenario.unit})
              </span>
            </div>

            {/* Pricing Slider */}
            <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 mb-5 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-semibold">Standard Catalog Price:</span>
                <span className="font-medium text-slate-500 tabular-nums">
                  ${scenario.initialUnitPrice.toLocaleString()} / {scenario.unit}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-indigo-950">Your Counter-Offer Adjustment:</span>
                  <span
                    className={`font-extrabold text-sm tabular-nums ${
                      counterPercent < 0 ? 'text-emerald-700' : 'text-slate-700'
                    }`}
                  >
                    {counterPercent > 0 ? `+${counterPercent}%` : `${counterPercent}%`} discount
                  </span>
                </div>
                <input
                  type="range"
                  min="-25"
                  max="10"
                  step="1"
                  value={counterPercent}
                  onChange={(e) => {
                    setCounterPercent(Number(e.target.value));
                    if (dealStatus !== 'negotiating') setDealStatus('negotiating');
                  }}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>-25% (Aggressive Discount)</span>
                  <span>-10% (Diplomatic Target)</span>
                  <span>0% (Standard)</span>
                </div>
              </div>

              {/* Price outcome */}
              <div className="pt-2 border-t border-indigo-200/60 flex justify-between items-center text-xs">
                <span className="text-indigo-900 font-semibold">Proposed Price per Unit:</span>
                <span className="font-bold text-base text-indigo-950 tabular-nums">
                  ${calculatedUnitPrice.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ {scenario.unit}</span>
                </span>
              </div>
            </div>

            {/* Tactics Selector */}
            <div className="space-y-2 mb-5">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Strengthen Your Proposal (Pick 1-2 Tactics):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TACTICS.map((tactic) => {
                  const isChecked = selectedTactics.includes(tactic.id);
                  return (
                    <button
                      key={tactic.id}
                      onClick={() => toggleTactic(tactic.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-400 text-emerald-950 shadow-2xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs mb-1">
                        <span>{tactic.title}</span>
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          +{tactic.moodBonus} Mood
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{tactic.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Financial comparison */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-600">Total Purchase Value:</span>
              <div className="text-right">
                <span className="font-bold text-slate-900 tabular-nums text-sm">
                  ${totalProposed.toLocaleString()}
                </span>
                {savings > 0 && (
                  <span className="text-emerald-600 font-semibold block text-[11px]">
                    (Saves your nation ${savings.toLocaleString()}!)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Deal Outcome / Action Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
            {dealStatus === 'accepted' ? (
              <div className="space-y-3">
                <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold text-sm">🎉 Deal Officially Signed & Sealed!</div>
                    <div>
                      {partner.traderName} accepted the discounted rate. Your country saved <strong>${savings.toLocaleString()}</strong> and earned <strong>+75 Trade Negotiation Points</strong>!
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onProceedToWarehouse();
                  }}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-all text-center text-xs"
                >
                  Proceed to Manage Warehouse & Money (Activity 6) →
                </button>
              </div>
            ) : dealStatus === 'rejected' ? (
              <div className="space-y-3">
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
                  <div className="font-bold">❌ Deal Rejected!</div>
                  <div>
                    {partner.traderName} felt the discount was too extreme without enough benefits. Try choosing a gentler discount or enabling more tactical concessions!
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleResetNegotiation}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Offer</span>
                  </button>
                  <button
                    onClick={handleProposeDeal}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Resubmit Adjusted Proposal
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleProposeDeal}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <Award className="w-4 h-4" />
                <span>Present Terms to {partner.traderName}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
