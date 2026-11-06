import React, { useState } from 'react';
import { CountryId, TradeOrder, InventoryItem } from '../../types/trade';
import { COUNTRIES } from '../../data/countriesData';
import { soundManager } from '../../utils/audio';
import { ArrowUpRight, CheckCircle2, TrendingUp, AlertCircle, PlusCircle } from 'lucide-react';

interface Activity4Props {
  userCountryId: CountryId;
  inventory: InventoryItem[];
  treasury: number;
  onExecuteExport: (
    buyerCountryId: CountryId,
    productId: string,
    quantity: number,
    totalEarned: number
  ) => void;
  onProduceDomesticGoods: (productId: string, quantity: number, cost: number) => void;
  onProceedToNegotiate: () => void;
}

export const Activity4SellExports: React.FC<Activity4Props> = ({
  userCountryId,
  inventory,
  treasury,
  onExecuteExport,
  onProduceDomesticGoods,
  onProceedToNegotiate,
}) => {
  const userCountry = COUNTRIES[userCountryId];

  // Generate dynamic incoming export orders tailored to user's domestic products
  const partnerCountryIds = (Object.keys(COUNTRIES) as CountryId[]).filter(
    (id) => id !== userCountryId
  );

  const [activeOrders, setActiveOrders] = useState<TradeOrder[]>(() => {
    return userCountry.domesticProducts.map((p, idx) => {
      const buyerId = partnerCountryIds[idx % partnerCountryIds.length];
      const buyer = COUNTRIES[buyerId];
      const qty = (idx + 1) * 15;
      const premiumPrice = Math.round(p.baseMarketPrice * (1.1 + (idx * 0.04))); // 10% to 22% above base!

      return {
        id: `exp_${p.id}_${idx}`,
        buyerCountryId: buyerId,
        sellerCountryId: userCountryId,
        productId: p.id,
        productName: p.name,
        icon: p.icon,
        quantity: qty,
        unit: p.unit,
        offeredPricePerUnit: premiumPrice,
        urgency: idx === 0 ? 'High Demand' : 'Normal',
        storyDescription: `${buyer.name} factories require ${qty} ${p.unit} of ${p.name} to fulfill domestic manufacturing contracts!`,
      };
    });
  });

  const [fulfilledOrderIds, setFulfilledOrderIds] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check inventory for a product
  const getProductStock = (productId: string) => {
    const item = inventory.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  };

  // Handle Export Fulfillment
  const handleFulfillOrder = (order: TradeOrder) => {
    const stock = getProductStock(order.productId);
    if (stock < order.quantity) return;

    const totalRevenue = order.quantity * order.offeredPricePerUnit;

    soundManager.playCoin();
    setTimeout(() => soundManager.playSuccessChime(), 200);

    onExecuteExport(order.buyerCountryId, order.productId, order.quantity, totalRevenue);
    setFulfilledOrderIds((prev) => [...prev, order.id]);

    const buyer = COUNTRIES[order.buyerCountryId];
    setSuccessMessage(
      `🎉 Export contract fulfilled! Shipped ${order.quantity} ${order.unit} of ${order.productName} to ${buyer.flag} ${buyer.name}. Earned +$${totalRevenue.toLocaleString()} in foreign exchange revenue!`
    );
  };

  // Handle Quick Domestic Production to restock
  const handleQuickProduce = (productId: string, qty: number) => {
    const prod = userCountry.domesticProducts.find((p) => p.id === productId);
    if (!prod) return;

    const cost = prod.productionCost * qty;
    if (treasury < cost) return;

    soundManager.playClick();
    onProduceDomesticGoods(productId, qty, cost);
  };

  return (
    <div className="space-y-6">
      {/* Activity Overview Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <h2 className="text-xl font-bold text-slate-900">
              Activity 4: Sell Products to Other Countries (Export)
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
            Concept: Exporting = Goods Exit, Foreign Money Enters
          </span>
        </div>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Foreign governments and factories want to purchase your country's domestic specialty products! Review the incoming purchase orders below. If you need more inventory to fulfill an order, produce batches at your domestic factories.
        </p>
      </div>

      {/* Hero Banner with Port Illustration */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 shadow-md border border-emerald-800/40">
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <img
            src="/src/assets/images/trade_cargo_port_1793953916319.jpg"
            alt="Cargo Export Seaport"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative max-w-2xl">
          <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wide mb-1">
            Global Trade Exchange · Outbound Cargo
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Fulfill International Export Orders
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Every export you complete brings foreign wealth directly into your national treasury. High export volumes are the key to building a strong <strong>Trade Surplus</strong>!
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-900 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Export Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeOrders.map((order) => {
          const buyer = COUNTRIES[order.buyerCountryId];
          const stock = getProductStock(order.productId);
          const hasEnough = stock >= order.quantity;
          const isFulfilled = fulfilledOrderIds.includes(order.id);
          const totalEarned = order.quantity * order.offeredPricePerUnit;
          const prod = userCountry.domesticProducts.find((p) => p.id === order.productId)!;
          const produceCost = prod.productionCost * order.quantity;

          return (
            <div
              key={order.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isFulfilled
                  ? 'bg-emerald-50/70 border-emerald-300 opacity-90'
                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs'
              }`}
            >
              <div>
                {/* Header: Buyer info & urgency */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{buyer.flag}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Buyer: {buyer.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {buyer.region}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      order.urgency === 'High Demand'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {order.urgency}
                  </span>
                </div>

                {/* Requested Item */}
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                    {order.icon}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{order.productName}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{order.storyDescription}</p>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs mb-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Order Quantity:</span>
                    <span className="font-bold text-slate-900">{order.quantity} {order.unit}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Buyer Offer Price:</span>
                    <span className="font-semibold text-emerald-700">
                      ${order.offeredPricePerUnit.toLocaleString()} / {order.unit}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 text-slate-900 font-bold">
                    <span>Total Export Revenue:</span>
                    <span className="text-emerald-600 flex items-center tabular-nums text-sm">
                      <ArrowUpRight className="w-4 h-4 inline" />
                      +${totalEarned.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Warehouse Stock Check */}
                <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-100/70 border border-slate-200 mb-3">
                  <span className="text-slate-600">Your Warehouse Stock:</span>
                  <span
                    className={`font-bold tabular-nums ${
                      hasEnough ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {stock} / {order.quantity} {order.unit}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                {isFulfilled ? (
                  <div className="w-full py-2.5 rounded-xl bg-emerald-100 text-emerald-800 text-center text-xs font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Contract Fulfilled & Paid!</span>
                  </div>
                ) : hasEnough ? (
                  <button
                    onClick={() => handleFulfillOrder(order)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Ship Cargo & Collect +${totalEarned.toLocaleString()}</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="text-[11px] text-amber-800 flex items-center gap-1 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Not enough in stock. Produce {order.quantity - stock} more units!</span>
                    </div>
                    <button
                      onClick={() => handleQuickProduce(order.productId, order.quantity - stock)}
                      disabled={treasury < produceCost}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Produce in Factories (Cost: ${produceCost.toLocaleString()})</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Step CTA */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="text-sm font-bold text-slate-900">
            Ready to test your bargaining skills?
          </div>
          <div className="text-xs text-slate-500">
            Activity 5 introduces price negotiations, tariffs, and diplomat moods!
          </div>
        </div>
        <button
          onClick={() => {
            soundManager.playClick();
            onProceedToNegotiate();
          }}
          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
        >
          <span>Go to Price Negotiation Activity →</span>
        </button>
      </div>
    </div>
  );
};
