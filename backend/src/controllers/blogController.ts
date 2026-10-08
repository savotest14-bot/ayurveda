import { Request, Response, NextFunction } from 'express';
import { BlogService } from '../services/blogService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class BlogController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const publishedOnly = req.query.all !== 'true';
      const blogs = await BlogService.getAll(publishedOnly);
      return sendSuccess(res, blogs);
    } catch (err) {
      next(err);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const blog = await BlogService.getBySlug(slug);
      return sendSuccess(res, blog);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const blog = await BlogService.getById(id);
      return sendSuccess(res, blog);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const blog = await BlogService.create(req.body);
      return sendSuccess(res, blog, 'Blog post created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const blog = await BlogService.update(id, req.body);
      return sendSuccess(res, blog, 'Blog post updated successfully');
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const result = await BlogService.delete(id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}
