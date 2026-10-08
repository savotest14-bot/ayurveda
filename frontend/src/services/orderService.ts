import { api } from './api.js';
import { Order } from '../types/index.js';

export interface CheckoutPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
  paymentMethod: 'COD_WHATSAPP' | 'RAZORPAY';
  items: { productId: number; quantity: number }[];
}

export const orderService = {
  async createCodOrder(data: CheckoutPayload): Promise<{
    order: Order;
    whatsappMessage: string;
    whatsappUrl: string;
  }> {
    const response = await api.post('/orders/cod-whatsapp', data);
    return response.data.data;
  },

  async createRazorpayOrder(data: CheckoutPayload): Promise<{
    order: Order;
    razorpayOrder: {
      id: string;
      amount: number;
      currency: string;
      key: string;
    };
  }> {
    const response = await api.post('/orders/create-razorpay', data);
    return response.data.data;
  },

  async verifyRazorpayPayment(data: {
    orderId: number;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<Order> {
    const response = await api.post('/payments/razorpay/verify', data);
    return response.data.data;
  },

  async getMyOrders(): Promise<Order[]> {
    const response = await api.get('/orders/my-orders');
    return response.data.data;
  },

  async getOrderById(id: number | string): Promise<Order> {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  },

  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response = await api.get(`/orders/number/${orderNumber}`);
    return response.data.data;
  }
};
