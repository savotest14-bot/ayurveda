import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Filter, RefreshCw, ShoppingCart } from 'lucide-react';
import { adminService } from '../services/adminApi.js';
import { Order } from '../types/index.js';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await adminService.getOrders({
        search,
        status: statusFilter || undefined,
        paymentStatus: paymentStatusFilter || undefined,
        limit: 50
      });
      setOrders(res.orders || []);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, paymentStatusFilter, paymentMethodFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrders();
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED':
      case 'PROCESSING':
        return 'bg-amber-100 text-amber-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'PAID':
      case 'COD_CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
      case 'REFUNDED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Orders Management</h1>
          <p className="text-xs text-slate-500 mt-1">Review customer purchases, COD orders, and dispatch workflows.</p>
        </div>
        <button
          onClick={loadOrders}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-xs"
        >
          <RefreshCw size={14} /> Refresh List
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-wrap gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-50 rounded-xl px-3.5 py-2 border border-slate-200 w-full sm:w-72">
          <Search size={16} className="text-slate-400 mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID, name, email..."
            className="bg-transparent outline-none text-xs w-full"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
          >
            <option value="">All Order Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
          >
            <option value="">All Payment Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="COD_PENDING">COD PENDING</option>
            <option value="COD_CONFIRMED">COD CONFIRMED</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingCart size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Order ID</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Order Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-900">
                      #{ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(ord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block">{ord.customerName}</span>
                      <span className="text-[11px] text-slate-400">{ord.customerPhone}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ₹{ord.totalAmount}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="text-[10px] text-slate-500 font-medium">
                          {ord.paymentMethod === 'COD_WHATSAPP' ? 'COD (WhatsApp)' : 'Razorpay'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getPaymentBadge(ord.paymentStatus)}`}>
                          {ord.paymentStatus.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getOrderStatusBadge(ord.orderStatus)}`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        to={`/admin/orders/${ord.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-800 rounded-lg font-bold transition-colors"
                      >
                        <Eye size={13} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
