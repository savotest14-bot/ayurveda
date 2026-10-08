import React, { useState, createContext, useContext, useEffect, useRef } from 'react';
import {
  ShoppingCart, Menu, X, Search, Phone, MapPin,
  Mail, ChevronRight, Leaf, ShieldCheck, Heart,
  Plus, Minus, Trash2, ArrowRight, CheckCircle, MessageCircle,
  ShoppingBag, Star, User, Eye, Globe, Send, ExternalLink, Play
} from 'lucide-react';


const BRAND_WHATSAPP = "919907303284";

const PRODUCTS = [
  {
    id: 1,
    name: "DRL Strong Mushroom Powder",
    shortName: "DRL Strong Mushroom Powder",
    price: 360,
    originalPrice: 450,
    category: "Herbal Powders",
    image: "/images/mushroom-powder.png",
    description: "Ayurvedic powder for daily energy and nutrition support.",
    longDescription: "A perfect blend of Ayurvedic herbs, Mushrooms & Natural Nutrition to support healthy weight gain and overall wellness."
  },
  {
    id: 2,
    name: "Pilo CARE Capsule",
    shortName: "Pilo Care Capsule",
    price: 320,
    originalPrice: 400,
    category: "Capsules",
    image: "/images/pilo-care.png",
    description: "Ayurvedic wellness support for daily comfort.",
    longDescription: "Ayurvedic wellness support for daily comfort. Helps in reducing discomfort and supports healthy digestion."
  },
  {
    id: 3,
    name: "Strong Stone Remover",
    shortName: "Strong Stone Remover",
    price: 505,
    originalPrice: 630,
    category: "Ayurvedic Wellness",
    image: "/images/stone-remover.png",
    description: "Ayurvedic support for kidney & urinary wellness.",
    longDescription: "Ayurvedic support for kidney & urinary wellness. Helps maintain a healthy urinary tract and detoxifies."
  },
  {
    id: 4,
    name: "DRL Musli + Shilajit Powder",
    shortName: "DRL Musli + Shilajit Powder",
    price: 495,
    originalPrice: 660,
    category: "Energy & Stamina",
    image: "/images/musli-shilajit.png",
    description: "Natural energy, stamina & vitality support.",
    longDescription: "Natural energy, stamina & vitality support. Formulated with premium Ayurvedic herbs for daily power."
  }
];

const CATEGORIES = [
  { name: "Ayurvedic Wellness", image: "/images/cat-ayurvedic-wellness.svg" },
  { name: "Herbal Powders", image: "/images/cat-herbal-powders.jpg" },
  { name: "Capsules", image: "/images/cat-capsules.jpg" },
  { name: "Daily Wellness", image: "/images/cat-daily-wellness.jpg" },
  { name: "Energy & Stamina", image: "/images/cat-energy-stamina.svg" },
  { name: "Other Products", image: "/images/cat-other-products.svg" },
];

const BLOGS = [
  {
    id: 1,
    title: "Ayurveda and Everyday Wellness",
    date: "Apr 12, 2026",
    image: "/images/blog-wellness.png",
    excerpt: "Discover how ancient Ayurvedic practices can transform your daily wellness routine with natural remedies."
  },
  {
    id: 2,
    title: "Understanding Herbal Ingredients",
    date: "Apr 8, 2026",
    image: "/images/blog-herbal.png",
    excerpt: "Learn about the powerful herbs behind our formulations and their traditional healing properties."
  },
  {
    id: 3,
    title: "Building a Healthy Daily Routine",
    date: "Apr 5, 2026",
    image: "/images/blog-routine.png",
    excerpt: "Simple steps to incorporate Ayurvedic wisdom into your modern daily life for lasting health benefits."
  }
];

interface AppContextType {
  currentView: string;
  navigate: (view: string) => void;
  cart: { product: typeof PRODUCTS[0]; quantity: number }[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: typeof PRODUCTS[0], quantity?: number) => void;
  updateCartQuantity: (productId: number, newQuantity: number) => void;
  removeFromCart: (productId: number) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toastMessage: string | null;
}

const AppContext = createContext<AppContextType | null>(null);
const useAppContext = () => useContext(AppContext)!;

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState('home');
  const [cart, setCart] = useState<{ product: typeof PRODUCTS[0]; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const navigate = (view: string) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addToCart = (product: typeof PRODUCTS[0], quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.name} to cart`);
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(prev => prev.map(item =>
      item.product.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const getCartTotal = () => cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const getCartCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppContext.Provider value={{
      currentView, navigate,
      cart, isCartOpen, setIsCartOpen, addToCart, updateCartQuantity, removeFromCart, getCartTotal, getCartCount,
      isMobileMenuOpen, setIsMobileMenuOpen,
      toastMessage
    }}>
      {children}
    </AppContext.Provider>
  );
};

/* =========================================
   NAVIGATION
   ========================================= */
const Navigation = () => {
  const {
    currentView, navigate, getCartCount,
    isCartOpen, setIsCartOpen,
    isMobileMenuOpen, setIsMobileMenuOpen
  } = useAppContext();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'about', label: 'About Us' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <header className={`sticky top-0 z-40 bg-white transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
        {/* Top Bar */}
        <div className="bg-brand-950 text-brand-100 text-xs py-2">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-4 font-medium tracking-wide">
              <span className="hidden sm:inline">Natural Ayurvedic Wellness Products</span>
              <span className="hidden sm:inline text-brand-400">|</span>
              <span>Order Online</span>
              <span className="text-brand-400">|</span>
              <span>WhatsApp Support</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-brand-200">
              <a href={`tel:+${BRAND_WHATSAPP}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone size={12} /> 9907303284
              </a>
              <span className="flex items-center gap-1.5">
                <MapPin size={12} /> Berasia Road, Bhopal
              </span>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className="container mx-auto px-4 md:px-8 py-3 flex items-center justify-between border-b border-brand-50">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer select-none group py-0.5"
            onClick={() => navigate('home')}
          >
            <img
              src="/varshalogo.png"
              alt="Varsha Ayurveda"
              className="h-10 md:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7 font-medium text-gray-600 text-[15px]">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => navigate(link.id)}
                className={`relative py-2 hover:text-brand-800 transition-colors ${currentView === link.id ? 'text-brand-800 font-bold' : ''}`}
              >
                {link.label}
                {currentView === link.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-800 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Search + Icons */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-100 focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
              <Search size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent outline-none text-sm text-gray-700 w-40 placeholder-gray-400"
              />
            </div>
            <button className="hidden md:block text-gray-500 hover:text-brand-800 transition-colors p-2">
              <User size={22} />
            </button>
            <button className="hidden md:block text-gray-500 hover:text-red-500 transition-colors p-2">
              <Heart size={22} />
            </button>
            <button
              className="relative hover:text-brand-800 transition-colors text-gray-600 p-2"
              onClick={() => setIsCartOpen(!isCartOpen)}
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={22} />
              {getCartCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-800 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                  {getCartCount()}
                </span>
              )}
            </button>
            <button
              className="lg:hidden text-brand-900 hover:text-brand-700 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 flex flex-col z-50 animate-fade-in">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => navigate(link.id)}
                className={`text-left px-6 py-4 border-b border-gray-50 text-base font-medium ${currentView === link.id ? 'text-brand-800 font-bold bg-brand-50' : 'text-gray-700'}`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </header>
    </>
  );
};

/* =========================================
   CART SIDEBAR
   ========================================= */
const CartSidebar = () => {
  const {
    cart, isCartOpen, setIsCartOpen,
    updateCartQuantity, removeFromCart, getCartTotal, navigate
  } = useAppContext();

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    let text = "Hello Varsha Ayurveda, I would like to place an order:\n\n";
    cart.forEach(item => {
      text += `• ${item.product.name}\n  Qty: ${item.quantity} × ₹${item.product.price} = ₹${item.product.price * item.quantity}\n\n`;
    });

    const total = getCartTotal();
    text += `*Subtotal:* ₹${total}\n`;
    text += `\nPlease share the payment and delivery details. Thank you!`;

    const url = `https://wa.me/${BRAND_WHATSAPP}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 transition-opacity backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
                onClick={() => { setIsCartOpen(false); navigate('shop'); }}
                className="text-brand-800 font-bold hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm relative group">
                <div className="w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0 p-1 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="max-h-full object-contain"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm leading-tight pr-6">{item.product.name}</h3>
                    <p className="font-bold text-brand-800 mt-1">₹{item.product.price}</p>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="px-2 py-1 hover:bg-gray-50 text-gray-600"><Minus size={14} /></button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="px-2 py-1 hover:bg-gray-50 text-gray-600"><Plus size={14} /></button>
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
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">Subtotal</span>
              <span className="text-2xl font-bold text-gray-900">₹{getCartTotal()}</span>
            </div>

            <button
              onClick={handleWhatsAppCheckout}
              className="w-full bg-whatsapp text-white font-bold py-4 rounded-xl hover:bg-whatsapp-dark transition-all shadow-md flex items-center justify-center gap-2 text-lg transform hover:-translate-y-0.5"
            >
              <MessageCircle size={22} /> Order on WhatsApp
            </button>
            <p className="text-center text-xs text-gray-500 mt-3">
              Fast & secure ordering via WhatsApp
            </p>
          </div>
        )}
      </div>
    </>
  );
};

/* =========================================
   PRODUCT CARD
   ========================================= */
const ProductCard: React.FC<{ product: typeof PRODUCTS[0] }> = ({ product }) => {
  const { addToCart, navigate } = useAppContext();
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col group h-full">
      {/* Image */}
      <div className="relative aspect-square bg-cream p-5 flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => navigate('shop')}>
        <img
          src={product.image}
          alt={product.name}
          className="object-contain h-full w-full transform group-hover:scale-105 transition-transform duration-500"
        />
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
            {discount}% OFF
          </div>
        )}
        <button className="absolute top-3 left-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100">
          <Heart size={16} />
        </button>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-base font-bold text-gray-900 mb-1 leading-snug">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-2 mb-4 mt-auto">
          <span className="text-xl font-bold text-brand-900">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <>
              <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">{discount}% OFF</span>
            </>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-brand-800 text-white font-semibold py-2.5 rounded-lg hover:bg-brand-900 transition-colors flex justify-center items-center gap-1.5 text-sm"
          >
            <ShoppingCart size={15} /> Add to Cart
          </button>
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-white text-brand-800 border border-brand-800 font-semibold py-2.5 rounded-lg hover:bg-brand-50 transition-colors text-sm"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};


/* =========================================
   HOME VIEW
   ========================================= */
const HomeView = () => {
  const { navigate } = useAppContext();

  const trustBadges = [
    { icon: <Leaf size={24} />, title: "100% Herbal", subtitle: "Pure & Natural" },
    { icon: <ShieldCheck size={24} />, title: "Natural Ingredients", subtitle: "Ayurvedic Goodness" },
    { icon: <CheckCircle size={24} />, title: "Safe & Trusted", subtitle: "Quality You Can Rely On" },
    { icon: <ShoppingBag size={24} />, title: "Easy Ordering", subtitle: "Hassle-Free Shopping" },
    { icon: <MessageCircle size={24} />, title: "WhatsApp Support", subtitle: "Get Quick Assistance" },
  ];

  return (
    <div className="flex flex-col w-full animate-fade-in">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden min-h-[600px] md:min-h-[680px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-bg.png"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/20" />
        </div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center py-16 md:py-20 lg:py-24 gap-8 lg:gap-16">
          <div className="flex-1 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 text-brand-700 font-semibold tracking-wider text-xs mb-5 bg-brand-50/80 px-4 py-2 rounded-full backdrop-blur-sm border border-brand-100">
              <Leaf size={14} /> PURE • NATURAL • AYURVEDIC
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-serif font-bold text-gray-900 leading-[1.1] mb-5">
              Natural Wellness, <br />
              <span className="text-brand-800">Rooted in Ayurveda</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Discover thoughtfully crafted Ayurvedic and herbal products designed to support your everyday wellness routine.
            </p>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <button
                onClick={() => navigate('shop')}
                className="bg-brand-800 text-white px-7 py-3.5 rounded-lg font-bold hover:bg-brand-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 text-base"
              >
                Shop Now <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('shop')}
                className="bg-white text-brand-800 border-2 border-brand-800 px-7 py-3.5 rounded-lg font-bold hover:bg-brand-50 transition-all text-base"
              >
                Explore Products
              </button>
            </div>
          </div>

          {/* Hero Product Collage */}
          <div className="flex-1 relative flex justify-center items-center">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 bg-brand-200/30 rounded-full blur-3xl scale-110 animate-pulse-soft" />
              <img
                src="/images/musli-shilajit.png"
                alt="Varsha Ayurveda Featured Products"
                className="relative z-10 w-full h-auto object-contain drop-shadow-2xl animate-float"
              />
              {/* Floating badge */}
              <div className="absolute -top-2 -right-2 md:right-4 md:top-4 w-24 h-24 bg-brand-900 rounded-full flex flex-col items-center justify-center text-white shadow-xl z-20 border-4 border-white">
                <span className="text-[10px] font-medium opacity-80">100%</span>
                <span className="text-sm font-bold leading-none">NATURAL</span>
                <span className="text-[10px] font-medium opacity-80">HERBAL</span>
              </div>
              {/* Bottom info card */}
              <div className="absolute -bottom-4 -left-4 md:left-0 bg-white p-3 rounded-xl shadow-xl flex items-center gap-3 z-20 animate-bounce-slow border border-brand-50">
                <div className="bg-brand-100 p-2 rounded-full text-brand-700">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-medium">Certified</p>
                  <p className="font-bold text-sm text-gray-900">100% Herbal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BADGES ===== */}
      <section className="bg-white border-y border-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
            {trustBadges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-3 text-center group">
                <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-brand-700 group-hover:bg-brand-100 transition-colors">
                  {badge.icon}
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-gray-900">{badge.title}</p>
                  <p className="text-xs text-gray-500">{badge.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SHOP OUR PRODUCTS ===== */}
      <section className="py-16 md:py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-brand-600 font-semibold text-xs tracking-[0.2em] uppercase mb-2 block">OUR PRODUCTS</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Shop Our Products</h2>
            <p className="text-gray-500 mt-2 text-sm">Pure Ayurveda. Better Tomorrow.</p>
          </div>

          <div className="flex justify-end mb-6">
            <button
              onClick={() => navigate('shop')}
              className="text-brand-800 font-semibold text-sm hover:text-brand-600 transition-colors flex items-center gap-1"
            >
              View All Products <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {PRODUCTS.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== SHOP BY CATEGORY BANNER SECTION ===== */}
      <section className="py-6 md:py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden shadow-xs border border-emerald-950/10 bg-[#eef7f0]">
            {/* Panoramic Botanical Background with Leaf Borders */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/category-banner-bg.jpg"
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover object-center pointer-events-none select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/10 to-white/40 pointer-events-none" />
            </div>

            {/* Banner Content */}
            <div className="relative z-10 px-5 sm:px-8 lg:px-10 py-7 sm:py-8 lg:py-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">

              {/* Left Column */}
              <div className="flex flex-col items-start justify-center flex-shrink-0 w-full lg:w-[250px] xl:w-[280px]">
                <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-serif font-bold text-[#063b20] tracking-tight leading-tight">
                  Shop by Category
                </h2>
                <p className="text-sm md:text-[15px] text-gray-700 font-normal mt-1.5 mb-5 leading-snug">
                  Choose what your body needs.
                </p>
                <button
                  onClick={() => navigate('shop')}
                  className="inline-flex items-center gap-2 bg-[#024424] hover:bg-[#01351c] text-white text-xs md:text-sm font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 group active:scale-95"
                >
                  <span>Explore All</span>
                  <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>

              {/* Right Column: 6 Category Cards */}
              <div className="w-full flex-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                <div className="flex lg:grid lg:grid-cols-6 gap-3 sm:gap-3.5 xl:gap-4 min-w-max lg:min-w-0">
                  {CATEGORIES.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => navigate('shop')}
                      className="group bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-emerald-950/5 flex flex-col items-center flex-1 min-w-[130px] sm:min-w-[140px] lg:min-w-0 text-left cursor-pointer"
                    >
                      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#faf6ee] flex items-center justify-center p-1 relative border border-gray-100/70 shadow-2xs">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-xs sm:text-[13px] font-bold text-slate-800 text-center mt-3 group-hover:text-brand-800 transition-colors leading-tight px-0.5 line-clamp-2">
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE VARSHA AYURVEDA ===== */}
      <section className="py-12 md:py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          {/* Section Header with Accent Lines */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-8 md:mb-12">
            <div className="h-[2px] w-10 sm:w-20 bg-brand-600/70 rounded-full" />
            <h2 className="text-xs sm:text-sm tracking-[0.25em] sm:tracking-[0.3em] uppercase font-bold text-brand-700 text-center select-none">
              WHY CHOOSE VARSHA AYURVEDA
            </h2>
            <div className="h-[2px] w-10 sm:w-20 bg-brand-600/70 rounded-full" />
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-6 xl:gap-10">
            {/* Left 4 Features with Vertical Dividers */}
            <div className="w-full lg:w-[62%] xl:w-[65%]">
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200/80 border border-gray-100 sm:border-0 rounded-2xl sm:rounded-none bg-[#fdfdfc] sm:bg-transparent shadow-xs sm:shadow-none p-3 sm:p-0">

                {/* 1. Authentic */}
                <div className="flex flex-col items-center text-center p-3 sm:p-2 lg:p-3 group">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#fcf8ec] flex items-center justify-center mb-3 shadow-2xs border border-amber-100/70 group-hover:scale-105 transition-transform duration-200">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 32 32" fill="none">
                      <path d="M16 26V13C16 13 16 7 24 6C24 14 18 15 16 15" fill="#1e824c" stroke="#0a5229" strokeWidth="1.2" strokeLinejoin="round" />
                      <path d="M16 19C16 19 11 15 7 16C7 22 13 22 16 20" fill="#32b568" stroke="#0a5229" strokeWidth="1.2" strokeLinejoin="round" />
                      <path d="M16 26C16 23 16 15 16 13" stroke="#063d1e" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
                    Authentic
                  </h3>
                  <p className="text-xs sm:text-[13px] text-gray-500 font-normal mt-1 leading-snug">
                    Ayurvedic Products
                  </p>
                </div>

                {/* 2. Natural */}
                <div className="flex flex-col items-center text-center p-3 sm:p-2 lg:p-3 group">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#fcf8ec] flex items-center justify-center mb-3 shadow-2xs border border-amber-100/70 group-hover:scale-105 transition-transform duration-200">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 32 32" fill="none">
                      <path d="M16 22V7C16 7 19.5 12 19.5 15.5C19.5 19 16 22 16 22Z" fill="#1e824c" />
                      <path d="M16 22V7C16 7 12.5 12 12.5 15.5C12.5 19 16 22 16 22Z" fill="#2ebf6c" />
                      <path d="M15 22C15 22 7 20 6 13C13 11 15 19 15 22Z" fill="#1e824c" />
                      <path d="M17 22C17 22 25 20 26 13C19 11 17 19 17 22Z" fill="#2ebf6c" />
                      <path d="M16 22V26" stroke="#063d1e" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
                    Natural
                  </h3>
                  <p className="text-xs sm:text-[13px] text-gray-500 font-normal mt-1 leading-snug">
                    Ingredients
                  </p>
                </div>

                {/* 3. Thoughtfully */}
                <div className="flex flex-col items-center text-center p-3 sm:p-2 lg:p-3 group">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#fcf8ec] flex items-center justify-center mb-3 shadow-2xs border border-amber-100/70 group-hover:scale-105 transition-transform duration-200">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 32 32" fill="none">
                      <path d="M16 24C16 24 9 19 9 13C9 10 11.5 8 14 8C15 8 15.8 8.6 16 9C16.2 8.6 17 8 18 8C20.5 8 23 10 23 13C23 19 16 24 16 24Z" stroke="#0a5229" strokeWidth="1.8" fill="#e8f8ed" strokeLinejoin="round" />
                      <path d="M16 21V13M16 15C17.5 14 19 14.5 19.5 16M16 16C14.5 15 13 15.5 12.5 17" stroke="#1e824c" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="7" cy="11" r="1.2" fill="#2ebf6c" />
                      <circle cx="25" cy="11" r="1.2" fill="#2ebf6c" />
                      <circle cx="16" cy="5" r="1.2" fill="#2ebf6c" />
                      <circle cx="8" cy="19" r="1" fill="#1e824c" />
                      <circle cx="24" cy="19" r="1" fill="#1e824c" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
                    Thoughtfully
                  </h3>
                  <p className="text-xs sm:text-[13px] text-gray-500 font-normal mt-1 leading-snug">
                    Crafted for Wellness
                  </p>
                </div>

                {/* 4. Customer */}
                <div className="flex flex-col items-center text-center p-3 sm:p-2 lg:p-3 group">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#fcf8ec] flex items-center justify-center mb-3 shadow-2xs border border-amber-100/70 group-hover:scale-105 transition-transform duration-200">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="13" r="5" stroke="#0a5229" strokeWidth="1.8" fill="#e8f8ed" />
                      <path d="M11 25C11 20.5 13 19 16 19C19 19 21 20.5 21 25" stroke="#0a5229" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M20 11C23 10 24 7 24 7C24 7 21 7.5 20 9" fill="#2ebf6c" stroke="#0a5229" strokeWidth="1.2" strokeLinejoin="round" />
                      <circle cx="12" cy="14" r="1.2" fill="#1e824c" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
                    Customer
                  </h3>
                  <p className="text-xs sm:text-[13px] text-gray-500 font-normal mt-1 leading-snug">
                    Support
                  </p>
                </div>

              </div>
            </div>

            {/* Right Mortar & Herbs + 'Nature Heals Naturally' Calligraphy */}
            <div className="w-full lg:w-[38%] xl:w-[35%] flex items-center justify-center lg:justify-end gap-3 sm:gap-5 pt-2 lg:pt-0">
              {/* Mortar & Herbs Photo */}
              <div className="relative max-w-[190px] sm:max-w-[220px] lg:max-w-[230px] xl:max-w-[250px] flex-shrink-0">
                <img
                  src="/images/why-choose-herbs.png"
                  alt="Ayurvedic Mortar and Medicinal Herbs"
                  className="w-full h-auto object-contain drop-shadow-sm select-none pointer-events-none hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Calligraphy Slogan */}
              <div className="flex flex-col select-none font-['Caveat',cursive] text-[#0d592b] leading-[0.9] text-3xl sm:text-4xl lg:text-[42px] font-bold -rotate-3 transition-transform hover:scale-105 duration-300 flex-shrink-0">
                <span className="tracking-wide">Nature</span>
                <span className="tracking-wide ml-1">Heals</span>
                <span className="tracking-wide ml-2 flex items-center gap-1">
                  Naturally
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#24a856] fill-current -rotate-12 inline-block -mt-1" viewBox="0 0 24 24">
                    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
                  </svg>
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== AYURVEDIC WELLNESS & BLOG SECTION (FIGMA DESIGN - 100% EXACT & RESPONSIVE) ===== */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

            {/* Left Column (Banner + Blog Section) */}
            <div className="lg:col-span-8 xl:col-span-9 flex flex-col justify-between gap-6 sm:gap-8">

              {/* Banner: A Healthier You with Ayurveda */}
              <div className="relative rounded-2xl overflow-hidden shadow-xs min-h-[190px] sm:min-h-[210px] md:min-h-[225px] flex items-center bg-[#dff0e4]">
                <img
                  src="/images/wellness-meditation-banner.jpg"
                  alt="A Healthier You with Ayurveda"
                  className="absolute inset-0 w-full h-full object-cover object-right"
                />

                {/* Soft gradient fade on left for crisp contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#eff6f1]/95 via-[#eff6f1]/80 sm:via-[#eff6f1]/45 to-transparent sm:w-3/5 pointer-events-none" />

                <div className="relative z-10 p-6 sm:p-9 md:p-10 max-w-sm sm:max-w-md">
                  <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-serif font-bold text-[#143e26] leading-[1.16] tracking-tight">
                    A Healthier You <br />
                    with Ayurveda
                  </h2>
                  <p className="text-xs sm:text-sm lg:text-[15px] font-medium text-[#2d6a4f] mt-1.5 sm:mt-2">
                    Traditional wisdom for modern life.
                  </p>
                  <button
                    onClick={() => navigate('about')}
                    className="inline-flex items-center justify-center bg-[#0c4024] hover:bg-[#124d2e] text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-200 shadow-sm mt-3.5 sm:mt-4 hover:shadow-md"
                  >
                    Learn More
                  </button>
                </div>
              </div>

              {/* Latest from Our Blog */}
              <div>
                {/* Header Row */}
                <div className="flex items-end justify-between mb-4 sm:mb-5">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#143e26] leading-tight">
                      Latest from Our Blog
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Tips, insights and natural living.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('blog')}
                    className="text-xs sm:text-sm font-semibold text-[#1a5336] hover:text-[#0c4024] flex items-center gap-1.5 transition-colors group"
                  >
                    View All Blogs <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* 3 Blog Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
                  {BLOGS.map(blog => (
                    <div
                      key={blog.id}
                      onClick={() => navigate('blog')}
                      className="group flex flex-col cursor-pointer"
                    >
                      <div className="w-full aspect-[16/8.5] rounded-xl overflow-hidden bg-gray-100 shadow-xs">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="pt-2 flex flex-col">
                        <span className="text-[11px] sm:text-xs text-gray-400 font-normal">
                          {blog.date}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#1a5336] transition-colors leading-snug line-clamp-2 mt-0.5">
                          {blog.title}
                        </h4>
                        <span className="text-[11px] sm:text-xs font-semibold text-[#1a5336] group-hover:text-[#0c4024] inline-flex items-center gap-1 mt-1 transition-all">
                          Read More <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (Have Questions? & Follow Us) */}
            <div className="lg:col-span-4 xl:col-span-3 bg-[#edf5ee]/70 lg:bg-[#edf5ee]/60 rounded-2xl p-5 sm:p-6 flex flex-col justify-between border border-emerald-100/60 shadow-xs">

              {/* Have Questions? Card */}
              <div className="bg-white/85 rounded-xl border border-[#b8dfc4] p-5 shadow-xs">
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#143e26] mb-3">
                  Have Questions?
                </h3>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">Chat with us on WhatsApp</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">Our team is here to help you.</p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${BRAND_WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full bg-[#0c4024] hover:bg-[#124d2e] text-white p-3 rounded-2xl flex items-center gap-3 transition-all duration-200 shadow-sm hover:shadow-md group"
                >
                  <div className="w-8 h-8 rounded-full border border-white/80 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] text-emerald-200/90 font-medium block leading-none">Chat Now</span>
                    <span className="text-sm sm:text-base font-bold text-white tracking-wider block mt-1 leading-tight">9907303284</span>
                  </div>
                </a>
              </div>

              {/* Follow Us */}
              <div className="mt-6 pt-2">
                <h4 className="font-bold text-[#143e26] text-xs sm:text-sm tracking-wide mb-3">
                  Follow Us
                </h4>
                <div className="flex items-center gap-2.5">
                  {/* Instagram */}
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#143e26] hover:bg-[#0c2f1a] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xs"
                    aria-label="Instagram"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  {/* Facebook */}
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#143e26] hover:bg-[#0c2f1a] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xs"
                    aria-label="Facebook"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${BRAND_WHATSAPP}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#143e26] hover:bg-[#0c2f1a] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xs"
                    aria-label="WhatsApp"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </a>
                  {/* YouTube */}
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#143e26] hover:bg-[#0c2f1a] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xs"
                    aria-label="YouTube"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
};


/* =========================================
   SHOP VIEW
   ========================================= */
const ShopView = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = selectedCategory === "All"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-cream min-h-screen animate-fade-in">
      {/* Header Banner */}
      <div className="bg-brand-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">Shop All Products</h1>
          <p className="text-brand-200 text-base max-w-xl mx-auto">
            Explore our complete range of authentic Ayurvedic formulations.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["All", ...CATEGORIES.map(c => c.name)].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                ? 'bg-brand-800 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300 hover:text-brand-800'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};


/* =========================================
   ABOUT VIEW
   ========================================= */
const AboutView = () => {
  const { navigate } = useAppContext();

  return (
    <div className="bg-white min-h-screen animate-fade-in">
      <div className="bg-brand-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">About Varsha Ayurveda</h1>
          <p className="text-brand-200 text-base max-w-xl mx-auto">
            Bringing the pure, untouched goodness of Ayurveda to your modern lifestyle.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-brand-50 rounded-3xl transform -rotate-3 z-0" />
            <img
              src="/images/wellness-banner.png"
              alt="Ayurvedic Herbs"
              className="relative z-10 w-full h-auto rounded-2xl shadow-xl object-cover aspect-[4/3]"
            />
          </div>

          <div className="space-y-8 text-base text-gray-600 leading-relaxed">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Leaf className="text-brand-600" size={28} /> Our Philosophy
              </h2>
              <p>
                At Varsha Ayurveda, we believe that nature holds the key to profound health and vitality. Rooted in the ancient science of Ayurveda, our mission is to provide you with natural, authentic, and highly effective wellness solutions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-3">
                <CheckCircle className="text-brand-600" size={28} /> Commitment to Quality
              </h2>
              <p>
                We carefully source the finest herbs and natural ingredients, ensuring that every product we create honors traditional methods while meeting modern quality standards. Our formulations are free from harmful chemicals, prioritizing pure herbal goodness.
              </p>
            </div>

            <button
              onClick={() => navigate('shop')}
              className="inline-flex items-center gap-2 bg-brand-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-900 transition-colors"
            >
              Explore Our Range <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


/* =========================================
   GALLERY VIEW
   ========================================= */
const GalleryView = () => {
  const galleryImages = [
    "/images/hero-bg.png",
    "/images/blog-wellness.png",
    "/images/blog-herbal.png",
    "/images/wellness-banner.png",
    "/images/blog-routine.png",
    "/images/musli-shilajit.png",
  ];

  return (
    <div className="bg-cream min-h-screen animate-fade-in">
      <div className="bg-brand-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">Our Gallery</h1>
          <p className="text-brand-200 text-base max-w-xl mx-auto">
            Pure. Natural. Authentic.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {galleryImages.map((src, idx) => (
            <div key={idx} className="break-inside-avoid relative group overflow-hidden rounded-2xl shadow-sm border border-gray-100">
              <img
                src={src}
                alt={`Gallery image ${idx + 1}`}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/20 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


/* =========================================
   BLOG VIEW
   ========================================= */
const BlogView = () => {
  return (
    <div className="bg-cream min-h-screen animate-fade-in">
      <div className="bg-brand-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">Our Blog</h1>
          <p className="text-brand-200 text-base max-w-xl mx-auto">
            Pure. Natural. Authentic.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOGS.map(blog => (
            <div key={blog.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all group cursor-pointer">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <p className="text-xs text-brand-600 font-medium mb-2">{blog.date}</p>
                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">{blog.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{blog.excerpt}</p>
                <span className="text-brand-800 font-semibold text-sm inline-flex items-center gap-1">
                  Read More <ArrowRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


/* =========================================
   CONTACT VIEW
   ========================================= */
const ContactView = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message! We will get back to you soon.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="bg-white min-h-screen animate-fade-in">
      <div className="bg-brand-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">Contact Us</h1>
          <p className="text-brand-200 text-base max-w-xl mx-auto">
            We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 max-w-5xl mx-auto">
          {/* Contact Details */}
          <div className="space-y-8 bg-cream p-8 md:p-10 rounded-3xl border border-brand-50">
            <h3 className="text-2xl font-serif font-bold text-gray-900">Get in Touch</h3>

            <div className="space-y-6">
              {[
                { icon: <MapPin size={22} />, title: "Our Location", content: "Varsha Ayurveda\nBerasia Road, Bhopal\nMadhya Pradesh, India" },
                { icon: <Phone size={22} />, title: "Phone / WhatsApp", content: "+91 9907303284" },
                { icon: <Mail size={22} />, title: "Email Address", content: "info@varshaayurveda.in" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-white text-brand-700 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm whitespace-pre-line">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href={`https://wa.me/${BRAND_WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-whatsapp text-white px-5 py-3 rounded-lg font-bold hover:bg-whatsapp-dark transition-colors text-sm"
            >
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
                <input
                  required
                  type="text"
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-300 focus:border-transparent outline-none bg-gray-50 transition-all text-sm"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Phone Number</label>
                <input
                  required
                  type="tel"
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-300 focus:border-transparent outline-none bg-gray-50 transition-all text-sm"
                  placeholder="Your Phone Number"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Message</label>
                <textarea
                  required
                  rows={5}
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-300 focus:border-transparent outline-none bg-gray-50 transition-all resize-none text-sm"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand-800 text-white font-bold py-3.5 rounded-xl hover:bg-brand-900 transition-colors shadow-md text-base"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


/* =========================================
   FOOTER
   ========================================= */
const Footer = () => {
  const { navigate } = useAppContext();

  return (
    <footer className="bg-brand-950 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
        {/* Brand Col */}
        <div className="lg:col-span-1 space-y-4">
          <div
            className="inline-block cursor-pointer select-none group"
            onClick={() => navigate('home')}
          >
            <img
              src="/logo-white.png"
              alt="Varsha Ayurveda"
              className="h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </div>
          <p className="text-brand-200/60 text-sm leading-relaxed">
            Bringing the goodness of Ayurveda to your daily life with natural and herbal wellness products.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold mb-5 text-white tracking-wide">Quick Links</h4>
          <ul className="space-y-3 text-brand-200/70 text-sm">
            {[
              { label: 'Home', view: 'home' },
              { label: 'Shop', view: 'shop' },
              { label: 'About Us', view: 'about' },
              { label: 'Gallery', view: 'gallery' },
              { label: 'Blog', view: 'blog' },
              { label: 'Contact', view: 'contact' },
            ].map(link => (
              <li key={link.view}>
                <button onClick={() => navigate(link.view)} className="hover:text-white transition-colors">
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h4 className="text-sm font-bold mb-5 text-white tracking-wide">Customer Support</h4>
          <ul className="space-y-3 text-brand-200/70 text-sm">
            {['FAQ', 'Shipping Policy', 'Return & Refund', 'Terms & Conditions', 'Privacy Policy', 'Cancellation Policy'].map(item => (
              <li key={item}><span className="hover:text-white transition-colors cursor-pointer">{item}</span></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-bold mb-5 text-white tracking-wide">Contact Us</h4>
          <ul className="space-y-3 text-brand-200/70 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 text-brand-400 flex-shrink-0" />
              <span>Berasia Road, Bhopal</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-brand-400 flex-shrink-0" />
              <span>9907303284</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-brand-400 flex-shrink-0" />
              <span>info@varshaayurveda.in</span>
            </li>
          </ul>
        </div>

        {/* Payment Methods */}
        <div>
          <h4 className="text-sm font-bold mb-5 text-white tracking-wide">Payment Methods</h4>
          <div className="flex flex-wrap gap-2">
            {['UPI', 'VISA', 'MC', 'COD'].map(method => (
              <div key={method} className="bg-white/10 text-white/80 px-3 py-1.5 rounded-md text-xs font-bold">
                {method}
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            {[Globe, Send, ExternalLink, Play].map((Icon, idx) => (
              <a key={idx} href="#" className="w-9 h-9 bg-brand-800/50 text-brand-200 rounded-full flex items-center justify-center hover:bg-brand-700 hover:text-white transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="container mx-auto px-4 pt-6 border-t border-brand-800/50 flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="text-brand-200/40 text-xs text-center md:text-left">
          © 2026 Varsha Ayurveda. All Rights Reserved.
        </p>
        <div className="flex gap-6 text-brand-200/40 text-xs">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
};


/* =========================================
   MAIN APP
   ========================================= */
const MainApp = () => {
  const { currentView, toastMessage } = useAppContext();

  return (
    <div className="font-sans text-gray-800 flex flex-col min-h-screen">
      <Navigation />
      <CartSidebar />

      <main className="flex-grow">
        {currentView === 'home' && <HomeView />}
        {currentView === 'shop' && <ShopView />}
        {currentView === 'about' && <AboutView />}
        {currentView === 'gallery' && <GalleryView />}
        {currentView === 'blog' && <BlogView />}
        {currentView === 'contact' && <ContactView />}
      </main>

      <Footer />

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${BRAND_WHATSAPP}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-whatsapp text-white p-4 rounded-full shadow-2xl hover:bg-whatsapp-dark transition-all hover:scale-110 z-40 flex items-center justify-center group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
        <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm font-bold px-4 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with us!
        </span>
      </a>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 md:bottom-6 md:left-6 md:right-auto bg-brand-900 text-white px-5 py-3.5 rounded-xl shadow-2xl z-50 animate-fade-in-up flex items-center gap-3">
          <CheckCircle size={18} className="text-brand-400" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
