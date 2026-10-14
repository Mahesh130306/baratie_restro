export type CuisineCategory = 
  | 'all'
  | 'indian'
  | 'chinese'
  | 'italian'
  | 'fastfood'
  | 'desserts'
  | 'beverages'
  | 'combos';

export interface MenuItem {
  id: string;
  name: string;
  category: 'indian' | 'chinese' | 'italian' | 'fastfood' | 'desserts' | 'beverages';
  isVeg: boolean;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: string;
  badge?: string;
  description: string;
  imageUrl: string;
  inStock?: boolean;
  spicyLevel?: 1 | 2 | 3;
  serves?: string;
}

export interface ComboDeal {
  id: string;
  title: string;
  tag: string;
  tagType: 'primary' | 'secondary' | 'tertiary';
  isVeg: boolean;
  rating: number;
  description: string;
  includes: string[];
  price: number;
  originalPrice: number;
  discountBadge: string;
  serves: string;
  imageUrl: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
  imageUrl?: string;
  category?: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  location: string;
  role: string;
  rating: number;
  review: string;
  avatarInitials: string;
  avatarColor: string;
}

export interface ActiveOrder {
  id: string;
  customerName: string;
  address: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'received' | 'preparing' | 'dispatched' | 'delivered';
  placedAt: string;
  estimatedDelivery: string;
  riderName: string;
  riderPhone: string;
  riderRating: number;
  paymentMethod: string;
}

export type ViewTab = 'home' | 'menu' | 'deals' | 'deck' | 'track' | 'about' | 'admin';
