import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, products, viewAllLink }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-display text-surface-900">{title}</h2>
        <div className="flex items-center gap-2">
          {viewAllLink && (
            <a href={viewAllLink} className="text-sm font-medium text-brand-600 hover:text-brand-700 mr-2">
              View All →
            </a>
          )}
          <button
            onClick={() => scroll('left')}
            className="w-9 h-9 rounded-full bg-white border border-surface-200 flex items-center justify-center text-surface-600 hover:bg-surface-50 hover:border-surface-300 transition-all shadow-sm"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-9 h-9 rounded-full bg-white border border-surface-200 flex items-center justify-center text-surface-600 hover:bg-surface-50 hover:border-surface-300 transition-all shadow-sm"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory"
      >
        {products.map((product) => (
          <div key={product.id} className="w-[220px] sm:w-[240px] shrink-0 snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductCarousel;
