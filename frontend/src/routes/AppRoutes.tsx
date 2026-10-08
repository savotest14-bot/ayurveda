import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout.js';
import { HomePage } from '../pages/HomePage.js';
import { ShopPage } from '../pages/ShopPage.js';
import { ProductDetailPage } from '../pages/ProductDetailPage.js';
import { AboutPage } from '../pages/AboutPage.js';
import { GalleryPage } from '../pages/GalleryPage.js';
import { BlogPage } from '../pages/BlogPage.js';
import { BlogDetailPage } from '../pages/BlogDetailPage.js';
import { ContactPage } from '../pages/ContactPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { OrderSuccessPage } from '../pages/OrderSuccessPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { RegisterPage } from '../pages/RegisterPage.js';
import { AccountPage } from '../pages/AccountPage.js';
import { OrdersPage } from '../pages/OrdersPage.js';
import { OrderDetailPage } from '../pages/OrderDetailPage.js';
import { useAuth } from '../context/AuthContext.js';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-brand-800 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-gray-400 text-xs">Checking authorization...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Store Pages */}
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="shop/:slug" element={<ProductDetailPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogDetailPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-success/:orderNumber" element={<OrderSuccessPage />} />

        {/* Customer Auth Pages */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Protected Customer Account Pages */}
        <Route
          path="account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="account/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="account/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Portal Redirect */}
        <Route
          path="admin/*"
          element={
            <div className="py-20 text-center">
              <p className="text-sm font-bold text-slate-700 mb-2">Redirecting to Admin Portal...</p>
              <a href="http://localhost:5174/admin" className="text-xs text-brand-800 underline">
                Click here if you are not redirected automatically
              </a>
              <script
                dangerouslySetInnerHTML={{
                  __html: `window.location.href = "http://localhost:5174/admin";`
                }}
              />
            </div>
          }
        />

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
