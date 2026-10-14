import React, { useState, useEffect } from 'react';
import { ViewTab, CuisineCategory, CartItem, MenuItem, ComboDeal, ActiveOrder } from './types';
import { MENU_ITEMS, INITIAL_ACTIVE_ORDERS } from './data/menuData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { MenuView } from './components/MenuView';
import { DealsView } from './components/DealsView';
import { TrackOrderView } from './components/TrackOrderView';
import { AdminPortal } from './components/AdminPortal';
import { AboutView } from './components/AboutView';
import { ScreensDeckView } from './components/ScreensDeckView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { FoodDetailModal } from './components/FoodDetailModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { AuthModal } from './components/AuthModal';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<ViewTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<CuisineCategory>('all');
  const [selectedLocation, setSelectedLocation] = useState('delhi');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVegOnly, setIsVegOnly] = useState(false);

  // Cart State (pre-populated with 2 items for immediate visual feedback and testing)
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'ind-1',
      name: 'Awadhi Chicken Biryani',
      price: 340,
      quantity: 1,
      isVeg: false,
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      category: 'indian'
    },
    {
      id: 'des-1',
      name: 'Belgian Chocolate Truffle Cake',
      price: 180,
      quantity: 1,
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      category: 'desserts'
    }
  ]);

  // Wishlist & Favorites
  const [favorites, setFavorites] = useState<string[]>(['ind-1', 'ita-1', 'des-1']);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);

  // User & Address
  const [user, setUser] = useState<{ name: string; phone: string; address?: string } | null>({
    name: 'Mahesh Venkat',
    phone: '+91 98765 43210',
    address: 'Flat 402, Regal Building, Outer Circle, Connaught Place, New Delhi - 110001'
  });
  const [deliveryAddress, setDeliveryAddress] = useState(
    'Flat 402, Regal Building, Outer Circle, Connaught Place, New Delhi - 110001'
  );

  // Coupon & Orders State
  const [appliedCoupon, setAppliedCoupon] = useState('CRAVE100');
  const [orders, setOrders] = useState<ActiveOrder[]>(INITIAL_ACTIVE_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(INITIAL_ACTIVE_ORDERS[0].id);
  const [outOfStockIds, setOutOfStockIds] = useState<string[]>([]);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Calculations
  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartSubtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  // Discount computation based on appliedCoupon
  let discountAmount = 0;
  if (appliedCoupon === 'CRAVE100' && cartSubtotal >= 499) {
    discountAmount = 100;
  } else if (appliedCoupon === 'FEAST50' && cartSubtotal >= 299) {
    discountAmount = 50;
  } else if (appliedCoupon === 'SWEETTOOTH' && cartSubtotal >= 499) {
    discountAmount = 180; // value of dessert
  }

  const freeDeliveryThreshold = 500;
  const isFreeDelivery = cartSubtotal >= freeDeliveryThreshold || appliedCoupon === 'FREESHIP';
  const deliveryFee = cartSubtotal === 0 ? 0 : (isFreeDelivery ? 0 : 40);
  const packagingFee = cartSubtotal === 0 ? 0 : 35;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + packagingFee + deliveryFee);

  // Cart Operations
  const handleAddToCart = (item: MenuItem | ComboDeal, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => 
          c.id === item.id ? { ...c, quantity: c.quantity + quantity } : c
        );
      }
      const newItem: CartItem = {
        id: item.id,
        name: 'title' in item ? item.title : item.name,
        price: item.price,
        quantity,
        isVeg: item.isVeg,
        imageUrl: item.imageUrl,
        category: 'category' in item ? item.category : 'combos'
      };
      return [...prev, newItem];
    });

    const itemName = 'title' in item ? item.title : item.name;
    showToast(`Added ${itemName} to your feast tray!`);
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(c => {
          if (c.id === id) {
            const nextQty = c.quantity + delta;
            return nextQty > 0 ? { ...c, quantity: nextQty } : null;
          }
          return c;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (id: string) => {
    setCart(prev => prev.filter(c => c.id !== id));
    showToast('Item removed from cart');
  };

  const handleClearCart = () => {
    setCart([]);
    showToast('Cart cleared');
  };

  // Favorites Operations
  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from favorites');
        return prev.filter(fId => fId !== id);
      } else {
        showToast('Saved to craving favorites! ❤️');
        return [...prev, id];
      }
    });
  };

  // Order Operations
  const handleOrderSuccess = (orderId: string, address: string, paymentMethod: string) => {
    const newOrder: ActiveOrder = {
      id: orderId,
      customerName: user?.name || 'Mahesh Venkat',
      address,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountAmount,
      total: grandTotal,
      status: 'received',
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedDelivery: 'In ~25 mins',
      riderName: 'Vikram Singh (Assigning route)',
      riderPhone: '+91 98111 22334',
      riderRating: 4.9,
      paymentMethod
    };

    setOrders(prev => [newOrder, ...prev]);
    setSelectedOrderId(orderId);
    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setActiveTab('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`🎉 Order #${orderId} confirmed! Live tracking started.`);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: ActiveOrder['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleAddNewOrder = (newOrder: ActiveOrder) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleToggleStock = (itemId: string) => {
    setOutOfStockIds(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const favoriteMenuItems = MENU_ITEMS.filter(m => favorites.includes(m.id));

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-800 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        cartSubtotal={cartSubtotal}
        openCart={() => setIsCartOpen(true)}
        openAuth={() => setIsAuthOpen(true)}
        openFavorites={() => setIsFavoritesOpen(true)}
        favoritesCount={favorites.length}
        isVegOnly={isVegOnly}
        setIsVegOnly={setIsVegOnly}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={() => {
          if (activeTab !== 'menu') setActiveTab('menu');
        }}
        user={user}
      />

      {/* Main Screen Views Content */}
      <main className="flex-1 pt-28 sm:pt-32">
        {activeTab === 'home' && (
          <HomeView
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              if (cat === 'combos') {
                setActiveTab('deals');
              } else {
                setActiveTab('menu');
              }
            }}
            onAddToCart={handleAddToCart}
            onUpdateQty={handleUpdateCartQty}
            cart={cart}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onOpenItemModal={(item) => setSelectedItemForModal(item)}
            setActiveTab={setActiveTab}
            isVegOnly={isVegOnly}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'menu' && (
          <MenuView
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onAddToCart={handleAddToCart}
            onUpdateQty={handleUpdateCartQty}
            cart={cart}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onOpenItemModal={(item) => setSelectedItemForModal(item)}
            isVegOnly={isVegOnly}
            setIsVegOnly={setIsVegOnly}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            outOfStockIds={outOfStockIds}
          />
        )}

        {activeTab === 'deals' && (
          <DealsView
            onAddToCart={handleAddToCart}
            cart={cart}
            onApplyCoupon={(code) => setAppliedCoupon(code)}
            appliedCoupon={appliedCoupon}
            showToast={showToast}
          />
        )}

        {activeTab === 'deck' && (
          <ScreensDeckView
            onSwitchScreen={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            activeOrdersCount={orders.length}
            cartCount={cartCount}
          />
        )}

        {activeTab === 'track' && (
          <TrackOrderView
            orders={orders}
            selectedOrderId={selectedOrderId}
            onSelectOrder={setSelectedOrderId}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            showToast={showToast}
          />
        )}

        {activeTab === 'about' && (
          <AboutView onExploreMenu={() => setActiveTab('menu')} />
        )}

        {activeTab === 'admin' && (
          <AdminPortal
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddNewOrder={handleAddNewOrder}
            outOfStockIds={outOfStockIds}
            onToggleStock={handleToggleStock}
            showToast={showToast}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} showToast={showToast} />

      {/* Cart Drawer Slide-Over */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        appliedCoupon={appliedCoupon}
        setAppliedCoupon={setAppliedCoupon}
        discountAmount={discountAmount}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        deliveryAddress={deliveryAddress}
        showToast={showToast}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        subtotal={cartSubtotal}
        discount={discountAmount}
        total={grandTotal}
        deliveryAddress={deliveryAddress}
        setDeliveryAddress={setDeliveryAddress}
        onOrderSuccess={handleOrderSuccess}
        showToast={showToast}
      />

      {/* Dish Details Modal */}
      <FoodDetailModal
        item={selectedItemForModal}
        onClose={() => setSelectedItemForModal(null)}
        onAddToCart={handleAddToCart}
        isFavorite={selectedItemForModal ? favorites.includes(selectedItemForModal.id) : false}
        onToggleFavorite={handleToggleFavorite}
        quantityInCart={selectedItemForModal ? (cart.find(c => c.id === selectedItemForModal.id)?.quantity || 0) : 0}
        onUpdateQty={handleUpdateCartQty}
      />

      {/* Wishlist / Favorites Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favoriteMenuItems}
        onRemoveFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
      />

      {/* User Sign In / Profile Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={user}
        onLogin={(newUser) => setUser(newUser)}
        onLogout={() => setUser(null)}
        showToast={showToast}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/60 backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="material-symbols-outlined text-amber-400 text-[20px]">info</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white transition-colors ml-2"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
