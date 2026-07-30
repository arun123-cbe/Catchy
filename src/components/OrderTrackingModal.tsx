import React, { useState } from 'react';
import { Search, X, Truck, Package, CheckCircle2, Clock, MapPin, Phone, Mail, ChevronRight, AlertCircle, Calendar, ShieldCheck, Copy, Check } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { useStore } from '../context/StoreContext';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderNumber?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderNumber = ''
}) => {
  const { orders, formatPrice } = useStore();
  const [searchQuery, setSearchQuery] = useState(initialOrderNumber);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(() => {
    if (initialOrderNumber) {
      return orders.find(o => o.orderNumber.toLowerCase() === initialOrderNumber.toLowerCase() || o.id === initialOrderNumber) || null;
    }
    // If there are existing orders, default to the most recent one
    return orders.length > 0 ? orders[0] : null;
  });

  const [copiedTracking, setCopiedTracking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setErrorMsg('');
    const q = searchQuery.trim().toLowerCase();
    const found = orders.find(
      o =>
        o.orderNumber.toLowerCase() === q ||
        o.id.toLowerCase() === q ||
        o.customer.phone.includes(q) ||
        o.customer.email.toLowerCase().includes(q)
    );

    if (found) {
      setSearchedOrder(found);
    } else {
      setSearchedOrder(null);
      setErrorMsg(`No order found matching "${searchQuery}". Please check your Order Number or registered phone number.`);
    }
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Processing':
        return 1;
      case 'Shipped':
        return 2;
      case 'Delivered':
        return 3;
      case 'Cancelled':
        return -1;
      default:
        return 1;
    }
  };

  const currentStep = searchedOrder ? getStatusStepIndex(searchedOrder.status) : 0;

  const steps = [
    { label: 'Order Placed', desc: 'Received & Verified', icon: Clock },
    { label: 'Processing', desc: 'Packed & Quality Passed', icon: Package },
    { label: 'Shipped', desc: 'In Transit with Express Courier', icon: Truck },
    { label: 'Delivered', desc: 'Doorstep Delivered', icon: CheckCircle2 },
  ];

  const handleCopyTracking = (awb: string) => {
    navigator.clipboard.writeText(awb);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col relative">
        
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-serif">Track Your Order Live</h2>
              <p className="text-xs text-stone-500">Real-time status updates & courier AWB tracking</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 md:p-6 space-y-6">
          {/* Order Search Bar */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
              Enter Order Number or Phone / Email
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="e.g. ORD-9821 or 9876543210..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-stone-800 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm shrink-0"
              >
                Track Order
              </button>
            </div>
          </form>

          {/* Quick Select Recent Orders */}
          {orders.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Recent Orders:</span>
              <div className="flex flex-wrap gap-2">
                {orders.map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => {
                      setSearchedOrder(ord);
                      setSearchQuery(ord.orderNumber);
                      setErrorMsg('');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                      searchedOrder?.id === ord.id
                        ? 'bg-rose-500 text-white border-rose-500 font-bold shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-200'
                    }`}
                  >
                    {ord.orderNumber} ({ord.status})
                  </button>
                ))}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Order Status Display */}
          {searchedOrder ? (
            <div className="space-y-6 animate-fade-in">
              {/* Status Header Badge */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-900 font-mono">{searchedOrder.orderNumber}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      searchedOrder.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : searchedOrder.status === 'Shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : searchedOrder.status === 'Cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {searchedOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Placed on: {searchedOrder.createdAt} • Payment: <span className="font-bold text-stone-700">{searchedOrder.paymentMethod}</span> ({searchedOrder.paymentDetails.status})
                  </p>
                </div>

                <div className="text-right sm:border-l sm:border-stone-200 sm:pl-4">
                  <span className="text-[10px] text-stone-400 block uppercase">Total Amount</span>
                  <span className="text-base font-bold text-stone-900 font-serif">{formatPrice(searchedOrder.total)}</span>
                </div>
              </div>

              {/* Courier & AWB Box */}
              <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">Express Delivery Courier</span>
                  <p className="text-xs font-bold text-stone-100">BlueDart / Delhivery Air Express</p>
                  <p className="text-[11px] text-stone-400">
                    AWB Tracking No:{' '}
                    <span className="font-mono text-amber-200 font-bold">
                      {searchedOrder.trackingNumber || `AWB-IND-${searchedOrder.orderNumber.replace(/[^0-9]/g, '') || '981273'}`}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyTracking(searchedOrder.trackingNumber || `AWB-IND-${searchedOrder.orderNumber.replace(/[^0-9]/g, '') || '981273'}`)}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0"
                >
                  {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTracking ? 'Copied AWB!' : 'Copy AWB'}</span>
                </button>
              </div>

              {/* Progress Stepper Timeline */}
              {searchedOrder.status !== 'Cancelled' ? (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Order Progress Timeline</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {steps.map((step, idx) => {
                      const Icon = step.icon;
                      const isCompleted = idx <= currentStep;
                      const isCurrent = idx === currentStep;

                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-2xl border transition-all ${
                            isCurrent
                              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20'
                              : isCompleted
                              ? 'bg-emerald-50/60 border-emerald-200'
                              : 'bg-stone-50 border-stone-200 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                isCompleted
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-stone-200 text-stone-600'
                              }`}
                            >
                              {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                            </div>
                            <span className="text-xs font-bold text-stone-900">{step.label}</span>
                          </div>
                          <p className="text-[10px] text-stone-500 pl-8">{step.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-rose-50 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>This order has been cancelled. Refund process initiated.</span>
                </div>
              )}

              {/* Shipping Address & Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" /> Delivery Address
                  </span>
                  <p className="text-xs font-bold text-stone-800">{searchedOrder.customer.name}</p>
                  <p className="text-xs text-stone-600">{searchedOrder.customer.address}</p>
                  <p className="text-xs text-stone-600">{searchedOrder.customer.city}, {searchedOrder.customer.pincode}</p>
                  <div className="pt-1 text-[11px] text-stone-500 flex items-center gap-2">
                    <Phone className="w-3 h-3 text-stone-400" /> {searchedOrder.customer.phone}
                  </div>
                </div>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider flex items-center gap-1">
                    <Package className="w-3 h-3 text-amber-500" /> Item Summary ({searchedOrder.items.length})
                  </span>
                  <div className="divide-y divide-stone-200 text-xs max-h-32 overflow-y-auto pr-1">
                    {searchedOrder.items.map((item, idx) => (
                      <div key={idx} className="py-1.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img src={item.productImage} alt={item.productName} className="w-8 h-8 rounded-lg object-cover bg-stone-200" />
                          <span className="font-medium text-stone-800 line-clamp-1">{item.productName} (x{item.quantity})</span>
                        </div>
                        <span className="font-bold text-stone-900 shrink-0">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-8 text-stone-400 space-y-2">
              <Truck className="w-12 h-12 mx-auto text-stone-300" />
              <p className="text-xs text-stone-500">Search for your order above to view real-time delivery tracking.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
