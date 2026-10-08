import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Search, Edit2, Trash2, Check, X,
  Package, AlertTriangle, ArrowUpDown
} from 'lucide-react';
import { adminService } from '../services/adminApi.js';
import { Product, Category } from '../types/index.js';
import { getImageUrl } from '../utils/imageUrl.js';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        adminService.getProducts({ search, category: selectedCat || undefined }),
        adminService.getCategories()
      ]);
      setProducts(prodRes.products || []);
      setCategories(catRes || []);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCat]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await adminService.updateProduct(product.id, { active: !product.active });
      setProducts(prev =>
        prev.map(p => (p.id === product.id ? { ...p, active: !p.active } : p))
      );
    } catch (err) {
      alert('Failed to update product active status');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await adminService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & New Product CTA */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Products Management</h1>
          <p className="text-xs text-slate-500 mt-1">Manage herbal catalog, stock inventory, and pricing.</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-800 text-white rounded-xl text-xs font-bold hover:bg-brand-900 transition-colors shadow-sm"
        >
          <Plus size={16} /> Add New Product
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-50 rounded-xl px-3.5 py-2 border border-slate-200 w-full sm:w-80">
          <Search size={16} className="text-slate-400 mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, SKU, or ingredients..."
            className="bg-transparent outline-none text-xs w-full"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading catalog...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">No products found</p>
            <p className="text-xs text-slate-400 mt-1">Create your first product to populate the catalog.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const img = p.images?.find(i => i.isPrimary)?.url || p.images?.[0]?.url || '/images/mushroom-powder.png';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-cream rounded-xl p-1 flex items-center justify-center flex-shrink-0 border border-slate-100 overflow-hidden relative">
                            <img
                              src={getImageUrl(img)}
                              alt={p.name}
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                                const fallback = (e.target as HTMLElement).nextElementSibling;
                                if (fallback) fallback.classList.remove('hidden');
                              }}
                            />
                            <span className="text-sm hidden">🌿</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{p.name}</span>
                            <span className="text-[11px] text-slate-400 font-mono">SKU: {p.sku || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {p.category?.name || 'Uncategorized'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900">₹{p.price}</span>
                        {p.compareAtPrice && (
                          <span className="text-slate-400 line-through block text-[10px]">₹{p.compareAtPrice}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {p.stock <= 10 ? (
                          <span className="inline-flex items-center gap-1 font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded text-[11px]">
                            <AlertTriangle size={11} /> {p.stock} units
                          </span>
                        ) : (
                          <span className="font-semibold text-slate-700">{p.stock} units</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleActive(p)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 transition-colors ${
                            p.active
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {p.active ? <Check size={10} /> : <X size={10} />}
                          {p.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/${p.id}/edit`}
                            className="p-1.5 text-slate-500 hover:text-brand-800 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
