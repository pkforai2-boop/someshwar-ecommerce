import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'All', path: '/category/all' },
  { name: 'Electronics', path: '/category/electronics' },
  { name: 'Mobiles', path: '/category/mobiles' },
  { name: 'Computers', path: '/category/computers' },
  { name: 'Fashion', path: '/category/fashion' },
  { name: 'Home & Kitchen', path: '/category/home-kitchen' },
  { name: 'Beauty', path: '/category/beauty' },
  { name: 'Grocery', path: '/category/grocery' },
  { name: 'Books', path: '/category/books' },
  { name: 'Sports', path: '/category/sports' },
  { name: 'Offers', path: '/category/offers' },
];

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bg-surface-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors shrink-0
                  ${isActive
                    ? 'bg-brand-500 text-white'
                    : 'text-surface-200 hover:text-white hover:bg-surface-800'
                  }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
