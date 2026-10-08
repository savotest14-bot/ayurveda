import { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../services/settingsService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class SettingsController {
  static async getSettings(_req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await SettingsService.getSettings();
      return sendSuccess(res, settings);
    } catch (err) {
      next(err);
    }
  }

  static async updateSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await SettingsService.updateSettings(req.body);
      return sendSuccess(res, updated, 'Site settings updated successfully');
    } catch (err) {
      next(err);
    }
  }
}
