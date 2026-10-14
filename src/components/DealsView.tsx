import React, { useState, useEffect } from 'react';
import { ComboDeal, CartItem } from '../types';
import { COMBO_DEALS } from '../data/menuData';

interface DealsViewProps {
  onAddToCart: (combo: ComboDeal) => void;
  cart: CartItem[];
  onApplyCoupon: (code: string) => void;
  appliedCoupon: string;
  showToast: (msg: string) => void;
}

export const DealsView: React.FC<DealsViewProps> = ({
  onAddToCart,
  cart,
  onApplyCoupon,
  appliedCoupon,
  showToast
}) => {
  // Flash sale countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 42, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 3, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const promoCodes = [
    {
      code: 'CRAVE100',
      discount: '₹100 OFF',
      minOrder: '₹499',
      desc: 'Save flat ₹100 on your favorite biryanis, pizzas and feast combos.',
      badge: 'Most Popular',
      color: 'from-rose-500 to-amber-500'
    },
    {
      code: 'FEAST50',
      discount: '₹50 OFF',
      minOrder: '₹299',
      desc: 'Instant ₹50 discount on any meal for quick solo cravings.',
      badge: 'Daily Saver',
      color: 'from-amber-500 to-orange-500'
    },
    {
      code: 'SWEETTOOTH',
      discount: 'FREE DESSERT',
      minOrder: '₹499',
      desc: 'Free Belgian Chocolate Truffle Cake or Gulab Jamun with your order.',
      badge: 'Chef Special',
      color: 'from-emerald-600 to-teal-500'
    },
    {
      code: 'FREESHIP',
      discount: '100% FREE DELIVERY',
      minOrder: '₹399',
      desc: 'Zero delivery fee anywhere in Delhi NCR. Express 25 min drop.',
      badge: 'Zero Delivery Fee',
      color: 'from-blue-600 to-indigo-600'
    }
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    onApplyCoupon(code);
    showToast(`Coupon ${code} applied successfully!`);
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 pb-20 space-y-10">
      {/* Top Header & Flash Sale Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-900 via-[#8a0028] to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-rose-800">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-xs uppercase tracking-wider">
              Limited Time Deals
            </span>
            <h1 className="font-headline text-2xl sm:text-4xl font-black text-white">
              Super Saver Combos & Daily Discounts
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
              Chef-curated family boxes packed with hearty mains, appetizers, cold drinks, and sweet delights at up to 35% savings.
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 text-center flex-shrink-0">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block mb-1">
              Flash Deal Ends In
            </span>
            <div className="flex items-center gap-2 text-2xl sm:text-3xl font-black font-headline text-white">
              <span className="w-12 py-1 bg-black/40 rounded-xl">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="w-12 py-1 bg-black/40 rounded-xl">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="w-12 py-1 bg-black/40 rounded-xl text-amber-300">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[10px] text-rose-200 mt-1 block">HRS : MINS : SECS</span>
          </div>
        </div>
      </div>

      {/* Coupon Codes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline text-xl sm:text-2xl font-black text-slate-900">
              Active Promo Coupons
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Tap any coupon code to automatically copy & apply to your cart
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {promoCodes.map((p) => {
            const isApplied = appliedCoupon === p.code;

            return (
              <div
                key={p.code}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
              >
                {/* Header ribbon */}
                <div className={`p-4 bg-gradient-to-r ${p.color} text-white`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-full">
                      {p.badge}
                    </span>
                    <span className="text-xs font-semibold text-white/90">Min: {p.minOrder}</span>
                  </div>
                  <h3 className="font-headline font-black text-xl text-white">{p.discount}</h3>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {p.desc}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-dashed border-slate-200">
                    <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300">
                      <span>{p.code}</span>
                    </div>

                    <button
                      onClick={() => handleCopyCode(p.code)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-headline font-bold transition-all cursor-pointer ${
                        isApplied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#b80035] hover:bg-rose-700 text-white'
                      }`}
                    >
                      {isApplied ? 'Applied ✓' : 'Apply Code'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Curated Super Saver Combos */}
      <div className="space-y-6">
        <div>
          <h2 className="font-headline text-xl sm:text-2xl font-black text-slate-900">
            Curated Feast Boxes & Family Combos
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Pre-assembled feast boxes ready for 2 to 4 people with zero guesswork
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {COMBO_DEALS.map((combo) => {
            const inCart = cart.some(c => c.id === combo.id);

            return (
              <div
                key={combo.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-rose-200 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col sm:flex-row group"
              >
                {/* Image Section */}
                <div className="relative sm:w-2/5 h-56 sm:h-auto bg-slate-100 overflow-hidden flex-shrink-0">
                  <img
                    src={combo.imageUrl}
                    alt={combo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/60 via-transparent to-transparent" />

                  {/* Veg Indicator */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-xs">
                    <div className={`w-3.5 h-3.5 rounded-[2px] border p-[1.5px] flex items-center justify-center ${
                      combo.isVeg ? 'border-emerald-600' : 'border-rose-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${combo.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
                      {combo.isVeg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </div>

                  {/* Discount Badge */}
                  <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-[11px] font-headline font-black px-2.5 py-1 rounded-xl shadow-md">
                    {combo.discountBadge}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-bold text-[#b80035] uppercase tracking-wider">
                        {combo.tag}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {combo.serves}
                      </span>
                    </div>

                    <h3 className="font-headline font-black text-lg text-slate-900 group-hover:text-[#b80035] transition-colors">
                      {combo.title}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {combo.description}
                    </p>

                    {/* What's Inside Checklist */}
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        What's Included:
                      </span>
                      <ul className="space-y-1">
                        {combo.includes.map((inc, i) => (
                          <li key={i} className="text-xs text-slate-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Price & Add Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-headline font-black text-xl text-[#b80035]">
                          ₹{combo.price}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ₹{combo.originalPrice}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold">
                        Save ₹{combo.originalPrice - combo.price} instant
                      </span>
                    </div>

                    <button
                      onClick={() => onAddToCart(combo)}
                      className={`px-5 py-2.5 rounded-2xl font-headline font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 ${
                        inCart
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20'
                          : 'bg-[#b80035] hover:bg-[#900028] text-white shadow-rose-900/20'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {inCart ? 'done' : 'add_shopping_cart'}
                      </span>
                      <span>{inCart ? 'Added in Tray' : 'Add Combo Box'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
