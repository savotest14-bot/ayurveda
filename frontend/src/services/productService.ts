import { api } from './api.js';
import { Product } from '../types/index.js';

export const productService = {
  async getProducts(params?: { category?: string; search?: string; featured?: boolean }) {
    const response = await api.get('/products', { params });
    return response.data.data;
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const response = await api.get(`/products/${slug}`);
    return response.data.data;
  }
};
