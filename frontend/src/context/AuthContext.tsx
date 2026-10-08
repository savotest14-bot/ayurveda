import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { authService } from '../services/authService.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; phone?: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('va_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('va_auth_token');
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('va_auth_token');
      if (storedToken) {
        try {
          const profile = await authService.getMe();
          setUser(profile);
          localStorage.setItem('va_user', JSON.stringify(profile));
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const result = await authService.login(credentials);
    setUser(result.user);
    setToken(result.token);
    localStorage.setItem('va_auth_token', result.token);
    localStorage.setItem('va_user', JSON.stringify(result.user));
  };

  const register = async (data: { name: string; email: string; phone?: string; password: string }) => {
    const result = await authService.register(data);
    setUser(result.user);
    setToken(result.token);
    localStorage.setItem('va_auth_token', result.token);
    localStorage.setItem('va_user', JSON.stringify(result.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('va_auth_token');
    localStorage.removeItem('va_user');
  };

  const refreshUser = async () => {
    try {
      const profile = await authService.getMe();
      setUser(profile);
      localStorage.setItem('va_user', JSON.stringify(profile));
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
