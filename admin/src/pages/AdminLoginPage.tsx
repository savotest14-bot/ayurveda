import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext.js';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState('admin@varshaayurveda.in');
  const [password, setPassword] = useState('Admin@12345');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <img
            src="/varshalogo.png"
            alt="Varsha Ayurveda"
            className="h-14 w-auto mx-auto mb-4 object-contain"
          />
          <h1 className="text-2xl font-serif font-bold text-slate-900">Admin Portal</h1>
          <p className="text-xs text-slate-500 mt-1">Management & Store Control Dashboard</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2.5 text-xs">
            <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Admin Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-400 bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-400 bg-slate-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-800 text-white font-bold py-3.5 rounded-xl hover:bg-brand-900 transition-colors shadow-md text-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
          >
            {loading ? 'Authenticating...' : <>Login to Admin <ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Seed default: <span className="font-mono text-slate-600">admin@varshaayurveda.in / Admin@12345</span>
          </p>
        </div>
      </div>
    </div>
  );
};
