import React from 'react';
import { STORE_LOCATIONS } from '../data/menuData';

interface AboutViewProps {
  onExploreMenu: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onExploreMenu }) => {
  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 pb-20 space-y-12">
      {/* Hero Banner */}
      <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-rose-950 via-[#7a0022] to-slate-950 text-white p-8 sm:p-14 shadow-2xl relative border border-rose-900/40">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="inline-block px-3.5 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-black uppercase tracking-wider">
            Our Culinary Story
          </span>
          <h1 className="font-headline text-3xl sm:text-5xl font-black text-white leading-tight">
            Piping Hot Feasts Crafted with Royal Passion.
          </h1>
          <p className="text-sm sm:text-base text-rose-100 leading-relaxed font-normal">
            Born out of the desire to rescue Delhi foodies from lukewarm, soggy deliveries, Foodie Hub unites master chefs, slow-dum clay pots, and lightning-fast logistics to serve restaurant-grade dishes straight to your dining table in under 30 minutes.
          </p>
          <div className="pt-2">
            <button
              onClick={onExploreMenu}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-headline font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Taste The Difference &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Excellence */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#b80035] flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[26px]">skillet</span>
          </div>
          <h3 className="font-headline font-bold text-base text-slate-900">Zero Frozen Ingredients</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Fresh meat cuts sourced at 5 AM daily, aromatic whole spices ground in-house, and premium dairy used without palm oil or preservatives.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[26px]">verified</span>
          </div>
          <h3 className="font-headline font-bold text-base text-slate-900">FSSAI Certified Hubs</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every kitchen station adheres to clinical sterilization, UV-treated water filtration, and continuous CCTV hygiene audits.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[26px]">thermal_heat</span>
          </div>
          <h3 className="font-headline font-bold text-base text-slate-900">Thermal Insulated Packs</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Proprietary foil-lined compartmentalized containers lock in aroma, maintain steam temperature, and prevent any gravy spillage.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[26px]">moped</span>
          </div>
          <h3 className="font-headline font-bold text-base text-slate-900">Dedicated Fleet</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our riders are equipped with electric bikes and dedicated hotboxes, prioritizing safety and speed without batch delivery delays.
          </p>
        </div>
      </div>

      {/* Cloud Kitchen Locations */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <h2 className="font-headline text-xl sm:text-2xl font-black text-slate-900">
            Our Cloud Kitchen Locations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Strategic neighborhood micro-hubs engineered for instant doorstep delivery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {STORE_LOCATIONS.map((loc) => (
            <div key={loc.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
              <span className="material-symbols-outlined text-[#b80035] text-[22px] flex-shrink-0 mt-0.5">
                storefront
              </span>
              <div>
                <h4 className="font-headline font-bold text-sm text-slate-900">{loc.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{loc.address}</p>
                <span className="text-[11px] font-bold text-emerald-600 mt-1 block">
                  ⚡ Avg {loc.deliveryMins} mins delivery radius
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
