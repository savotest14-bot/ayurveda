import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { CartProvider } from './context/CartContext.js';
import { SettingsProvider } from './context/SettingsContext.js';
import { AppRoutes } from './routes/AppRoutes.js';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
