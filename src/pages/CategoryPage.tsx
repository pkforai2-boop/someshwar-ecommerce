import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ui/ProductCard';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products, getProductsByCategory, getDeals } = useProducts();

  const categoryName = useMemo(() => {
    if (!slug) return 'All';
    const map: Record<string, string> = {
      all: 'All', electronics: 'Electronics', mobiles: 'Mobiles', computers: 'Computers',
      fashion: 'Fashion', 'home-kitchen': 'Home & Kitchen', beauty: 'Beauty',
      grocery: 'Grocery', books: 'Books', sports: 'Sports', offers: 'Offers',
    };
    return map[slug] || slug;
  }, [slug]);

  const filteredProducts = useMemo(() => {
    if (slug === 'offers') return getDeals();
    if (slug === 'all') return products;
    return getProductsByCategory(categoryName);
  }, [slug, categoryName, products, getDeals, getProductsByCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <nav className="flex items-center gap-2 text-sm text-surface-500 mb-6">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight size={14} />
        <span className="text-surface-800">{categoryName}</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-display text-surface-900">{categoryName}</h1>
        <p className="text-sm text-surface-500">{filteredProducts.length} products</p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-surface-500 text-lg mb-4">No products found in this category</p>
          <Link to="/" className="btn-primary">Browse All Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
