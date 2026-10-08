import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Phone, Mail, CheckCircle,
  Clock, Package, MessageCircle, AlertCircle
} from 'lucide-react';
import { adminService } from '../services/adminApi.js';
import { Order } from '../types/index.js';

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;
      try {
        const data = await adminService.getOrderById(id);
        setOrder(data);
        setOrderStatus(data.orderStatus);
        setPaymentStatus(data.paymentStatus);
      } catch (err) {
        console.error('Failed to load order detail', err);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const handleUpdateStatus = async () => {
    if (!id) return;
    setUpdating(true);
    setSuccessMsg(false);
    try {
      const updated = await adminService.updateOrderStatus(id, {
        orderStatus,
        paymentStatus
      });
      setOrder(updated);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickConfirmCod = async () => {
    if (!id) return;
    setUpdating(true);
    try {
      const updated = await adminService.updateOrderStatus(id, {
        orderStatus: 'CONFIRMED',
        paymentStatus: 'COD_CONFIRMED'
      });
      setOrder(updated);
      setOrderStatus('CONFIRMED');
      setPaymentStatus('COD_CONFIRMED');
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err: any) {
      alert('Failed to confirm COD order');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-400">Loading order...</div>;
  }

  if (!order) {
    return (
      <div className="p-12 text-center">
        <AlertCircle size={36} className="mx-auto text-slate-300 mb-2" />
        <p className="text-sm font-bold text-slate-700">Order not found</p>
        <Link to="/admin/orders" className="text-xs text-brand-700 underline mt-2 block">Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={16} /> Back to All Orders
      </Link>

      {/* Top Banner */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Order Reference</span>
          <h1 className="text-2xl font-serif font-bold text-slate-900 font-mono">#{order.orderNumber}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {order.paymentMethod === 'COD_WHATSAPP' && order.paymentStatus === 'COD_PENDING' && (
            <button
              onClick={handleQuickConfirmCod}
              disabled={updating}
              className="px-4 py-2 bg-green-700 text-white rounded-xl text-xs font-bold hover:bg-green-800 transition-colors shadow-xs"
            >
              Confirm COD Order
            </button>
          )}

          <a
            href={`https://wa.me/91${order.customerPhone}?text=${encodeURIComponent(`Hello ${order.customerName}, this is regarding your Varsha Ayurveda order #${order.orderNumber}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-whatsapp text-white rounded-xl text-xs font-bold hover:bg-whatsapp-dark transition-colors shadow-xs"
          >
            <MessageCircle size={15} /> Message Customer
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items and Pricing */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
              Purchased Formulations ({order.items?.length})
            </h2>

            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">{item.productName}</span>
                    <span className="text-slate-400">Unit Price: ₹{item.price} × {item.quantity} units</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">₹{item.total}</span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee</span>
                <span>{order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Amount</span>
                <span className="text-brand-900">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
              Shipping & Customer Info
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-500 uppercase block mb-1">Customer Details</span>
                <p className="font-bold text-slate-800 text-sm">{order.customerName}</p>
                <p className="text-slate-600 flex items-center gap-1.5 mt-1"><Mail size={13} /> {order.customerEmail}</p>
                <p className="text-slate-600 flex items-center gap-1.5 mt-0.5"><Phone size={13} /> {order.customerPhone}</p>
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase block mb-1">Delivery Destination</span>
                <p className="text-slate-700 flex items-start gap-1.5">
                  <MapPin size={14} className="text-brand-700 flex-shrink-0 mt-0.5" />
                  <span>{order.shippingAddress}, {order.city}, {order.state} - {order.pincode}</span>
                </p>
                {order.notes && (
                  <p className="mt-2 text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                    Note: "{order.notes}"
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status Controls */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
              Update Order Status
            </h2>

            {successMsg && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle size={15} /> Status updated successfully!
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Order Fulfillment Status</label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="COD_PENDING">COD PENDING</option>
                  <option value="COD_CONFIRMED">COD CONFIRMED</option>
                  <option value="FAILED">FAILED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>

              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                className="w-full bg-brand-800 text-white font-bold py-2.5 rounded-xl hover:bg-brand-900 transition-colors shadow-xs disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Save Status Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
