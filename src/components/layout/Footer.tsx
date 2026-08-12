import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-900 text-surface-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg gradient-brand flex items-center justify-center">
                <span className="text-white font-bold text-lg font-display">S</span>
              </div>
              <div>
                <h3 className="text-white font-bold font-display">SOMESHWAR</h3>
                <p className="text-[10px] text-surface-500 tracking-wider">E-COMMERCE</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Your trusted online shopping destination. Quality products, best prices, and fast delivery.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-brand-400 transition-colors">Home</Link></li>
              <li><Link to="/category/all" className="hover:text-brand-400 transition-colors">All Products</Link></li>
              <li><Link to="/category/offers" className="hover:text-brand-400 transition-colors">Today's Deals</Link></li>
              <li><Link to="/cart" className="hover:text-brand-400 transition-colors">Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-brand-400 transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/account" className="hover:text-brand-400 transition-colors">My Account</Link></li>
              <li><Link to="/account?tab=orders" className="hover:text-brand-400 transition-colors">Track Order</Link></li>
              <li><span className="hover:text-brand-400 transition-colors cursor-pointer">Shipping Info</span></li>
              <li><span className="hover:text-brand-400 transition-colors cursor-pointer">Return Policy</span></li>
              <li><span className="hover:text-brand-400 transition-colors cursor-pointer">Help Center</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: support@someshwar.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Hours: 9 AM - 9 PM IST</li>
              <li className="pt-2">
                <Link to="/admin" className="text-brand-400 hover:text-brand-300 transition-colors font-medium">
                  Admin Panel →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-surface-500">
            © {new Date().getFullYear()} Someshwar E-Commerce. Developed by <span className="text-brand-400 font-semibold">Atharv Khanvilkar</span>. Designed by <span className="text-brand-400 font-semibold">G.G. Khanvilkar</span>. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-surface-500">
            <span className="hover:text-surface-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-surface-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-surface-300 cursor-pointer">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
