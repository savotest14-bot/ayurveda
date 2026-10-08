import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, MessageCircle, AlertCircle } from 'lucide-react';
import { orderService } from '../services/orderService.js';
import { useSettings } from '../context/SettingsContext.js';
import { Order } from '../types/index.js';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { settings } = useSettings();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-brand-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <AlertCircle size={40} className="mx-auto text-gray-400 mb-2" />
        <h2 className="text-xl font-bold text-gray-800">Order Not Found</h2>
        <Link to="/account/orders" className="text-brand-800 text-sm font-bold mt-4 inline-block hover:underline">
          Return to Orders
        </Link>
      </div>
    );
  }

  const whatsappNum = settings?.whatsappNumber || '919907303284';

  return (
    <div className="bg-cream min-h-screen py-10 animate-fade-in">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          to="/account/orders"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-brand-800 mb-6"
        >
          <ArrowLeft size={16} /> Back to My Orders
        </Link>

        <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-gray-100 gap-4">
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-widest block font-semibold">Order Reference</span>
              <h1 className="text-2xl font-serif font-bold text-gray-900 font-mono">#{order.orderNumber}</h1>
              <p className="text-xs text-gray-400 mt-1">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-brand-50 text-brand-800 border border-brand-200">
                Order: {order.orderStatus}
              </span>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Payment: {order.paymentStatus.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-gray-900">Items in this Order</h2>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 rounded-xl bg-cream border border-brand-50 text-sm"
                >
                  <div>
                    <p className="font-bold text-gray-900">{item.productName}</p>
                    <p className="text-xs text-gray-500">
                      ₹{item.price} × {item.quantity} units
                    </p>
                  </div>
                  <span className="font-bold text-gray-900">₹{item.total}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Details */}
          <div className="pt-4 border-t border-gray-100 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Charge</span>
              <span>{order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
              <span>Total Paid / Payable</span>
              <span className="text-brand-900 text-xl">₹{order.totalAmount}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="pt-4 border-t border-gray-100 text-sm text-gray-700">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5">
              <MapPin size={16} className="text-brand-700" /> Shipping Destination
            </h3>
            <p className="text-gray-600">{order.shippingAddress}</p>
            <p className="text-gray-600">{order.city}, {order.state} - {order.pincode}</p>
            <p className="text-xs text-gray-500 mt-2">
              Contact: {order.customerName} | Phone: {order.customerPhone}
            </p>
          </div>

          {/* WhatsApp Support CTA */}
          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <a
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Hi Varsha Ayurveda, I need help with order #${order.orderNumber}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-whatsapp text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-whatsapp-dark transition-colors shadow-sm"
            >
              <MessageCircle size={16} /> Need help? Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
