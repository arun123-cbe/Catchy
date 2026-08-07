import React from 'react';
import { CheckCircle2, Package, Truck, Calendar, Sparkles, RefreshCw, Download, ArrowRight } from 'lucide-react';
import { Order } from '../types';
import { useStore } from '../context/StoreContext';

interface OrderSuccessModalProps {
  order: Order;
  onClose: () => void;
  onNavigateToSubscriptions?: () => void;
  onTrackOrder?: (orderNumber: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onTrackOrder
}) => {
  const { formatPrice } = useStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 text-center relative border border-stone-200">
        
        {/* Animated Check Icon */}
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-inner">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>

        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Payment Verified ({order.paymentMethod})
        </span>

        <h2 className="text-2xl font-bold text-stone-900 font-serif mt-2 mb-1">
          Thank You For Your Order!
        </h2>
        <p className="text-xs text-stone-500 font-mono">
          Order Number: <span className="font-bold text-stone-800">{order.orderNumber}</span>
        </p>

        {order.paymentDetails.upiRefNo && (
          <p className="text-[11px] text-emerald-700 font-mono mt-0.5">
            UPI Ref No: {order.paymentDetails.upiRefNo}
          </p>
        )}

        {/* Order Items Breakdown */}
        <div className="mt-6 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-left space-y-3">
          <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Itemized Order Summary
          </h4>
          <div className="divide-y divide-stone-200 text-xs">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2 first:pt-0 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <img src={item.productImage} alt={item.productName} className="w-10 h-10 rounded-lg object-cover bg-stone-200" />
                  <div>
                    <span className="font-bold text-stone-800 line-clamp-1">{item.productName}</span>
                    <span className="text-[10px] text-stone-500 block">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-stone-900 shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-200 flex justify-between text-xs font-bold text-stone-900">
            <span>Total Amount Paid</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Delivery Timeline Preview */}
        <div className="mt-6 pt-4 border-t border-stone-200 text-left">
          <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
            Estimated Delivery Timeline
          </h4>
          <div className="flex items-center justify-between text-[11px] text-stone-600 relative">
            <div className="flex flex-col items-center text-center z-10">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-stone-900">Confirmed</span>
              <span className="text-[10px] text-stone-400">Today</span>
            </div>

            <div className="h-0.5 bg-stone-200 flex-1 mx-2 mb-4" />

            <div className="flex flex-col items-center text-center z-10">
              <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center font-bold mb-1">
                <Package className="w-4 h-4" />
              </div>
              <span className="font-medium">Processing</span>
              <span className="text-[10px] text-stone-400">24 Hours</span>
            </div>

            <div className="h-0.5 bg-stone-200 flex-1 mx-2 mb-4" />

            <div className="flex flex-col items-center text-center z-10">
              <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center font-bold mb-1">
                <Truck className="w-4 h-4" />
              </div>
              <span className="font-medium">Express Ship</span>
              <span className="text-[10px] text-stone-400">2-3 Days</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-2">
          {onTrackOrder && (
            <button
              onClick={() => {
                onClose();
                onTrackOrder(order.orderNumber);
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-bold hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Delivery Status</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold hover:bg-stone-200 transition-all border border-stone-200"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
};
