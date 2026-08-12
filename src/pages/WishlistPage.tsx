import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const WishlistPage: React.FC = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (productId: string) => {
    const item = items.find(i => i.product.id === productId);
    if (item) {
      addToCart(item.product);
      removeFromWishlist(productId);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 mx-auto mb-6 bg-surface-100 rounded-full flex items-center justify-center">
          <Heart size={40} className="text-surface-400" />
        </div>
        <h2 className="text-2xl font-bold text-surface-800 mb-3">Your wishlist is empty</h2>
        <p className="text-surface-500 mb-6">Save items you love to your wishlist.</p>
        <Link to="/" className="btn-primary">Explore Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-2xl font-bold font-display text-surface-900 mb-6">
        My Wishlist ({items.length} {items.length === 1 ? 'item' : 'items'})
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map(({ product }) => (
          <div key={product.id} className="card group animate-fade-in">
            <Link to={`/product/${product.id}`} className="block">
              <div className="relative aspect-square bg-surface-50 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.discount > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-brand-600 font-medium">{product.brand}</p>
                <h3 className="text-sm font-semibold text-surface-800 line-clamp-2 mt-0.5">{product.name}</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-base font-bold">₹{product.sellingPrice.toLocaleString()}</span>
                  {product.discount > 0 && (
                    <span className="text-xs text-surface-400 line-through">₹{product.mrp.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </Link>
            <div className="px-3 pb-3 flex gap-2">
              <button
                onClick={() => handleMoveToCart(product.id)}
                className="flex-1 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <ShoppingCart size={13} /> Move to Cart
              </button>
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="w-9 h-9 rounded-lg border border-surface-200 text-surface-400 hover:text-red-500 hover:border-red-300 flex items-center justify-center transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
