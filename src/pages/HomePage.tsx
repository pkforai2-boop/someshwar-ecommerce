import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Truck, ShieldCheck, Headphones } from 'lucide-react';
import ProductCarousel from '../components/ui/ProductCarousel';
import ProductCard from '../components/ui/ProductCard';
import { categories } from '../data/categories';
import { useProducts } from '../context/ProductContext';

const HomePage: React.FC = () => {
  const {
    products,
    getDeals,
    getBestSellers,
    getNewArrivals,
    getFeaturedProducts
  } = useProducts();

  const deals = getDeals();
  const bestSellers = getBestSellers();
  const newArrivals = getNewArrivals();
  const featured = getFeaturedProducts();
  const recommended = products.slice(0, 8);
  const specialOffers = products.filter(p => p.discount >= 35);

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <section className="relative overflow-hidden gradient-dark text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(249,115,22,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,191,36,0.2),transparent_50%)]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-6">
                <Sparkles size={14} className="text-amber-400" />
                <span>Mega Sale — Up to 50% Off</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight mb-6">
                Shop the Best <br />
                <span className="text-transparent bg-clip-text gradient-brand bg-gradient-to-r from-brand-400 to-amber-300">
                  Deals Online
                </span>
              </h2>
              <p className="text-surface-300 text-lg mb-8 max-w-lg">
                Discover amazing products at unbeatable prices. Electronics, fashion, home essentials and more — all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/category/all" className="btn-primary text-base px-8 py-3 flex items-center gap-2">
                  Shop Now <ArrowRight size={18} />
                </Link>
                <Link to="/category/offers" className="btn-outline border-white/30 text-white hover:bg-white/10 text-base px-8 py-3">
                  View Offers
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="w-80 h-80 lg:w-96 lg:h-96 mx-auto rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&h=500&fit=crop"
                    alt="Shopping"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white text-surface-900 rounded-2xl p-4 shadow-xl animate-pulse-slow">
                  <p className="font-bold text-2xl text-brand-500">50%</p>
                  <p className="text-xs font-medium">OFF</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-b border-surface-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Delivery', desc: 'On orders over ₹500' },
              { icon: ShieldCheck, title: 'Secure Payment', desc: '100% secure checkout' },
              { icon: Headphones, title: '24/7 Support', desc: 'Dedicated support team' },
              { icon: Sparkles, title: 'Best Quality', desc: 'Premium products only' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-brand-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-800">{title}</p>
                  <p className="text-xs text-surface-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        {/* Categories */}
        <section className="py-10">
          <h2 className="text-2xl font-bold font-display text-surface-900 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.slug === 'all' ? '/category/all' : `/category/${cat.slug}`}
                className="group text-center"
              >
                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-2 border-2 border-transparent group-hover:border-brand-400 transition-all duration-300 shadow-sm group-hover:shadow-md">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <p className="text-xs font-medium text-surface-700 group-hover:text-brand-600 transition-colors">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Today's Deals */}
        <ProductCarousel title="🔥 Today's Deals" products={deals} viewAllLink="/category/offers" />

        {/* Best Sellers */}
        <ProductCarousel title="⭐ Best Sellers" products={bestSellers} />

        {/* New Arrivals */}
        <ProductCarousel title="✨ New Arrivals" products={newArrivals} />

        {/* Recommended Products - Grid */}
        <section className="py-8">
          <h2 className="text-2xl font-bold font-display text-surface-900 mb-6">Recommended for You</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {recommended.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="py-8">
          <div className="rounded-2xl overflow-hidden gradient-brand p-8 md:p-12 text-white relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>
            <div className="relative z-10 max-w-lg">
              <h3 className="text-3xl md:text-4xl font-bold font-display mb-4">
                Special Weekend Offers!
              </h3>
              <p className="text-white/80 mb-6">
                Get up to 50% off on selected items. Limited time offer — don't miss out!
              </p>
              <Link to="/category/offers" className="bg-white text-brand-600 font-semibold px-6 py-3 rounded-lg hover:bg-surface-50 transition-colors inline-flex items-center gap-2">
                Shop Offers <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* Special Offers */}
        <ProductCarousel title="💎 Special Offers" products={specialOffers} viewAllLink="/category/offers" />
      </div>
    </div>
  );
};

export default HomePage;
