import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck, CreditCard, MessageCircle, ArrowRight,
  ShoppingBag, CheckCircle, AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';
import { useSettings } from '../context/SettingsContext.js';
import { orderService, CheckoutPayload } from '../services/orderService.js';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    shippingAddress: '',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    pincode: '462001',
    notes: '',
    paymentMethod: 'COD_WHATSAPP' as 'COD_WHATSAPP' | 'RAZORPAY'
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pre-fill user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: prev.customerName || user.name,
        customerEmail: prev.customerEmail || user.email,
        customerPhone: prev.customerPhone || user.phone || ''
      }));
    }
  }, [user]);

  // Load Razorpay Script dynamically
  useEffect(() => {
    if (!document.getElementById('razorpay-script')) {
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center animate-fade-in">
        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-serif font-bold text-gray-800 mb-2">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-6">Please add items to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="px-6 py-3 bg-brand-800 text-white rounded-xl font-bold hover:bg-brand-900 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const freeThreshold = settings?.freeShippingThreshold || 500;
  const standardShipping = settings?.shippingCharge || 50;
  const shippingCharge = subtotal >= freeThreshold ? 0 : standardShipping;
  const total = subtotal + shippingCharge;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const payload: CheckoutPayload = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      shippingAddress: formData.shippingAddress,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      notes: formData.notes,
      paymentMethod: formData.paymentMethod,
      items: cart.map(i => ({ productId: i.product.id, quantity: i.quantity }))
    };

    try {
      if (formData.paymentMethod === 'COD_WHATSAPP') {
        // Cash on Delivery via WhatsApp
        const result = await orderService.createCodOrder(payload);
        clearCart();

        // Open WhatsApp with prefilled order text
        if (result.whatsappUrl) {
          window.open(result.whatsappUrl, '_blank');
        }

        navigate(`/order-success/${result.order.orderNumber}`);
      } else {
        // Razorpay Payment Flow
        const result = await orderService.createRazorpayOrder(payload);
        const { order, razorpayOrder } = result;

        if (!window.Razorpay) {
          throw new Error('Razorpay payment gateway failed to load. Please try COD or reload the page.');
        }

        const options = {
          key: razorpayOrder.key,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: settings?.storeName || 'Varsha Ayurveda',
          description: `Order #${order.orderNumber}`,
          image: '/favicon.svg',
          order_id: razorpayOrder.id,
          handler: async function (response: any) {
            try {
              // Verify signature securely on backend
              await orderService.verifyRazorpayPayment({
                orderId: order.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              });

              clearCart();
              navigate(`/order-success/${order.orderNumber}`);
            } catch (verifErr: any) {
              setErrorMessage(verifErr.response?.data?.message || 'Payment signature verification failed.');
            }
          },
          prefill: {
            name: formData.customerName,
            email: formData.customerEmail,
            contact: formData.customerPhone
          },
          theme: {
            color: '#166534'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (failResponse: any) {
          setErrorMessage(`Payment failed: ${failResponse.error?.description || 'Transaction cancelled'}`);
          setLoading(false);
        });
        rzp.open();
        setLoading(false);
      }
    } catch (err: any) {
      setLoading(false);
      const msg = err.response?.data?.message || err.message || 'Failed to place order. Please check inputs.';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="bg-cream min-h-screen py-10 animate-fade-in">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-500 mb-8 text-sm">Please enter your shipping address and choose your payment method.</p>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-3">
            <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form & Payment Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact & Address Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">1. Delivery Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    required
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Recipient's name"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-300 outline-none text-sm bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    required
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-300 outline-none text-sm bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                <input
                  required
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  placeholder="Order receipt will be sent here"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-300 outline-none text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Street Address & Landmark *</label>
                <textarea
                  required
                  rows={3}
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  placeholder="House/Flat number, building, street, colony..."
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-300 outline-none text-sm bg-gray-50 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City *</label>
                  <input
                    required
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">State *</label>
                  <input
                    required
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pincode *</label>
                  <input
                    required
                    type="text"
                    name="pincode"
                    pattern="\d{6}"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="6 digits"
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Delivery Notes (Optional)</label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Special instructions or delivery timing preferences"
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm bg-gray-50"
                />
              </div>
            </div>

            {/* Payment Method Selection Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">2. Payment Method</h2>

              <div className="space-y-3">
                {/* Cash on Delivery (WhatsApp) */}
                {settings?.codEnabled !== false && (
                  <label
                    className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === 'COD_WHATSAPP'
                        ? 'border-brand-800 bg-brand-50/50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD_WHATSAPP"
                      checked={formData.paymentMethod === 'COD_WHATSAPP'}
                      onChange={() => setFormData(p => ({ ...p, paymentMethod: 'COD_WHATSAPP' }))}
                      className="mt-1 text-brand-800 focus:ring-brand-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-gray-900">
                        <MessageCircle size={20} className="text-whatsapp" />
                        <span>Cash on Delivery (WhatsApp Order)</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Pay in cash upon doorstep delivery. Instantly connects with our official WhatsApp number for swift order confirmation.
                      </p>
                    </div>
                  </label>
                )}

                {/* Razorpay Online */}
                {settings?.razorpayEnabled !== false && (
                  <label
                    className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === 'RAZORPAY'
                        ? 'border-brand-800 bg-brand-50/50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="RAZORPAY"
                      checked={formData.paymentMethod === 'RAZORPAY'}
                      onChange={() => setFormData(p => ({ ...p, paymentMethod: 'RAZORPAY' }))}
                      className="mt-1 text-brand-800 focus:ring-brand-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-gray-900">
                        <CreditCard size={20} className="text-brand-800" />
                        <span>Online Payment (Razorpay - UPI / Cards / Net Banking)</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Fast, encrypted payment via Google Pay, PhonePe, Paytm, Credit/Debit cards, or Net Banking.
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary & Final Submit */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm h-fit space-y-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 pb-3 border-b border-gray-100">
              Your Order
            </h2>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.product.id} className="flex justify-between items-center text-sm gap-2">
                  <div className="flex-1 truncate">
                    <span className="font-medium text-gray-800">{item.product.name}</span>
                    <span className="text-xs text-gray-400 block">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-bold text-gray-900">₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600 items-center">
                <span>Delivery Charges</span>
                <span>
                  {shippingCharge === 0 ? (
                    <span className="text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded text-xs">FREE</span>
                  ) : (
                    <span className="font-bold text-gray-900">₹{shippingCharge}</span>
                  )}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                <span className="text-base font-bold text-gray-900">Total Payable</span>
                <span className="text-2xl font-bold text-brand-900">₹{total}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-800 text-white font-bold py-4 rounded-xl hover:bg-brand-900 transition-all shadow-md flex items-center justify-center gap-2 text-base disabled:opacity-50"
            >
              {loading ? (
                <span>Processing Order...</span>
              ) : formData.paymentMethod === 'COD_WHATSAPP' ? (
                <><MessageCircle size={18} /> Place Order via WhatsApp</>
              ) : (
                <><ShieldCheck size={18} /> Pay ₹{total} via Razorpay</>
              )}
            </button>

            <div className="text-xs text-gray-400 text-center space-y-1">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck size={14} className="text-brand-700" /> 100% Encrypted & Safe Checkout
              </p>
              <p>Ayurvedic wellness formulated with purity & care.</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
