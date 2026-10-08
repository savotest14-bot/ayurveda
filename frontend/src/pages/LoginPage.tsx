import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/account';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen py-16 flex items-center justify-center animate-fade-in">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-3 select-none">
              <img
                src="/varshalogo.png"
                alt="Varsha Ayurveda"
                className="h-12 w-auto mx-auto object-contain"
              />
            </Link>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Welcome Back</h1>
            <p className="text-xs text-gray-500 mt-1">Sign in to your Varsha Ayurveda account</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2.5 text-xs">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 bg-gray-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-800 text-white font-bold py-3.5 rounded-xl hover:bg-brand-900 transition-colors shadow-md text-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
            >
              {loading ? 'Signing in...' : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-600">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-brand-800 font-bold hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
