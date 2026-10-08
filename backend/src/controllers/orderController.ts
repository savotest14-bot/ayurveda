import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/orderService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class OrderController {
  static async createCodWhatsapp(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.user?.id;
      const result = await OrderService.createCodWhatsappOrder({
        ...req.body,
        customerId
      });
      return sendSuccess(res, result, 'COD order created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  static async createRazorpay(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.user?.id;
      const result = await OrderService.createRazorpayOrder({
        ...req.body,
        customerId
      });
      return sendSuccess(res, result, 'Razorpay order created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  static async getMyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await OrderService.getMyOrders(req.user!.id);
      return sendSuccess(res, orders);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = parseInt(req.params.id as string, 10);
      const userId = req.user?.role === 'ADMIN' ? undefined : req.user?.id;
      const order = await OrderService.getOrderById(orderId, userId);
      return sendSuccess(res, order);
    } catch (err) {
      next(err);
    }
  }

  static async getByNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const orderNumber = req.params.orderNumber as string;
      const order = await OrderService.getOrderByNumber(orderNumber);
      return sendSuccess(res, order);
    } catch (err) {
      next(err);
    }
  }

  // Admin endpoints
  static async adminGetAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, paymentStatus, paymentMethod, search, page, limit } = req.query;
      const result = await OrderService.getAllOrders({
        status: status as any,
        paymentStatus: paymentStatus as any,
        paymentMethod: paymentMethod as any,
        search: search as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20
      });
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = parseInt(req.params.id as string, 10);
      const updated = await OrderService.updateOrderStatus(orderId, req.body);
      return sendSuccess(res, updated, 'Order status updated successfully');
    } catch (err) {
      next(err);
    }
  }
}
