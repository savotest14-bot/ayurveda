import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, X, Plus, Minus, Trash2, ShoppingBag,
  MessageCircle, ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { useSettings } from '../context/SettingsContext.js';
import { getImageUrl } from '../utils/imageUrl.js';

export const CartSidebar: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart, isCartOpen, setIsCartOpen,
    updateCartQuantity, removeFromCart, getCartTotal
  } = useCart();
  const { settings } = useSettings();

  const whatsappNum = settings?.whatsappNumber || '919907303284';

  const handleWhatsAppQuickCheckout = () => {
    if (cart.length === 0) return;

    let text = `🌿 *VARSHA AYURVEDA - ORDER INQUIRY*\n\n`;
    cart.forEach(item => {
      text += `• ${item.product.name}\n  Qty: ${item.quantity} × ₹${item.product.price} = ₹${item.product.price * item.quantity}\n\n`;
    });

    const total = getCartTotal();
    text += `*Subtotal:* ₹${total}\n\n`;
    text += `Please share payment and delivery details. Thank you!`;

    const url = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 transition-opacity backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-brand-50">
          <h2 className="text-xl font-serif font-bold text-brand-900 flex items-center gap-2">
            <ShoppingCart size={22} /> Your Cart
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-white rounded-full text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-cream">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
              <ShoppingBag className="w-16 h-16 text-gray-300" />
              <p className="text-lg">Your cart is currently empty.</p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }}
                className="text-brand-800 font-bold hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map(item => {
              const primaryImage = item.product.images?.find(i => i.isPrimary)?.url || item.product.images?.[0]?.url || '/images/mushroom-powder.png';

              return (
                <div
                  key={item.product.id}
                  className="flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm relative group"
                >
                  <div className="w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0 p-1 flex items-center justify-center overflow-hidden">
                    <img
                      src={getImageUrl(primaryImage)}
                      alt={item.product.name}
                      className="max-h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/mushroom-powder.png';
                      }}
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm leading-tight pr-6">
                        {item.product.name}
                      </h3>
                      <p className="font-bold text-brand-800 mt-1">₹{item.product.price}</p>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-gray-50 text-gray-600"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-gray-50 text-gray-600"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] space-y-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-600 font-medium">Subtotal</span>
              <span className="text-2xl font-bold text-gray-900">₹{getCartTotal()}</span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-brand-800 text-white font-bold py-3.5 rounded-xl hover:bg-brand-900 transition-all shadow-md flex items-center justify-center gap-2 text-base"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <button
              onClick={handleWhatsAppQuickCheckout}
              className="w-full bg-whatsapp text-white font-bold py-3 rounded-xl hover:bg-whatsapp-dark transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
            >
              <MessageCircle size={18} /> Order on WhatsApp
            </button>

            <p className="text-center text-xs text-gray-500">
              Safe & authentic Ayurvedic wellness direct to your doorstep
            </p>
          </div>
        )}
      </div>
    </>
  );
};
