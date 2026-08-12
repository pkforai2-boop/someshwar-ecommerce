import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product, SavedItem } from '../types';
import toast from 'react-hot-toast';

interface CartContextType {
  items: CartItem[];
  savedItems: SavedItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeSavedItem: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  totalDiscount: number;
  deliveryCharge: number;
  grandTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'someshwar_cart';
const SAVED_KEY = 'someshwar_saved';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    const saved = localStorage.getItem(SAVED_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(savedItems));
  }, [savedItems]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        toast.success(`Updated quantity in cart`);
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      toast.success(`Added to cart!`);
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
    toast.success('Removed from cart');
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item
      )
    );
  }, []);

  const saveForLater = useCallback((productId: string) => {
    setItems(prev => {
      const item = prev.find(i => i.product.id === productId);
      if (item) {
        setSavedItems(s => [...s, { product: item.product, savedAt: new Date().toISOString() }]);
        toast.success('Saved for later');
      }
      return prev.filter(i => i.product.id !== productId);
    });
  }, []);

  const moveToCart = useCallback((productId: string) => {
    setSavedItems(prev => {
      const item = prev.find(i => i.product.id === productId);
      if (item) {
        setItems(c => {
          const existing = c.find(ci => ci.product.id === productId);
          if (existing) return c;
          return [...c, { product: item.product, quantity: 1 }];
        });
        toast.success('Moved to cart');
      }
      return prev.filter(i => i.product.id !== productId);
    });
  }, []);

  const removeSavedItem = useCallback((productId: string) => {
    setSavedItems(prev => prev.filter(i => i.product.id !== productId));
    toast.success('Removed from saved items');
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const totalDiscount = items.reduce((sum, item) => sum + (item.product.mrp - item.product.sellingPrice) * item.quantity, 0);
  const deliveryCharge = subtotal > 500 ? 0 : 49;
  const grandTotal = subtotal - totalDiscount + deliveryCharge;

  return (
    <CartContext.Provider
      value={{
        items, savedItems, addToCart, removeFromCart, updateQuantity,
        saveForLater, moveToCart, removeSavedItem, clearCart,
        cartCount, subtotal, totalDiscount, deliveryCharge, grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
