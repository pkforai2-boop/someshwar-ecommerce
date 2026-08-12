import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ui/ProductCard';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { searchProducts } = useProducts();
  const results = useMemo(() => searchProducts(query), [query, searchProducts]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-2xl font-bold font-display text-surface-900 mb-2">
        Search Results
      </h1>
      <p className="text-sm text-surface-500 mb-6">
        {results.length} results for "<span className="font-medium text-surface-700">{query}</span>"
      </p>

      {results.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-4 bg-surface-100 rounded-full flex items-center justify-center">
            <Search size={32} className="text-surface-400" />
          </div>
          <h2 className="text-xl font-semibold text-surface-700 mb-2">No results found</h2>
          <p className="text-surface-500 mb-6">Try searching with different keywords</p>
          <Link to="/" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
