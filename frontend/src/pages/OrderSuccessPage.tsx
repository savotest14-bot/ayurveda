import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, MessageCircle, MapPin, Phone } from 'lucide-react';
import { orderService } from '../services/orderService.js';
import { useSettings } from '../context/SettingsContext.js';
import { Order } from '../types/index.js';

export const OrderSuccessPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { settings } = useSettings();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) return;
      try {
        const data = await orderService.getOrderByNumber(orderNumber);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order receipt', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  const whatsappNum = settings?.whatsappNumber || '919907303284';

  return (
    <div className="bg-cream min-h-screen py-16 animate-fade-in">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm text-center">
          {/* Success Checkmark */}
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
            <CheckCircle size={44} className="text-green-600" />
          </div>

          <span className="text-xs font-bold text-brand-700 bg-brand-50 px-4 py-1.5 rounded-full uppercase tracking-widest inline-block mb-3">
            ORDER RECEIVED
          </span>

          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
            Thank You for Your Order!
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto mb-8">
            Your Ayurvedic wellness package is being processed. An order confirmation has been logged.
          </p>

          {/* Order Details Card */}
          {loading ? (
            <div className="py-8 text-gray-400">Loading order summary...</div>
          ) : order ? (
            <div className="bg-cream rounded-2xl p-6 text-left mb-8 border border-brand-100/60 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-gray-200/60 gap-2">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider block">Order Reference</span>
                  <span className="text-lg font-bold text-gray-900 font-mono">#{order.orderNumber}</span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-gray-400 uppercase tracking-wider block">Payment Status</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-brand-100 text-brand-800">
                    {order.paymentStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2 py-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Items</span>
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-800">{item.productName} × {item.quantity}</span>
                    <span className="font-bold text-gray-900">₹{item.total}</span>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="pt-3 border-t border-gray-200/60 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span>{order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200/60">
                  <span>Total Amount</span>
                  <span className="text-brand-900">₹{order.totalAmount}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="pt-3 border-t border-gray-200/60 text-xs text-gray-600">
                <span className="font-bold text-gray-800 block mb-1 flex items-center gap-1">
                  <MapPin size={13} className="text-brand-600" /> Delivery Address:
                </span>
                <p>{order.shippingAddress}, {order.city}, {order.state} - {order.pincode}</p>
                <p className="mt-1">Recipient: {order.customerName} ({order.customerPhone})</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 mb-8">Order reference: #{orderNumber}</p>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Hello Varsha Ayurveda, I have a query regarding my order #${orderNumber}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-whatsapp text-white px-6 py-3.5 rounded-xl font-bold hover:bg-whatsapp-dark transition-colors text-sm shadow-sm"
            >
              <MessageCircle size={18} /> Order Support on WhatsApp
            </a>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-brand-800 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-brand-900 transition-colors text-sm shadow-md"
            >
              Continue Shopping <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
