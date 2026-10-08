import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout.js';
import { AdminLoginPage } from '../pages/AdminLoginPage.js';
import { AdminDashboardPage } from '../pages/AdminDashboardPage.js';
import { AdminProductsPage } from '../pages/AdminProductsPage.js';
import { AdminProductFormPage } from '../pages/AdminProductFormPage.js';
import { AdminCategoriesPage } from '../pages/AdminCategoriesPage.js';
import { AdminOrdersPage } from '../pages/AdminOrdersPage.js';
import { AdminOrderDetailPage } from '../pages/AdminOrderDetailPage.js';
import { AdminCustomersPage } from '../pages/AdminCustomersPage.js';
import { AdminBlogsPage } from '../pages/AdminBlogsPage.js';
import { AdminBlogFormPage } from '../pages/AdminBlogFormPage.js';
import { AdminMessagesPage } from '../pages/AdminMessagesPage.js';
import { AdminSettingsPage } from '../pages/AdminSettingsPage.js';
import { AdminProfilePage } from '../pages/AdminProfilePage.js';
import { useAdminAuth } from '../context/AdminAuthContext.js';

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Protected App */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<AdminProductFormPage />} />
        <Route path="products/:id/edit" element={<AdminProductFormPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="orders/:id" element={<AdminOrderDetailPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
        <Route path="blogs" element={<AdminBlogsPage />} />
        <Route path="blogs/new" element={<AdminBlogFormPage />} />
        <Route path="blogs/:id/edit" element={<AdminBlogFormPage />} />
        <Route path="messages" element={<AdminMessagesPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
      </Route>

      {/* Redirect all unmatched to /admin */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};
