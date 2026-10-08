import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Navigation } from '../components/Navigation.js';
import { CartSidebar } from '../components/CartSidebar.js';
import { Footer } from '../components/Footer.js';
import { WhatsAppWidget } from '../components/WhatsAppWidget.js';
import { useCart } from '../context/CartContext.js';

export const MainLayout: React.FC = () => {
  const { pathname } = useLocation();
  const { toastMessage } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <div className="font-sans text-gray-800 flex flex-col min-h-screen bg-cream">
      <Navigation />
      <CartSidebar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
      <WhatsAppWidget />

      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 md:bottom-6 md:left-6 md:right-auto bg-brand-900 text-white px-5 py-3.5 rounded-xl shadow-2xl z-50 animate-fade-in-up flex items-center gap-3">
          <CheckCircle size={18} className="text-brand-400" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
