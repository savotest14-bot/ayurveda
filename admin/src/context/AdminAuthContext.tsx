import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types/index.js';
import { adminService } from '../services/adminApi.js';

interface AdminAuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('va_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('va_admin_token');
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('va_admin_token');
      if (storedToken) {
        try {
          const profile = await adminService.getMe();
          if (profile.role === 'ADMIN') {
            setAdmin(profile);
            localStorage.setItem('va_admin_user', JSON.stringify(profile));
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const result = await adminService.login(credentials);
    if (result.user.role !== 'ADMIN') {
      throw new Error('Access denied: Admin credentials required.');
    }
    setAdmin(result.user);
    setToken(result.token);
    localStorage.setItem('va_admin_token', result.token);
    localStorage.setItem('va_admin_user', JSON.stringify(result.user));
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('va_admin_token');
    localStorage.removeItem('va_admin_user');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
