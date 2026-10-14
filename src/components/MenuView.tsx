import React, { useState, useMemo } from 'react';
import { MenuItem, CuisineCategory, CartItem } from '../types';
import { MENU_ITEMS } from '../data/menuData';

interface MenuViewProps {
  selectedCategory: CuisineCategory;
  setSelectedCategory: (cat: CuisineCategory) => void;
  onAddToCart: (item: MenuItem, quantity?: number) => void;
  onUpdateQty: (id: string, delta: number) => void;
  cart: CartItem[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpenItemModal: (item: MenuItem) => void;
  isVegOnly: boolean;
  setIsVegOnly: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  outOfStockIds?: string[];
}

export const MenuView: React.FC<MenuViewProps> = ({
  selectedCategory,
  setSelectedCategory,
  onAddToCart,
  onUpdateQty,
  cart,
  favorites,
  onToggleFavorite,
  onOpenItemModal,
  isVegOnly,
  setIsVegOnly,
  searchQuery,
  setSearchQuery,
  outOfStockIds = []
}) => {
  const [filterType, setFilterType] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [onlyChefsSpecial, setOnlyChefsSpecial] = useState(false);
  const [underPrice, setUnderPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-asc' | 'price-desc'>('popular');

  const categories: { id: CuisineCategory; label: string; count: number }[] = [
    { id: 'all', label: 'All Items', count: MENU_ITEMS.length },
    { id: 'indian', label: 'Indian Biryanis & Curries', count: MENU_ITEMS.filter(m => m.category === 'indian').length },
    { id: 'chinese', label: 'Indo-Chinese & Bowls', count: MENU_ITEMS.filter(m => m.category === 'chinese').length },
    { id: 'italian', label: 'Artisan Pizzas & Pastas', count: MENU_ITEMS.filter(m => m.category === 'italian').length },
    { id: 'fastfood', label: 'Burgers & Finger Foods', count: MENU_ITEMS.filter(m => m.category === 'fastfood').length },
    { id: 'desserts', label: 'Artisanal Desserts', count: MENU_ITEMS.filter(m => m.category === 'desserts').length },
    { id: 'beverages', label: 'Thick Shakes & Coolers', count: MENU_ITEMS.filter(m => m.category === 'beverages').length },
  ];

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && selectedCategory !== 'combos' && item.category !== selectedCategory) {
        return false;
      }

      // Veg toggle from global header or local filter
      if (isVegOnly && !item.isVeg) return false;
      if (filterType === 'veg' && !item.isVeg) return false;
      if (filterType === 'nonveg' && item.isVeg) return false;

      // Chef's special filter
      if (onlyChefsSpecial && !item.badge?.includes('Chef')) return false;

      // Under price filter
      if (underPrice && item.price > underPrice) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      // 'popular' default: badges first, then rating
      const aScore = (a.badge ? 10 : 0) + a.rating;
      const bScore = (b.badge ? 10 : 0) + b.rating;
      return bScore - aScore;
    });
  }, [selectedCategory, isVegOnly, filterType, onlyChefsSpecial, underPrice, searchQuery, sortBy]);

  const getItemCartQty = (id: string) => {
    const found = cart.find(c => c.id === id);
    return found ? found.quantity : 0;
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#b80035] text-[28px]">menu_book</span>
            <h1 className="font-headline text-2xl sm:text-3xl font-black text-slate-900">
              Foodie Hub Culinary Menu
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore 38 handcrafted gourmet preparations cooked fresh on order
          </p>
        </div>

        {/* Search Bar for Mobile/Tablet or desktop */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within dishes..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-200 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-2 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-headline font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-[#b80035] text-white shadow-md shadow-rose-900/20'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Filters & Sorting Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left Filter Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Veg Only Toggle */}
          <button
            onClick={() => {
              setIsVegOnly(!isVegOnly);
              if (!isVegOnly) setFilterType('veg');
              else setFilterType('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              isVegOnly || filterType === 'veg'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <div className="w-3.5 h-3.5 rounded-[2px] border border-emerald-600 flex items-center justify-center p-[2px]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            </div>
            <span>Pure Veg</span>
          </button>

          {/* Non Veg Filter */}
          <button
            onClick={() => {
              if (filterType === 'nonveg') {
                setFilterType('all');
              } else {
                setFilterType('nonveg');
                setIsVegOnly(false);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              filterType === 'nonveg'
                ? 'bg-rose-50 text-rose-800 border-rose-300 ring-2 ring-rose-500/20 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <div className="w-3.5 h-3.5 rounded-[2px] border border-rose-600 flex items-center justify-center p-[2px]">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            </div>
            <span>Non-Veg</span>
          </button>

          {/* Chef's Special */}
          <button
            onClick={() => setOnlyChefsSpecial(!onlyChefsSpecial)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              onlyChefsSpecial
                ? 'bg-amber-50 text-amber-900 border-amber-300 ring-2 ring-amber-500/20 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-amber-500">star</span>
            <span>Chef's Special</span>
          </button>

          {/* Under ₹250 */}
          <button
            onClick={() => setUnderPrice(underPrice === 250 ? null : 250)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              underPrice === 250
                ? 'bg-indigo-50 text-indigo-800 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span>Under ₹250</span>
          </button>

          {/* Reset Filters */}
          {(isVegOnly || filterType !== 'all' || onlyChefsSpecial || underPrice !== null || searchQuery) && (
            <button
              onClick={() => {
                setIsVegOnly(false);
                setFilterType('all');
                setOnlyChefsSpecial(false);
                setUnderPrice(null);
                setSearchQuery('');
              }}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 underline ml-1 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Right Sort Dropdown */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="material-symbols-outlined text-[18px] text-slate-400">sort</span>
          <span>Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-400 cursor-pointer"
          >
            <option value="popular">Popularity & Badges</option>
            <option value="rating">Rating (High to Low)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Dish Count Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing <strong className="text-slate-900">{filteredItems.length}</strong> delicious preparations</span>
        {searchQuery && (
          <span>Matching "<strong className="text-slate-900">{searchQuery}</strong>"</span>
        )}
      </div>

      {/* Dishes Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <span className="material-symbols-outlined text-[36px]">search_off</span>
          </div>
          <h3 className="font-headline font-bold text-lg text-slate-800 mb-1">No matching dishes found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Try clearing your search query or removing active filters to see all 38 dishes.
          </p>
          <button
            onClick={() => {
              setIsVegOnly(false);
              setFilterType('all');
              setOnlyChefsSpecial(false);
              setUnderPrice(null);
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-xl bg-[#b80035] text-white text-xs font-bold cursor-pointer hover:bg-rose-700"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => {
            const qty = getItemCartQty(item.id);
            const isFav = favorites.includes(item.id);
            const isOutOfStock = outOfStockIds.includes(item.id) || item.inStock === false;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border border-slate-200/80 hover:border-rose-200 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group relative ${
                  isOutOfStock ? 'opacity-70 grayscale-[20%]' : ''
                }`}
              >
                {/* Image Banner */}
                <div 
                  className="relative h-48 w-full bg-slate-100 overflow-hidden cursor-pointer"
                  onClick={() => !isOutOfStock && onOpenItemModal(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Veg / Non-Veg Indicator */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-xs">
                    <div className={`w-3.5 h-3.5 rounded-[2px] border p-[1.5px] flex items-center justify-center ${
                      item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
                      {item.isVeg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </div>

                  {/* Favorite Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.id);
                    }}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer ${
                      isFav 
                        ? 'bg-rose-500 text-white' 
                        : 'bg-black/40 hover:bg-black/60 text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isFav ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>

                  {/* Bottom Image Overlay Badges */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    {item.badge ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 shadow-xs">
                        {item.badge}
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-white/90">{item.serves}</span>
                    )}

                    <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-xs font-bold">
                      <span className="material-symbols-outlined text-amber-400 text-[14px]">star</span>
                      <span>{item.rating}</span>
                      <span className="text-[10px] text-slate-300">({item.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Out of Stock Ribbon */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="bg-rose-600 text-white font-headline font-black text-xs px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                        Currently Sold Out
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 
                        onClick={() => !isOutOfStock && onOpenItemModal(item)}
                        className="font-headline font-bold text-sm sm:text-base text-slate-900 line-clamp-1 group-hover:text-[#b80035] transition-colors cursor-pointer"
                      >
                        {item.name}
                      </h3>
                      {item.spicyLevel && (
                        <span className="text-xs" title={`Spice Level: ${item.spicyLevel}/3`}>
                          {'🌶️'.repeat(item.spicyLevel)}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Price & Add CTA */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-headline font-black text-base sm:text-lg text-[#b80035]">
                          ₹{item.price}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{item.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        {item.serves || '1 Portion'}
                      </span>
                    </div>

                    {isOutOfStock ? (
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl">
                        Unavailable
                      </span>
                    ) : qty > 0 ? (
                      <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-2 py-1 rounded-xl shadow-xs">
                        <button
                          onClick={() => onUpdateQty(item.id, -1)}
                          className="w-6 h-6 rounded-lg bg-white text-slate-800 hover:text-rose-600 flex items-center justify-center font-bold text-xs shadow-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-headline font-bold text-xs text-[#b80035] w-4 text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-[#b80035] text-white flex items-center justify-center font-bold text-xs shadow-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onAddToCart(item)}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#b80035] text-white font-headline font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[15px]">add</span>
                        <span>ADD</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
