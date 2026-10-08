import React, { useEffect, useState } from 'react';
import { Save, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { adminService } from '../services/adminApi.js';
import { SiteSettings } from '../types/index.js';

export const AdminSettingsPage: React.FC = () => {
  const [formData, setFormData] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await adminService.getSettings();
        setFormData(data || {});
      } catch (err) {
        console.error('Failed to load site settings', err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);
    setErrorMsg(null);

    try {
      const updated = await adminService.updateSettings({
        ...formData,
        shippingCharge: Number(formData.shippingCharge),
        freeShippingThreshold: Number(formData.freeShippingThreshold)
      });
      setFormData(updated);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update site settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-400">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-serif font-bold text-slate-900">Site Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Configure global store details, payment gates, and marketing text.</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl flex items-center gap-3 text-xs">
          <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
          <span>Site settings successfully updated! Changes are reflected immediately across the storefront.</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-3 text-xs">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand & Contact Settings */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            1. Store Identity & Contact
          </h2>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Current Brand Logo</p>
              <p className="text-[11px] text-slate-500">Official Varsha Ayurveda logo loaded across storefront and admin</p>
            </div>
            <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
              <img src="/varshalogo.png" alt="Varsha Ayurveda Logo" className="h-8 w-auto object-contain" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Store Name</label>
              <input
                type="text"
                value={formData.storeName || ''}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Store Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official WhatsApp Number (Country code + Number)</label>
              <input
                type="text"
                value={formData.whatsappNumber || ''}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="e.g. 919907303284"
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none font-mono"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-slate-700 mb-1">Physical Store Address</label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none"
            />
          </div>
        </div>

        {/* Shipping & Payment Channels */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            2. Shipping & Payment Gateways
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Standard Delivery Charge (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.shippingCharge ?? 50}
                onChange={(e) => setFormData({ ...formData, shippingCharge: Number(e.target.value) })}
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Free Delivery Cart Threshold (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.freeShippingThreshold ?? 500}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-3 p-3.5 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 text-xs font-bold text-slate-800">
              <input
                type="checkbox"
                checked={formData.codEnabled ?? true}
                onChange={(e) => setFormData({ ...formData, codEnabled: e.target.checked })}
                className="w-4 h-4 text-brand-800 rounded"
              />
              Enable Cash on Delivery (WhatsApp Ordering)
            </label>

            <label className="flex items-center gap-3 p-3.5 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 text-xs font-bold text-slate-800">
              <input
                type="checkbox"
                checked={formData.razorpayEnabled ?? true}
                onChange={(e) => setFormData({ ...formData, razorpayEnabled: e.target.checked })}
                className="w-4 h-4 text-brand-800 rounded"
              />
              Enable Razorpay Gateway (UPI, Cards, Net Banking)
            </label>
          </div>
        </div>

        {/* Marketing & Banner Content */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            3. Banner & Marketing Text
          </h2>

          <div className="text-xs space-y-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Top Announcement Ribbon</label>
              <input
                type="text"
                value={formData.announcementText || ''}
                onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Hero Main Heading Tagline</label>
              <input
                type="text"
                value={formData.heroTagline || ''}
                onChange={(e) => setFormData({ ...formData, heroTagline: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Hero Subtitle</label>
              <textarea
                rows={2}
                value={formData.heroSubtitle || ''}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Footer Brand Statement</label>
              <textarea
                rows={2}
                value={formData.footerText || ''}
                onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-800 text-white rounded-xl text-xs font-bold hover:bg-brand-900 transition-colors shadow-md disabled:opacity-50"
          >
            <Save size={16} /> {saving ? 'Saving Settings...' : 'Save Site Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
