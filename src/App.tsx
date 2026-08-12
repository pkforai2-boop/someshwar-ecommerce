import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { ProductProvider } from './context/ProductContext';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import SearchResultsPage from './pages/SearchResultsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import AccountPage from './pages/AccountPage';
import AdminPage from './pages/AdminPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ProductProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <OrderProvider>
              <div className="min-h-screen flex flex-col bg-surface-50">
                <Header />
                <Navigation />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/category/:slug" element={<CategoryPage />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                    <Route path="/order-tracking/:orderId" element={<OrderTrackingPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/admin/:subtab" element={<AdminPage />} />
                  </Routes>
                </main>
                <Footer />
                <Toaster
                  position="bottom-center"
                  toastOptions={{
                    duration: 2500,
                    style: {
                      background: '#1e293b',
                      color: '#f1f5f9',
                      borderRadius: '12px',
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: '500',
                    },
                  }}
                />
              </div>
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ProductProvider>
  </BrowserRouter>
  );
};

export default App;
