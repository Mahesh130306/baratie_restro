import React, { useState } from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  appliedCoupon: string;
  setAppliedCoupon: (code: string) => void;
  discountAmount: number;
  onProceedToCheckout: () => void;
  deliveryAddress: string;
  onOpenAddressModal?: () => void;
  showToast: (msg: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  appliedCoupon,
  setAppliedCoupon,
  discountAmount,
  onProceedToCheckout,
  deliveryAddress,
  onOpenAddressModal,
  showToast
}) => {
  const [couponCodeInput, setCouponCodeInput] = useState(appliedCoupon || '');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const totalItemsCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const freeDeliveryThreshold = 500;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const deliveryFee = subtotal === 0 ? 0 : (isFreeDelivery ? 0 : 40);
  const packagingFee = subtotal === 0 ? 0 : 35;
  const gst = subtotal === 0 ? 0 : Math.round((subtotal - discountAmount) * 0.05);
  const grandTotal = Math.max(0, subtotal - discountAmount + packagingFee + deliveryFee + gst);
  const totalSavings = discountAmount + (isFreeDelivery && subtotal > 0 ? 40 : 0);

  const deliveryPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCodeInput.trim().toUpperCase();
    if (!code) {
      setCouponError('Enter a valid coupon code');
      return;
    }
    if (code === 'WELCOME50' || code === 'FOODIE50' || code === 'CHEF20') {
      setAppliedCoupon(code);
      setCouponError('');
      showToast(`Coupon '${code}' applied successfully!`);
    } else {
      setCouponError('Invalid code. Try "WELCOME50" or "FOODIE50"');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-slate-900 text-base leading-tight">Your Feast Tray</h3>
                <span className="text-xs text-slate-500">{totalItemsCount} items selected</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {cart.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-slate-400 hover:text-rose-600 font-semibold transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer border border-slate-200"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>

          {/* Delivery Goal Progress Tracker */}
          <div className="px-6 py-3 bg-gradient-to-r from-slate-50 to-rose-50/40 border-b border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-700 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-[16px]">moped</span>
                {isFreeDelivery ? (
                  <span className="text-emerald-700 font-bold">🎉 You unlocked FREE Express Delivery!</span>
                ) : (
                  <span>Add <strong className="text-rose-600">₹{freeDeliveryThreshold - subtotal}</strong> more for Free Delivery</span>
                )}
              </span>
              <span className="text-rose-600 font-bold">{deliveryPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isFreeDelivery ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-rose-600'
                }`}
                style={{ width: `${deliveryPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                  <span className="material-symbols-outlined text-[32px]">remove_shopping_cart</span>
                </div>
                <h4 className="font-headline font-bold text-slate-800 text-sm">Your tray is empty</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Discover mouthwatering biryanis, burgers, pizzas, and artisanal desserts to begin your feast.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-5 py-2 rounded-full bg-[#e11d48] text-white text-xs font-bold shadow-md hover:bg-[#b80035] transition-all cursor-pointer"
                >
                  Explore Delicious Menu
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Veg/Non-Veg Badge */}
                    <div className="flex-shrink-0">
                      {item.isVeg ? (
                        <div className="w-4 h-4 rounded-[3px] border border-emerald-600 flex items-center justify-center p-[2px] bg-white">
                          <div className="w-2 h-2 rounded-full bg-emerald-600" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-[3px] border border-rose-600 flex items-center justify-center p-[2px] bg-white">
                          <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-rose-600" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-900 truncate">{item.name}</span>
                      <span className="text-[11px] text-slate-500 font-medium">₹{item.price} each</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Stepper */}
                    <div className="flex items-center rounded-xl bg-white border border-slate-200 px-2 py-1 shadow-2xs gap-2">
                      <button 
                        onClick={() => onUpdateQty(item.id, -1)}
                        className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-rose-600 font-bold text-sm cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-slate-900 w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQty(item.id, 1)}
                        className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-rose-600 font-bold text-sm cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-headline font-bold text-slate-900 min-w-[50px] text-right">
                      ₹{item.price * item.quantity}
                    </span>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Remove Item"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 bg-slate-50/90 border-t border-slate-200 flex flex-col gap-3.5">
              
              {/* Promo Code Input */}
              <div>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
                      confirmation_number
                    </span>
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => {
                        setCouponCodeInput(e.target.value);
                        setCouponError('');
                      }}
                      placeholder="Coupon Code (e.g. WELCOME50)"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs uppercase font-bold tracking-wider text-slate-800 placeholder:normal-case placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {appliedCoupon && !couponError && (
                  <div className="mt-1.5 flex items-center justify-between text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">check_circle</span>
                      Code '{appliedCoupon}' active (₹{discountAmount} savings)
                    </span>
                    <button 
                      onClick={() => {
                        setAppliedCoupon('');
                        setCouponCodeInput('');
                      }}
                      className="text-[10px] text-slate-400 hover:text-rose-600 underline font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="mt-1 text-[11px] text-rose-600 font-semibold">{couponError}</p>
                )}
              </div>

              {/* Bill Details */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col gap-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-bold text-slate-900">₹{subtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Savings</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Restaurant Packaging</span>
                  <span className="font-medium text-slate-900">₹{packagingFee}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <span>Delivery Partner Fee</span>
                    {isFreeDelivery && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                        FREE
                      </span>
                    )}
                  </span>
                  <span className={isFreeDelivery ? 'text-emerald-700 font-bold' : 'font-medium text-slate-900'}>
                    {isFreeDelivery ? '₹0' : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Taxes & Restaurant GST (5%)</span>
                  <span className="font-medium text-slate-900">₹{gst}</span>
                </div>

                <div className="border-t border-slate-100 pt-2.5 mt-0.5 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total to Pay</span>
                    <span className="font-headline font-extrabold text-lg text-[#b80035]">₹{grandTotal}</span>
                  </div>
                  {totalSavings > 0 && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Saved ₹{totalSavings} Total
                    </span>
                  )}
                </div>
              </div>

              {/* Delivery Address Pill */}
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="material-symbols-outlined text-rose-500 text-[18px] shrink-0">home_pin</span>
                  <span className="truncate">Deliver to: <strong className="text-slate-800">{deliveryAddress}</strong></span>
                </div>
                {onOpenAddressModal && (
                  <button 
                    onClick={onOpenAddressModal}
                    className="text-[#b80035] font-bold hover:underline shrink-0 ml-2 cursor-pointer"
                  >
                    Change
                  </button>
                )}
              </div>

              {/* Proceed CTA */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 rounded-full bg-[#e11d48] hover:bg-[#b80035] text-white font-headline font-bold text-sm shadow-lg shadow-rose-900/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
