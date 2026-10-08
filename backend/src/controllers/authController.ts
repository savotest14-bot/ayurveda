import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      return sendSuccess(res, result, 'Registration successful', 201);
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      return sendSuccess(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  static async logout(_req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, { message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getMe(req.user!.id);
      return sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await AuthService.updateProfile(req.user!.id, req.body);
      return sendSuccess(res, updated, 'Profile updated successfully');
    } catch (err) {
      next(err);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.changePassword(req.user!.id, req.body);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}
