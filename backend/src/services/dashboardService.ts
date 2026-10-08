import { prisma } from '../config/db.js';
import { OrderStatus, PaymentMethod, PaymentStatus, Role } from '@prisma/client';

export class DashboardService {
  static async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      todayOrders,
      pendingOrders,
      deliveredOrders,
      totalRevenueResult,
      razorpayRevenueResult,
      codOrders,
      totalProducts,
      lowStockProducts,
      totalCustomers,
      newMessages,
      recentOrders,
      orderStatusCounts,
      paymentMethodCounts,
      bestSellingItems
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.order.count({ where: { orderStatus: OrderStatus.PENDING } }),
      prisma.order.count({ where: { orderStatus: OrderStatus.DELIVERED } }),
      prisma.order.aggregate({
        where: { paymentStatus: { in: [PaymentStatus.PAID, PaymentStatus.COD_CONFIRMED] } },
        _sum: { totalAmount: true }
      }),
      prisma.order.aggregate({
        where: {
          paymentMethod: PaymentMethod.RAZORPAY,
          paymentStatus: PaymentStatus.PAID
        },
        _sum: { totalAmount: true }
      }),
      prisma.order.count({ where: { paymentMethod: PaymentMethod.COD_WHATSAPP } }),
      prisma.product.count({ where: { active: true } }),
      prisma.product.count({ where: { stock: { lte: 10 }, active: true } }),
      prisma.user.count({ where: { role: Role.CUSTOMER } }),
      prisma.contactMessage.count({ where: { status: 'NEW' } }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: { items: true }
      }),
      prisma.order.groupBy({
        by: ['orderStatus'],
        _count: { id: true }
      }),
      prisma.order.groupBy({
        by: ['paymentMethod'],
        _count: { id: true }
      }),
      prisma.orderItem.groupBy({
        by: ['productName'],
        _sum: { quantity: true, total: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
      })
    ]);

    // Calculate revenue & order counts for the last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const start = new Date(d.setHours(0, 0, 0, 0));
      const end = new Date(d.setHours(23, 59, 59, 999));
      const dayLabel = start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

      last7Days.push({ start, end, label: dayLabel });
    }

    const dailyStats = await Promise.all(
      last7Days.map(async ({ start, end, label }) => {
        const [ordersCount, revenue] = await Promise.all([
          prisma.order.count({
            where: { createdAt: { gte: start, lte: end } }
          }),
          prisma.order.aggregate({
            where: {
              createdAt: { gte: start, lte: end },
              paymentStatus: { in: [PaymentStatus.PAID, PaymentStatus.COD_CONFIRMED] }
            },
            _sum: { totalAmount: true }
          })
        ]);

        return {
          date: label,
          orders: ordersCount,
          revenue: revenue._sum.totalAmount || 0
        };
      })
    );

    return {
      overview: {
        totalOrders,
        todayOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue: totalRevenueResult._sum.totalAmount || 0,
        razorpayRevenue: razorpayRevenueResult._sum.totalAmount || 0,
        codOrders,
        totalProducts,
        lowStockProducts,
        totalCustomers,
        newMessages
      },
      charts: {
        dailyTrends: dailyStats,
        orderStatusDistribution: orderStatusCounts.map(s => ({
          status: s.orderStatus,
          count: s._count.id
        })),
        paymentMethodDistribution: paymentMethodCounts.map(p => ({
          method: p.paymentMethod,
          count: p._count.id
        })),
        bestSellingProducts: bestSellingItems.map(b => ({
          name: b.productName,
          quantity: b._sum.quantity || 0,
          totalRevenue: b._sum.total || 0
        }))
      },
      recentOrders
    };
  }
}
