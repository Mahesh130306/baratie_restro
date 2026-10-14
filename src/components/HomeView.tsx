import React from 'react';
import { MenuItem, ComboDeal, CuisineCategory, ViewTab, CartItem } from '../types';
import { MENU_ITEMS, COMBO_DEALS, CUSTOMER_REVIEWS } from '../data/menuData';

interface HomeViewProps {
  onSelectCategory: (cat: CuisineCategory) => void;
  onAddToCart: (item: MenuItem | ComboDeal, quantity?: number) => void;
  onUpdateQty: (id: string, delta: number) => void;
  cart: CartItem[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpenItemModal: (item: MenuItem) => void;
  setActiveTab: (tab: ViewTab) => void;
  isVegOnly: boolean;
  searchQuery: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectCategory,
  onAddToCart,
  onUpdateQty,
  cart,
  favorites,
  onToggleFavorite,
  onOpenItemModal,
  setActiveTab,
  isVegOnly
}) => {
  // Filter trending items for the home page showcase
  const trendingItems = MENU_ITEMS.filter(item => {
    if (isVegOnly && !item.isVeg) return false;
    return item.badge || item.rating >= 4.8;
  }).slice(0, 8);

  const getItemCartQty = (id: string) => {
    const found = cart.find(c => c.id === id);
    return found ? found.quantity : 0;
  };

  const categoriesList: { id: CuisineCategory; label: string; icon: string; count: number }[] = [
    { id: 'all', label: 'All Cuisines', icon: 'lunch_dining', count: 38 },
    { id: 'indian', label: 'Indian Delights', icon: 'rice_bowl', count: 8 },
    { id: 'chinese', label: 'Indo-Chinese', icon: 'ramen_dining', count: 6 },
    { id: 'italian', label: 'Gourmet Italian', icon: 'local_pizza', count: 6 },
    { id: 'fastfood', label: 'Burgers & Fries', icon: 'fastfood', count: 6 },
    { id: 'desserts', label: 'Artisanal Desserts', icon: 'cake', count: 6 },
    { id: 'combos', label: 'Super Combos', icon: 'takeout_dining', count: 4 }
  ];

  return (
    <div className="pb-16 space-y-12">
      {/* Top Highlight Announcement */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-[#b80035] text-white py-2 px-4 text-center text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow-sm">
        <span className="material-symbols-outlined text-[16px] animate-bounce">celebration</span>
        <span>SPECIAL OFFER: Use code <span className="underline decoration-wavy font-extrabold text-amber-200">CRAVE100</span> to get ₹100 OFF + Free Delivery on orders over ₹499!</span>
        <button 
          onClick={() => setActiveTab('deals')}
          className="ml-2 underline text-[11px] font-black uppercase tracking-wider hover:text-amber-200"
        >
          View Deals &rarr;
        </button>
      </div>

      {/* Hero Section */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-rose-950 via-[#70001f] to-slate-950 text-white shadow-2xl p-6 sm:p-10 lg:p-14 border border-rose-900/40">
          
          {/* Background Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Express Cloud Kitchen Active in Connaught Place</span>
              </div>

              <h1 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                CRAVE IT? <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-rose-100">
                  WE DELIVER IT HOT & FRESH.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-rose-100/90 max-w-xl font-normal leading-relaxed">
                Chef-crafted Awadhi biryanis, wood-fired artisanal pizzas, fiery noodles, juicy burgers, and decadent Belgian desserts delivered piping hot in under 30 minutes.
              </p>

              {/* Key Trust Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-xs font-semibold">
                  <span className="text-amber-400 text-base">⚡</span>
                  <span>25-30 Min Delivery</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-xs font-semibold">
                  <span className="text-amber-400 text-base">⭐</span>
                  <span>4.8+ Rating (25k+ Foodies)</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-xs font-semibold">
                  <span className="text-emerald-400 text-base">🛡️</span>
                  <span>100% Tamper Sealed</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('menu')}
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-headline font-black text-sm tracking-wide shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">restaurant</span>
                  <span>Explore Full Menu (38)</span>
                </button>

                <button
                  onClick={() => setActiveTab('deals')}
                  className="px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-headline font-bold text-sm border border-white/20 backdrop-blur-md active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">local_offer</span>
                  <span>Super Saver Deals</span>
                </button>
              </div>
            </div>

            {/* Right Hero Visual Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md">
                
                {/* Main Hero Food Card */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900 group">
                  <img
                    src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80"
                    alt="Royal Awadhi Biryani"
                    className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-4 bg-slate-900/90 backdrop-blur-md border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Today's Star Special</span>
                      <h3 className="font-headline font-bold text-base text-white">Awadhi Chicken Dum Biryani</h3>
                      <p className="text-xs text-slate-300">₹340 <span className="line-through text-slate-500">₹420</span></p>
                    </div>
                    <button
                      onClick={() => onAddToCart(MENU_ITEMS[0])}
                      className="px-4 py-2 rounded-xl bg-[#b80035] hover:bg-rose-600 text-white font-headline font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      + ADD
                    </button>
                  </div>
                </div>

                {/* Floating Micro Badge 1 */}
                <div className="absolute -top-4 -left-4 bg-white text-slate-900 px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-100 animate-bounce duration-1000">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    🔥
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold leading-tight">Live Craving</span>
                    <span className="font-headline font-extrabold text-xs text-slate-900 leading-tight">420+ Orders This Hour</span>
                  </div>
                </div>

                {/* Floating Micro Badge 2 */}
                <div className="absolute -bottom-4 -right-4 bg-white text-slate-900 px-3.5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-[#b80035] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold leading-tight">Fastest Rider</span>
                    <span className="font-headline font-extrabold text-xs text-slate-900 leading-tight">Avg 22 Mins in CP</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Category Icons Selector Carousel */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-headline text-xl sm:text-2xl font-black text-slate-900">
              What are you craving today?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Browse top categories freshly crafted in our cloud kitchen
            </p>
          </div>
          <button
            onClick={() => setActiveTab('menu')}
            className="text-xs font-bold text-[#b80035] hover:text-rose-700 flex items-center gap-1 cursor-pointer"
          >
            <span>See All (38 Items)</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                if (cat.id === 'combos') {
                  setActiveTab('deals');
                } else {
                  setActiveTab('menu');
                }
              }}
              className="flex flex-col items-center p-4 rounded-2xl bg-white hover:bg-rose-50/60 border border-slate-200/80 hover:border-rose-300 shadow-xs hover:shadow-md transition-all group cursor-pointer text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-[#b80035] text-slate-700 group-hover:text-white flex items-center justify-center transition-colors mb-2 shadow-xs">
                <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
              </div>
              <span className="font-headline font-bold text-xs text-slate-900 group-hover:text-[#b80035] transition-colors">
                {cat.label}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                {cat.count} Dishes
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Trending Dishes & Chef's Specials */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-[#b80035] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">local_fire_department</span>
            </div>
            <div>
              <h2 className="font-headline text-xl sm:text-2xl font-black text-slate-900">
                Trending Now & Chef's Specials
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Most ordered culinary hits prepared hot on order
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('menu')}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <span>View All Menu</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* Dish Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trendingItems.map((item) => {
            const qty = getItemCartQty(item.id);
            const isFav = favorites.includes(item.id);

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/80 hover:border-rose-200 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group relative"
              >
                {/* Image Banner */}
                <div 
                  className="relative h-48 w-full bg-slate-100 overflow-hidden cursor-pointer"
                  onClick={() => onOpenItemModal(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Veg / Non-Veg Indicator */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-xs">
                    <div className={`w-3.5 h-3.5 rounded-[2px] border p-[1.5px] flex items-center justify-center ${
                      item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
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

                  {/* Rating & Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    {item.badge ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 shadow-xs">
                        {item.badge}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-white/80">{item.serves}</span>
                    )}

                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md text-xs font-bold">
                      <span className="material-symbols-outlined text-amber-400 text-[14px]">star</span>
                      <span>{item.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 
                      onClick={() => onOpenItemModal(item)}
                      className="font-headline font-bold text-sm sm:text-base text-slate-900 line-clamp-1 group-hover:text-[#b80035] transition-colors cursor-pointer"
                    >
                      {item.name}
                    </h3>

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
                        {item.serves || 'Standard portion'}
                      </span>
                    </div>

                    {qty > 0 ? (
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
      </section>

      {/* Featured Combo Feast Box Highlight */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-amber-50 to-rose-50 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500 text-amber-950 text-xs font-black uppercase tracking-wider">
                Party & Family Combos
              </span>
              <h2 className="font-headline text-2xl sm:text-3xl font-black text-slate-900">
                Save up to 35% with Curated Feast Boxes
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Complete meals bundled with biryani, starters, cold beverages, and decadent desserts. Perfect for house parties, game nights, and family dinners.
              </p>
              <div className="flex items-center gap-4 pt-1">
                <button
                  onClick={() => setActiveTab('deals')}
                  className="px-5 py-2.5 rounded-xl bg-[#b80035] hover:bg-rose-700 text-white font-headline font-bold text-xs shadow-md shadow-rose-900/20 active:scale-95 transition-all cursor-pointer"
                >
                  Explore All Combos
                </button>
                <span className="text-xs font-semibold text-slate-500">
                  Starting at only <span className="font-bold text-slate-900">₹399</span>
                </span>
              </div>
            </div>

            {/* Quick Preview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
              {COMBO_DEALS.slice(0, 2).map((combo) => (
                <div key={combo.id} className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
                  <img
                    src={combo.imageUrl}
                    alt={combo.title}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase block">{combo.tag}</span>
                    <h4 className="font-headline font-bold text-xs text-slate-900 truncate">{combo.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-headline font-bold text-xs text-[#b80035]">₹{combo.price}</span>
                      <span className="text-[10px] text-slate-400 line-through">₹{combo.originalPrice}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onAddToCart(combo)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-[#b80035] hover:text-white text-slate-800 transition-colors ml-auto cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Foodie Hub? (Trust & Quality Grid) */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="font-headline text-xl sm:text-2xl font-black text-slate-900">
            Why Delhi Foodies Love Foodie Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Uncompromising culinary standards with lightning-fast neighborhood deliveries
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#b80035] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[24px]">speed</span>
            </div>
            <h3 className="font-headline font-bold text-sm text-slate-900">25-30 Min Delivery</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Equipped with smart hot-bags ensuring your butter chicken and naan arrive steaming hot.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[24px]">soup_kitchen</span>
            </div>
            <h3 className="font-headline font-bold text-sm text-slate-900">Master Chef Recipes</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Crafted by veteran chefs using unadulterated spices, cold-pressed oils, and fresh farm produce.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
            <h3 className="font-headline font-bold text-sm text-slate-900">FSSAI Gold Certified</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Sterilized contactless kitchen protocols, regular staff health checks, and 100% bio-sealed containers.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[24px]">near_me</span>
            </div>
            <h3 className="font-headline font-bold text-sm text-slate-900">Live GPS Tracker</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Track your dedicated delivery partner live from the kitchen stove to your apartment entrance.
            </p>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-headline text-xl sm:text-2xl font-black text-slate-900">
              Verified Foodie Reviews
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Over 25,000+ satisfied hunger pangs served this month
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
            <span className="material-symbols-outlined text-[18px]">hotel_class</span>
            <span>4.9 / 5 Average Rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[16px]">star</span>
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{rev.review}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 mt-3 border-t border-slate-100">
                <div className={`w-9 h-9 rounded-full ${rev.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                  {rev.avatarInitials}
                </div>
                <div>
                  <h4 className="font-headline font-bold text-xs text-slate-900">{rev.name}</h4>
                  <span className="text-[10px] text-slate-400">{rev.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Track Order Live Teaser Banner */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 animate-pulse">
              <span className="material-symbols-outlined text-[26px]">moped</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Live Delivery Simulation</span>
              <h3 className="font-headline font-bold text-lg text-white">Have an active order on the way?</h3>
              <p className="text-xs text-slate-400">Track rider speed, real-time map route, and estimated time of arrival.</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('track')}
            className="px-6 py-3 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-headline font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            Open Live GPS Tracker &rarr;
          </button>
        </div>
      </section>
    </div>
  );
};
