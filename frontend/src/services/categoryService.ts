import { api } from './api.js';
import { Category } from '../types/index.js';

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data.data;
  }
};
