import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Menu, X, Search, Phone, MapPin,
  Leaf, User, ShoppingBag, BookOpen, Image, MessageCircle,
  Package, LogOut, ChevronRight, Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';
import { useSettings } from '../context/SettingsContext.js';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount, isCartOpen, setIsCartOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { settings } = useSettings();

  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and search upon route navigation and sync scroll
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    setScrolled(window.scrollY > 10);
  }, [location.pathname]);

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { path: '/', label: 'Home', icon: Leaf },
    { path: '/shop', label: 'Shop', icon: ShoppingBag },
    { path: '/about', label: 'About Us', icon: Sparkles },
    { path: '/gallery', label: 'Gallery', icon: Image },
    { path: '/blog', label: 'Blog', icon: BookOpen },
    { path: '/contact', label: 'Contact', icon: MessageCircle },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const whatsappNum = settings?.whatsappNumber || '919907303284';
  const displayPhone = settings?.phone || '9907303284';

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled && !isMobileMenuOpen && !isMobileSearchOpen;

  return (
    <>
      <header
        className={`w-full z-40 transition-all duration-300 ${
          isHome
            ? `fixed top-0 left-0 right-0 ${
                isTransparent
                  ? 'bg-transparent shadow-none'
                  : 'bg-white shadow-md'
              }`
            : `sticky top-0 bg-white shadow-xs`
        }`}
      >
        {/* Top Announcement Bar */}
        <div
          className={`transition-colors duration-300 text-brand-100 text-[11px] sm:text-xs py-1.5 sm:py-2 ${
            isTransparent
              ? 'bg-[#0c3c22]/85 backdrop-blur-xs border-b border-white/10'
              : 'bg-[#0c3c22]'
          }`}
        >
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium tracking-wide truncate">
              <span className="hidden sm:inline">
                {settings?.announcementText || "Natural Ayurvedic Wellness Products | Order Online | WhatsApp Support"}
              </span>
              <span className="sm:hidden font-semibold flex items-center gap-1.5 truncate">
                <Leaf size={12} className="text-emerald-400 shrink-0" />
                <span className="truncate">Natural Ayurvedic Wellness</span>
              </span>
            </div>

            <div className="flex items-center gap-4 text-emerald-200 shrink-0 text-[11px] sm:text-xs">
              <a
                href={`https://wa.me/${whatsappNum}?text=Hello%20Varsha%20Ayurveda`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
                title="Chat on WhatsApp"
              >
                <Phone size={11} className="text-emerald-400" />
                <span className="font-semibold">+91 {displayPhone}</span>
              </a>
              <span className="hidden md:flex items-center gap-1">
                <MapPin size={11} className="text-emerald-400" /> Bhopal, India
              </span>
            </div>
          </div>
        </div>

        {/* Main Nav Bar */}
        <div
          className={`container mx-auto px-4 py-2 sm:py-2.5 md:py-3 flex items-center justify-between transition-colors duration-300 ${
            isTransparent ? 'border-b border-white/15' : 'border-b border-gray-100'
          }`}
        >
          {/* Brand Logo */}
          <Link to="/" className="flex items-center select-none group py-0.5 shrink-0">
            <img
              src="/varshalogo.png"
              alt="Varsha Ayurveda"
              className="h-8 sm:h-9 md:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Nav Links (Hidden on Mobile/Tablet) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-medium text-sm xl:text-[15px]">
            {navLinks.map((link) => {
              const isActive = link.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-1.5 transition-colors ${
                    isTransparent
                      ? isActive
                        ? 'text-[#0c4328] font-bold'
                        : 'text-[#143e26] font-semibold hover:text-[#062817]'
                      : isActive
                        ? 'text-brand-800 font-bold'
                        : 'text-gray-700 hover:text-brand-800'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${
                        isTransparent ? 'bg-[#0c4328]' : 'bg-brand-800'
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Search, Account & Cart Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3">
            {/* Desktop Search Input */}
            <form
              onSubmit={handleSearchSubmit}
              className={`hidden md:flex items-center rounded-full px-3.5 py-1.5 border transition-all ${
                isTransparent
                  ? 'bg-white/70 backdrop-blur-xs border-white/80 focus-within:bg-white focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100/50 shadow-2xs'
                  : 'bg-gray-50 border-gray-200 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-100'
              }`}
            >
              <Search size={15} className="text-gray-500 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent outline-none text-xs sm:text-sm text-gray-800 w-32 lg:w-44 placeholder-gray-500"
              />
            </form>

            {/* Mobile Search Toggle Button */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className={`md:hidden p-2 rounded-full transition-colors ${
                isTransparent
                  ? 'text-[#0c4328] hover:bg-white/40'
                  : 'text-gray-700 hover:text-brand-800 hover:bg-gray-100'
              }`}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* User Account / Profile Badge */}
            {isAuthenticated && user ? (
              <Link
                to="/account"
                className={`flex items-center gap-1.5 sm:gap-2 pl-1 pr-2.5 sm:pr-3 py-1 rounded-full transition-all duration-200 select-none group shrink-0 ${
                  isTransparent
                    ? 'bg-white/70 hover:bg-white/90 border border-white/80 shadow-2xs backdrop-blur-xs'
                    : 'bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/80 shadow-2xs'
                }`}
                title={`Logged in as ${user.name} - View Account`}
              >
                {/* User Image / Initial Avatar */}
                {user.avatar || user.image ? (
                  <img
                    src={user.avatar || user.image}
                    alt={user.name}
                    className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full object-cover border border-emerald-600/30 shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-gradient-to-br from-[#0c4a2d] to-[#15803d] text-white flex items-center justify-center font-bold text-xs sm:text-[13px] shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}

                {/* User Name */}
                <span
                  className={`text-xs sm:text-[13px] font-bold max-w-[70px] sm:max-w-[100px] md:max-w-[130px] truncate leading-none ${
                    isTransparent
                      ? 'text-[#0c4328]'
                      : 'text-[#0c4a2d] group-hover:text-[#062817]'
                  }`}
                >
                  {user.name}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className={`p-2 rounded-full transition-colors ${
                  isTransparent
                    ? 'text-[#0c4328] hover:bg-white/40'
                    : 'text-gray-700 hover:text-brand-800 hover:bg-brand-50'
                }`}
                title="Login to your account"
                aria-label="Login"
              >
                <User size={20} />
              </Link>
            )}

            {/* Cart Trigger */}
            <button
              className={`relative p-2 rounded-full transition-colors ${
                isTransparent
                  ? 'text-[#0c4328] hover:bg-white/40'
                  : 'text-gray-700 hover:text-brand-800 hover:bg-brand-50'
              }`}
              onClick={() => setIsCartOpen(!isCartOpen)}
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={20} />
              {getCartCount() > 0 && (
                <span className="absolute top-0 right-0 bg-[#0c4a2d] text-white text-[10px] font-bold rounded-full h-4.5 w-4.5 min-w-[18px] flex items-center justify-center shadow-xs">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isTransparent
                  ? 'text-[#0c4328] hover:bg-white/40'
                  : 'text-gray-800 hover:text-brand-800 hover:bg-gray-100'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Expandable Search Bar */}
        {isMobileSearchOpen && (
          <div className="md:hidden bg-gray-50 border-b border-gray-200 px-4 py-2.5 animate-fade-in shadow-inner">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search herbal products..."
                  autoFocus
                  className="w-full bg-white text-gray-900 text-sm pl-9 pr-3 py-2 rounded-full border border-gray-300 focus:border-brand-600 focus:outline-none shadow-2xs"
                />
              </div>
              <button
                type="submit"
                className="bg-[#0c4a2d] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xs shrink-0"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* ===== NATIVE-STYLE MOBILE SLIDE-OVER DRAWER ===== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Drawer Content Panel */}
          <div className="relative w-[85%] max-w-[340px] bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in-right overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-[#fbf9f5]">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <img
                  src="/varshalogo.png"
                  alt="Varsha Ayurveda"
                  className="h-9 w-auto object-contain"
                />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-2xs"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Drawer Search */}
            <div className="p-4 border-b border-gray-100 bg-white">
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-brand-500 focus-within:bg-white transition-all">
                <Search size={16} className="text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="bg-transparent outline-none text-xs sm:text-sm text-gray-800 w-full placeholder-gray-400"
                />
              </form>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 py-2 px-3 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#0c4a2d] text-white font-semibold shadow-xs'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-brand-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isActive ? 'text-emerald-300' : 'text-[#0c4a2d]'} />
                      <span>{link.label}</span>
                    </div>
                    <ChevronRight size={15} className={isActive ? 'text-emerald-300' : 'text-gray-400'} />
                  </Link>
                );
              })}

              {/* My Orders Quick Link */}
              <Link
                to={isAuthenticated ? "/account" : "/login"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-brand-800 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Package size={18} className="text-[#0c4a2d]" />
                  <span>Track Orders</span>
                </div>
                <ChevronRight size={15} className="text-gray-400" />
              </Link>
            </nav>

            {/* Quick Contact & WhatsApp Pill in Drawer */}
            <div className="p-4 mx-3 my-2 rounded-2xl bg-[#edf6ef] border border-emerald-100 flex flex-col gap-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0c4a2d]">Need Assistance?</span>
              <a
                href={`https://wa.me/${whatsappNum}?text=Hello%20Varsha%20Ayurveda%2C%20I%20need%20assistance`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1faa52] text-white py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Phone size={14} />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href={`tel:${displayPhone}`}
                className="text-center text-xs font-medium text-gray-700 hover:text-brand-800"
              >
                Call: +91 {displayPhone}
              </a>
            </div>

            {/* Drawer Footer Account Section */}
            <div className="p-4 border-t border-gray-100 bg-[#FAF9F5]">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#0c4a2d] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-gray-900 leading-tight">{user?.name}</p>
                      <Link
                        to="/account"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-[11px] text-[#0c4a2d] font-semibold hover:underline"
                      >
                        View Account
                      </Link>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-2 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2 px-3 rounded-xl text-xs font-bold bg-[#0c4a2d] text-white text-center shadow-xs hover:bg-[#08351f] transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2 px-3 rounded-xl text-xs font-semibold bg-white border border-gray-300 text-gray-800 text-center hover:bg-gray-50 transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
