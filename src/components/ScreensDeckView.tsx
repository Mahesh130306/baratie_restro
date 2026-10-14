import React from 'react';
import { ViewTab } from '../types';

interface ScreensDeckViewProps {
  onSwitchScreen: (tab: ViewTab) => void;
  activeOrdersCount: number;
  cartCount: number;
}

export const ScreensDeckView: React.FC<ScreensDeckViewProps> = ({
  onSwitchScreen,
  activeOrdersCount,
  cartCount
}) => {
  const screens = [
    {
      id: 'home' as ViewTab,
      number: 'Screen 1',
      title: 'Home & Cravings Hub',
      subtitle: 'Hero banner, category chips, trending dishes, combos & reviews',
      tag: 'Customer Front',
      icon: 'home',
      color: 'from-rose-500 to-amber-500',
      previewImg: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      features: ['25-30 Min Delivery Banner', '7 Cuisine Category Selectors', 'Chef Specials & Trending Grid', 'Customer Testimonials']
    },
    {
      id: 'menu' as ViewTab,
      number: 'Screen 2',
      title: 'Full 38-Dish Menu Explorer',
      subtitle: 'Complete categorized dishes with dietary filters & quick steppers',
      tag: 'Menu Catalog',
      icon: 'menu_book',
      color: 'from-amber-500 to-orange-500',
      previewImg: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
      features: ['38 Categorized Dishes', 'Veg / Non-Veg Toggle', 'Spice Level Indicators', 'Live Add to Cart Steppers']
    },
    {
      id: 'deals' as ViewTab,
      number: 'Screen 3',
      title: 'Super Saver Combos & Deals',
      subtitle: 'Flash countdown, 1-click promo coupons, & curated feast boxes',
      tag: 'Offers & Promos',
      icon: 'local_offer',
      color: 'from-emerald-600 to-teal-500',
      previewImg: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      features: ['Daily Flash Sale Countdown', '1-Click Copy Coupons (CRAVE100, FEAST50)', 'Curated Feast Boxes for 2-4', 'Instant Combo Cart Insertion']
    },
    {
      id: 'track' as ViewTab,
      number: 'Screen 4',
      title: 'Live Order Tracker & GPS Map',
      subtitle: 'Live simulated bike route, status stepper, and rider contact card',
      tag: 'Real-time Telemetry',
      icon: 'near_me',
      color: 'from-indigo-600 to-blue-500',
      previewImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      features: ['Simulated SVG Street GPS Route', 'Live Rider Animation & Speed', '4-Stage Order Stepper', 'Rider Calling & Chat Notes']
    },
    {
      id: 'admin' as ViewTab,
      number: 'Screen 5',
      title: 'Kitchen Partner Admin Portal',
      subtitle: 'Kanban station order dispatching, revenue KPI, & live stock toggle',
      tag: 'Back-of-House / KOS',
      icon: 'soup_kitchen',
      color: 'from-slate-800 to-black',
      previewImg: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80',
      features: ['Live Order Management Queue', 'Simulate New Order with Chime', 'Revenue & Prep Time KPI Cards', 'Real-Time Dish Sold-Out Toggle']
    }
  ];

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 pb-20 space-y-8">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#8a0028] to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-rose-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-400 text-emerald-950 text-xs font-black uppercase tracking-wider">
              5-Screen Production Suite
            </span>
            <h1 className="font-headline text-2xl sm:text-4xl font-black text-white">
              Foodie Hub Interactive Screens Deck
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 max-w-2xl leading-relaxed">
              Every screen from the client's design is fully functional with interactive states, real calculations, simulated GPS delivery routes, and partner operations.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex-shrink-0">
            <div className="text-center px-2">
              <span className="font-headline font-black text-xl text-amber-300">5</span>
              <span className="text-[10px] text-slate-300 block uppercase font-bold">Screens</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center px-2">
              <span className="font-headline font-black text-xl text-white">38</span>
              <span className="text-[10px] text-slate-300 block uppercase font-bold">Dishes</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center px-2">
              <span className="font-headline font-black text-xl text-emerald-300">{cartCount}</span>
              <span className="text-[10px] text-slate-300 block uppercase font-bold">In Cart</span>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {screens.map((screen) => (
          <div
            key={screen.id}
            className="bg-white rounded-3xl border border-slate-200/90 hover:border-rose-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
            onClick={() => onSwitchScreen(screen.id)}
          >
            {/* Visual Top Bar */}
            <div className={`p-4 bg-gradient-to-r ${screen.color} text-white flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">{screen.icon}</span>
                <span className="font-headline font-black text-xs uppercase tracking-wider">{screen.number}</span>
              </div>
              <span className="text-[10px] font-bold bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-full">
                {screen.tag}
              </span>
            </div>

            {/* Thumbnail Banner */}
            <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
              <img
                src={screen.previewImg}
                alt={screen.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="font-headline font-black text-base text-white">
                  {screen.title}
                </h3>
              </div>
            </div>

            {/* Description & Features */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                {screen.subtitle}
              </p>

              {/* Feature Pills */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                {screen.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSwitchScreen(screen.id);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 group-hover:bg-[#b80035] text-white text-xs font-headline font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Launch {screen.number}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
