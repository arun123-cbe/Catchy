import React from 'react';
import { RefreshCw, Calendar, DollarSign, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminSubscriptions: React.FC = () => {
  const { subscriptions, formatPrice } = useStore();

  const activeSubs = subscriptions.filter(s => s.status === 'Active');
  const pausedSubs = subscriptions.filter(s => s.status === 'Paused');

  const mrrUSD = activeSubs.reduce((sum, s) => {
    // Convert per delivery price into 30-day equivalent
    return sum + (s.pricePerDelivery * (30 / s.frequencyDays));
  }, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-stone-900 font-serif">Subscriptions Overview & MRR</h2>
        <p className="text-xs text-stone-500">Monitor recurring subscriber retention, monthly recurring revenue, and scheduled replenishments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-stone-500 uppercase">Monthly Recurring Revenue (MRR)</span>
          <div className="text-2xl font-extrabold text-emerald-800 font-serif mt-1">
            {formatPrice(mrrUSD)}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">+22% month-over-month growth</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-stone-500 uppercase">Active VIP Subscribers</span>
          <div className="text-2xl font-extrabold text-stone-900 font-serif mt-1">
            {activeSubs.length} Active
          </div>
          <span className="text-[11px] text-stone-400 block mt-1">{pausedSubs.length} Currently Paused</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-stone-500 uppercase">Average Subscription Value</span>
          <div className="text-2xl font-extrabold text-stone-900 font-serif mt-1">
            {formatPrice(activeSubs.length > 0 ? mrrUSD / activeSubs.length : 0)}
          </div>
          <span className="text-[11px] text-stone-400 block mt-1">Per active subscriber</span>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 border-b border-stone-200 uppercase tracking-wider text-[10px] text-stone-500 font-bold">
              <tr>
                <th className="p-4">Subscriber</th>
                <th className="p-4">Product Formula</th>
                <th className="p-4">Delivery Cycle</th>
                <th className="p-4">Price / Cycle</th>
                <th className="p-4">Next Delivery</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 font-medium">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-stone-900 block">{sub.customerName}</span>
                    <span className="text-[10px] text-stone-400 font-mono">{sub.customerEmail}</span>
                  </td>

                  <td className="p-4 flex items-center gap-2">
                    <img src={sub.productImage} alt={sub.productName} className="w-8 h-8 rounded-lg object-cover bg-stone-100" />
                    <span className="font-bold text-stone-800 line-clamp-1">{sub.productName}</span>
                  </td>

                  <td className="p-4 font-bold text-stone-700">
                    Every {sub.frequencyDays} Days
                  </td>

                  <td className="p-4 font-extrabold text-emerald-800">
                    {formatPrice(sub.pricePerDelivery)}
                  </td>

                  <td className="p-4 font-mono text-stone-600">
                    {sub.nextDeliveryDate}
                  </td>

                  <td className="p-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        sub.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : sub.status === 'Paused'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
