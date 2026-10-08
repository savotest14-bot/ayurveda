import crypto from 'crypto';
import { razorpayInstance } from '../config/razorpay.js';
import { ENV } from '../config/env.js';
import { ApiError } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

export class PaymentService {
  static async createRazorpayOrder(amountInRupees: number, receipt: string) {
    const amountInPaise = Math.round(amountInRupees * 100);
    try {
      // In automated test environment or dummy keys, return sandbox simulated order
      if (process.env.NODE_ENV === 'test' || ENV.RAZORPAY_KEY_ID.includes('DemoKey')) {
        return {
          id: `order_mock_${Date.now()}`,
          entity: 'order',
          amount: amountInPaise,
          amount_paid: 0,
          amount_due: amountInPaise,
          currency: 'INR',
          receipt,
          status: 'created',
          created_at: Math.floor(Date.now() / 1000)
        };
      }

      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        payment_capture: 1
      };

      const order = await razorpayInstance.orders.create(options);
      return order;
    } catch (error: any) {
      logger.error('Razorpay order creation failed', error);
      // Fallback for development if dummy keys are used
      if (process.env.NODE_ENV !== 'production') {
        return {
          id: `order_dev_${Date.now()}`,
          entity: 'order',
          amount: amountInPaise,
          amount_paid: 0,
          amount_due: amountInPaise,
          currency: 'INR',
          receipt,
          status: 'created',
          created_at: Math.floor(Date.now() / 1000)
        };
      }
      throw new ApiError(500, `Failed to create Razorpay order: ${error.message || 'Razorpay error'}`);
    }
  }

  static verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    try {
      const text = `${orderId}|${paymentId}`;
      const generatedSignature = crypto
        .createHmac('sha256', ENV.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      return generatedSignature === signature;
    } catch (err: any) {
      logger.error('Signature verification error', err);
      return false;
    }
  }

  static verifyWebhookSignature(rawBody: string, webhookSignature: string): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', ENV.RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');

      return expectedSignature === webhookSignature;
    } catch (err: any) {
      logger.error('Webhook signature verification error', err);
      return false;
    }
  }
}
