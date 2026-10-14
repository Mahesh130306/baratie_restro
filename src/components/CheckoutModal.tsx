import React, { useState } from 'react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  deliveryAddress: string;
  setDeliveryAddress: (addr: string) => void;
  onOrderSuccess: (orderId: string, address: string, paymentMethod: string) => void;
  showToast: (msg: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  subtotal,
  discount,
  total,
  deliveryAddress,
  setDeliveryAddress,
  onOrderSuccess,
  showToast
}) => {
  const [addressInput, setAddressInput] = useState(deliveryAddress);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [deliveryNote, setDeliveryNote] = useState('Contactless drop at door');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) {
      showToast('Please enter your delivery address');
      return;
    }

    setDeliveryAddress(addressInput);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const generatedOrderId = `FH-${Math.floor(1000 + Math.random() * 9000)}`;
      const methodLabel = paymentMethod === 'upi' ? `UPI (${upiId})` : paymentMethod === 'card' ? 'Credit / Debit Card' : 'Cash on Delivery (COD)';
      onOrderSuccess(generatedOrderId, addressInput, methodLabel);
      onClose();
      showToast(`Order #${generatedOrderId} placed successfully! Kitchen preparing.`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200 border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-[#b80035] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-slate-900 text-lg leading-tight">Fast 1-Click Checkout</h3>
              <p className="text-xs text-slate-500">Express thermal dispatch in 20-25 mins</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handlePlaceOrder} className="flex flex-col gap-5">
          
          {/* Order Summary Mini Pill */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
            <div className="flex flex-col">
              <span className="text-slate-500">Feast Items: <strong className="text-slate-900">{cart.length} delicacies</strong></span>
              <span className="text-emerald-700 font-bold">● Live kitchen cooking slot allocated</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block line-through">₹{subtotal + 40}</span>
              <span className="font-headline font-extrabold text-base text-[#b80035]">₹{total}</span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-rose-500">pin_drop</span>
              <span>Delivery Address</span>
            </label>
            <textarea
              rows={2}
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="House/Flat number, building name, street, landmark, city"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white resize-none"
            />
            <div className="flex gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => setAddressInput('Flat 402, Regal Building, Outer Circle, CP, New Delhi - 110001')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                Home (CP)
              </button>
              <button
                type="button"
                onClick={() => setAddressInput('Tower 8B, DLF Cyber City, Cyber Hub, Gurugram - 122002')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                Office (Cyber City)
              </button>
            </div>
          </div>

          {/* Delivery Instructions */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-slate-400">note_alt</span>
              <span>Delivery Instructions</span>
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Contactless drop at door', 'Ring bell once', 'Do not ring (Baby sleeping)', 'Add extra cutlery'].map((note) => (
                <button
                  key={note}
                  type="button"
                  onClick={() => setDeliveryNote(note)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    deliveryNote === note
                      ? 'border-rose-500 bg-rose-50/50 text-[#b80035] font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">payments</span>
              <span>Choose Payment Method</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-rose-600 bg-rose-50 text-[#b80035] font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                <span className="text-xs">UPI / GPay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-rose-600 bg-rose-50 text-[#b80035] font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">credit_card</span>
                <span className="text-xs">Debit / Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-rose-600 bg-rose-50 text-[#b80035] font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">local_atm</span>
                <span className="text-xs">Cash on Delivery</span>
              </button>
            </div>

            {paymentMethod === 'upi' && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                <span className="text-xs text-slate-600 font-semibold">Enter your UPI ID or PhonePe / Google Pay / Paytm handle:</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. mobile@upi or name@okaxis"
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <span className="px-3 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center">
                    Verified ✓
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Place Order CTA Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-full bg-[#e11d48] hover:bg-[#b80035] text-white font-headline font-extrabold text-sm shadow-xl shadow-rose-900/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Transmitting to Kitchen...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>Confirm & Pay ₹{total}</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-emerald-600">lock</span>
              <span>Safe 256-Bit Encrypted Payment with Instant Refund Guarantee</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
