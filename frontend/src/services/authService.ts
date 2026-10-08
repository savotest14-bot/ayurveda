import { api } from './api.js';
import { User } from '../types/index.js';

export const authService = {
  async register(data: { name: string; email: string; phone?: string; password: string }): Promise<{ user: User; token: string }> {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  },

  async login(data: { email: string; password: string }): Promise<{ user: User; token: string }> {
    const response = await api.post('/auth/login', data);
    return response.data.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  async updateProfile(data: { name?: string; phone?: string }): Promise<User> {
    const response = await api.put('/auth/profile', data);
    return response.data.data;
  },

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await api.put('/auth/change-password', data);
    return response.data.data;
  }
};
