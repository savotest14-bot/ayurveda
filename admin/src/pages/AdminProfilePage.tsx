import React, { useState } from 'react';
import { User, Lock, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext.js';
import { adminService } from '../services/adminApi.js';

export const AdminProfilePage: React.FC = () => {
  const { admin } = useAdminAuth();

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);
    setErrorMsg(null);

    try {
      await adminService.changePassword(passwordData);
      setSuccessMsg(true);
      setPasswordData({ currentPassword: '', newPassword: '' });
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update admin password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-serif font-bold text-slate-900">Admin Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Manage system credentials and administrative access.</p>
      </div>

      {/* Admin Profile Overview */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-800 flex items-center justify-center text-xl font-bold font-serif">
          {admin?.name?.charAt(0) || 'A'}
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">{admin?.name}</h2>
          <p className="text-xs text-slate-500">{admin?.email}</p>
          <span className="mt-2 inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
            ROLE: {admin?.role}
          </span>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
          <Lock size={16} className="text-brand-800" /> Security & Password
        </h2>

        {successMsg && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle size={15} /> Admin password updated successfully!
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={15} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Current Password *</label>
            <input
              required
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">New Password (Min 6 chars) *</label>
            <input
              required
              type="password"
              minLength={6}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-800 text-white rounded-xl font-bold hover:bg-brand-900 transition-colors disabled:opacity-50"
          >
            <Save size={15} /> {saving ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
