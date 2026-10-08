import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Upload, Trash2, CheckCircle, Image as ImageIcon,
  Save, AlertCircle
} from 'lucide-react';
import { adminService } from '../services/adminApi.js';
import { Category, Product } from '../types/index.js';
import { getImageUrl } from '../utils/imageUrl.js';

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    price: 0,
    compareAtPrice: 0,
    stock: 100,
    sku: '',
    categoryId: undefined as number | undefined,
    featured: false,
    active: true,
    ingredients: '',
    benefits: '',
    usage: '',
    weight: '',
    images: [] as { url: string; altText?: string; isPrimary: boolean; order: number }[]
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const catRes = await adminService.getCategories();
        setCategories(catRes || []);

        if (isEdit && id) {
          const prod: Product = await adminService.getProductById(id);
          setFormData({
            name: prod.name,
            slug: prod.slug,
            shortDescription: prod.shortDescription || '',
            description: prod.description || '',
            price: prod.price,
            compareAtPrice: prod.compareAtPrice || 0,
            stock: prod.stock,
            sku: prod.sku || '',
            categoryId: prod.categoryId || undefined,
            featured: prod.featured,
            active: prod.active,
            ingredients: prod.ingredients || '',
            benefits: prod.benefits || '',
            usage: prod.usage || '',
            weight: prod.weight || '',
            images: prod.images?.map(i => ({
              url: i.url,
              altText: i.altText,
              isPrimary: i.isPrimary,
              order: i.order
            })) || []
          });
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to initialize product form');
      }
    };

    init();
  }, [id, isEdit]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    try {
      const file = e.target.files[0];
      const url = await adminService.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        images: [
          ...prev.images,
          { url, altText: prev.name, isPrimary: prev.images.length === 0, order: prev.images.length }
        ]
      }));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      if (newImages.length > 0 && !newImages.some(i => i.isPrimary)) {
        newImages[0].isPrimary = true;
      }
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    const payload = {
      ...formData,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
      stock: Number(formData.stock),
      categoryId: formData.categoryId ? Number(formData.categoryId) : null
    };

    try {
      if (isEdit && id) {
        await adminService.updateProduct(id, payload);
      } else {
        await adminService.createProduct(payload);
      }
      navigate('/admin/products');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to save product');
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft size={16} /> Back to Products
        </Link>
        <h1 className="text-xl font-serif font-bold text-slate-900">
          {isEdit ? 'Edit Herbal Product' : 'Add New Formulation'}
        </h1>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-3 text-xs">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Details Card */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            1. Core Product Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Name *</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. DRL Strong Mushroom Powder"
                className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Custom Slug (Optional)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="auto-generated-from-title"
                className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={formData.categoryId || ''}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none"
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">SKU / Code</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. VA-DRL-001"
                className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Net Weight / Quantity</label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="e.g. 200g Powder / 60 Caps"
                className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
              <input
                required
                type="number"
                min="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Compare At / MRP (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.compareAtPrice || ''}
                onChange={(e) => setFormData({ ...formData, compareAtPrice: Number(e.target.value) })}
                placeholder="Leave blank if no discount"
                className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Inventory Units in Stock *</label>
              <input
                required
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Brief tagline shown on product cards"
              className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Detailed Description *</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Complete overview of traditional benefits and formulation details..."
              className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none resize-none"
            />
          </div>
        </div>

        {/* Product Images Card */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              2. Product Imagery
            </h2>
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors">
              <Upload size={14} /> {uploadingImage ? 'Uploading...' : 'Upload Image'}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative aspect-square bg-slate-50 rounded-2xl border border-slate-200 p-2 flex flex-col items-center justify-center group overflow-hidden">
                <img
                  src={getImageUrl(img.url)}
                  alt=""
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                    const fallback = (e.target as HTMLElement).nextElementSibling;
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
                <span className="text-xl hidden">🌿</span>

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 text-white">
                  <button
                    type="button"
                    onClick={() => handleSetPrimaryImage(idx)}
                    className={`text-[10px] px-2 py-1 rounded font-bold ${img.isPrimary ? 'bg-green-600' : 'bg-slate-700 hover:bg-slate-600'}`}
                  >
                    {img.isPrimary ? 'Primary Image' : 'Set as Primary'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="text-red-400 hover:text-red-300 text-xs p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {img.isPrimary && (
                  <span className="absolute top-2 left-2 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>

          {formData.images.length === 0 && (
            <p className="text-xs text-slate-400 py-6 text-center border-2 border-dashed border-slate-100 rounded-2xl">
              No images uploaded yet. Click upload to attach product pictures.
            </p>
          )}
        </div>

        {/* Ayurvedic Information Card */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            3. Ayurvedic Specifications
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Botanical Ingredients</label>
            <input
              type="text"
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              placeholder="e.g. Ashwagandha, Safed Musli, Shuddha Shilajit, Gokshura..."
              className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Key Benefits (Separate with semicolons)</label>
            <input
              type="text"
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              placeholder="e.g. Boosts stamina & energy; Enhances immune defense; Rejuvenates vitality"
              className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Dosage & Usage Instructions</label>
            <input
              type="text"
              value={formData.usage}
              onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
              placeholder="e.g. Mix 1 scoop (5-10g) in lukewarm milk twice daily after meals"
              className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none"
            />
          </div>

          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-brand-800 rounded focus:ring-brand-500"
              />
              Feature on Homepage
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 text-brand-800 rounded focus:ring-brand-500"
              />
              Active in Storefront
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3">
          <Link
            to="/admin/products"
            className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-800 text-white rounded-xl text-xs font-bold hover:bg-brand-900 transition-colors shadow-md disabled:opacity-50"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};
