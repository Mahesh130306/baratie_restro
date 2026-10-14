import React, { useState } from 'react';
import { ViewTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: ViewTab) => void;
  showToast: (msg: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, showToast }) => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address');
      return;
    }
    showToast('Subscribed! You will receive weekend midnight secret deals.');
    setEmail('');
  };

  return (
    <footer className="w-full bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Address */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#e11d48] flex items-center justify-center text-white shadow-md">
                <span className="material-symbols-outlined text-[20px]">restaurant_menu</span>
              </div>
              <span className="font-headline text-xl font-bold text-white tracking-tight">Foodie Hub</span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Delicious food, delivered with love! Experience lightning-fast door-step deliveries from chef-curated cloud kitchens and top-rated regional bistros.
            </p>

            <div className="flex flex-col gap-2 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-rose-500 text-[18px] shrink-0 mt-0.5">storefront</span>
                <span>42 Regal Building, Outer Circle, Connaught Place, New Delhi - 110001</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-emerald-500 text-[18px] shrink-0">call</span>
                <span>+91 11 4987 6500 &nbsp;•&nbsp; order@foodiehub.in</span>
              </div>
            </div>
          </div>

          {/* Quick Bites Navigation */}
          <div className="flex flex-col gap-3">
            <h4 className="font-headline text-sm font-bold text-white uppercase tracking-wider">Quick Bites</h4>
            <ul className="flex flex-col gap-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('menu')} className="hover:text-rose-400 transition-colors">
                  Our Full Menu (38 Items)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('deals')} className="hover:text-rose-400 transition-colors">
                  Pocket Hero Combos
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('deck')} className="hover:text-rose-400 transition-colors">
                  Live 1-Screen Order Deck
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('track')} className="hover:text-rose-400 transition-colors">
                  Live Order GPS Status
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-rose-400 transition-colors">
                  Chef's Philosophy & Story
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin')} className="hover:text-rose-400 transition-colors">
                  Kitchen Partner Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="flex flex-col gap-3">
            <h4 className="font-headline text-sm font-bold text-white uppercase tracking-wider">Legal & Trust</h4>
            <ul className="flex flex-col gap-2 text-xs text-slate-400">
              <li><a href="#privacy" onClick={(e) => { e.preventDefault(); showToast('Privacy Policy: We never sell or share your contact data.'); }} className="hover:text-rose-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" onClick={(e) => { e.preventDefault(); showToast('Terms of Service: Certified hygienic preparation.'); }} className="hover:text-rose-400 transition-colors">Terms & Conditions</a></li>
              <li><a href="#refund" onClick={(e) => { e.preventDefault(); showToast('Refund: 100% money back if food arrives cold or leaked.'); }} className="hover:text-rose-400 transition-colors">Refund & Cancellation</a></li>
            </ul>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-[11px] mt-2">
              <span className="material-symbols-outlined text-emerald-400 text-[20px] shrink-0">verified</span>
              <span>FSSAI Lic. #10020011000543 (Verified Clean Kitchen)</span>
            </div>
          </div>

          {/* Crave Alerts & Newsletter */}
          <div className="flex flex-col gap-3">
            <h4 className="font-headline text-sm font-bold text-white uppercase tracking-wider">Get Crave Alerts</h4>
            <p className="text-xs text-slate-400">Subscribe for fresh discounts and weekend midnight deals.</p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="flex gap-1.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-800 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 border border-slate-700"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#e11d48] hover:bg-[#b80035] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Join
                </button>
              </div>
            </form>

            <div className="pt-2">
              <span className="text-[11px] text-slate-400 block mb-2 font-medium">Secure Checkout Partners</span>
              <div className="flex items-center gap-2 text-slate-300 text-[11px] font-bold">
                <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">UPI</span>
                <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">Razorpay</span>
                <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">Paytm</span>
                <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">Cards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Foodie Hub Technologies Pvt. Ltd. Crafted with love for foodies.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400 font-semibold">Download App:</span>
            <button 
              onClick={() => showToast('App Store build: Ready for iOS 18')} 
              className="text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              App Store
            </button>
            <span>•</span>
            <button 
              onClick={() => showToast('Google Play build: Ready for Android')} 
              className="text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Google Play
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
