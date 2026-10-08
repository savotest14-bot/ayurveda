import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, ArrowLeft } from 'lucide-react';
import { orderService } from '../services/orderService.js';
import { Order } from '../types/index.js';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to fetch customer orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
      case 'CONFIRMED':
        return 'bg-amber-100 text-amber-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-cream min-h-screen py-10 animate-fade-in">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/account" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-brand-800">
            <ArrowLeft size={16} /> Back to My Profile
          </Link>
        </div>

        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-500 text-sm mb-8">View order receipts and track delivery statuses.</p>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-2xl h-28 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 text-sm mb-6">You have not placed any orders with Varsha Ayurveda yet.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-brand-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-900 transition-colors text-sm"
            >
              Start Shopping <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-brand-900 text-base">
                      #{order.orderNumber}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadge(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    {order.items?.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="text-xs text-gray-400 block">Total Amount</span>
                    <span className="text-lg font-bold text-gray-900">₹{order.totalAmount}</span>
                  </div>

                  <Link
                    to={`/account/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-50 text-brand-800 hover:bg-brand-100 rounded-xl text-xs font-bold transition-colors"
                  >
                    Details <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
