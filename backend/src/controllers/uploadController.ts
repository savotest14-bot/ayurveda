import { Request, Response, NextFunction } from 'express';
import { sendSuccess, ApiError } from '../utils/apiResponse.js';

export class UploadController {
  static async uploadSingle(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new ApiError(400, 'No image file uploaded');
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      return sendSuccess(res, {
        url: fileUrl,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
      }, 'Image uploaded successfully');
    } catch (err) {
      next(err);
    }
  }

  static async uploadMultiple(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        throw new ApiError(400, 'No image files uploaded');
      }

      const files = req.files as Express.Multer.File[];
      const urls = files.map(f => ({
        url: `/uploads/${f.filename}`,
        filename: f.filename,
        mimetype: f.mimetype,
        size: f.size
      }));

      return sendSuccess(res, urls, 'Images uploaded successfully');
    } catch (err) {
      next(err);
    }
  }
}
