import { Product } from '../types';
import { products as initialProducts } from '../data/products';

const PRODUCTS_KEY = 'someshwar_products';

export interface ProductServiceInterface {
  getProducts(includeInactive?: boolean): Product[];
  getProductById(id: string): Product | undefined;
  getProductsByCategory(category: string): Product[];
  searchProducts(query: string): Product[];
  getFeaturedProducts(): Product[];
  getBestSellers(): Product[];
  getNewArrivals(): Product[];
  getDeals(): Product[];
  getRelatedProducts(product: Product): Product[];
  addProduct(product: Product): Product[];
  updateProduct(id: string, updatedProduct: Partial<Product>): Product[];
  deleteProduct(id: string): Product[];
}

export class LocalStorageProductService implements ProductServiceInterface {
  private loadProductsFromStorage(): Product[] {
    const saved = localStorage.getItem(PRODUCTS_KEY);
    if (!saved) {
      // Seed with initial 22 products if no localStorage exists
      const seeded = initialProducts.map(p => ({ ...p, status: p.status || 'active' }));
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    try {
      const parsed: Product[] = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        const seeded = initialProducts.map(p => ({ ...p, status: p.status || 'active' }));
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seeded));
        return seeded;
      }
      return parsed;
    } catch {
      const seeded = initialProducts.map(p => ({ ...p, status: p.status || 'active' }));
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seeded));
      return seeded;
    }
  }

  private saveProductsToStorage(products: Product[]): void {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }

  getProducts(includeInactive = false): Product[] {
    const all = this.loadProductsFromStorage();
    if (includeInactive) return all;
    return all.filter(p => p.status !== 'inactive');
  }

  getProductById(id: string): Product | undefined {
    const all = this.loadProductsFromStorage();
    return all.find(p => p.id === id);
  }

  getProductsByCategory(category: string): Product[] {
    const active = this.getProducts(false);
    if (category === 'All' || category.toLowerCase() === 'all') return active;
    return active.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  searchProducts(query: string): Product[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const active = this.getProducts(false);
    return active.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  getFeaturedProducts(): Product[] {
    return this.getProducts(false).filter(p => p.isFeatured);
  }

  getBestSellers(): Product[] {
    return this.getProducts(false).filter(p => p.isBestSeller);
  }

  getNewArrivals(): Product[] {
    return this.getProducts(false).filter(p => p.isNewArrival);
  }

  getDeals(): Product[] {
    return this.getProducts(false).filter(p => p.isDeal || p.discount >= 25);
  }

  getRelatedProducts(product: Product): Product[] {
    return this.getProducts(false)
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 6);
  }

  addProduct(product: Product): Product[] {
    const all = this.loadProductsFromStorage();
    const newProduct: Product = {
      ...product,
      status: product.status || 'active',
    };
    const updated = [newProduct, ...all];
    this.saveProductsToStorage(updated);
    return updated;
  }

  updateProduct(id: string, updatedFields: Partial<Product>): Product[] {
    const all = this.loadProductsFromStorage();
    const updated = all.map(p => {
      if (p.id === id) {
        const merged = { ...p, ...updatedFields };
        if (merged.mrp && merged.discount !== undefined) {
          merged.sellingPrice = Math.round(merged.mrp * (1 - merged.discount / 100));
        }
        return merged;
      }
      return p;
    });
    this.saveProductsToStorage(updated);
    return updated;
  }

  deleteProduct(id: string): Product[] {
    const all = this.loadProductsFromStorage();
    const updated = all.filter(p => p.id !== id);
    this.saveProductsToStorage(updated);
    return updated;
  }
}

export const productService: ProductServiceInterface = new LocalStorageProductService();
