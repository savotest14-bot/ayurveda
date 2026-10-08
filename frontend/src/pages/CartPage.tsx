import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Plus, Minus, Trash2, ArrowRight,
  ShieldCheck, Leaf
} from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { useSettings } from '../context/SettingsContext.js';
import { getImageUrl } from '../utils/imageUrl.js';

export const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const freeThreshold = settings?.freeShippingThreshold || 500;
  const standardShipping = settings?.shippingCharge || 50;
  const shippingCharge = subtotal >= freeThreshold ? 0 : standardShipping;
  const total = subtotal + shippingCharge;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
          <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Explore our range of authentic Ayurvedic powders, capsules, and wellness formulations.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-brand-800 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-brand-900 transition-colors shadow-md"
        >
          Explore Herbal Shop <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-10 animate-fade-in">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">
          Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const primaryImage =
                item.product.images?.find(i => i.isPrimary)?.url ||
                item.product.images?.[0]?.url ||
                '/images/mushroom-powder.png';

              return (
                <div
                  key={item.product.id}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-5 relative"
                >
                  <Link
                    to={`/shop/${item.product.slug}`}
                    className="w-24 h-24 bg-cream rounded-xl p-2 flex items-center justify-center flex-shrink-0"
                  >
                    <img
                      src={getImageUrl(primaryImage)}
                      alt={item.product.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/mushroom-powder.png';
                      }}
                    />
                  </Link>

                  <div className="flex-1 text-center sm:text-left">
                    <Link
                      to={`/shop/${item.product.slug}`}
                      className="text-base font-bold text-gray-900 hover:text-brand-800 transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.product.category?.name || 'Ayurvedic Preparation'}
                    </p>
                    <p className="text-base font-bold text-brand-900 mt-2">
                      ₹{item.product.price}
                    </p>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="px-3 py-2 hover:bg-gray-50 text-gray-600"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-50 text-gray-600"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right min-w-[80px]">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}

            {/* Threshold Notice */}
            {subtotal < freeThreshold && (
              <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 text-xs text-brand-800 flex items-center gap-2">
                <Leaf size={16} />
                <span>
                  Add items worth <strong>₹{freeThreshold - subtotal}</strong> more to qualify for <strong>FREE Delivery</strong>!
                </span>
              </div>
            )}
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm h-fit space-y-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 pb-4 border-b border-gray-100">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivery Charge</span>
                <span>
                  {shippingCharge === 0 ? (
                    <span className="text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded">FREE</span>
                  ) : (
                    <span className="font-bold text-gray-900">₹{shippingCharge}</span>
                  )}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                <span className="text-base font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-brand-900">₹{total}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-brand-800 text-white font-bold py-4 rounded-xl hover:bg-brand-900 transition-all shadow-md flex items-center justify-center gap-2 text-base"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <div className="pt-2 text-xs text-gray-400 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-brand-700" />
                <span>100% Secure Checkout & Original Formulations</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf size={16} className="text-brand-700" />
                <span>Dispatched directly from Bhopal Ayurvedic facility</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
