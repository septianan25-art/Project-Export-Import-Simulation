/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CountryId, Product, InventoryItem, TradeTransaction } from './types/trade';
import { COUNTRIES } from './data/countriesData';
import { soundManager } from './utils/audio';

import { TopNav } from './components/TopNav';
import { ActivityNavigation } from './components/ActivityNavigation';

import { Activity1ChooseCountry } from './components/activities/Activity1ChooseCountry';
import { Activity2LearnProducts } from './components/activities/Activity2LearnProducts';
import { Activity3BuyImports } from './components/activities/Activity3BuyImports';
import { Activity4SellExports } from './components/activities/Activity4SellExports';
import { Activity5NegotiatePrice } from './components/activities/Activity5NegotiatePrice';
import { Activity6ManageMoney } from './components/activities/Activity6ManageMoney';
import { Activity7SolveProblems } from './components/activities/Activity7SolveProblems';
import { Activity8CalculateValues } from './components/activities/Activity8CalculateValues';
import { Activity9SurplusDeficit } from './components/activities/Activity9SurplusDeficit';
import { Activity10FinalChallenge } from './components/activities/Activity10FinalChallenge';

export default function App() {
  const [selectedCountryId, setSelectedCountryId] = useState<CountryId>('indonesia');
  const [currentActivity, setCurrentActivity] = useState<number>(1);
  const [completedActivities, setCompletedActivities] = useState<number[]>([]);
  const [score, setScore] = useState<number>(50);
  const [soundMuted, setSoundMuted] = useState<boolean>(soundManager.getMuted());

  // Economic state
  const country = COUNTRIES[selectedCountryId];
  const [treasury, setTreasury] = useState<number>(country.startingTreasury);
  const [maxStorage, setMaxStorage] = useState<number>(country.initialWarehouseSlots);

  // Initial starter inventory based on country's domestic products
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    return country.domesticProducts.slice(0, 3).map((p) => ({
      productId: p.id,
      productName: p.name,
      quantity: 30,
      unit: p.unit,
      avgCost: p.productionCost,
      category: p.category,
      icon: p.icon,
      originCountryId: country.id,
    }));
  });

  const [transactions, setTransactions] = useState<TradeTransaction[]>([]);

  // Update starting values if country is switched in Activity 1
  const handleSelectCountry = (id: CountryId) => {
    setSelectedCountryId(id);
    const newCountry = COUNTRIES[id];
    setTreasury(newCountry.startingTreasury);
    setMaxStorage(newCountry.initialWarehouseSlots);
    setInventory(
      newCountry.domesticProducts.slice(0, 3).map((p) => ({
        productId: p.id,
        productName: p.name,
        quantity: 30,
        unit: p.unit,
        avgCost: p.productionCost,
        category: p.category,
        icon: p.icon,
        originCountryId: id,
      }))
    );
  };

  const markCompleted = (actId: number) => {
    if (!completedActivities.includes(actId)) {
      setCompletedActivities((prev) => [...prev, actId]);
    }
  };

  const handleToggleSound = () => {
    const isMuted = soundManager.toggleMute();
    setSoundMuted(isMuted);
  };

  // Activity 1 completion
  const handleConfirmChoice = () => {
    markCompleted(1);
    setScore((s) => s + 50);
    setCurrentActivity(2);
  };

  // Activity 2 completion
  const handleCompleteActivity2 = () => {
    markCompleted(2);
    setScore((s) => s + 50);
    setCurrentActivity(3);
  };

  // Activity 3: Execute Import
  const handleExecuteImport = (
    sellerCountryId: CountryId,
    product: Product,
    quantity: number,
    totalCost: number,
    shippingFee: number,
    tariffFee: number
  ) => {
    setTreasury((t) => t - totalCost);
    setScore((s) => s + 60);
    markCompleted(3);

    // Add to inventory
    setInventory((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            unit: product.unit,
            avgCost: product.baseMarketPrice,
            category: product.category,
            icon: product.icon,
            originCountryId: sellerCountryId,
          },
        ];
      }
    });

    // Record transaction
    const newTx: TradeTransaction = {
      id: `tx_${Date.now()}_imp`,
      timestamp: Date.now(),
      type: 'IMPORT',
      partnerCountryId: sellerCountryId,
      productName: product.name,
      quantity,
      unitPrice: product.baseMarketPrice,
      totalValue: totalCost,
      shippingFee,
      tariffFee,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Activity 4: Execute Export
  const handleExecuteExport = (
    buyerCountryId: CountryId,
    productId: string,
    quantity: number,
    totalEarned: number
  ) => {
    setTreasury((t) => t + totalEarned);
    setScore((s) => s + 75);
    markCompleted(4);

    // Remove from inventory
    setInventory((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, item.quantity - quantity) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

    // Record transaction
    const prod = country.domesticProducts.find((p) => p.id === productId);
    const newTx: TradeTransaction = {
      id: `tx_${Date.now()}_exp`,
      timestamp: Date.now(),
      type: 'EXPORT',
      partnerCountryId: buyerCountryId,
      productName: prod?.name || 'Domestic Goods',
      quantity,
      unitPrice: Math.round(totalEarned / quantity),
      totalValue: totalEarned,
      shippingFee: 0,
      tariffFee: 0,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Produce Domestic Goods (Activity 4 & 6)
  const handleProduceDomesticGoods = (
    productId: string,
    quantity: number,
    cost: number
  ) => {
    setTreasury((t) => t - cost);

    const prod = country.domesticProducts.find((p) => p.id === productId);
    if (!prod) return;

    setInventory((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            productId: prod.id,
            productName: prod.name,
            quantity: quantity,
            unit: prod.unit,
            avgCost: prod.productionCost,
            category: prod.category,
            icon: prod.icon,
            originCountryId: selectedCountryId,
          },
        ];
      }
    });
  };

  // Activity 5: Negotiation Success
  const handleNegotiationSuccess = (bonusPoints: number) => {
    setScore((s) => s + bonusPoints);
    markCompleted(5);
  };

  // Activity 6: Upgrade Storage
  const handleUpgradeStorage = (additionalSlots: number, cost: number) => {
    setTreasury((t) => t - cost);
    setMaxStorage((m) => m + additionalSlots);
    setScore((s) => s + 40);
    markCompleted(6);
  };

  // Activity 7: Trade Problem Solved
  const handleApplyProblemImpact = (costImpact: number, scorePoints: number) => {
    setTreasury((t) => t + costImpact);
    setScore((s) => s + scorePoints);
    markCompleted(7);
  };

  // Activity 8: Math Challenge Solved
  const handleCalculationSolved = (points: number) => {
    setScore((s) => s + points);
    markCompleted(8);
  };

  // Activity 9: Balance scale explored
  const handleCompleteActivity9 = () => {
    markCompleted(9);
    setScore((s) => s + 50);
  };

  // Restart Mission
  const handleResetMission = () => {
    soundManager.playClick();
    setCurrentActivity(1);
    setCompletedActivities([]);
    setScore(50);
    handleSelectCountry('indonesia');
    setTransactions([]);
  };

  // Scroll to top on activity step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentActivity]);

  const currentAvailableStorage =
    maxStorage - inventory.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      {/* Top Bar Contract (Wordmark, Nav links, Action Cluster) */}
      <TopNav
        score={score}
        treasury={treasury}
        currentActivity={currentActivity}
        onSelectActivity={setCurrentActivity}
        onResetGame={handleResetMission}
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
      />

      {/* Stepper Navigation Strip */}
      <ActivityNavigation
        currentActivity={currentActivity}
        completedActivities={completedActivities}
        onSelectActivity={setCurrentActivity}
      />

      {/* Main Content Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentActivity === 1 && (
          <Activity1ChooseCountry
            selectedCountryId={selectedCountryId}
            onSelectCountry={handleSelectCountry}
            onConfirmChoice={handleConfirmChoice}
          />
        )}

        {currentActivity === 2 && (
          <Activity2LearnProducts
            countryId={selectedCountryId}
            onComplete={handleCompleteActivity2}
          />
        )}

        {currentActivity === 3 && (
          <Activity3BuyImports
            userCountryId={selectedCountryId}
            treasury={treasury}
            availableStorage={currentAvailableStorage}
            onExecuteImport={handleExecuteImport}
            onProceedToExport={() => setCurrentActivity(4)}
          />
        )}

        {currentActivity === 4 && (
          <Activity4SellExports
            userCountryId={selectedCountryId}
            inventory={inventory}
            treasury={treasury}
            onExecuteExport={handleExecuteExport}
            onProduceDomesticGoods={handleProduceDomesticGoods}
            onProceedToNegotiate={() => setCurrentActivity(5)}
          />
        )}

        {currentActivity === 5 && (
          <Activity5NegotiatePrice
            userCountryId={selectedCountryId}
            onNegotiationSuccess={handleNegotiationSuccess}
            onProceedToWarehouse={() => setCurrentActivity(6)}
          />
        )}

        {currentActivity === 6 && (
          <Activity6ManageMoney
            userCountryId={selectedCountryId}
            treasury={treasury}
            maxStorage={maxStorage}
            inventory={inventory}
            onUpgradeStorage={handleUpgradeStorage}
            onProduceGoods={handleProduceDomesticGoods}
            onProceedToProblems={() => setCurrentActivity(7)}
          />
        )}

        {currentActivity === 7 && (
          <Activity7SolveProblems
            userCountryId={selectedCountryId}
            onApplyProblemImpact={handleApplyProblemImpact}
            onProceedToCalculator={() => setCurrentActivity(8)}
          />
        )}

        {currentActivity === 8 && (
          <Activity8CalculateValues
            userCountryId={selectedCountryId}
            transactions={transactions}
            onCalculationChallengeSolved={handleCalculationSolved}
            onProceedToScale={() => setCurrentActivity(9)}
          />
        )}

        {currentActivity === 9 && (
          <Activity9SurplusDeficit
            userCountryId={selectedCountryId}
            transactions={transactions}
            onComplete={handleCompleteActivity9}
            onProceedToExam={() => setCurrentActivity(10)}
          />
        )}

        {currentActivity === 10 && (
          <Activity10FinalChallenge
            userCountryId={selectedCountryId}
            totalGameScore={score}
            treasury={treasury}
            onAddScore={(pts) => {
              setScore((s) => s + pts);
              markCompleted(10);
            }}
            onRestartMission={handleResetMission}
          />
        )}
      </main>

      {/* Grade 8 Educational Glossary & Quiet Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200/90 py-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Grade 8 International Trade Pocket Glossary
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-900 block mb-0.5">Export (Out)</span>
                <span className="text-slate-500 text-[11px] leading-relaxed">
                  Goods sent out of your country to foreign buyers. Earns foreign money.
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-900 block mb-0.5">Import (In)</span>
                <span className="text-slate-500 text-[11px] leading-relaxed">
                  Goods brought into your country from foreign sellers. Costs money.
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-emerald-800 block mb-0.5">Trade Surplus</span>
                <span className="text-slate-500 text-[11px] leading-relaxed">
                  Export Value &gt; Import Value. More money earned than spent!
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-rose-800 block mb-0.5">Trade Deficit</span>
                <span className="text-slate-500 text-[11px] leading-relaxed">
                  Import Value &gt; Export Value. More money spent abroad than earned.
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-amber-800 block mb-0.5">Import Tariff</span>
                <span className="text-slate-500 text-[11px] leading-relaxed">
                  A government customs tax added to imported foreign products.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <div>
              Global Trade Mission · Interactive Economics Simulation for Grade 8
            </div>
            <div className="flex items-center gap-3">
              <span>Indonesia 🇮🇩</span>
              <span>·</span>
              <span>Japan 🇯🇵</span>
              <span>·</span>
              <span>Australia 🇦🇺</span>
              <span>·</span>
              <span>Saudi Arabia 🇸🇦</span>
              <span>·</span>
              <span>South Korea 🇰🇷</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
