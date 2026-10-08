import { api } from './api.js';

export const contactService = {
  async submitMessage(data: { name: string; email: string; phone?: string; message: string }) {
    const response = await api.post('/contact', data);
    return response.data;
  }
};
