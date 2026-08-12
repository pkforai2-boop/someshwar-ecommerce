import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, Heart, BookmarkX, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import QuantitySelector from '../components/ui/QuantitySelector';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items, savedItems, removeFromCart, updateQuantity,
    saveForLater, moveToCart, removeSavedItem,
    subtotal, totalDiscount, deliveryCharge, grandTotal, cartCount,
  } = useCart();

  if (items.length === 0 && savedItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 mx-auto mb-6 bg-surface-100 rounded-full flex items-center justify-center">
          <ShoppingCart size={40} className="text-surface-400" />
        </div>
        <h2 className="text-2xl font-bold text-surface-800 mb-3">Your cart is empty</h2>
        <p className="text-surface-500 mb-6">Add items to your cart to see them here.</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <ShoppingBag size={18} /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-2xl font-bold font-display text-surface-900 mb-6">
        Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="card p-4 flex gap-4 animate-fade-in">
              <Link to={`/product/${product.id}`} className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-lg overflow-hidden bg-surface-50">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/product/${product.id}`} className="text-sm sm:text-base font-semibold text-surface-800 hover:text-brand-600 line-clamp-2 transition-colors">
                  {product.name}
                </Link>
                <p className="text-xs text-surface-500 mt-0.5">{product.brand}</p>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-lg font-bold text-surface-900">₹{product.sellingPrice.toLocaleString()}</span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-sm text-surface-400 line-through">₹{product.mrp.toLocaleString()}</span>
                      <span className="text-xs font-semibold text-green-600">{product.discount}% off</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <QuantitySelector
                    quantity={quantity}
                    maxQuantity={Math.min(product.stock, 10)}
                    onChange={(q) => updateQuantity(product.id, q)}
                  />
                  <div className="flex gap-2 text-sm">
                    <button onClick={() => saveForLater(product.id)}
                      className="text-surface-500 hover:text-brand-600 flex items-center gap-1 transition-colors">
                      <Heart size={14} /> Save
                    </button>
                    <button onClick={() => removeFromCart(product.id)}
                      className="text-surface-500 hover:text-red-500 flex items-center gap-1 transition-colors">
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Saved for Later */}
          {savedItems.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-surface-800 mb-4">Saved for Later ({savedItems.length})</h3>
              <div className="space-y-3">
                {savedItems.map(({ product }) => (
                  <div key={product.id} className="card p-4 flex gap-4 animate-fade-in">
                    <Link to={`/product/${product.id}`} className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-surface-50">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-surface-800 line-clamp-1">{product.name}</p>
                      <p className="text-base font-bold text-surface-900 mt-1">₹{product.sellingPrice.toLocaleString()}</p>
                      <div className="flex gap-3 mt-2 text-sm">
                        <button onClick={() => moveToCart(product.id)}
                          className="text-brand-600 hover:text-brand-700 flex items-center gap-1 font-medium transition-colors">
                          <ShoppingCart size={14} /> Move to Cart
                        </button>
                        <button onClick={() => removeSavedItem(product.id)}
                          className="text-surface-500 hover:text-red-500 flex items-center gap-1 transition-colors">
                          <BookmarkX size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price Summary */}
        {items.length > 0 && (
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-surface-800 mb-4 pb-4 border-b border-surface-100">
                Price Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-surface-600">Price ({cartCount} items)</span>
                  <span className="text-surface-800">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Discount</span>
                  <span className="text-green-600 font-medium">− ₹{totalDiscount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Delivery Charge</span>
                  <span className={deliveryCharge === 0 ? 'text-green-600 font-medium' : 'text-surface-800'}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                <hr className="border-surface-200" />
                <div className="flex justify-between text-base font-bold">
                  <span className="text-surface-900">Total Amount</span>
                  <span className="text-surface-900">₹{grandTotal.toLocaleString()}</span>
                </div>
                {totalDiscount > 0 && (
                  <p className="text-xs text-green-600 font-medium bg-green-50 p-2 rounded-lg text-center">
                    You're saving ₹{totalDiscount.toLocaleString()} on this order!
                  </p>
                )}
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>
              <Link to="/" className="btn-ghost w-full mt-2 text-center block text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
