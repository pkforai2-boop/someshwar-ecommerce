export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  images: string[];
  mrp: number;
  discount: number;
  sellingPrice: number;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  stock: number;
  specifications: Record<string, string>;
  tags: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isDeal?: boolean;
  status?: 'active' | 'inactive';
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SavedItem {
  product: Product;
  savedAt: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  house: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pinCode: string;
  landmark: string;
  isDefault?: boolean;
}

export type PaymentStatusType = 'paid' | 'pending' | 'failed' | 'refunded';

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  email: string;
  phone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  address: Address;
  paymentMethod: PaymentMethodType;
  paymentStatus?: PaymentStatusType;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  trackingHistory: TrackingStep[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  sku?: string;
  category?: string;
  quantity: number;
  price: number;
  mrp: number;
  discount?: number;
  estimatedDelivery?: string;
}

export type OrderStatus = 'placed' | 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered';

export interface TrackingStep {
  status: OrderStatus;
  label: string;
  date: string;
  completed: boolean;
}

export type PaymentMethodType = 'cod' | 'upi' | 'online' | 'other';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  productCount: number;
}

export interface CustomerDetails {
  fullName: string;
  mobile: string;
  email: string;
}

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalSales: number;
  pendingOrders: number;
  deliveredOrders: number;
}
