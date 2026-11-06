import React, { useState } from 'react';
import { CountryId, InventoryItem } from '../../types/trade';
import { COUNTRIES } from '../../data/countriesData';
import { soundManager } from '../../utils/audio';
import {
  Coins,
  Package,
  Boxes,
  Plus,
  ArrowRight,
  TrendingUp,
  Warehouse,
  CheckCircle2,
} from 'lucide-react';

interface Activity6Props {
  userCountryId: CountryId;
  treasury: number;
  maxStorage: number;
  inventory: InventoryItem[];
  onUpgradeStorage: (additionalSlots: number, cost: number) => void;
  onProduceGoods: (productId: string, quantity: number, cost: number) => void;
  onProceedToProblems: () => void;
}

export const Activity6ManageMoney: React.FC<Activity6Props> = ({
  userCountryId,
  treasury,
  maxStorage,
  inventory,
  onUpgradeStorage,
  onProduceGoods,
  onProceedToProblems,
}) => {
  const country = COUNTRIES[userCountryId];

  const totalUsedStorage = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const storagePercent = Math.min(100, Math.round((totalUsedStorage / maxStorage) * 100));

  // Estimate total asset value in warehouse
  const totalInventoryValue = inventory.reduce((sum, item) => {
    return sum + item.quantity * item.avgCost;
  }, 0);

  const totalNetWorth = treasury + totalInventoryValue;

  const [selectedProduceId, setSelectedProduceId] = useState<string>(country.domesticProducts[0].id);
  const [produceQuantity, setProduceQuantity] = useState<number>(15);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const activeProduct = country.domesticProducts.find((p) => p.id === selectedProduceId)!;
  const productionCost = activeProduct.productionCost * produceQuantity;
  const canAffordProduce = treasury >= productionCost;
  const canFitProduce = totalUsedStorage + produceQuantity <= maxStorage;

  const handleProduce = () => {
    if (!canAffordProduce || !canFitProduce) return;

    soundManager.playClick();
    onProduceGoods(selectedProduceId, produceQuantity, productionCost);
    setActionNotice(
      `🏭 Production complete! Added ${produceQuantity} ${activeProduct.unit} of ${activeProduct.name} to warehouse.`
    );
  };

  const handleUpgradeWarehouse = () => {
    const cost = 35000;
    if (treasury < cost) return;

    soundManager.playSuccessChime();
    onUpgradeStorage(150, cost);
    setActionNotice('🏗️ Harbor warehouse expanded by +150 cargo crates!');
  };

  return (
    <div className="space-y-6">
      {/* Activity Overview Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏭</span>
            <h2 className="text-xl font-bold text-slate-900">
              Activity 6: Manage Money and Products
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
            Concept: Treasury & Inventory Balance
          </span>
        </div>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          A successful global trader must balance liquid cash (treasury) with physical inventory (warehouse products). If your warehouse fills up, you cannot import; if your warehouse is empty, you cannot fulfill profitable export orders!
        </p>
      </div>

      {/* Financial Health & Storage Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Treasury */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Treasury Reserves</span>
            <Coins className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 tabular-nums">
            ${treasury.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Liquid cash for imports & factory payroll
          </div>
        </div>

        {/* Warehouse Inventory Value */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Warehouse Value</span>
            <Boxes className="w-5 h-5 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-sky-600 tabular-nums">
            ${totalInventoryValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Physical merchandise ready to sell
          </div>
        </div>

        {/* Total National Net Worth */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">National Net Worth</span>
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            ${totalNetWorth.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Cash reserves + warehouse assets
          </div>
        </div>

        {/* Storage Capacity Gauge */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Storage Capacity</span>
              <Warehouse className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {totalUsedStorage} / {maxStorage} <span className="text-xs text-slate-400 font-normal">crates</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  storagePercent > 85 ? 'bg-rose-500' : storagePercent > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${storagePercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>{storagePercent}% Full</span>
              <span>{maxStorage - totalUsedStorage} Slots Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Warehouse Inventory Breakdown & Domestic Production */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Inventory Goods Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-sky-600" />
              <span>Current Warehouse Goods</span>
            </h3>
            <span className="text-xs text-slate-500">
              {inventory.length} distinct item types
            </span>
          </div>

          {inventory.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              Your warehouse is empty! Produce domestic goods or import from abroad.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {inventory.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-lg bg-slate-50 border border-slate-100">
                      {item.icon}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{item.productName}</div>
                      <div className="text-[11px] text-slate-500">
                        {item.category} · Origin: {COUNTRIES[item.originCountryId]?.name || 'Domestic'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 tabular-nums text-sm">
                      {item.quantity} {item.unit}
                    </div>
                    <div className="text-[11px] text-slate-500 tabular-nums">
                      Valued at ${(item.quantity * item.avgCost).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Warehouse Upgrade Card */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Expand Warehouse Storage (+150 Crates)
              </div>
              <div className="text-[11px] text-slate-500">
                Modernize dockside bays to handle higher trade volumes. Cost: $35,000.
              </div>
            </div>
            <button
              onClick={handleUpgradeWarehouse}
              disabled={treasury < 35000}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-medium text-xs rounded-lg transition-colors whitespace-nowrap"
            >
              Expand Storage ($35,000)
            </button>
          </div>
        </div>

        {/* Right: Domestic Factory Production Desk */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <Plus className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900">Domestic Factory Production</h3>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Spend national treasury funds to harvest crops, extract minerals, or assemble manufactured goods in {country.name}'s domestic facilities.
            </p>

            {/* Select domestic product */}
            <div className="space-y-2 mb-4">
              <label className="text-xs font-bold text-slate-700">Choose Product to Manufacture:</label>
              <div className="grid grid-cols-1 gap-2">
                {country.domesticProducts.map((p) => {
                  const isSelected = selectedProduceId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProduceId(p.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-400'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{p.icon}</span>
                        <div>
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-[10px] text-slate-500">${p.productionCost.toLocaleString()} per {p.unit}</div>
                        </div>
                      </div>
                      <span className="font-semibold text-emerald-700">
                        Sells for ${p.baseMarketPrice.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Slider */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Production Volume:</span>
                <span className="font-bold text-emerald-700 tabular-nums">
                  {produceQuantity} {activeProduct.unit}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={produceQuantity}
                onChange={(e) => setProduceQuantity(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Total Production Cost */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-600">Total Factory Expense:</span>
              <span className="font-bold text-slate-900 tabular-nums text-sm">
                ${productionCost.toLocaleString()}
              </span>
            </div>

            {/* Warnings */}
            <div className="mt-2 text-xs space-y-1">
              {!canAffordProduce && (
                <div className="text-rose-600 font-semibold">
                  ⚠️ Need ${(productionCost - treasury).toLocaleString()} more in treasury.
                </div>
              )}
              {!canFitProduce && (
                <div className="text-amber-600 font-semibold">
                  ⚠️ Not enough warehouse crates! Expand storage or export goods.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={handleProduce}
              disabled={!canAffordProduce || !canFitProduce}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-xs transition-all text-xs"
            >
              Start Domestic Production Run
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onProceedToProblems();
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <span>Solve Real-World Trade Crises (Activity 7)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
