import React, { useState } from 'react';
import { RefreshCw, Calendar, Pause, Play, Trash2, CheckCircle2, ShieldCheck, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SubscriptionsManager: React.FC = () => {
  const {
    subscriptions,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    updateSubscriptionFrequency,
    formatPrice,
    setActiveView
  } = useStore();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Active' | 'Paused' | 'Cancelled'>('All');

  const filtered = subscriptions.filter(s => activeFilter === 'All' || s.status === activeFilter);

  const activeCount = subscriptions.filter(s => s.status === 'Active').length;
  const totalMonthlySpend = subscriptions
    .filter(s => s.status === 'Active')
    .reduce((sum, s) => sum + (s.pricePerDelivery * (30 / s.frequencyDays)), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 text-white rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-xl border border-emerald-800/40">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-200">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>VIP Auto-Replenishment Vault</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif">
            Manage Your Subscriptions
          </h1>
          <p className="text-xs md:text-sm text-emerald-100/80 leading-relaxed font-sans">
            Enjoy guaranteed 15-20% savings, priority batch dispatch, and complete control. Pause, skip, or modify frequency whenever your ritual changes.
          </p>

          <div className="flex flex-wrap gap-6 pt-4 border-t border-emerald-800/60 text-xs">
            <div>
              <span className="text-emerald-300 block text-[10px] uppercase font-bold">Active Subscriptions</span>
              <span className="text-2xl font-extrabold text-white font-serif">{activeCount}</span>
            </div>
            <div>
              <span className="text-emerald-300 block text-[10px] uppercase font-bold">Est. Monthly Total</span>
              <span className="text-2xl font-extrabold text-emerald-300 font-serif">{formatPrice(totalMonthlySpend)}</span>
            </div>
            <div>
              <span className="text-emerald-300 block text-[10px] uppercase font-bold">Perk Status</span>
              <span className="text-sm font-bold text-white flex items-center gap-1 mt-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                VIP Free Express Shipping
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div className="flex gap-2">
          {(['All', 'Active', 'Paused', 'Cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === tab
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab} ({subscriptions.filter(s => tab === 'All' || s.status === tab).length})
            </button>
          ))}
        </div>

        <button
          onClick={() => setActiveView('store')}
          className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
        >
          Add New Subscription Formula
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Subscriptions Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 space-y-4">
          <RefreshCw className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-lg font-bold text-stone-800 font-serif">No {activeFilter.toLowerCase()} subscriptions found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Subscribe to your favorite skincare and supplements during checkout to unlock 15-20% off every recurring order.
          </p>
          <button
            onClick={() => setActiveView('store')}
            className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800"
          >
            Explore Subscribable Essentials
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Badge */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-mono text-stone-400">
                    {sub.subscriptionNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      sub.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : sub.status === 'Paused'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>

                {/* Product Info */}
                <div className="flex gap-3 items-center mb-4">
                  <img
                    src={sub.productImage}
                    alt={sub.productName}
                    className="w-16 h-16 rounded-xl object-cover bg-stone-100 border border-stone-200"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 line-clamp-1 font-serif">
                      {sub.productName}
                    </h4>
                    <span className="text-xs font-extrabold text-emerald-800 block mt-0.5">
                      {formatPrice(sub.pricePerDelivery)} / delivery
                    </span>
                    <span className="text-[10px] text-stone-400 block">
                      Deliveries Completed: {sub.deliveriesCompleted}
                    </span>
                  </div>
                </div>

                {/* Frequency & Next Date Box */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-2 text-xs mb-4">
                  <div className="flex justify-between items-center text-stone-600">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-stone-500" />
                      Next Order Date:
                    </span>
                    <span className="font-bold text-stone-900">
                      {sub.status === 'Active' ? sub.nextDeliveryDate : 'On Hold'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-stone-600 pt-2 border-t border-stone-200">
                    <span className="font-medium">Frequency:</span>
                    <select
                      value={sub.frequencyDays}
                      onChange={(e) => updateSubscriptionFrequency(sub.id, Number(e.target.value) as 30 | 60 | 90)}
                      disabled={sub.status === 'Cancelled'}
                      className="bg-white border border-stone-300 rounded-md px-2 py-0.5 text-xs font-bold text-stone-800 focus:outline-none"
                    >
                      <option value={30}>Every 30 Days</option>
                      <option value={60}>Every 60 Days</option>
                      <option value={90}>Every 90 Days</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-stone-100 flex gap-2">
                {sub.status === 'Active' ? (
                  <button
                    onClick={() => pauseSubscription(sub.id)}
                    className="flex-1 py-2 px-3 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 flex items-center justify-center gap-1"
                  >
                    <Pause className="w-3.5 h-3.5 text-amber-600" />
                    Pause
                  </button>
                ) : sub.status === 'Paused' ? (
                  <button
                    onClick={() => resumeSubscription(sub.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 flex items-center justify-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Resume
                  </button>
                ) : null}

                {sub.status !== 'Cancelled' && (
                  <button
                    onClick={() => cancelSubscription(sub.id)}
                    className="py-2 px-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center justify-center gap-1"
                    title="Cancel Subscription"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Cancel
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
