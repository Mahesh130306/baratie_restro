import React, { useState } from 'react';
import { MenuItem } from '../types';

interface FoodDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity?: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  quantityInCart: number;
  onUpdateQty: (id: string, delta: number) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  item,
  onClose,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
  quantityInCart,
  onUpdateQty
}) => {
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedNote, setAddedNote] = useState(false);

  if (!item) return null;

  const discountPercent = item.originalPrice > item.price
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(item.id)}
          className={`absolute top-4 left-4 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
            isFavorite 
              ? 'bg-rose-500 text-white' 
              : 'bg-black/50 hover:bg-black/70 text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isFavorite ? 'favorite' : 'favorite_border'}
          </span>
        </button>

        {/* Food Image Banner */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-100 flex-shrink-0">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Badge & Category */}
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                {/* Veg / Non-Veg Indicator */}
                <div className={`w-4 h-4 rounded-[3px] border p-[2px] flex items-center justify-center bg-white ${
                  item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                  }`} />
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  item.isVeg ? 'bg-emerald-500 text-white' : 'bg-rose-600 text-white'
                }`}>
                  {item.isVeg ? 'Pure Veg' : 'Non-Veg'}
                </span>
                {item.badge && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                    {item.badge}
                  </span>
                )}
              </div>
              <h3 className="font-headline text-xl sm:text-2xl font-black text-white leading-tight">
                {item.name}
              </h3>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-xl text-white font-bold text-xs">
                <span className="material-symbols-outlined text-amber-400 text-[16px]">star</span>
                <span>{item.rating}</span>
                <span className="text-slate-300 text-[10px]">({item.reviewsCount})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Price & Serves Row */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#b80035] font-headline">₹{item.price}</span>
              {item.originalPrice > item.price && (
                <>
                  <span className="text-sm font-semibold text-slate-400 line-through">₹{item.originalPrice}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {discountPercent}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
              {item.serves && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">group</span>
                  <span>{item.serves}</span>
                </div>
              )}
              {item.spicyLevel && (
                <div className="flex items-center gap-1" title={`Spice Level: ${item.spicyLevel}/3`}>
                  <span className="text-[13px]">{'🌶️'.repeat(item.spicyLevel)}</span>
                  <span className="text-slate-500 capitalize">
                    {item.spicyLevel === 1 ? 'Mild' : item.spicyLevel === 2 ? 'Medium' : 'Hot & Spicy'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">About This Dish</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Quality Badges */}
          <div className="grid grid-cols-3 gap-2 py-2">
            <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-amber-50 text-amber-900 border border-amber-100/60 text-center">
              <span className="material-symbols-outlined text-[20px] text-amber-600 mb-0.5">timer</span>
              <span className="text-[11px] font-bold">25-30 Mins</span>
              <span className="text-[9px] text-amber-700">Freshly Cooked</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-100/60 text-center">
              <span className="material-symbols-outlined text-[20px] text-emerald-600 mb-0.5">verified_user</span>
              <span className="text-[11px] font-bold">Hygienic</span>
              <span className="text-[9px] text-emerald-700">Tamper Sealed</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-rose-50 text-rose-900 border border-rose-100/60 text-center">
              <span className="material-symbols-outlined text-[20px] text-rose-600 mb-0.5">skillet</span>
              <span className="text-[11px] font-bold">Chef Recipe</span>
              <span className="text-[9px] text-rose-700">Authentic Spices</span>
            </div>
          </div>

          {/* Special Cooking Instructions Note */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Add Kitchen Cooking Note (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => {
                  setSpecialInstructions(e.target.value);
                  setAddedNote(false);
                }}
                placeholder="e.g. Less spicy, extra onions, no cutlery needed..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200"
              />
              {specialInstructions && !addedNote && (
                <button
                  onClick={() => setAddedNote(true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded-lg hover:bg-slate-800"
                >
                  Save Note
                </button>
              )}
            </div>
            {addedNote && (
              <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Note attached for the chef
              </p>
            )}
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Total Amount</span>
            <span className="text-xl font-black text-slate-900 font-headline">
              ₹{item.price * (quantityInCart > 0 ? quantityInCart : 1)}
            </span>
          </div>

          {quantityInCart > 0 ? (
            <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-2xl border border-slate-200 shadow-sm">
              <button
                onClick={() => onUpdateQty(item.id, -1)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 flex items-center justify-center font-bold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="font-headline font-bold text-base text-slate-900 w-5 text-center">
                {quantityInCart}
              </span>
              <button
                onClick={() => onUpdateQty(item.id, 1)}
                className="w-8 h-8 rounded-xl bg-[#b80035] hover:bg-rose-700 text-white flex items-center justify-center font-bold transition-colors cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart(item, 1)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#b80035] hover:bg-[#900028] text-white font-headline font-bold text-sm shadow-md shadow-rose-900/20 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
              <span>Add to Feast Tray</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
