import React, { useState } from 'react';
import { STORE_LOCATIONS } from '../data/menuData';
import { ViewTab } from '../types';

interface HeaderProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  cartCount: number;
  cartSubtotal: number;
  openCart: () => void;
  openAuth: () => void;
  openFavorites: () => void;
  favoritesCount: number;
  isVegOnly: boolean;
  setIsVegOnly: (val: boolean) => void;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit?: () => void;
  user: { name: string; phone: string } | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  cartSubtotal,
  openCart,
  openAuth,
  openFavorites,
  favoritesCount,
  isVegOnly,
  setIsVegOnly,
  selectedLocation,
  setSelectedLocation,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  user
}) => {
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const currentLocation = STORE_LOCATIONS.find(l => l.id === selectedLocation) || STORE_LOCATIONS[0];

  const handleNavClick = (tab: ViewTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (activeTab !== 'menu') {
        setActiveTab('menu');
      }
      if (onSearchSubmit) onSearchSubmit();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      {/* Top Bar */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Brand & Location */}
        <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#b80035] to-[#e11d48] flex items-center justify-center text-white shadow-md shadow-rose-900/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">restaurant_menu</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-lg sm:text-xl font-extrabold tracking-tight text-[#b80035] leading-none group-hover:text-[#e11d48] transition-colors">
                Foodie Hub
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#a73a00] uppercase tracking-wider leading-none mt-1">
                Crave & Delight
              </span>
            </div>
          </button>

          {/* Location Picker */}
          <div className="relative">
            <button
              onClick={() => setShowLocationMenu(!showLocationMenu)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-[#b80035] text-[18px]">location_on</span>
              <span className="truncate max-w-[140px] lg:max-w-[180px]">{currentLocation.name}</span>
              <span className="material-symbols-outlined text-slate-400 text-[16px]">expand_more</span>
            </button>

            {showLocationMenu && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Select Kitchen Hub
                </div>
                <div className="py-1 flex flex-col gap-1">
                  {STORE_LOCATIONS.map(loc => (
                    <button
                      key={loc.id}
                      onClick={() => {
                        setSelectedLocation(loc.id);
                        setShowLocationMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex flex-col gap-0.5 transition-colors ${
                        selectedLocation === loc.id
                          ? 'bg-rose-50 text-[#b80035] font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{loc.name}</span>
                        <span className="text-[10px] text-emerald-600 font-bold">{loc.deliveryMins}m drop</span>
                      </div>
                      <span className="text-[11px] text-slate-400 truncate">{loc.address}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Live Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-2">
          <div className={`relative w-full transition-all duration-200 ${isSearchFocused ? 'ring-2 ring-rose-500/20' : ''}`}>
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search Biryani, Burgers, Pizzas, Desserts..."
              className="w-full pl-10 pr-9 py-2 rounded-full bg-slate-100/90 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:ring-1 focus:ring-rose-500/30 transition-all border border-transparent focus:border-rose-200"
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

        {/* Right Action Icons & Cart */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* Veg Only Toggle Button */}
          <button
            onClick={() => setIsVegOnly(!isVegOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
              isVegOnly
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 border-transparent'
            }`}
            title="Toggle Vegetarian Only"
          >
            <div className="w-3.5 h-3.5 rounded-[2px] border border-emerald-600 flex items-center justify-center p-[2px]">
              <div className={`w-1.5 h-1.5 rounded-full ${isVegOnly ? 'bg-emerald-600' : 'bg-emerald-500'}`} />
            </div>
            <span className="hidden sm:inline uppercase text-[11px] tracking-wider">Veg Only</span>
          </button>

          {/* Wishlist / Favorites */}
          <button
            onClick={openFavorites}
            className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-rose-600 transition-colors"
            title="Your Favorites"
          >
            <span className="material-symbols-outlined text-[22px]">favorite</span>
            {favoritesCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#b80035] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={openCart}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#e11d48] hover:bg-[#b80035] text-white shadow-md shadow-rose-900/20 active:scale-95 transition-all cursor-pointer font-headline font-bold text-xs sm:text-sm"
          >
            <span className="material-symbols-outlined text-[19px]">shopping_bag</span>
            <span>
              Cart ({cartCount}) <span className="hidden xs:inline">• ₹{cartSubtotal}</span>
            </span>
          </button>

          {/* User Sign In / Profile */}
          {user ? (
            <button
              onClick={openAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:inline max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={openAuth}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="bg-slate-50/90 border-t border-slate-100 px-4 sm:px-6">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between overflow-x-auto no-scrollbar h-11 text-xs">
          <nav className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => handleNavClick('home')}
              className={`py-2 font-semibold transition-all whitespace-nowrap cursor-pointer relative ${
                activeTab === 'home'
                  ? 'text-[#b80035] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#b80035]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('menu')}
              className={`py-2 font-semibold transition-all whitespace-nowrap cursor-pointer relative ${
                activeTab === 'menu'
                  ? 'text-[#b80035] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#b80035]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Full Menu (38)
            </button>

            <button
              onClick={() => handleNavClick('deals')}
              className={`py-2 font-semibold transition-all whitespace-nowrap cursor-pointer relative ${
                activeTab === 'deals'
                  ? 'text-[#b80035] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#b80035]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today's Deals
            </button>

            <button
              onClick={() => handleNavClick('deck')}
              className={`py-2 font-semibold transition-all whitespace-nowrap cursor-pointer relative flex items-center gap-1 ${
                activeTab === 'deck'
                  ? 'text-[#b80035] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#b80035]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live 1-Screen Deck</span>
            </button>

            <button
              onClick={() => handleNavClick('track')}
              className={`py-2 font-semibold transition-all whitespace-nowrap cursor-pointer relative ${
                activeTab === 'track'
                  ? 'text-[#b80035] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#b80035]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Track Order
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`py-2 font-semibold transition-all whitespace-nowrap cursor-pointer relative ${
                activeTab === 'about'
                  ? 'text-[#b80035] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#b80035]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              About Us
            </button>

            <button
              onClick={() => handleNavClick('admin')}
              className={`py-2 font-semibold transition-all whitespace-nowrap cursor-pointer relative flex items-center gap-1 ${
                activeTab === 'admin'
                  ? 'text-[#b80035] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#b80035]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">countertops</span>
              <span>Admin Kitchen Panel</span>
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-2 text-slate-500 text-[11px] font-medium flex-shrink-0">
            <span className="material-symbols-outlined text-[14px] text-emerald-600">schedule</span>
            <span>Kitchen Open: 10:00 AM - 11:30 PM</span>
          </div>
        </div>
      </div>
    </header>
  );
};
