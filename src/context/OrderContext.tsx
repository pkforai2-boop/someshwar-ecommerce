import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus, TrackingStep } from '../types';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: (userId?: string, email?: string) => Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getAllOrders: () => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_KEY = 'someshwar_orders';

const generateTrackingHistory = (status: OrderStatus): TrackingStep[] => {
  const steps: { status: OrderStatus; label: string }[] = [
    { status: 'placed', label: 'Order Placed' },
    { status: 'confirmed', label: 'Order Confirmed' },
    { status: 'packed', label: 'Packed' },
    { status: 'shipped', label: 'Shipped' },
    { status: 'out_for_delivery', label: 'Out for Delivery' },
    { status: 'delivered', label: 'Delivered' },
  ];

  const statusIndex = steps.findIndex(s => s.status === status);

  return steps.map((step, index) => ({
    ...step,
    date: index <= statusIndex
      ? new Date(Date.now() - (statusIndex - index) * 24 * 60 * 60 * 1000).toISOString()
      : '',
    completed: index <= statusIndex,
  }));
};

const sampleOrders: Order[] = [
  {
    id: 'ORD50720259',
    userId: 'user_gajendra',
    customerName: 'Gajendra',
    email: 'gajendra@someshwar.com',
    phone: '9876543210',
    items: [
      {
        productId: 'p3',
        productName: 'Professional Laptop 15.6" - i7 13th Gen',
        productImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
        sku: 'SKU-P3-LAPTOP',
        category: 'Computers',
        quantity: 1,
        mrp: 74999,
        price: 59999,
        discount: 20,
        estimatedDelivery: '2026-08-15T00:00:00.000Z',
      },
    ],
    subtotal: 74999,
    discount: 15000,
    deliveryCharge: 0,
    total: 59999,
    address: {
      id: 'addr_gajendra',
      house: 'Flat 102, Shreeram Residency',
      street: 'MG Road',
      area: 'Shivaji Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      pinCode: '411005',
      landmark: 'Near City Central Bank',
    },
    paymentMethod: 'online',
    paymentStatus: 'paid',
    status: 'placed',
    createdAt: '2026-08-11T10:30:00.000Z',
    estimatedDelivery: '2026-08-15T00:00:00.000Z',
    trackingHistory: generateTrackingHistory('placed'),
  },
  {
    id: 'ORD87391024',
    userId: 'user_priya',
    customerName: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '9123456789',
    items: [
      {
        productId: 'p1',
        productName: 'Premium Wireless Noise Cancelling Headphones',
        productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
        sku: 'SKU-P1-AUDIO',
        category: 'Electronics',
        quantity: 1,
        mrp: 12999,
        price: 7799,
        discount: 40,
        estimatedDelivery: '2026-08-14T00:00:00.000Z',
      },
      {
        productId: 'p8',
        productName: 'Luxury Skincare Gift Set - 5 Piece',
        productImage: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop',
        sku: 'SKU-P8-BEAUTY',
        category: 'Beauty',
        quantity: 1,
        mrp: 3999,
        price: 2599,
        discount: 35,
        estimatedDelivery: '2026-08-14T00:00:00.000Z',
      },
    ],
    subtotal: 16998,
    discount: 6600,
    deliveryCharge: 0,
    total: 10398,
    address: {
      id: 'addr_priya',
      house: 'B-402, Sunshine Apartments',
      street: 'Link Road',
      area: 'Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400053',
      landmark: 'Opposite Infinity Mall',
    },
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    status: 'shipped',
    createdAt: '2026-08-10T14:20:00.000Z',
    estimatedDelivery: '2026-08-14T00:00:00.000Z',
    trackingHistory: generateTrackingHistory('shipped'),
  },
  {
    id: 'ORD39201948',
    userId: 'user_rahul',
    customerName: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phone: '9988776655',
    items: [
      {
        productId: 'p2',
        productName: 'Ultra Slim Smartphone 5G - 128GB',
        productImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
        sku: 'SKU-P2-PHONE',
        category: 'Mobiles',
        quantity: 1,
        mrp: 34999,
        price: 26249,
        discount: 25,
        estimatedDelivery: '2026-08-13T00:00:00.000Z',
      },
    ],
    subtotal: 34999,
    discount: 8750,
    deliveryCharge: 0,
    total: 26249,
    address: {
      id: 'addr_rahul',
      house: 'Villa 12, Green Glen Layout',
      street: 'Outer Ring Road',
      area: 'Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560103',
      landmark: 'Near EcoSpace Tech Park',
    },
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    status: 'delivered',
    createdAt: '2026-08-08T09:15:00.000Z',
    estimatedDelivery: '2026-08-12T00:00:00.000Z',
    trackingHistory: generateTrackingHistory('delivered'),
  },
];

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(ORDERS_KEY);
    if (!saved) return sampleOrders;
    try {
      const parsed: Order[] = JSON.parse(saved);
      if (!parsed || parsed.length === 0) return sampleOrders;
      // If ORD50720259 doesn't exist in saved orders, merge sampleOrders
      if (!parsed.some(o => o.id === 'ORD50720259')) {
        return [...sampleOrders, ...parsed];
      }
      return parsed;
    } catch {
      return sampleOrders;
    }
  });

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [order, ...prev]);
  }, []);

  const getOrderById = useCallback(
    (orderId: string) => orders.find(o => o.id === orderId),
    [orders]
  );

  const getUserOrders = useCallback(
    (userId?: string, email?: string) => {
      if (!userId && !email) return [];
      return orders.filter(order =>
        (userId && order.userId === userId) ||
        (email && order.email && order.email.toLowerCase() === email.toLowerCase())
      );
    },
    [orders]
  );

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status, trackingHistory: generateTrackingHistory(status) }
          : order
      )
    );
  }, []);

  const getAllOrders = useCallback(() => orders, [orders]);

  return (
    <OrderContext.Provider value={{ orders, addOrder, getOrderById, getUserOrders, updateOrderStatus, getAllOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
};

export { generateTrackingHistory };
