import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/productService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class ProductController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, categoryId, search, featured, page, limit } = req.query;
      const result = await ProductService.getAll({
        category: category as string,
        categoryId: categoryId ? parseInt(categoryId as string, 10) : undefined,
        search: search as string,
        featured: featured !== undefined ? featured === 'true' : undefined,
        activeOnly: true,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 50
      });
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const product = await ProductService.getBySlug(slug);
      return sendSuccess(res, product);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const product = await ProductService.getById(id);
      return sendSuccess(res, product);
    } catch (err) {
      next(err);
    }
  }

  // Admin endpoints
  static async adminGetAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, search, page, limit } = req.query;
      const result = await ProductService.getAll({
        category: category as string,
        search: search as string,
        activeOnly: false,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 50
      });
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.create(req.body);
      return sendSuccess(res, product, 'Product created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const product = await ProductService.update(id, req.body);
      return sendSuccess(res, product, 'Product updated successfully');
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const result = await ProductService.delete(id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}
