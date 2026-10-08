import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, FolderTree, ShoppingCart,
  Users, BookOpen, MessageSquare, Settings, User, LogOut,
  Menu, X, Leaf, ExternalLink
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext.js';

export const AdminLayout: React.FC = () => {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: ShoppingBag },
    { path: '/admin/categories', label: 'Categories', icon: FolderTree },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/customers', label: 'Customers', icon: Users },
    { path: '/admin/blogs', label: 'Blogs', icon: BookOpen },
    { path: '/admin/messages', label: 'Inquiries', icon: MessageSquare },
    { path: '/admin/settings', label: 'Site Settings', icon: Settings },
    { path: '/admin/profile', label: 'Admin Profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between z-30 sticky top-0">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <img src="/varshalogo.png" alt="Varsha Ayurveda" className="h-8 w-auto object-contain" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
            Admin
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Sidebar Backdrop on Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col z-50 transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-slate-800">
          <Link to="/admin/dashboard" className="block select-none group">
            <img
              src="/logo-white.png"
              alt="Varsha Ayurveda Admin"
              className="h-9 w-auto object-contain mb-1.5 transition-transform duration-200 group-hover:scale-105"
            />
            <span className="inline-block text-[10px] text-brand-400 font-bold uppercase tracking-[0.2em] bg-slate-800/90 px-2 py-0.5 rounded-md border border-slate-700/80">
              Admin Console
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2"><ExternalLink size={14} /> View Storefront</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">5173</span>
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="hidden md:flex bg-white border-b border-slate-200 px-8 py-3.5 items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-base font-bold text-slate-800">
              Admin Control Panel
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-900 block">{admin?.name}</span>
              <span className="text-[10px] text-slate-400 block">{admin?.email}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center text-xs">
              {admin?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
