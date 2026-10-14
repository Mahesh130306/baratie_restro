import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name: string; phone: string; address?: string } | null;
  onLogin: (user: { name: string; phone: string; address?: string }) => void;
  onLogout: () => void;
  showToast: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  showToast
}) => {
  const [name, setName] = useState(currentUser?.name || 'Mahesh Venkat');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [address, setAddress] = useState(currentUser?.address || 'Flat 402, Regal Building, Outer Circle, CP, New Delhi');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast('Please enter your full name and phone number');
      return;
    }
    onLogin({ name, phone, address });
    showToast(`Welcome to Foodie Hub, ${name}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 bg-gradient-to-r from-[#b80035] to-[#e11d48] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">account_circle</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-lg leading-tight">
                {currentUser ? 'Your Profile' : 'Sign In to Foodie Hub'}
              </h3>
              <p className="text-xs text-rose-100">Quick re-orders, rewards & fast checkout</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {currentUser ? (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-[#b80035] text-white flex items-center justify-center text-xl font-bold font-headline shadow-md">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-headline font-bold text-base text-slate-900">{currentUser.name}</h4>
                <p className="text-xs text-slate-500">{currentUser.phone}</p>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Foodie Gold Member • 150 Crave Points
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Saved Delivery Address
              </label>
              <p className="text-xs text-slate-700 p-3 rounded-xl bg-slate-50 border border-slate-100">
                {currentUser.address || 'Flat 402, Regal Building, Outer Circle, CP, New Delhi'}
              </p>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  onLogout();
                  showToast('You have been signed out.');
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl border border-rose-200 text-[#b80035] hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
              >
                Sign Out
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mahesh Venkat"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-200"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Phone Number (for OTP & Delivery Updates)
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-200"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Default Delivery Address
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Flat No., Street, Landmark..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-200"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#b80035] hover:bg-[#900028] text-white font-headline font-bold text-sm shadow-md shadow-rose-900/20 active:scale-95 transition-all cursor-pointer mt-2"
            >
              Sign In & Enjoy Foodie Hub
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
