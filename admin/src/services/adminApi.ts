import axios from 'axios';
import { DashboardStats, Product, Category, Blog, Order, ContactMessage, SiteSettings } from '../types/index.js';

export const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('va_admin_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (!window.location.pathname.includes('/admin/login') && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('va_admin_token');
        localStorage.removeItem('va_admin_user');
      }
    }
    return Promise.reject(error);
  }
);

export const adminService = {
  // Auth
  async login(credentials: { email: string; password: string }) {
    const res = await adminApi.post('/auth/login', credentials);
    return res.data.data;
  },

  async getMe() {
    const res = await adminApi.get('/auth/me');
    return res.data.data;
  },

  async changePassword(passwords: { currentPassword: string; newPassword: string }) {
    const res = await adminApi.put('/auth/change-password', passwords);
    return res.data.data;
  },

  // Dashboard
  async getDashboard(): Promise<DashboardStats> {
    const res = await adminApi.get('/admin/dashboard');
    return res.data.data;
  },

  // Products
  async getProducts(params?: { search?: string; category?: string; page?: number; limit?: number }) {
    const res = await adminApi.get('/admin/products', { params });
    return res.data.data;
  },

  async getProductById(id: number | string): Promise<Product> {
    const res = await adminApi.get(`/admin/products/${id}`);
    return res.data.data;
  },

  async createProduct(data: any): Promise<Product> {
    const res = await adminApi.post('/admin/products', data);
    return res.data.data;
  },

  async updateProduct(id: number | string, data: any): Promise<Product> {
    const res = await adminApi.put(`/admin/products/${id}`, data);
    return res.data.data;
  },

  async deleteProduct(id: number | string) {
    const res = await adminApi.delete(`/admin/products/${id}`);
    return res.data.data;
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await adminApi.get('/admin/categories');
    return res.data.data;
  },

  async createCategory(data: any): Promise<Category> {
    const res = await adminApi.post('/admin/categories', data);
    return res.data.data;
  },

  async updateCategory(id: number | string, data: any): Promise<Category> {
    const res = await adminApi.put(`/admin/categories/${id}`, data);
    return res.data.data;
  },

  async deleteCategory(id: number | string) {
    const res = await adminApi.delete(`/admin/categories/${id}`);
    return res.data.data;
  },

  // Blogs
  async getBlogs(): Promise<Blog[]> {
    const res = await adminApi.get('/admin/blogs');
    return res.data.data;
  },

  async getBlogById(id: number | string): Promise<Blog> {
    const res = await adminApi.get(`/admin/blogs/${id}`);
    return res.data.data;
  },

  async createBlog(data: any): Promise<Blog> {
    const res = await adminApi.post('/admin/blogs', data);
    return res.data.data;
  },

  async updateBlog(id: number | string, data: any): Promise<Blog> {
    const res = await adminApi.put(`/admin/blogs/${id}`, data);
    return res.data.data;
  },

  async deleteBlog(id: number | string) {
    const res = await adminApi.delete(`/admin/blogs/${id}`);
    return res.data.data;
  },

  // Orders
  async getOrders(params?: { status?: string; paymentStatus?: string; search?: string; page?: number; limit?: number }) {
    const res = await adminApi.get('/admin/orders', { params });
    return res.data.data;
  },

  async getOrderById(id: number | string): Promise<Order> {
    const res = await adminApi.get(`/admin/orders/${id}`);
    return res.data.data;
  },

  async updateOrderStatus(id: number | string, data: { orderStatus?: string; paymentStatus?: string }): Promise<Order> {
    const res = await adminApi.put(`/admin/orders/${id}/status`, data);
    return res.data.data;
  },

  // Customers
  async getCustomers(params?: { search?: string; page?: number }) {
    const res = await adminApi.get('/admin/customers', { params });
    return res.data.data;
  },

  async toggleCustomerStatus(id: string, isActive: boolean) {
    const res = await adminApi.put(`/admin/customers/${id}/status`, { isActive });
    return res.data.data;
  },

  // Contact Messages
  async getMessages(status?: string): Promise<ContactMessage[]> {
    const res = await adminApi.get('/admin/contact-messages', { params: { status } });
    return res.data.data;
  },

  async updateMessageStatus(id: number, status: string): Promise<ContactMessage> {
    const res = await adminApi.put(`/admin/contact-messages/${id}`, { status });
    return res.data.data;
  },

  // Site Settings
  async getSettings(): Promise<SiteSettings> {
    const res = await adminApi.get('/admin/settings');
    return res.data.data;
  },

  async updateSettings(data: any): Promise<SiteSettings> {
    const res = await adminApi.put('/admin/settings', data);
    return res.data.data;
  },

  // Image Upload
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    const res = await adminApi.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.data.url;
  }
};
