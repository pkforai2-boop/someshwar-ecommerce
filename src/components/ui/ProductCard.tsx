import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Zap } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product);
      window.location.href = '/cart';
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="card group" id={`product-card-${product.id}`}>
      {/* Image Container */}
      <div className="relative aspect-square bg-surface-50 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            Out of Stock
          </span>
        )}

        {/* Discount Badge */}
        {product.discount > 0 && product.stock > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {product.discount}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md
            ${inWishlist ? 'bg-red-500 text-white' : 'bg-white/90 text-surface-500 hover:text-red-500 hover:bg-white'}`}
        >
          <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>

        {/* Quick Actions */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                product.stock === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-surface-900 hover:bg-surface-100'
              }`}
            >
              <ShoppingCart size={14} /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-opacity flex items-center justify-center gap-1 ${
                product.stock === 0
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'gradient-brand text-white hover:opacity-90'
              }`}
            >
              <Zap size={14} /> Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-xs text-brand-600 font-medium mb-1">{product.brand}</p>
        <h3 className="text-sm font-semibold text-surface-800 line-clamp-2 mb-2 group-hover:text-brand-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-0.5 bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
            {product.rating} <Star size={10} fill="currentColor" />
          </div>
          <span className="text-xs text-surface-500">({product.reviewCount.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-lg font-bold text-surface-900">₹{product.sellingPrice.toLocaleString()}</span>
          {product.discount > 0 && (
            <>
              <span className="text-sm text-surface-400 line-through">₹{product.mrp.toLocaleString()}</span>
              <span className="text-xs font-semibold text-green-600">{product.discount}% off</span>
            </>
          )}
        </div>

        {/* Stock */}
        {product.stock <= 10 && product.stock > 0 && (
          <p className="text-xs text-red-500 font-medium mt-1">Only {product.stock} left!</p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-red-500 font-semibold mt-1">Out of Stock</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
