import { z } from 'zod';
import { PaymentMethod, PaymentStatus, OrderStatus } from '@prisma/client';

export const orderItemInputSchema = z.object({
  productId: z.coerce.number().int().positive('Product ID is required'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1')
});

export const createOrderSchema = z.object({
  body: z.object({
    customerName: z.string().min(2, 'Customer name is required'),
    customerEmail: z.string().email('Valid email address is required'),
    customerPhone: z.string().regex(/^[0-9+ ]{10,15}$/, 'Valid 10-digit phone number is required'),
    shippingAddress: z.string().min(5, 'Complete shipping address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().regex(/^\d{6}$/, 'Valid 6-digit pincode is required'),
    notes: z.string().optional().nullable(),
    paymentMethod: z.nativeEnum(PaymentMethod),
    items: z.array(orderItemInputSchema).min(1, 'Cart cannot be empty')
  })
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Order ID must be numeric')
  }),
  body: z.object({
    orderStatus: z.nativeEnum(OrderStatus).optional(),
    paymentStatus: z.nativeEnum(PaymentStatus).optional()
  })
});
