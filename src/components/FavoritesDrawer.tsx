import React from 'react';
import { MenuItem } from '../types';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: MenuItem[];
  onRemoveFavorite: (id: string) => void;
  onAddToCart: (item: MenuItem) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onAddToCart
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-[#b80035] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">favorite</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-base text-slate-900">Your Bookmarked Favorites</h3>
                <p className="text-xs text-slate-500">{favorites.length} craving items saved</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {favorites.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[32px] text-slate-300">favorite_border</span>
                </div>
                <p className="font-headline font-bold text-base text-slate-700 mb-1">No favorites saved yet</p>
                <p className="text-xs text-slate-400 max-w-xs">
                  Tap the heart icon on any dish across the menu to save it to your personal craving wishlist!
                </p>
              </div>
            ) : (
              favorites.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:border-rose-100 hover:shadow-sm bg-white transition-all group"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded-[2px] border p-[1px] flex items-center justify-center ${
                        item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                      </div>
                      <h4 className="font-headline font-bold text-xs text-slate-800 truncate">
                        {item.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-headline font-extrabold text-xs text-[#b80035]">₹{item.price}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-amber-500 text-[12px]">star</span>
                        {item.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onAddToCart(item)}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-[#b80035] text-[#b80035] hover:text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      + Add
                    </button>
                    <button
                      onClick={() => onRemoveFavorite(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove from favorites"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
