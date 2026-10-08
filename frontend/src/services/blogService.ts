import { api } from './api.js';
import { Blog } from '../types/index.js';

export const blogService = {
  async getBlogs(): Promise<Blog[]> {
    const response = await api.get('/blogs');
    return response.data.data;
  },

  async getBlogBySlug(slug: string): Promise<Blog> {
    const response = await api.get(`/blogs/${slug}`);
    return response.data.data;
  }
};
