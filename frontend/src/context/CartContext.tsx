import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types/index.js';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('va_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('va_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart', e);
    }
  }, [cart]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
          showToast(`Only ${product.stock} units available in stock`);
          return prev;
        }
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        if (quantity > product.stock) {
          showToast(`Only ${product.stock} units available in stock`);
          return prev;
        }
        return [...prev, { product, quantity }];
      }
    });

    showToast(`Added ${product.name} to cart`);
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          if (newQuantity > item.product.stock) {
            showToast(`Max available stock is ${item.product.stock}`);
            return { ...item, quantity: item.product.stock };
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        toastMessage,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
