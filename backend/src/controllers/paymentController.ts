import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/orderService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class PaymentController {
  static async verifyRazorpay(req: Request, res: Response, next: NextFunction) {
    try {
      const confirmedOrder = await OrderService.verifyRazorpayPayment(req.body);
      return sendSuccess(res, confirmedOrder, 'Payment verified and order confirmed successfully');
    } catch (err) {
      next(err);
    }
  }

  static async razorpayWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      const rawBody = (req as any).rawBody || JSON.stringify(req.body);
      const result = await OrderService.handleWebhook(rawBody, signature, req.body);
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}
