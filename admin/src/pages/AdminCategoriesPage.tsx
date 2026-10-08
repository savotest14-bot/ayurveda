import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Upload, Check, X, FolderTree, AlertCircle } from 'lucide-react';
import { adminService } from '../services/adminApi.js';
import { Category } from '../types/index.js';
import { getImageUrl } from '../utils/imageUrl.js';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    sortOrder: 0,
    active: true
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      sortOrder: categories.length + 1,
      active: true
    });
    setShowModal(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image || '',
      sortOrder: cat.sortOrder,
      active: cat.active
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const url = await adminService.uploadImage(e.target.files[0]);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err) {
      alert('Failed to upload category image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCategory) {
        await adminService.updateCategory(editingCategory.id, formData);
      } else {
        await adminService.createCategory(formData);
      }
      setShowModal(false);
      loadCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete category "${name}"? Products in this category will become uncategorized.`)) return;
    try {
      await adminService.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Category Management</h1>
          <p className="text-xs text-slate-500 mt-1">Organize herbal product collections and display order.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-800 text-white rounded-xl text-xs font-bold hover:bg-brand-900 transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <FolderTree size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">No categories found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Sort Order</th>
                  <th className="py-3.5 px-4">Products</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cream rounded-xl p-1 flex items-center justify-center flex-shrink-0 border border-slate-100 overflow-hidden relative">
                          {cat.image ? (
                            <img
                              src={getImageUrl(cat.image)}
                              alt={cat.name}
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                                const fallback = (e.target as HTMLElement).nextElementSibling;
                                if (fallback) fallback.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <span className={`text-sm ${cat.image ? 'hidden' : ''}`}>🌿</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{cat.name}</span>
                          <span className="text-[11px] text-slate-400 line-clamp-1">{cat.description || 'No description'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{cat.slug}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{cat.sortOrder}</td>
                    <td className="py-3.5 px-4 font-bold text-brand-800">
                      {cat._count?.products || 0} products
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        cat.active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {cat.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 text-slate-500 hover:text-brand-800 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none"
                  placeholder="e.g. Herbal Powders"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Custom Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none"
                  placeholder="auto-generated-if-empty"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none resize-none"
                  placeholder="Brief overview of this category"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category Image</label>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold w-full justify-center">
                    <Upload size={14} /> {uploading ? 'Uploading...' : 'Choose File'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                </div>
              </div>

              {formData.image && (
                <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <img
                    src={getImageUrl(formData.image)}
                    alt=""
                    className="w-10 h-10 object-contain rounded"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="text-[10px] text-slate-500 truncate flex-1">{formData.image}</span>
                  <button type="button" onClick={() => setFormData(p => ({ ...p, image: '' }))} className="text-red-500">
                    <X size={14} />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="catActive"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-brand-800 rounded"
                />
                <label htmlFor="catActive" className="font-bold text-slate-800 cursor-pointer">
                  Visible in Navigation & Shop
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-brand-800 text-white rounded-xl font-bold hover:bg-brand-900"
                >
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
