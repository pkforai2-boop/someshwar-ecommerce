import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Zap, Star, Truck, ShieldCheck, ChevronRight, ZoomIn } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import QuantitySelector from '../components/ui/QuantitySelector';
import RatingStars from '../components/ui/RatingStars';
import ProductCard from '../components/ui/ProductCard';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, getRelatedProducts } = useProducts();
  const product = getProductById(id || '');
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const relatedProducts = useMemo(() => (product ? getRelatedProducts(product) : []), [product, getRelatedProducts]);

  const handleBuyNow = () => {
    if (product && product.stock > 0) {
      addToCart(product, quantity);
      navigate('/checkout');
    }
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-surface-800 mb-4">Product Not Found</h2>
        <p className="text-surface-500 mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">Go to Home</Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-surface-500 mb-6">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight size={14} />
        <Link to={`/category/${product.category.toLowerCase().replace(/ & /g, '-')}`} className="hover:text-brand-600">{product.category}</Link>
        <ChevronRight size={14} />
        <span className="text-surface-800 truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Product Main */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div
            className="relative aspect-square bg-surface-50 rounded-2xl overflow-hidden cursor-crosshair border border-surface-100"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-200"
              style={isZoomed ? { transform: 'scale(2)', transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
            />
            {isZoomed && (
              <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <ZoomIn size={12} /> Zoomed
              </div>
            )}
            {product.discount > 0 && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === idx ? 'border-brand-500 shadow-md' : 'border-surface-200 hover:border-surface-300'
                }`}
              >
                <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-brand-600 font-medium mb-1">{product.brand}</p>
            <h1 className="text-2xl lg:text-3xl font-bold text-surface-900 font-display">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-green-600 text-white text-sm font-bold px-2.5 py-1 rounded-lg">
              {product.rating} <Star size={14} fill="currentColor" />
            </div>
            <span className="text-sm text-surface-500">{product.reviewCount.toLocaleString()} ratings & reviews</span>
          </div>

          {/* Price */}
          <div className="bg-surface-50 rounded-xl p-5">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl font-bold text-surface-900">₹{product.sellingPrice.toLocaleString()}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-lg text-surface-400 line-through">₹{product.mrp.toLocaleString()}</span>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    {product.discount}% off
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-surface-500">Inclusive of all taxes</p>
          </div>

          {/* Stock */}
          <div>
            {product.stock > 10 ? (
              <p className="text-sm text-green-600 font-medium">✓ In Stock</p>
            ) : product.stock > 0 ? (
              <p className="text-sm text-amber-600 font-medium">⚡ Only {product.stock} left — order soon!</p>
            ) : (
              <p className="text-sm text-red-600 font-medium">✗ Out of Stock</p>
            )}
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-surface-700">Quantity:</span>
              <QuantitySelector quantity={quantity} maxQuantity={Math.min(product.stock, 10)} onChange={setQuantity} />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => addToCart(product, quantity)}
              disabled={product.stock === 0}
              className="flex-1 btn-secondary flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <Zap size={18} /> Buy Now
            </button>
            <button
              onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
              className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all ${
                inWishlist ? 'border-red-500 bg-red-50 text-red-500' : 'border-surface-200 text-surface-400 hover:border-red-300 hover:text-red-500'
              }`}
            >
              <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-surface-50 rounded-lg p-3">
              <Truck size={18} className="text-brand-500" />
              <span className="text-xs text-surface-600">Free delivery over ₹500</span>
            </div>
            <div className="flex items-center gap-2 bg-surface-50 rounded-lg p-3">
              <ShieldCheck size={18} className="text-brand-500" />
              <span className="text-xs text-surface-600">Secure checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex border-b border-surface-200">
          {(['description', 'specifications', 'reviews'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-surface-500 hover:text-surface-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-surface-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="max-w-lg">
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key} className="border-b border-surface-100">
                      <td className="py-3 pr-4 text-sm font-medium text-surface-500 w-1/3">{key}</td>
                      <td className="py-3 text-sm text-surface-800">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-surface-900">{product.rating}</p>
                  <RatingStars rating={product.rating} />
                  <p className="text-xs text-surface-500 mt-1">{product.reviewCount} reviews</p>
                </div>
              </div>
              {product.reviews.map(review => (
                <div key={review.id} className="border-b border-surface-100 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-0.5 bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                      {review.rating} <Star size={10} fill="currentColor" />
                    </div>
                    <span className="text-sm font-medium text-surface-800">{review.userName}</span>
                    <span className="text-xs text-surface-400">
                      {new Date(review.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-surface-600">{review.comment}</p>
                  <p className="text-xs text-surface-400 mt-1">{review.helpful} people found this helpful</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-8 border-t border-surface-100 mt-8">
          <h2 className="text-2xl font-bold font-display text-surface-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
