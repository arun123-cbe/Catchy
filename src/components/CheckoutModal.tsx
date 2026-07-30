import React, { useState } from 'react';
import { X, QrCode, CreditCard, Smartphone, CheckCircle2, ShieldCheck, ArrowRight, Lock, Copy, Check, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { PaymentMethod, Order } from '../types';

interface CheckoutModalProps {
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose, onOrderSuccess }) => {
  const { cart, placeOrder, formatPrice, currency } = useStore();

  const [step, setStep] = useState<'details' | 'payment'>('details');

  // Customer Form State
  const [customer, setCustomer] = useState({
    name: 'Goutham Arun',
    email: 'gouthamarun123@gmail.com',
    phone: '+91 98765 43210',
    address: 'Suite 402, Sunshine Heights, Indiranagar',
    city: 'Bengaluru',
    pincode: '560038'
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('gouthamarun@okaxis');
  const [upiSimulatingVerify, setUpiSimulatingVerify] = useState(false);
  const [upiVerified, setUpiVerified] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Card State
  const [cardDetails, setCardDetails] = useState({
    number: '4532 •••• •••• 8821',
    name: 'Goutham Arun',
    expiry: '08/28',
    cvv: '921'
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Subtotal & Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const discount = 0;
  const shipping = subtotal >= 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const handleVerifyUpi = () => {
    if (!upiId.includes('@')) {
      alert('Please enter a valid UPI ID (e.g. name@upi, user@gpay)');
      return;
    }
    setUpiSimulatingVerify(true);
    setTimeout(() => {
      setUpiSimulatingVerify(false);
      setUpiVerified(true);
    }, 1200);
  };

  const handleFinalPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      // Trigger Confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });

      const orderItems = cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        price: item.product.price,
        quantity: item.quantity
      }));

      const createdOrder = placeOrder({
        customer,
        items: orderItems,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        paymentMethod,
        paymentDetails: {
          upiId: paymentMethod === 'UPI' ? upiId : undefined,
          upiRefNo: paymentMethod === 'UPI' ? `UPI${Math.floor(100000000000 + Math.random() * 900000000000)}` : undefined,
          cardLast4: paymentMethod === 'CARD' ? '8821' : undefined,
          cardBrand: paymentMethod === 'CARD' ? 'Visa' : undefined,
          status: 'PAID'
        },
        status: 'Processing'
      });

      setIsProcessing(false);
      onOrderSuccess(createdOrder);
    }, 2000);
  };

  const merchantUpiVpa = 'auraglow.payments@icici';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative border border-stone-200">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <h2 className="text-lg font-bold text-stone-900 font-serif">
              {step === 'details' ? 'Shipping & Contact Details' : 'Secure Integrated Gateway'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Progress Bar */}
        <div className="bg-stone-100 px-6 py-2 border-b border-stone-200 flex items-center justify-between text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step === 'details' ? 'text-rose-600 font-bold' : 'text-stone-500'}`}>
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[11px]">1</span>
            <span>Shipping Info</span>
          </div>
          <div className="w-12 h-0.5 bg-stone-300" />
          <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-emerald-700 font-bold' : 'text-stone-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 'payment' ? 'bg-emerald-700 text-white' : 'bg-stone-300 text-stone-700'}`}>2</span>
            <span>UPI / Card Payment</span>
          </div>
        </div>

        <div className="p-6">
          
          {/* STEP 1: SHIPPING & CUSTOMER DETAILS */}
          {step === 'details' && (
            <form onSubmit={(e) => { e.preventDefault(); setStep('payment'); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Pincode / Zipcode</label>
                  <input
                    type="text"
                    required
                    value={customer.pincode}
                    onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">City / Region</label>
                <input
                  type="text"
                  required
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />
              </div>

              {/* Order Summary Snapshot */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 mt-4 text-xs space-y-1.5">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({cart.length} items):</span>
                  <span className="font-bold text-stone-800">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping:</span>
                  <span className="font-bold text-emerald-700">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Payable:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-md mt-4"
              >
                Continue to Payment ({formatPrice(total)})
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: PAYMENT GATEWAYS (UPI, CARD, EXPRESS) */}
          {step === 'payment' && (
            <div className="space-y-6">
              
              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-3 gap-2 bg-stone-100 p-1 rounded-2xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'UPI'
                      ? 'bg-white text-emerald-900 shadow-xs ring-2 ring-emerald-500/30'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  UPI / QR
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'CARD'
                      ? 'bg-white text-stone-900 shadow-xs ring-2 ring-stone-900/20'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  Card
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('APPLE_PAY')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'APPLE_PAY'
                      ? 'bg-white text-stone-900 shadow-xs ring-2 ring-stone-900/20'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-stone-800" />
                  Express Pay
                </button>
              </div>

              {/* --- GATEWAY 1: UPI PAYMENT GATEWAY --- */}
              {paymentMethod === 'UPI' && (
                <div className="space-y-5 bg-gradient-to-b from-emerald-50/50 to-white p-5 rounded-2xl border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-emerald-700" />
                        UPI FastPay Gateway (BHIM / GPay / PhonePe / Paytm)
                      </h4>
                      <p className="text-[11px] text-stone-500">Instant 0% fee transaction with real-time verification</p>
                    </div>
                    <span className="bg-emerald-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      INSTANT VERIFY
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    
                    {/* Simulated Live QR Code */}
                    <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm text-center flex flex-col items-center">
                      <div className="p-3 bg-stone-900 rounded-2xl mb-2 text-white shadow-inner relative group">
                        {/* Dynamic SVG QR code representation */}
                        <div className="w-32 h-32 bg-white rounded-lg p-2 flex flex-col items-center justify-center relative">
                          <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-stone-900 rounded">
                            {Array.from({ length: 36 }).map((_, i) => (
                              <div
                                key={i}
                                className={`rounded-[1px] ${
                                  i % 2 === 0 || i % 7 === 0 ? 'bg-white' : 'bg-stone-900'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-7 h-7 bg-emerald-600 rounded-full text-white font-bold text-[10px] flex items-center justify-center border-2 border-white shadow-md">
                              AG
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] text-stone-600 font-medium">Scan with any UPI App</span>
                      <span className="text-xs font-bold text-stone-900 mt-0.5">Amount: {formatPrice(total)}</span>
                    </div>

                    {/* VPA / UPI ID Entry */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-800 uppercase mb-1">
                          Or Enter Your UPI VPA / ID
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="username@gpay or phone@paytm"
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value);
                              setUpiVerified(false);
                            }}
                            className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyUpi}
                            disabled={upiSimulatingVerify}
                            className="px-3 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-all shrink-0"
                          >
                            {upiSimulatingVerify ? 'Verifying...' : 'Verify'}
                          </button>
                        </div>
                        {upiVerified && (
                          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            UPI ID Verified: AuraGlow VPA linked!
                          </span>
                        )}
                      </div>

                      {/* Quick UPI Apps Trigger Buttons */}
                      <div>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                          Supported UPI Apps
                        </span>
                        <div className="flex items-center gap-2">
                          {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                            <button
                              key={app}
                              type="button"
                              onClick={() => {
                                setUpiId(`user@${app.toLowerCase()}`);
                                setUpiVerified(true);
                              }}
                              className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-[10px] font-bold text-stone-700 hover:border-emerald-500 hover:text-emerald-900 transition-all shadow-2xs"
                            >
                              {app}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="p-2.5 bg-stone-100 rounded-xl text-[10px] text-stone-500 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Instant notification will trigger on your phone upon clicking Pay.</span>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* --- GATEWAY 2: CREDIT / DEBIT CARD GATEWAY --- */}
              {paymentMethod === 'CARD' && (
                <div className="space-y-4 bg-stone-50 p-5 rounded-2xl border border-stone-200">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    Credit or Debit Card Payment
                  </h4>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-800 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-800 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-800 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* --- GATEWAY 3: APPLE PAY / EXPRESS --- */}
              {paymentMethod === 'APPLE_PAY' && (
                <div className="bg-stone-900 text-white p-6 rounded-2xl text-center space-y-3">
                  <Smartphone className="w-10 h-10 mx-auto text-amber-300" />
                  <h4 className="text-base font-bold font-serif">Express One-Touch Payment</h4>
                  <p className="text-xs text-stone-300">
                    Pay securely using saved cards, Apple Pay, or Google Pay wallet pass.
                  </p>
                </div>
              )}

              {/* Final Complete Pay Button */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleFinalPayment}
                  className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying & Processing Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-emerald-300" />
                      <span>Pay {formatPrice(total)} Now</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-stone-400 text-[10px]">
                  <button type="button" onClick={() => setStep('details')} className="underline hover:text-stone-700">
                    ← Edit Shipping Info
                  </button>
                  <span>256-bit SSL Encrypted Transaction</span>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
