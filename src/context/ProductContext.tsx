import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product } from '../types';
import { productService } from '../services/ProductService';

interface ProductContextType {
  products: Product[]; // Active products for customer
  allProducts: Product[]; // All products including inactive for admin
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (query: string) => Product[];
  getFeaturedProducts: () => Product[];
  getBestSellers: () => Product[];
  getNewArrivals: () => Product[];
  getDeals: () => Product[];
  getRelatedProducts: (product: Product) => Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  refreshProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allProducts, setAllProducts] = useState<Product[]>(() => {
    return productService.getProducts(true);
  });

  const refreshProducts = useCallback(() => {
    setAllProducts(productService.getProducts(true));
  }, []);

  const activeProducts = useCallback(() => {
    return allProducts.filter(p => p.status !== 'inactive');
  }, [allProducts]);

  const getProductById = useCallback((id: string): Product | undefined => {
    return allProducts.find(p => p.id === id);
  }, [allProducts]);

  const getProductsByCategory = useCallback((category: string): Product[] => {
    const active = activeProducts();
    if (category === 'All' || category.toLowerCase() === 'all') return active;
    return active.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }, [activeProducts]);

  const searchProducts = useCallback((query: string): Product[] => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const active = activeProducts();
    return active.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }, [activeProducts]);

  const getFeaturedProducts = useCallback((): Product[] => {
    return activeProducts().filter(p => p.isFeatured);
  }, [activeProducts]);

  const getBestSellers = useCallback((): Product[] => {
    return activeProducts().filter(p => p.isBestSeller);
  }, [activeProducts]);

  const getNewArrivals = useCallback((): Product[] => {
    return activeProducts().filter(p => p.isNewArrival);
  }, [activeProducts]);

  const getDeals = useCallback((): Product[] => {
    return activeProducts().filter(p => p.isDeal || p.discount >= 25);
  }, [activeProducts]);

  const getRelatedProducts = useCallback((product: Product): Product[] => {
    return activeProducts()
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 6);
  }, [activeProducts]);

  const addProduct = useCallback((product: Product) => {
    const updated = productService.addProduct(product);
    setAllProducts(updated);
  }, []);

  const updateProduct = useCallback((id: string, updatedFields: Partial<Product>) => {
    const updated = productService.updateProduct(id, updatedFields);
    setAllProducts(updated);
  }, []);

  const deleteProduct = useCallback((id: string) => {
    const updated = productService.deleteProduct(id);
    setAllProducts(updated);
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products: activeProducts(),
        allProducts,
        getProductById,
        getProductsByCategory,
        searchProducts,
        getFeaturedProducts,
        getBestSellers,
        getNewArrivals,
        getDeals,
        getRelatedProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
};
