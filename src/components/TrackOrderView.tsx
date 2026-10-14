import React, { useState, useEffect } from 'react';
import { ActiveOrder, CartItem } from '../types';

interface TrackOrderViewProps {
  orders: ActiveOrder[];
  selectedOrderId?: string;
  onSelectOrder?: (orderId: string) => void;
  onUpdateOrderStatus?: (orderId: string, newStatus: ActiveOrder['status']) => void;
  showToast: (msg: string) => void;
}

export const TrackOrderView: React.FC<TrackOrderViewProps> = ({
  orders,
  selectedOrderId,
  onSelectOrder,
  onUpdateOrderStatus,
  showToast
}) => {
  const activeOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  // Rider position animation along map route (0% to 100%)
  const [riderProgress, setRiderProgress] = useState(62);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  // Animate rider position gently
  useEffect(() => {
    if (activeOrder?.status !== 'dispatched') return;
    const interval = setInterval(() => {
      setRiderProgress(prev => {
        if (prev >= 92) return 92;
        return prev + 1;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [activeOrder?.status]);

  if (!activeOrder) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <span className="material-symbols-outlined text-[32px]">receipt_long</span>
        </div>
        <h2 className="font-headline font-bold text-xl text-slate-800">No Orders in Transit</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
          Add items to your cart and complete checkout to track your delivery live on this map!
        </p>
      </div>
    );
  }

  const steps: { key: ActiveOrder['status']; title: string; time: string; icon: string; desc: string }[] = [
    { key: 'received', title: 'Order Confirmed', time: activeOrder.placedAt, icon: 'receipt', desc: 'Order received & sent to CP kitchen' },
    { key: 'preparing', title: 'Cooking in Kitchen', time: '12:20 PM', icon: 'skillet', desc: 'Chef assembling fresh ingredients' },
    { key: 'dispatched', title: 'Rider on the Way', time: '12:28 PM', icon: 'moped', desc: `${activeOrder.riderName} is speeding on route` },
    { key: 'delivered', title: 'Delivered at Door', time: activeOrder.estimatedDelivery.split(' ')[0], icon: 'home', desc: 'Enjoy your hot & delicious meal' },
  ];

  const getStepStatus = (stepKey: ActiveOrder['status']) => {
    const orderRanks: Record<ActiveOrder['status'], number> = {
      received: 1,
      preparing: 2,
      dispatched: 3,
      delivered: 4
    };
    const currentRank = orderRanks[activeOrder.status];
    const thisRank = orderRanks[stepKey];

    if (thisRank < currentRank) return 'completed';
    if (thisRank === currentRank) return 'current';
    return 'upcoming';
  };

  const advanceNextStatus = () => {
    if (!onUpdateOrderStatus) return;
    if (activeOrder.status === 'received') {
      onUpdateOrderStatus(activeOrder.id, 'preparing');
      showToast('Order moved to Cooking in Kitchen');
    } else if (activeOrder.status === 'preparing') {
      onUpdateOrderStatus(activeOrder.id, 'dispatched');
      showToast('Rider picked up meal and is on the way!');
    } else if (activeOrder.status === 'dispatched') {
      onUpdateOrderStatus(activeOrder.id, 'delivered');
      showToast('Order delivered successfully! Bon appétit!');
    } else {
      onUpdateOrderStatus(activeOrder.id, 'received');
      showToast('Reset order to Received');
    }
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Top Header & Order Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-headline text-xs font-black uppercase tracking-wider text-emerald-600">
              Live GPS Telemetry Active
            </span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
            Track Order #{activeOrder.id}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Placed at {activeOrder.placedAt} • Estimated arrival: <strong className="text-slate-800">{activeOrder.estimatedDelivery}</strong>
          </p>
        </div>

        {/* Switch Order Dropdown */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 pl-2">Select Order:</span>
            <select
              value={activeOrder.id}
              onChange={(e) => onSelectOrder && onSelectOrder(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  #{o.id} - {o.status.toUpperCase()} ({o.items.length} items)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Grid: Left GPS Map & Rider details | Right Stepper & Order Bill */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Col: Interactive Live Map & Rider (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Simulated Live GPS Map View */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xl">
            {/* Map Canvas Background (Simulated stylized city roads of CP Delhi) */}
            <div className="relative h-80 sm:h-96 w-full bg-[#1b232a] overflow-hidden select-none">
              
              {/* Stylized Street Grid Lines */}
              <svg className="w-full h-full opacity-60" viewBox="0 0 600 400" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2a3b4c" strokeWidth="0.8" />
                  </pattern>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#e11d48" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>

                <rect width="100%" height="100%" fill="#161f28" />
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* City Blocks & Green Parks */}
                <rect x="50" y="40" width="120" height="90" rx="8" fill="#1f2d3a" />
                <rect x="200" y="40" width="180" height="80" rx="8" fill="#1a3328" />
                <text x="240" y="85" fill="#4ade80" fontSize="10" fontWeight="bold" opacity="0.6">CENTRAL PARK CP</text>
                
                <rect x="410" y="40" width="140" height="90" rx="8" fill="#1f2d3a" />
                <rect x="60" y="160" width="130" height="100" rx="8" fill="#1f2d3a" />
                <rect x="220" y="160" width="160" height="110" rx="8" fill="#1f2d3a" />
                <rect x="410" y="160" width="140" height="110" rx="8" fill="#1f2d3a" />

                {/* Major Roads */}
                <line x1="0" y1="145" x2="600" y2="145" stroke="#33475b" strokeWidth="16" />
                <line x1="0" y1="145" x2="600" y2="145" stroke="#475f78" strokeWidth="1" strokeDasharray="6 6" />

                <line x1="205" y1="0" x2="205" y2="400" stroke="#33475b" strokeWidth="16" />
                <line x1="395" y1="0" x2="395" y2="400" stroke="#33475b" strokeWidth="16" />
                <line x1="0" y1="285" x2="600" y2="285" stroke="#33475b" strokeWidth="16" />

                {/* Delivery Active Route Pathway */}
                <path
                  d="M 110 90 L 110 145 L 395 145 L 395 285 L 510 285"
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="8 4"
                  className="animate-pulse"
                />
              </svg>

              {/* Pin 1: Foodie Hub Kitchen */}
              <div className="absolute top-[80px] left-[100px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="px-2 py-0.5 rounded-md bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-wider shadow-md mb-1 whitespace-nowrap">
                  Foodie Hub Kitchen
                </div>
                <div className="w-8 h-8 rounded-full bg-[#b80035] text-white flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-rose-500/30">
                  <span className="material-symbols-outlined text-[18px]">soup_kitchen</span>
                </div>
              </div>

              {/* Pin 2: Animated Rider Marker */}
              {activeOrder.status === 'dispatched' && (
                <div 
                  className="absolute transition-all duration-1000 ease-linear -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{
                    // compute approximate position along (110,90) -> (110,145) -> (395,145) -> (395,285) -> (510,285)
                    left: `${riderProgress > 70 ? 395 + (riderProgress - 70) * 4.5 : riderProgress > 30 ? 110 + (riderProgress - 30) * 7.1 : 110}px`,
                    top: `${riderProgress > 70 ? 285 : riderProgress > 50 ? 145 + (riderProgress - 50) * 7 : 145}px`
                  }}
                >
                  <div className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-lg mb-1 flex items-center gap-1 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    <span>{activeOrder.riderName} (~12 mins)</span>
                  </div>
                  <div className="relative">
                    <div className="absolute -inset-2 bg-emerald-400/40 rounded-full animate-ping"></div>
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl border-2 border-white ring-4 ring-emerald-500/30 relative z-10">
                      <span className="material-symbols-outlined text-[20px]">two_wheeler</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Pin 3: Customer Destination */}
              <div className="absolute top-[275px] left-[510px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="px-2 py-0.5 rounded-md bg-white text-slate-900 text-[10px] font-black uppercase tracking-wider shadow-md mb-1 whitespace-nowrap">
                  Delivery Destination
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-slate-500/30">
                  <span className="material-symbols-outlined text-[18px]">home</span>
                </div>
              </div>

              {/* Bottom Map Overlay Bar */}
              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">speed</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Live Transit Stats</span>
                    <span className="font-headline font-bold text-xs text-white">
                      {activeOrder.status === 'dispatched' ? '1.1 km away • Speed: 26 km/h' : activeOrder.status === 'delivered' ? 'Delivery Completed' : 'Meal cooking on stove'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={advanceNextStatus}
                    className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                    title="Simulate progression of order through kitchen and rider"
                  >
                    <span className="material-symbols-outlined text-[14px]">fast_forward</span>
                    <span>Simulate Step</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Partner Profile Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt="Delivery Partner"
                  className="w-14 h-14 rounded-2xl object-cover shadow-sm border-2 border-rose-100"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px]">
                  ✓
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline font-bold text-base text-slate-900">
                    {activeOrder.riderName}
                  </h3>
                  <span className="flex items-center gap-0.5 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-[13px]">star</span>
                    {activeOrder.riderRating}
                  </span>
                </div>
                <p className="text-xs text-slate-500">Foodie Hub Super Rider • 1,420+ trips</p>
                <p className="text-[11px] text-slate-400 mt-0.5">DL 01 AB 4022 (Ather Electric Scooter)</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowCallModal(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">call</span>
                <span>Call Rider</span>
              </button>

              <button
                onClick={() => setShowMessageModal(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Message</span>
              </button>
            </div>
          </div>

          {/* Delivery Address Box */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-start gap-3">
            <span className="material-symbols-outlined text-rose-600 text-[22px] flex-shrink-0 mt-0.5">
              location_on
            </span>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Delivering to
              </span>
              <p className="text-xs font-semibold text-slate-800 mt-0.5">
                {activeOrder.address}
              </p>
              <span className="text-[11px] text-slate-500 block mt-1">
                Recipient: {activeOrder.customerName} • Contactless drop requested
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Order Timeline Stepper & Bill (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Timeline Stepper */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-headline font-black text-lg text-slate-900 border-b border-slate-100 pb-3">
              Order Timeline
            </h3>

            <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {steps.map((st) => {
                const status = getStepStatus(st.key);

                return (
                  <div key={st.key} className="flex items-start gap-4 relative z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 border-2 transition-all ${
                      status === 'completed'
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : status === 'current'
                        ? 'bg-[#b80035] border-white text-white ring-4 ring-rose-500/20 shadow-md'
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}>
                      <span className="material-symbols-outlined text-[16px]">
                        {status === 'completed' ? 'check' : st.icon}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-headline font-bold text-xs ${
                          status === 'current' ? 'text-[#b80035]' : status === 'completed' ? 'text-slate-900' : 'text-slate-400'
                        }`}>
                          {st.title}
                        </h4>
                        <span className="text-[10px] font-semibold text-slate-400">{st.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Itemized Order Receipt */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-headline font-black text-base text-slate-900">
                Order Summary ({activeOrder.items.length} Items)
              </h3>
              <span className="text-[11px] font-bold text-slate-500">#{activeOrder.id}</span>
            </div>

            {/* Dishes List */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {activeOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-[2px] border p-[1px] flex items-center justify-center ${
                      item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                    </div>
                    <span className="font-semibold text-slate-800">{item.name}</span>
                    <span className="text-slate-400 text-[11px]">x {item.quantity}</span>
                  </div>
                  <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Bill Details */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{activeOrder.subtotal}</span>
              </div>
              {activeOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Special Discount</span>
                  <span>-₹{activeOrder.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Doorstep Delivery</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Paid</span>
                <span className="text-[#b80035] font-headline text-base">₹{activeOrder.total}</span>
              </div>
              <span className="text-[10px] text-slate-400 block pt-1">
                Payment Mode: {activeOrder.paymentMethod}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Call Rider Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">phone_in_talk</span>
            </div>
            <h3 className="font-headline font-bold text-lg text-slate-900">Calling {activeOrder.riderName}</h3>
            <p className="text-xs text-slate-500">
              Connecting your call through Foodie Hub's masked secure calling line.
            </p>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 font-mono font-bold text-sm text-slate-800">
              {activeOrder.riderPhone}
            </div>
            <button
              onClick={() => {
                setShowCallModal(false);
                showToast(`Call simulated with rider ${activeOrder.riderName}`);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Message Rider Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-base text-slate-900">Message {activeOrder.riderName}</h3>
              <button onClick={() => setShowMessageModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quick Presets</span>
              {[
                "Please ring the doorbell when you arrive.",
                "Leave food at door, contactless delivery.",
                "Call me once you are at the building gate.",
                "Building lift is on the left side."
              ].map((preset, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setShowMessageModal(false);
                    showToast(`Sent note to ${activeOrder.riderName}: "${preset}"`);
                  }}
                  className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-xs text-slate-700 transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Type custom note..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-rose-500 mb-2"
              />
              <button
                onClick={() => {
                  if (customMsg.trim()) {
                    setShowMessageModal(false);
                    showToast(`Note delivered to ${activeOrder.riderName}`);
                    setCustomMsg('');
                  }
                }}
                className="w-full py-2 rounded-xl bg-[#b80035] text-white text-xs font-bold"
              >
                Send Custom Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
