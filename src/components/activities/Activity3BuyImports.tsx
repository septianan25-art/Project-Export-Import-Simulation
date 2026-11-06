import React, { useState } from 'react';
import { CountryId, Product } from '../../types/trade';
import { COUNTRIES } from '../../data/countriesData';
import { WorldTradeMap } from '../WorldTradeMap';
import { soundManager } from '../../utils/audio';
import { ShoppingCart, Ship, ShieldCheck, ArrowDownRight, CheckCircle2 } from 'lucide-react';

interface Activity3Props {
  userCountryId: CountryId;
  treasury: number;
  availableStorage: number;
  onExecuteImport: (
    sellerCountryId: CountryId,
    product: Product,
    quantity: number,
    totalCost: number,
    shippingFee: number,
    tariffFee: number
  ) => void;
  onProceedToExport: () => void;
}

export const Activity3BuyImports: React.FC<Activity3Props> = ({
  userCountryId,
  treasury,
  availableStorage,
  onExecuteImport,
  onProceedToExport,
}) => {
  const partnerCountryIds = (Object.keys(COUNTRIES) as CountryId[]).filter(
    (id) => id !== userCountryId
  );

  const [selectedPartnerId, setSelectedPartnerId] = useState<CountryId>(partnerCountryIds[0]);
  const partner = COUNTRIES[selectedPartnerId];

  const [selectedProduct, setSelectedProduct] = useState<Product>(partner.domesticProducts[0]);
  const [quantity, setQuantity] = useState<number>(10);
  const [lastImportedMessage, setLastImportedMessage] = useState<string | null>(null);

  // When partner changes, pick their first product
  const handleSelectPartner = (id: CountryId) => {
    setSelectedPartnerId(id);
    setSelectedProduct(COUNTRIES[id].domesticProducts[0]);
    setLastImportedMessage(null);
  };

  // Calculations
  const basePrice = selectedProduct.baseMarketPrice * quantity;
  const shippingFee = Math.round(basePrice * 0.05); // 5% ocean freight
  const tariffFee = Math.round(basePrice * 0.06); // 6% import tariff
  const totalCost = basePrice + shippingFee + tariffFee;

  const canAfford = treasury >= totalCost;
  const hasStorage = availableStorage >= quantity;

  const handleBuy = () => {
    if (!canAfford || !hasStorage) return;

    soundManager.playShipHorn();
    setTimeout(() => soundManager.playCoin(), 300);

    onExecuteImport(
      selectedPartnerId,
      selectedProduct,
      quantity,
      totalCost,
      shippingFee,
      tariffFee
    );

    setLastImportedMessage(
      `Successfully imported ${quantity} ${selectedProduct.unit} of ${selectedProduct.name} from ${partner.name}! Cargo has arrived at your harbor warehouse.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Activity Overview Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚢</span>
            <h2 className="text-xl font-bold text-slate-900">
              Activity 3: Buy Products from Other Countries (Import)
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
            Concept: Importing = Money Out, Goods In
          </span>
        </div>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Select a trading partner on the interactive world map or click the country tabs below. Choose products that your country lacks, examine shipping fees and tariffs, and dispatch cargo freighters!
        </p>
      </div>

      {/* World Map Component */}
      <WorldTradeMap
        selectedCountryId={userCountryId}
        activePartnerId={selectedPartnerId}
        onSelectPartner={handleSelectPartner}
      />

      {/* Partner Country Selector Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
          Select Trading Partner:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {partnerCountryIds.map((pid) => {
            const p = COUNTRIES[pid];
            const isSelected = selectedPartnerId === pid;
            return (
              <button
                key={pid}
                onClick={() => {
                  soundManager.playClick();
                  handleSelectPartner(pid);
                }}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'bg-sky-50 border-sky-600 ring-2 ring-sky-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-sky-300'
                }`}
              >
                <span className="text-3xl">{p.flag}</span>
                <div>
                  <div className="text-sm font-bold text-slate-900">{p.name}</div>
                  <div className="text-[11px] text-slate-500">{p.region}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Import Marketplace: Products & Cart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Available Products from Partner */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <span>{partner.flag}</span>
              <span>Goods Produced in {partner.name}</span>
            </h3>
            <span className="text-xs text-slate-500">Pick an item to import</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {partner.domesticProducts.map((prod) => {
              const isSelected = selectedProduct.id === prod.id;
              return (
                <button
                  key={prod.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedProduct(prod);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl p-2 rounded-lg bg-slate-50 border border-slate-200">
                      {prod.icon}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{prod.name}</div>
                      <div className="text-[11px] text-slate-500">{prod.category}</div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Unit Price:</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      ${prod.baseMarketPrice.toLocaleString()} / {prod.unit}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Educational Concept Box */}
          <div className="mt-5 p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
            <strong>Why are we importing this?</strong> {selectedProduct.description} Importing gives your domestic businesses and families high quality goods that would cost too much or take too long to make domestically.
          </div>
        </div>

        {/* Import Order & Price Calculator */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <ShoppingCart className="w-5 h-5 text-sky-600" />
              <h3 className="font-bold text-slate-900">Import Purchase Order</h3>
            </div>

            {/* Selected Item Summary */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4">
              <span className="text-3xl">{selectedProduct.icon}</span>
              <div>
                <div className="font-bold text-sm text-slate-900">{selectedProduct.name}</div>
                <div className="text-xs text-slate-500">
                  Seller: {partner.flag} {partner.name}
                </div>
              </div>
            </div>

            {/* Quantity Selector Slider & Steppers */}
            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Import Quantity:</span>
                <span className="font-bold text-sky-600 tabular-nums text-sm">
                  {quantity} {selectedProduct.unit}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>5 (Small batch)</span>
                <span>25 (Standard)</span>
                <span>50 (Bulk fleet)</span>
              </div>
            </div>

            {/* Transparent Cost Breakdown */}
            <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Base Cost ({quantity} × ${selectedProduct.baseMarketPrice.toLocaleString()}):</span>
                <span className="font-medium text-slate-900 tabular-nums">${basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 text-slate-600">
                  <Ship className="w-3.5 h-3.5 text-sky-500" />
                  Ocean Freight & Logistics (5%):
                </span>
                <span className="font-medium text-slate-900 tabular-nums">+${shippingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 text-slate-600">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  Import Customs Tariff (6%):
                </span>
                <span className="font-medium text-slate-900 tabular-nums">+${tariffFee.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Import Bill:</span>
                <span className="text-rose-600 tabular-nums flex items-center">
                  <ArrowDownRight className="w-4 h-4 inline" />
                  ${totalCost.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Validation checks */}
            <div className="mt-3 space-y-1 text-xs">
              {!canAfford && (
                <div className="text-rose-600 font-semibold">
                  ⚠️ Insufficient funds in treasury! You need ${(totalCost - treasury).toLocaleString()} more.
                </div>
              )}
              {!hasStorage && (
                <div className="text-amber-600 font-semibold">
                  ⚠️ Not enough warehouse storage space! Free up space by exporting goods first.
                </div>
              )}
            </div>
          </div>

          {/* Action Button & Confirmation Message */}
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
            {lastImportedMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{lastImportedMessage}</span>
              </div>
            )}

            <button
              onClick={handleBuy}
              disabled={!canAfford || !hasStorage}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Dispatch Cargo Ships & Pay ${totalCost.toLocaleString()}</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onProceedToExport();
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-all text-center"
            >
              Now Let's Sell Products Abroad (Export) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
