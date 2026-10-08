import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Package, LogOut, Lock, CheckCircle,
  AlertCircle, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { authService } from '../services/authService.js';

export const AccountPage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess(false);

    try {
      await authService.updateProfile(profileData);
      await refreshUser();
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordSuccess(false);
    setPasswordError(null);

    try {
      await authService.changePassword(passwordData);
      setPasswordSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '' });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-cream min-h-screen py-10 animate-fade-in">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">My Account</h1>
            <p className="text-xs text-gray-500 mt-1">Manage your wellness account and order history</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Quick Profile & Navigation */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center">
              <div className="w-20 h-20 bg-brand-50 text-brand-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-100">
                <User size={36} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
              {user.phone && <p className="text-xs text-gray-500 mt-1">📞 {user.phone}</p>}

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs font-semibold text-brand-700">
                <Shield size={14} /> Account Role: {user.role}
              </div>
            </div>

            {/* Quick Action Navigation */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2">
              <Link
                to="/account/orders"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-50 text-gray-700 hover:text-brand-800 transition-colors font-medium text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Package size={18} className="text-brand-700" />
                  <span>My Orders</span>
                </div>
                <span className="text-xs text-gray-400">View All →</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Edit Profile & Change Password */}
          <div className="md:col-span-2 space-y-6">
            {/* Edit Profile Form */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-serif font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Personal Information
              </h2>

              {profileSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle size={16} /> Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-brand-300 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-brand-300 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    disabled
                    type="email"
                    value={user.email}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Email cannot be changed.</p>
                </div>

                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-6 py-2.5 bg-brand-800 text-white font-bold rounded-xl text-sm hover:bg-brand-900 transition-colors shadow-sm disabled:opacity-50"
                >
                  {profileSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-serif font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <Lock size={18} className="text-brand-800" /> Change Password
              </h2>

              {passwordSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle size={16} /> Password updated successfully!
                </div>
              )}

              {passwordError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle size={16} /> {passwordError}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Current Password</label>
                    <input
                      required
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-brand-300 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">New Password</label>
                    <input
                      required
                      type="password"
                      minLength={6}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Minimum 6 characters"
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-brand-300 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="px-6 py-2.5 bg-gray-800 text-white font-bold rounded-xl text-sm hover:bg-black transition-colors shadow-sm disabled:opacity-50"
                >
                  {passwordSaving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
