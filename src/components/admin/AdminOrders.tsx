import React, { useState } from 'react';
import { ShoppingBag, Search, Eye, Truck, CheckCircle2, Clock, X, QrCode, CreditCard, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, formatPrice } = useStore();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'All'>('All');
  const [selectedOrderModal, setSelectedOrderModal] = useState<Order | null>(null);

  const filtered = orders.filter(o => {
    const matchesStatus = selectedStatus === 'All' || o.status === selectedStatus;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      (o.paymentDetails.upiRefNo && o.paymentDetails.upiRefNo.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const statuses: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 font-serif">Customer Orders & Gateway Audit</h2>
          <p className="text-xs text-stone-500">Track dispatch status, verify UPI transaction IDs, and update logistics tracking numbers</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-stone-200">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by Order #, Customer, or UPI Ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-800 focus:outline-none"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(['All', ...statuses] as const).map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedStatus === st ? 'bg-stone-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 border-b border-stone-200 uppercase tracking-wider text-[10px] text-stone-500 font-bold">
              <tr>
                <th className="p-4">Order # & Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Payment Gateway</th>
                <th className="p-4">Total</th>
                <th className="p-4">Logistics Status</th>
                <th className="p-4 text-right">View / Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 font-medium">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                  
                  <td className="p-4">
                    <span className="font-bold text-stone-900 font-mono block">{ord.orderNumber}</span>
                    <span className="text-[10px] text-stone-400">{new Date(ord.createdAt).toLocaleDateString()}</span>
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-stone-900 block">{ord.customer.name}</span>
                    <span className="text-[10px] text-stone-400">{ord.customer.email}</span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      {ord.paymentMethod === 'UPI' ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <QrCode className="w-3 h-3 text-emerald-600" />
                          UPI ({ord.paymentDetails.upiId || 'App Pay'})
                        </span>
                      ) : (
                        <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-indigo-600" />
                          Card (•••• {ord.paymentDetails.cardLast4 || '4242'})
                        </span>
                      )}
                    </div>
                    {ord.paymentDetails.upiRefNo && (
                      <span className="text-[9px] font-mono text-stone-400 block mt-0.5">Ref: {ord.paymentDetails.upiRefNo}</span>
                    )}
                  </td>

                  <td className="p-4 font-bold text-stone-900">
                    {formatPrice(ord.total)}
                  </td>

                  <td className="p-4">
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : ord.status === 'Shipped'
                          ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                          : ord.status === 'Processing'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-stone-100 text-stone-700 border-stone-300'
                      }`}
                    >
                      {statuses.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedOrderModal(ord)}
                      className="p-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors inline-flex items-center gap-1 text-[11px] font-bold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Details
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setSelectedOrderModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-stone-900 font-serif mb-1">
              Order {selectedOrderModal.orderNumber}
            </h3>
            <span className="text-xs text-stone-400 font-mono">
              Placed on {new Date(selectedOrderModal.createdAt).toLocaleString()}
            </span>

            {/* Customer Box */}
            <div className="mt-4 p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
              <span className="font-bold text-stone-800 uppercase block">Shipping Address:</span>
              <p className="text-stone-700 font-medium">{selectedOrderModal.customer.name}</p>
              <p className="text-stone-500">{selectedOrderModal.customer.address}, {selectedOrderModal.customer.city} - {selectedOrderModal.customer.pincode}</p>
              <p className="text-stone-500">Contact: {selectedOrderModal.customer.phone} | {selectedOrderModal.customer.email}</p>
            </div>

            {/* Items List */}
            <div className="mt-4 space-y-2">
              <span className="text-xs font-bold text-stone-800 uppercase block">Items Purchased:</span>
              <div className="divide-y divide-stone-100 text-xs">
                {selectedOrderModal.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={item.productImage} alt={item.productName} className="w-10 h-10 rounded-lg object-cover bg-stone-100" />
                      <div>
                        <span className="font-bold text-stone-900 block">{item.productName}</span>
                        <span className="text-[10px] text-stone-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="mt-4 pt-3 border-t border-stone-200 flex justify-between font-bold text-sm text-stone-900">
              <span>Grand Total Paid</span>
              <span>{formatPrice(selectedOrderModal.total)}</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
