import React, { useEffect, useState } from 'react';
import { Search, Users, Check, X } from 'lucide-react';
import { adminService } from '../services/adminApi.js';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCustomers({ search });
      setCustomers(res.customers || []);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleToggleStatus = async (customer: any) => {
    try {
      await adminService.toggleCustomerStatus(customer.id, !customer.isActive);
      setCustomers(prev =>
        prev.map(c => (c.id === customer.id ? { ...c, isActive: !c.isActive } : c))
      );
    } catch (err) {
      alert('Failed to update customer status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Customers</h1>
          <p className="text-xs text-slate-500 mt-1">Registered clients, purchase histories, and activity statuses.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <form onSubmit={(e) => { e.preventDefault(); loadCustomers(); }} className="flex items-center bg-slate-50 rounded-xl px-3.5 py-2 border border-slate-200 max-w-sm">
          <Search size={16} className="text-slate-400 mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="bg-transparent outline-none text-xs w-full"
          />
        </form>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Total Orders</th>
                  <th className="py-3.5 px-4">Total Spent</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                  <th className="py-3.5 px-6 text-right">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{c.name}</span>
                          <span className="text-[11px] text-slate-400">{c.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {c.phone || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {c.ordersCount} orders
                    </td>
                    <td className="py-3.5 px-4 font-bold text-brand-800">
                      ₹{c.totalSpent.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => handleToggleStatus(c)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 transition-colors ${
                          c.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {c.isActive ? <Check size={10} /> : <X size={10} />}
                        {c.isActive ? 'Active' : 'Disabled'}
                      </button>
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
