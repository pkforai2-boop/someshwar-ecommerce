import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ShoppingCart, Heart, User, Package, Menu, X, ChevronDown, LayoutDashboard
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAccountDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setAccountDropdown(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 glass shadow-sm">
      <div className="gradient-brand h-1" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg gradient-brand flex items-center justify-center">
              <span className="text-white font-bold text-lg font-display">S</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold font-display text-surface-900 leading-tight">
                SOMESHWAR
              </h1>
              <p className="text-[10px] text-surface-500 -mt-0.5 tracking-wider">E-COMMERCE</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="flex w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="flex-1 px-4 py-2 rounded-l-lg border border-r-0 border-surface-200 bg-surface-50 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-r-lg transition-colors"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Direct Admin Panel Button */}
            <Link to="/admin" className="btn-ghost text-sm hidden sm:flex items-center gap-1 text-brand-600 bg-brand-50 font-semibold px-3 py-1.5 rounded-lg hover:bg-brand-100 transition-colors" id="admin-link">
              <LayoutDashboard size={18} />
              <span className="hidden md:inline">Admin</span>
            </Link>

            {/* Account */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    setAccountDropdown(!accountDropdown);
                  } else {
                    navigate('/login');
                  }
                }}
                className="flex items-center gap-1 btn-ghost text-sm"
                id="account-button"
              >
                <User size={20} />
                <span className="hidden lg:inline">
                  {isAuthenticated ? user?.name?.split(' ')[0] : 'Login'}
                </span>
                {isAuthenticated && <ChevronDown size={14} />}
              </button>

              {accountDropdown && isAuthenticated && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-surface-100 py-2 animate-scale-in z-50">
                  <div className="px-4 py-2 border-b border-surface-100">
                    <p className="font-semibold text-surface-900 text-sm">{user?.name}</p>
                    <p className="text-xs text-surface-500">{user?.email}</p>
                  </div>
                  <Link to="/account" onClick={() => setAccountDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 transition-colors">
                    <User size={16} /> My Account
                  </Link>
                  <Link to="/account?tab=orders" onClick={() => setAccountDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 transition-colors">
                    <Package size={16} /> My Orders
                  </Link>
                  <Link to="/wishlist" onClick={() => setAccountDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 transition-colors">
                    <Heart size={16} /> Wishlist
                  </Link>
                  <Link to="/admin" onClick={() => setAccountDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand-600 hover:bg-brand-50 transition-colors font-medium">
                    <LayoutDashboard size={16} /> Admin Panel
                  </Link>
                  <hr className="my-1 border-surface-100" />
                  <button onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Orders */}
            <Link to="/account?tab=orders" className="btn-ghost text-sm hidden sm:flex items-center gap-1" id="orders-link">
              <Package size={20} />
              <span className="hidden lg:inline">Orders</span>
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="btn-ghost text-sm relative" id="wishlist-link">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="btn-ghost text-sm relative" id="cart-link">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 gradient-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-ghost md:hidden"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-4 py-2 rounded-l-lg border border-r-0 border-surface-200 bg-surface-50 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm"
            />
            <button type="submit" className="px-4 py-2 bg-brand-500 text-white rounded-r-lg">
              <Search size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-surface-100 animate-slide-down">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {!isAuthenticated && (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-surface-700 hover:bg-surface-50 rounded-lg">
                Login / Register
              </Link>
            )}
            <Link to="/account" onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-surface-700 hover:bg-surface-50 rounded-lg">
              My Account
            </Link>
            <Link to="/account?tab=orders" onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-surface-700 hover:bg-surface-50 rounded-lg">
              My Orders
            </Link>
            <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-surface-700 hover:bg-surface-50 rounded-lg">
              Wishlist ({wishlistCount})
            </Link>
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-surface-700 hover:bg-surface-50 rounded-lg">
              Admin Panel
            </Link>
            {isAuthenticated && (
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
