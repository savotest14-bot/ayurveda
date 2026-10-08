import { Request, Response, NextFunction } from 'express';
import { ContactService } from '../services/contactService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class ContactController {
  static async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const message = await ContactService.submitMessage(req.body);
      return sendSuccess(res, message, 'Thank you! Your message has been sent successfully.', 201);
    } catch (err) {
      next(err);
    }
  }

  static async adminGetAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.query;
      const messages = await ContactService.getAll(status as any);
      return sendSuccess(res, messages);
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const updated = await ContactService.updateStatus(id, req.body.status);
      return sendSuccess(res, updated, 'Message status updated');
    } catch (err) {
      next(err);
    }
  }
}
