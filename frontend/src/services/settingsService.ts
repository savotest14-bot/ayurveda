import { api } from './api.js';
import { SiteSettings } from '../types/index.js';

export const settingsService = {
  async getSettings(): Promise<SiteSettings> {
    const response = await api.get('/settings');
    return response.data.data;
  }
};
