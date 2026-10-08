import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, ShoppingCart, DollarSign, Package,
  AlertTriangle, Users, MessageSquare, ArrowRight,
  Clock, CheckCircle, CreditCard, RefreshCw
} from 'lucide-react';
import { adminService } from '../services/adminApi.js';
import { DashboardStats } from '../types/index.js';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDashboard();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-brand-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-500 text-sm">Aggregating real-time store analytics...</p>
      </div>
    );
  }

  if (!stats) return null;

  const { overview, charts, recentOrders } = stats;

  return (
    <div className="space-y-8">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-xs text-slate-500 mt-1">Live metrics, inventory status, and sales analytics.</p>
        </div>
        <button
          onClick={fetchStats}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-xs"
        >
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* KPI Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs col-span-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales</span>
            <div className="w-9 h-9 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-slate-900 mt-2">₹{overview.totalRevenue.toLocaleString()}</p>
          <div className="flex gap-4 mt-2 text-xs text-slate-500">
            <span>Online: <strong>₹{overview.razorpayRevenue.toLocaleString()}</strong></span>
            <span>COD: <strong>{overview.codOrders} orders</strong></span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShoppingCart size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{overview.totalOrders}</p>
          <p className="text-[11px] text-slate-400 mt-1">Today: +{overview.todayOrders}</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">{overview.pendingOrders}</p>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting dispatch</p>
        </div>

        {/* Total Products & Low Stock */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Products</span>
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
              <Package size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{overview.totalProducts}</p>
          {overview.lowStockProducts > 0 ? (
            <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
              <AlertTriangle size={11} /> {overview.lowStockProducts} Low Stock
            </p>
          ) : (
            <p className="text-[11px] text-green-600 mt-1">Stock Healthy</p>
          )}
        </div>

        {/* Customers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Customers</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{overview.totalCustomers}</p>
          <p className="text-[11px] text-slate-400 mt-1">Registered users</p>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales & Orders Trend (SVG Bar/Trend chart) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp size={18} className="text-brand-700" /> Revenue & Order Trend
              </h2>
              <p className="text-xs text-slate-400">Aggregated daily performance over past 7 days</p>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-2 pt-8 px-2 border-b border-slate-100">
            {charts.dailyTrends.map((day, idx) => {
              const maxRevenue = Math.max(...charts.dailyTrends.map(d => d.revenue), 1000);
              const heightPct = Math.max(8, Math.round((day.revenue / maxRevenue) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip on hover */}
                  <span className="text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 px-1.5 py-0.5 rounded">
                    ₹{day.revenue}
                  </span>

                  {/* Bar */}
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full max-w-[42px] bg-brand-800 hover:bg-brand-700 rounded-t-lg transition-all relative"
                  >
                    {day.orders > 0 && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-brand-900">
                        {day.orders}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{day.date.split(',')[0]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status & Payment Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Status Distribution</h2>
            <p className="text-xs text-slate-400">Order workflow distribution</p>
          </div>

          <div className="space-y-3">
            {charts.orderStatusDistribution.map((item) => (
              <div key={item.status} className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-700">{item.status}</span>
                <span className="font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full">
                  {item.count}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Channels</h3>
            {charts.paymentMethodDistribution.map((pm) => (
              <div key={pm.method} className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  {pm.method === 'COD_WHATSAPP' ? (
                    <><MessageSquare size={13} className="text-green-600" /> WhatsApp COD</>
                  ) : (
                    <><CreditCard size={13} className="text-blue-600" /> Razorpay</>
                  )}
                </span>
                <span className="font-bold text-slate-900">{pm.count} orders</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best Sellers & Recent Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Best Selling Products */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Top Selling Products</h2>
          <div className="space-y-3">
            {charts.bestSellingProducts.map((prod, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 text-xs">
                <div className="truncate mr-2">
                  <span className="font-bold text-slate-800 block truncate">{prod.name}</span>
                  <span className="text-[11px] text-slate-400">{prod.quantity} units sold</span>
                </div>
                <span className="font-bold text-brand-900 whitespace-nowrap">₹{prod.totalRevenue}</span>
              </div>
            ))}
            {charts.bestSellingProducts.length === 0 && (
              <p className="text-xs text-slate-400 py-4 text-center">No sales recorded yet.</p>
            )}
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-brand-700 font-bold hover:underline">
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-mono font-bold text-slate-900">#{ord.orderNumber}</td>
                    <td className="py-3 text-slate-700">{ord.customerName}</td>
                    <td className="py-3 font-bold text-slate-900">₹{ord.totalAmount}</td>
                    <td className="py-3 text-slate-500">
                      {ord.paymentMethod === 'COD_WHATSAPP' ? 'COD (WhatsApp)' : 'Razorpay'}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/admin/orders/${ord.id}`}
                        className="text-brand-700 font-bold hover:text-brand-900"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
