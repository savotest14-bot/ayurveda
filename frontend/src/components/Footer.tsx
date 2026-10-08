import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Phone, Mail, Clock, ShieldCheck,
  MessageCircle, HeartHandshake, Leaf
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext.js';

export const Footer: React.FC = () => {
  const { settings } = useSettings();

  const phone = settings?.phone || '9907303284';
  const whatsappNum = settings?.whatsappNumber || '919907303284';
  const email = settings?.email || 'info@varshaayurveda.in';
  const address = settings?.address || 'Berasia Road, Bhopal, Madhya Pradesh, India';
  const footerText = settings?.footerText || 'Bringing the goodness of Ayurveda to your daily life with natural and herbal wellness products.';

  return (
    <footer className="relative bg-[#072415] text-stone-200 overflow-hidden border-t border-emerald-900/60">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#c5a059]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative container mx-auto px-4 pt-12 lg:pt-14 pb-8 z-10">

        {/* ===== MAIN FOOTER GRID ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-10 mb-12">

          {/* Column 1: Brand & Heritage (4 Cols on LG) */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-block select-none group">
              <img
                src="/logo-white.png"
                alt="Varsha Ayurveda"
                className="h-11 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </Link>

            <p className="text-stone-300/80 text-xs sm:text-sm leading-relaxed max-w-sm">
              {footerText}
            </p>

            {/* Brand Trust Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-950/80 border border-emerald-800/50 text-emerald-300">
                <Leaf size={12} className="text-emerald-400" />
                100% Pure & Herbal
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-950/80 border border-emerald-800/50 text-emerald-300">
                <ShieldCheck size={12} className="text-emerald-400" />
                GMP Certified Quality
              </span>
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <p className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-2.5">
                Connect With Us
              </p>
              <div className="flex items-center gap-2.5">
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-emerald-400/60 hover:bg-emerald-500/15 text-stone-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-2xs"
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
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-emerald-400/60 hover:bg-emerald-500/15 text-stone-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-2xs"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${whatsappNum}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-emerald-400/60 hover:bg-emerald-500/15 text-stone-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-2xs"
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
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-emerald-400/60 hover:bg-emerald-500/15 text-stone-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-2xs"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links (2 Cols on LG) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-emerald-400">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300/80">
              {[
                { label: 'Home', path: '/' },
                { label: 'Shop Products', path: '/shop' },
                { label: 'About Our Story', path: '/about' },
                { label: 'Product Gallery', path: '/gallery' },
                { label: 'Ayurvedic Blog', path: '/blog' },
                { label: 'Contact Us', path: '/contact' },
              ].map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Support (2 Cols on LG) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-emerald-400">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300/80">
              {[
                { label: 'Track Order', path: '/orders' },
                { label: 'Shipping & Delivery', path: '/contact' },
                { label: 'Return & Refund', path: '/contact' },
                { label: 'Terms & Conditions', path: '/contact' },
                { label: 'Privacy Policy', path: '/contact' },
                { label: 'FAQs & Help', path: '/contact' },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.path}
                    className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200"
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us (2 Cols on LG) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-emerald-400">
              Contact Us
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-stone-300/80">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 text-emerald-400 flex-shrink-0" />
                <span className="leading-snug">{address}</span>
              </li>
              <li>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-2.5 hover:text-white transition-colors duration-200"
                >
                  <Phone size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>+91 {phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2.5 hover:text-white transition-colors duration-200"
                >
                  <Mail size={15} className="text-emerald-400 flex-shrink-0" />
                  <span className="truncate">{email}</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-stone-400 pt-1">
                <Clock size={15} className="text-emerald-400 flex-shrink-0" />
                <span>Mon – Sat: 9:00 AM – 7:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Column 5: Payment & Security (2 Cols on LG) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-emerald-400">
              Payment & Security
            </h4>

            <p className="text-[11px] text-stone-400 leading-relaxed">
              100% Secure Checkout with 256-Bit SSL encryption.
            </p>

            {/* Real Payment Method Badges */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {/* UPI */}
              <div className="h-7 px-2 bg-white rounded flex items-center justify-center shadow-2xs hover:scale-105 transition-transform cursor-default" title="UPI">
                <svg className="h-3.5 w-auto" viewBox="0 0 65 24" fill="none">
                  <path d="M15.5 3.5L9 20.5H13.8L20.3 3.5H15.5Z" fill="#097939" />
                  <path d="M21.5 3.5L15 20.5H19.8L26.3 3.5H21.5Z" fill="#ED752E" />
                  <text x="27" y="17.5" fontFamily="Arial, sans-serif" fontWeight="900" fontStyle="italic" fontSize="14" fill="#2E3192">
                    UPI
                  </text>
                </svg>
              </div>

              {/* Google Pay */}
              <div className="h-7 px-2 bg-white rounded flex items-center justify-center shadow-2xs hover:scale-105 transition-transform cursor-default" title="Google Pay">
                <svg className="h-3.5 w-auto" viewBox="0 0 56 22" fill="none">
                  <path d="M11 11.2c0-.6-.05-1.1-.15-1.6H5.5v3.1h3.1c-.15.8-.6 1.5-1.3 2v1.6h2.1c1.2-1.1 1.9-2.8 1.9-4.8z" fill="#4285F4" />
                  <path d="M5.5 16.8c1.5 0 2.8-.5 3.8-1.4l-2.1-1.6c-.5.4-1.2.6-1.7.6-1.3 0-2.5-.9-2.9-2.1H.4v1.7c1 2 3.1 3.4 5.1 3.4z" fill="#34A853" />
                  <path d="M2.6 12.3c-.1-.4-.2-.8-.2-1.3s.1-.9.2-1.3V8H.4C0 8.8-.2 9.9-.2 11s.2 2.2.6 3l2.2-1.7z" fill="#FBBC04" />
                  <path d="M5.5 6.4c.8 0 1.6.3 2.2.9l1.7-1.7C8.3 4.6 7 4.1 5.5 4.1c-2 0-4.1 1.4-5.1 3.4L2.6 9.2c.4-1.2 1.6-2.1 2.9-2.1z" fill="#EA4335" />
                  <text x="14" y="14" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="11" fill="#5F6368">
                    Pay
                  </text>
                </svg>
              </div>

              {/* PhonePe */}
              <div className="h-7 px-2 bg-white rounded flex items-center justify-center shadow-2xs hover:scale-105 transition-transform cursor-default" title="PhonePe">
                <svg className="h-3.5 w-auto" viewBox="0 0 62 20" fill="none">
                  <circle cx="10" cy="10" r="8" fill="#5F259F" />
                  <path d="M7 7.5h6M9.8 7.5v6.5M8 9.5c0 0 1.8 0 2.2 1.2.4 1.2-.4 2.5-1.8 2.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
                  <text x="21" y="14" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="10.5" fill="#5F259F">
                    PhonePe
                  </text>
                </svg>
              </div>

              {/* Paytm */}
              <div className="h-7 px-2 bg-white rounded flex items-center justify-center shadow-2xs hover:scale-105 transition-transform cursor-default" title="Paytm">
                <svg className="h-3.5 w-auto" viewBox="0 0 48 18" fill="none">
                  <text x="1" y="13.5" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="12" fill="#002970">
                    Pay
                  </text>
                  <text x="23" y="13.5" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="12" fill="#00BAF2">
                    tm
                  </text>
                </svg>
              </div>

              {/* Visa */}
              <div className="h-7 px-2 bg-white rounded flex items-center justify-center shadow-2xs hover:scale-105 transition-transform cursor-default" title="Visa">
                <svg className="h-3.5 w-auto" viewBox="0 0 48 16" fill="none">
                  <path d="M19.5 2.5l-3.2 11h-2.5l1.9-8.8-.2-.3c-.6-.5-1.5-.8-2.6-.8l-.4.1-.1.4 3 6.9-1.9 2.5H11L7.5 4.5c-.3-.9-.6-1.2-1.3-1.5-.6-.3-1.6-.5-2.2-.5L4 2.8c1.7.3 3.3.9 4.6 1.7l3.8 11h2.7l4.1-13h-2.7z" fill="#1A1F71" />
                  <path d="M26.2 13.5l2.6-11h-2.5l-2.6 11h2.5z" fill="#1A1F71" />
                  <path d="M34.8 6.4c-.1-.7-.8-1.2-1.8-1.3-1.2-.1-2.4.5-2.5 1.4-.1.7.5 1.2 1.4 1.6l1 .5c1.4.7 2.1 1.4 2 2.7-.2 1.9-1.9 2.5-3.6 2.4-1.5-.1-2.6-.7-3.1-1.3l.4-1.9c.6.6 1.6 1.1 2.7 1.1 1 0 1.7-.5 1.8-1.2.1-.7-.5-1.1-1.5-1.6l-.9-.4c-1.3-.6-2-1.3-1.9-2.4.2-1.7 1.8-2.5 3.4-2.4 1.3.1 2.2.5 2.7.9l-.4 1.9z" fill="#1A1F71" />
                  <path d="M42.2 13.5h2.3l-2-11h-2.1c-.6 0-1 .3-1.2.8l-4.1 10.2h2.7l.5-1.5h3.4l.5 1.5zm-2.8-3.4l1.4-3.8.8 3.8h-2.2z" fill="#1A1F71" />
                </svg>
              </div>

              {/* Mastercard */}
              <div className="h-7 px-2 bg-white rounded flex items-center justify-center shadow-2xs hover:scale-105 transition-transform cursor-default" title="Mastercard">
                <svg className="h-4.5 w-auto" viewBox="0 0 36 22" fill="none">
                  <circle cx="13" cy="11" r="7.5" fill="#EB001B" />
                  <circle cx="23" cy="11" r="7.5" fill="#F79E1B" />
                  <path d="M18 5.5a7.5 7.5 0 0 0-2 5.5 7.5 7.5 0 0 0 2 5.5 7.5 7.5 0 0 0 2-5.5 7.5 7.5 0 0 0-2-5.5z" fill="#FF5F00" />
                </svg>
              </div>

              {/* RuPay */}
              <div className="h-7 px-2 bg-white rounded flex items-center justify-center shadow-2xs hover:scale-105 transition-transform cursor-default" title="RuPay">
                <svg className="h-3.5 w-auto" viewBox="0 0 54 18" fill="none">
                  <text x="1" y="13.5" fontFamily="Arial, sans-serif" fontWeight="900" fontStyle="italic" fontSize="12" fill="#092040">
                    RuPay
                  </text>
                  <path d="M43 4.5l3.5 4.5-3.5 4.5h3.5l3.5-4.5-3.5-4.5h-3.5z" fill="#F47920" />
                  <path d="M46.5 4.5l3.5 4.5-3.5 4.5h3.5l3.5-4.5-3.5-4.5h-3.5z" fill="#00A859" />
                </svg>
              </div>

              {/* Cash on Delivery */}
              <div className="h-7 px-2 bg-white rounded flex items-center justify-center gap-1 shadow-2xs hover:scale-105 transition-transform cursor-default" title="Cash on Delivery">
                <span className="text-[9.5px] font-extrabold text-[#0c4a2d] bg-emerald-100/90 px-1 py-0.5 rounded leading-none">COD</span>
                <span className="text-[9.5px] font-bold text-[#0c4a2d] leading-none">Accepted</span>
              </div>
            </div>

            {/* Direct WhatsApp Consultation Button */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsappNum}?text=Hello%20Varsha%20Ayurveda%2C%20I%20would%20like%20guidance%20on%20products`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm"
              >
                <MessageCircle size={15} className="text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* ===== BOTTOM COPYRIGHT & CREDITS STRIP ===== */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400/80">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center md:text-left">
            <p>
              © {new Date().getFullYear()} {settings?.storeName || 'Varsha Ayurveda'}. All Rights Reserved.
            </p>
            <span className="hidden sm:inline text-stone-600">•</span>
            <p className="text-emerald-400/80 flex items-center gap-1">
              <HeartHandshake size={13} />
              Rooted in Nature. Crafted for Health.
            </p>
          </div>

          <div className="flex items-center gap-5 text-stone-400 text-xs">
            <Link to="/contact" className="hover:text-emerald-300 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-emerald-300 transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-emerald-300 transition-colors">
              Support
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
