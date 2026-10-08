import { prisma } from '../config/db.js';
import { ApiError } from '../utils/apiResponse.js';
import { generateOrderNumber } from '../utils/orderNumber.js';
import { PaymentService } from './paymentService.js';
import { SettingsService } from './settingsService.js';
import { EmailService } from './emailService.js';
import { logger } from '../utils/logger.js';
import { PaymentMethod, PaymentStatus, OrderStatus } from '@prisma/client';
import { ENV } from '../config/env.js';

export interface OrderItemInput {
  productId: number;
  quantity: number;
}

export interface CreateOrderDTO {
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string | null;
  paymentMethod: PaymentMethod;
  items: OrderItemInput[];
}

export class OrderService {
  /**
   * Validates products, checks stock, and calculates reliable prices from DB
   */
  private static async validateAndCalculate(itemsInput: OrderItemInput[]) {
    if (!itemsInput || itemsInput.length === 0) {
      throw new ApiError(400, 'Cannot place an empty order');
    }

    const productIds = itemsInput.map(i => i.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        active: true
      }
    });

    if (products.length !== productIds.length) {
      throw new ApiError(400, 'One or more selected products are invalid or no longer available');
    }

    const productMap = new Map(products.map(p => [p.id, p]));
    let subtotal = 0;
    const validatedItems: {
      productId: number;
      productName: string;
      quantity: number;
      price: number;
      total: number;
    }[] = [];

    for (const item of itemsInput) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new ApiError(400, `Product ID ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`);
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      });
    }

    const settings = await SettingsService.getSettings();
    let shippingCharge = settings.shippingCharge;
    if (subtotal >= settings.freeShippingThreshold) {
      shippingCharge = 0;
    }

    const totalAmount = subtotal + shippingCharge;

    return {
      subtotal,
      shippingCharge,
      totalAmount,
      validatedItems,
      settings
    };
  }

  /**
   * Places a COD WhatsApp order: creates in DB first, then generates formatted WhatsApp message
   */
  static async createCodWhatsappOrder(data: CreateOrderDTO) {
    const { subtotal, shippingCharge, totalAmount, validatedItems, settings } =
      await this.validateAndCalculate(data.items);

    if (!settings.codEnabled) {
      throw new ApiError(400, 'Cash on Delivery (WhatsApp) is currently disabled by store');
    }

    const orderNumber = generateOrderNumber();

    const order = await prisma.$transaction(async (tx) => {
      // 1. Deduct stock
      for (const item of validatedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // 2. Create order & items
      return await tx.order.create({
        data: {
          orderNumber,
          customerId: data.customerId || null,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          shippingAddress: data.shippingAddress,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          notes: data.notes || null,
          subtotal,
          shippingCharge,
          discount: 0,
          totalAmount,
          paymentMethod: PaymentMethod.COD_WHATSAPP,
          paymentStatus: PaymentStatus.COD_PENDING,
          orderStatus: OrderStatus.PENDING,
          items: {
            create: validatedItems.map(item => ({
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              price: item.price,
              total: item.total
            }))
          }
        },
        include: {
          items: true
        }
      });
    });

    // Generate formatted WhatsApp message
    let whatsappText = `🌿 *VARSHA AYURVEDA - NEW ORDER*\n`;
    whatsappText += `━━━━━━━━━━━━━━━━━━━━━\n`;
    whatsappText += `*Order ID:* ${order.orderNumber}\n`;
    whatsappText += `*Customer:* ${order.customerName}\n`;
    whatsappText += `*Phone:* ${order.customerPhone}\n\n`;
    whatsappText += `📦 *ITEMS ORDERED:*\n`;

    validatedItems.forEach((item, index) => {
      whatsappText += `${index + 1}. ${item.productName}\n`;
      whatsappText += `   Qty: ${item.quantity} × ₹${item.price} = ₹${item.total}\n`;
    });

    whatsappText += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    whatsappText += `*Subtotal:* ₹${order.subtotal}\n`;
    whatsappText += `*Delivery Charge:* ₹${order.shippingCharge}\n`;
    whatsappText += `*Total Amount:* ₹${order.totalAmount}\n`;
    whatsappText += `*Payment Method:* Cash on Delivery (COD)\n\n`;
    whatsappText += `📍 *DELIVERY ADDRESS:*\n`;
    whatsappText += `${order.shippingAddress}, ${order.city}, ${order.state} - ${order.pincode}\n`;
    if (order.notes) {
      whatsappText += `*Notes:* ${order.notes}\n`;
    }
    whatsappText += `\nPlease confirm my order and share delivery schedule. Thank you!`;

    const targetWhatsapp = settings.whatsappNumber || ENV.WHATSAPP_NUMBER;
    const whatsappUrl = `https://wa.me/${targetWhatsapp}?text=${encodeURIComponent(whatsappText)}`;

    // Asynchronously send email confirmation
    EmailService.sendOrderConfirmation(order).catch(() => {});

    return {
      order,
      whatsappMessage: whatsappText,
      whatsappUrl
    };
  }

  /**
   * Creates a Razorpay online payment order
   */
  static async createRazorpayOrder(data: CreateOrderDTO) {
    const { subtotal, shippingCharge, totalAmount, validatedItems, settings } =
      await this.validateAndCalculate(data.items);

    if (!settings.razorpayEnabled) {
      throw new ApiError(400, 'Online payments with Razorpay are currently disabled');
    }

    const orderNumber = generateOrderNumber();

    // Create Razorpay Order on Razorpay servers
    const rzpOrder = await PaymentService.createRazorpayOrder(totalAmount, orderNumber);

    // Save order in PostgreSQL
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: data.customerId || null,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          shippingAddress: data.shippingAddress,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          notes: data.notes || null,
          subtotal,
          shippingCharge,
          discount: 0,
          totalAmount,
          paymentMethod: PaymentMethod.RAZORPAY,
          paymentStatus: PaymentStatus.PENDING,
          orderStatus: OrderStatus.PENDING,
          items: {
            create: validatedItems.map(item => ({
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              price: item.price,
              total: item.total
            }))
          }
        },
        include: {
          items: true
        }
      });

      // Create linked payment entry
      await tx.payment.create({
        data: {
          orderId: createdOrder.id,
          razorpayOrderId: rzpOrder.id,
          amount: totalAmount,
          currency: 'INR',
          status: 'created',
          paymentMethod: 'razorpay'
        }
      });

      return createdOrder;
    });

    return {
      order,
      razorpayOrder: {
        id: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        key: ENV.RAZORPAY_KEY_ID
      }
    };
  }

  /**
   * Verifies Razorpay payment signature and confirms order
   */
  static async verifyRazorpayPayment(data: {
    orderId: number;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    const isValid = PaymentService.verifySignature(
      data.razorpayOrderId,
      data.razorpayPaymentId,
      data.razorpaySignature
    );

    if (!isValid) {
      await prisma.payment.updateMany({
        where: { razorpayOrderId: data.razorpayOrderId },
        data: { status: 'failed' }
      });
      await prisma.order.update({
        where: { id: data.orderId },
        data: { paymentStatus: PaymentStatus.FAILED }
      });
      throw new ApiError(400, 'Invalid payment signature. Payment verification failed.');
    }

    // Success transaction: update order, payment, and decrement stock
    const confirmedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: data.orderId },
        include: { items: true }
      });

      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      // Check if already paid to prevent double stock decrement
      if (order.paymentStatus === PaymentStatus.PAID) {
        return order;
      }

      // Deduct product stock
      for (const item of order.items) {
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          });
        }
      }

      // Update payment record
      await tx.payment.updateMany({
        where: { razorpayOrderId: data.razorpayOrderId },
        data: {
          razorpayPaymentId: data.razorpayPaymentId,
          razorpaySignature: data.razorpaySignature,
          status: 'captured'
        }
      });

      // Update order
      return await tx.order.update({
        where: { id: data.orderId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          orderStatus: OrderStatus.CONFIRMED
        },
        include: {
          items: true,
          payments: true
        }
      });
    });

    EmailService.sendOrderConfirmation(confirmedOrder).catch(() => {});
    return confirmedOrder;
  }

  /**
   * Idempotent webhook event handler for Razorpay
   */
  static async handleWebhook(rawBody: string, signature: string, eventData: any) {
    const isValid = PaymentService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      throw new ApiError(400, 'Invalid webhook signature');
    }

    const eventId = eventData.event_id || eventData.id || `${eventData.event}-${Date.now()}`;

    // Check idempotency
    const existingLog = await prisma.webhookLog.findUnique({
      where: { eventId }
    });

    if (existingLog) {
      logger.info(`Webhook event ${eventId} already processed.`);
      return { status: 'already_processed' };
    }

    const eventType = eventData.event;
    logger.info(`Processing Razorpay webhook event: ${eventType}`);

    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = eventData.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const razorpayPaymentId = paymentEntity?.id;

      if (razorpayOrderId) {
        const paymentRecord = await prisma.payment.findFirst({
          where: { razorpayOrderId },
          include: { order: { include: { items: true } } }
        });

        if (paymentRecord && paymentRecord.order.paymentStatus !== PaymentStatus.PAID) {
          await prisma.$transaction(async (tx) => {
            for (const item of paymentRecord.order.items) {
              if (item.productId) {
                await tx.product.update({
                  where: { id: item.productId },
                  data: { stock: { decrement: item.quantity } }
                });
              }
            }

            await tx.payment.update({
              where: { id: paymentRecord.id },
              data: {
                razorpayPaymentId,
                status: 'captured'
              }
            });

            await tx.order.update({
              where: { id: paymentRecord.orderId },
              data: {
                paymentStatus: PaymentStatus.PAID,
                orderStatus: OrderStatus.CONFIRMED
              }
            });
          });
        }
      }
    } else if (eventType === 'payment.failed') {
      const paymentEntity = eventData.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;

      if (razorpayOrderId) {
        await prisma.payment.updateMany({
          where: { razorpayOrderId },
          data: { status: 'failed' }
        });
      }
    }

    // Save webhook log for idempotency
    await prisma.webhookLog.create({
      data: {
        eventId,
        event: eventType,
        payload: JSON.stringify(eventData),
        processed: true
      }
    });

    return { status: 'processed' };
  }

  static async getMyOrders(userId: string) {
    return await prisma.order.findMany({
      where: { customerId: userId },
      include: {
        items: true,
        payments: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getOrderById(orderId: number, userId?: string) {
    const where: any = { id: orderId };
    if (userId) {
      where.customerId = userId;
    }

    const order = await prisma.order.findUnique({
      where,
      include: {
        items: {
          include: {
            product: {
              include: { images: true }
            }
          }
        },
        payments: true
      }
    });

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    return order;
  }

  static async getOrderByNumber(orderNumber: string) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        payments: true
      }
    });

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    return order;
  }

  static async getAllOrders(query: {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.orderStatus = query.status;
    }
    if (query.paymentStatus) {
      where.paymentStatus = query.paymentStatus;
    }
    if (query.paymentMethod) {
      where.paymentMethod = query.paymentMethod;
    }
    if (query.search) {
      where.OR = [
        { orderNumber: { contains: query.search, mode: 'insensitive' } },
        { customerName: { contains: query.search, mode: 'insensitive' } },
        { customerEmail: { contains: query.search, mode: 'insensitive' } },
        { customerPhone: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: {
          items: true,
          payments: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      })
    ]);

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async updateOrderStatus(id: number, data: { orderStatus?: OrderStatus; paymentStatus?: PaymentStatus }) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    return await prisma.order.update({
      where: { id },
      data,
      include: {
        items: true,
        payments: true
      }
    });
  }
}
