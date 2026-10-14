import React, { useState } from 'react';
import { ActiveOrder, MenuItem } from '../types';
import { MENU_ITEMS, STORE_LOCATIONS } from '../data/menuData';

interface AdminPortalProps {
  orders: ActiveOrder[];
  onUpdateOrderStatus: (orderId: string, status: ActiveOrder['status']) => void;
  onAddNewOrder: (newOrder: ActiveOrder) => void;
  outOfStockIds: string[];
  onToggleStock: (itemId: string) => void;
  showToast: (msg: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  orders,
  onUpdateOrderStatus,
  onAddNewOrder,
  outOfStockIds,
  onToggleStock,
  showToast
}) => {
  const [selectedHub, setSelectedHub] = useState('delhi');
  const [inventorySearch, setInventorySearch] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Play synthetic pleasant alert chime for incoming orders
  const playAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // AudioContext fallback
    }
  };

  const handleSimulateNewOrder = () => {
    playAlertSound();
    const randomDish1 = MENU_ITEMS[Math.floor(Math.random() * 8)];
    const randomDish2 = MENU_ITEMS[8 + Math.floor(Math.random() * 8)];
    const newId = `FH-${Math.floor(8500 + Math.random() * 1000)}`;

    const freshOrder: ActiveOrder = {
      id: newId,
      customerName: ['Pooja Sharma', 'Vikram Malhotra', 'Rohan Verma', 'Kavita Iyer'][Math.floor(Math.random() * 4)],
      address: 'Tower 4, Barakhamba Suites, Connaught Place',
      items: [
        { id: randomDish1.id, name: randomDish1.name, price: randomDish1.price, quantity: 1, isVeg: randomDish1.isVeg },
        { id: randomDish2.id, name: randomDish2.name, price: randomDish2.price, quantity: 1, isVeg: randomDish2.isVeg }
      ],
      subtotal: randomDish1.price + randomDish2.price,
      discount: 50,
      total: randomDish1.price + randomDish2.price - 50 + 35,
      status: 'received',
      placedAt: 'Just Now',
      estimatedDelivery: 'In 25 Mins',
      riderName: 'Assigning Rider...',
      riderPhone: '+91 98000 11223',
      riderRating: 4.9,
      paymentMethod: 'UPI (Google Pay)'
    };

    onAddNewOrder(freshOrder);
    showToast(`🔔 New Order #${newId} received! Sent to kitchen queue.`);
  };

  const filteredMenuItems = MENU_ITEMS.filter(m => 
    m.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    m.category.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  const activeOrdersCount = orders.filter(o => o.status !== 'delivered').length;
  const currentHubInfo = STORE_LOCATIONS.find(l => l.id === selectedHub) || STORE_LOCATIONS[0];

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8">
      {/* Top Banner Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
              Kitchen Operating System (KOS v2.4)
            </span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl font-black text-white mt-1">
            Foodie Hub Kitchen Partner Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time station order queue, cook-time analytics & menu availability control
          </p>
        </div>

        {/* Hub Selector & Sound toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle incoming order chime"
          >
            <span className="material-symbols-outlined text-[18px]">
              {soundEnabled ? 'volume_up' : 'volume_off'}
            </span>
            <span className="hidden sm:inline">Chime: {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <select
            value={selectedHub}
            onChange={(e) => setSelectedHub(e.target.value)}
            className="bg-slate-800 text-white border border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-bold focus:outline-none cursor-pointer"
          >
            {STORE_LOCATIONS.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>

          <button
            onClick={handleSimulateNewOrder}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-headline font-black text-xs shadow-lg active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">add_alert</span>
            <span>Simulate New Order</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Queue</span>
            <span className="w-8 h-8 rounded-xl bg-rose-50 text-[#b80035] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">soup_kitchen</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="font-headline font-black text-2xl sm:text-3xl text-slate-900">{activeOrdersCount}</span>
            <span className="text-xs text-slate-400 ml-1.5">orders in progress</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block">
            ↑ 4 fresh in last 10 mins
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today's Revenue</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">currency_rupee</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="font-headline font-black text-2xl sm:text-3xl text-slate-900">₹48,650</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block">
            +18.4% vs yesterday
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Prep Time</span>
            <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">timer</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="font-headline font-black text-2xl sm:text-3xl text-slate-900">11.4 min</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block">
            ⚡ 2.6 mins faster than SLA
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Fleet</span>
            <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="font-headline font-black text-2xl sm:text-3xl text-slate-900">8 Riders</span>
          </div>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block">
            {currentHubInfo.name.split(',')[0]} Sector
          </span>
        </div>
      </div>

      {/* Live Order Queue Management Board */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline text-xl sm:text-2xl font-black text-slate-900">
              Live Kitchen Station Queue
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage incoming customer orders from receipt to rider handover
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Total Orders: {orders.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {orders.map((order) => {
            const statusColors: Record<ActiveOrder['status'], { bg: string; label: string; nextLabel?: string; nextStatus?: ActiveOrder['status'] }> = {
              received: {
                bg: 'bg-amber-100 text-amber-900 border-amber-300',
                label: 'NEW • RECEIVED',
                nextLabel: 'Accept & Send to Stove',
                nextStatus: 'preparing'
              },
              preparing: {
                bg: 'bg-rose-100 text-[#b80035] border-rose-300',
                label: 'COOKING IN KITCHEN',
                nextLabel: 'Handover to Rider',
                nextStatus: 'dispatched'
              },
              dispatched: {
                bg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
                label: 'OUT FOR DELIVERY',
                nextLabel: 'Mark Completed',
                nextStatus: 'delivered'
              },
              delivered: {
                bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                label: 'DELIVERED',
              }
            };

            const cfg = statusColors[order.status];

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="font-mono font-bold text-xs text-slate-900">#{order.id}</span>
                      <h4 className="font-headline font-bold text-sm text-slate-800">{order.customerName}</h4>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${cfg.bg}`}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="py-3 space-y-1.5 border-b border-slate-100">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${it.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span className="font-medium text-slate-800">{it.name}</span>
                        </div>
                        <span className="font-bold text-slate-600">x{it.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery & Rider Details */}
                  <div className="pt-2 text-xs text-slate-500 space-y-1">
                    <p className="truncate"><strong>Drop:</strong> {order.address}</p>
                    <p><strong>Rider:</strong> {order.riderName} ({order.riderPhone})</p>
                    <div className="flex items-center justify-between font-bold text-slate-800 pt-1">
                      <span>Total Bill: ₹{order.total}</span>
                      <span className="text-[11px] text-slate-400 font-normal">{order.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  {cfg.nextStatus && (
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(order.id, cfg.nextStatus!);
                        showToast(`Order #${order.id} updated to ${cfg.nextStatus?.toUpperCase()}`);
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-[#b80035] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      {cfg.nextLabel}
                    </button>
                  )}

                  {order.status === 'delivered' && (
                    <span className="flex-1 py-2 text-center text-xs font-bold text-emerald-600 bg-emerald-50 rounded-xl">
                      ✓ Order Fulfilled
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Menu Inventory Stock Toggle Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-headline text-xl font-black text-slate-900">
              Kitchen Inventory & Live Stock Manager
            </h2>
            <p className="text-xs text-slate-500">
              Mark dishes as "Sold Out" in real time when ingredients run low. Changes reflect immediately across the customer menu.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={inventorySearch}
              onChange={(e) => setInventorySearch(e.target.value)}
              placeholder="Search dishes..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Stock List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
          {filteredMenuItems.map((item) => {
            const isSoldOut = outOfStockIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                  isSoldOut ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50 border-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="font-headline font-bold text-xs text-slate-800 truncate">{item.name}</h5>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">{item.category} • ₹{item.price}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onToggleStock(item.id);
                    showToast(`${item.name} marked ${!isSoldOut ? 'SOLD OUT' : 'AVAILABLE'}`);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isSoldOut
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  {isSoldOut ? 'Mark In Stock' : 'In Stock ✓'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
