import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/categoryService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class CategoryController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const activeOnly = req.query.all !== 'true';
      const categories = await CategoryService.getAll(activeOnly);
      return sendSuccess(res, categories);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const category = await CategoryService.getById(id);
      return sendSuccess(res, category);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.create(req.body);
      return sendSuccess(res, category, 'Category created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const category = await CategoryService.update(id, req.body);
      return sendSuccess(res, category, 'Category updated successfully');
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const result = await CategoryService.delete(id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}
