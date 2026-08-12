import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, WishlistItem } from '../types';
import toast from 'react-hot-toast';

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_KEY = 'someshwar_wishlist';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem(WISHLIST_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  }, [items]);

  const addToWishlist = useCallback((product: Product) => {
    setItems(prev => {
      if (prev.some(item => item.product.id === product.id)) {
        toast('Already in wishlist', { icon: '💛' });
        return prev;
      }
      toast.success('Added to wishlist!');
      return [...prev, { product, addedAt: new Date().toISOString() }];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
    toast.success('Removed from wishlist');
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => items.some(item => item.product.id === productId),
    [items]
  );

  return (
    <WishlistContext.Provider
      value={{ items, addToWishlist, removeFromWishlist, isInWishlist, wishlistCount: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
