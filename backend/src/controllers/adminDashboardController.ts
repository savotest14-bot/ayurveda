import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboardService.js';
import { prisma } from '../config/db.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { Role } from '@prisma/client';

export class AdminDashboardController {
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await DashboardService.getDashboardStats();
      return sendSuccess(res, stats);
    } catch (err) {
      next(err);
    }
  }

  static async getCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, page, limit } = req.query;
      const pageNum = Math.max(1, page ? parseInt(page as string, 10) : 1);
      const limitNum = Math.max(1, limit ? parseInt(limit as string, 10) : 20);
      const skip = (pageNum - 1) * limitNum;

      const where: any = { role: Role.CUSTOMER };
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } },
          { phone: { contains: search as string, mode: 'insensitive' } }
        ];
      }

      const [total, customers] = await Promise.all([
        prisma.user.count({ where }),
        prisma.user.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            isActive: true,
            createdAt: true,
            _count: {
              select: { orders: true }
            },
            orders: {
              select: { totalAmount: true, paymentStatus: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limitNum
        })
      ]);

      const formatted = customers.map(c => {
        const totalSpent = c.orders
          .filter(o => o.paymentStatus === 'PAID' || o.paymentStatus === 'COD_CONFIRMED')
          .reduce((sum, o) => sum + o.totalAmount, 0);

        return {
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          isActive: c.isActive,
          createdAt: c.createdAt,
          ordersCount: c._count.orders,
          totalSpent
        };
      });

      return sendSuccess(res, {
        customers: formatted,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async toggleCustomerStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { isActive } = req.body;
      const updated = await prisma.user.update({
        where: { id },
        data: { isActive },
        select: { id: true, name: true, email: true, isActive: true }
      });
      return sendSuccess(res, updated, 'Customer status updated');
    } catch (err) {
      next(err);
    }
  }
}
