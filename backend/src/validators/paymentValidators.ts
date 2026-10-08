import { z } from 'zod';

export const verifyPaymentSchema = z.object({
  body: z.object({
    orderId: z.coerce.number().int().positive(),
    razorpayOrderId: z.string().min(1, 'Razorpay order ID is required'),
    razorpayPaymentId: z.string().min(1, 'Razorpay payment ID is required'),
    razorpaySignature: z.string().min(1, 'Razorpay signature is required')
  })
});
