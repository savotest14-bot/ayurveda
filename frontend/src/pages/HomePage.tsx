import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf, ShieldCheck, CheckCircle, ShoppingBag, MessageCircle,
  ArrowRight, Phone, Globe, Send, ExternalLink, Play
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard.js';
import { productService } from '../services/productService.js';
import { categoryService } from '../services/categoryService.js';
import { blogService } from '../services/blogService.js';
import { useSettings } from '../context/SettingsContext.js';
import { Product, Category, Blog } from '../types/index.js';
import { getImageUrl } from '../utils/imageUrl.js';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: "Ayurvedic Wellness", slug: "ayurvedic-wellness", image: "/images/cat-ayurvedic-wellness.svg", active: true, sortOrder: 1 },
  { id: 2, name: "Herbal Powders", slug: "herbal-powders", image: "/images/cat-herbal-powders.jpg", active: true, sortOrder: 2 },
  { id: 3, name: "Capsules", slug: "capsules", image: "/images/cat-capsules.jpg", active: true, sortOrder: 3 },
  { id: 4, name: "Daily Wellness", slug: "daily-wellness", image: "/images/cat-daily-wellness.jpg", active: true, sortOrder: 4 },
  { id: 5, name: "Energy & Stamina", slug: "energy-stamina", image: "/images/cat-energy-stamina.svg", active: true, sortOrder: 5 },
  { id: 6, name: "Other Products", slug: "other-products", image: "/images/cat-other-products.svg", active: true, sortOrder: 6 },
];

const DEFAULT_BLOGS: Blog[] = [
  {
    id: 1,
    title: "Ayurveda and Everyday Wellness",
    slug: "ayurveda-and-everyday-wellness",
    excerpt: "Discover how ancient Ayurvedic practices can transform your daily wellness routine with natural remedies.",
    content: "",
    featuredImage: "/images/blog-wellness.png",
    author: "Dr. Varsha Sharma, BAMS",
    published: true,
    createdAt: "2026-04-12T00:00:00.000Z",
    updatedAt: "2026-04-12T00:00:00.000Z"
  },
  {
    id: 2,
    title: "Understanding Herbal Ingredients",
    slug: "understanding-herbal-ingredients",
    excerpt: "Learn about the powerful herbs behind our formulations and their traditional healing properties.",
    content: "",
    featuredImage: "/images/blog-herbal.png",
    author: "Acharya Devrat",
    published: true,
    createdAt: "2026-04-08T00:00:00.000Z",
    updatedAt: "2026-04-08T00:00:00.000Z"
  },
  {
    id: 3,
    title: "Building a Healthy Daily Routine",
    slug: "building-a-healthy-daily-routine",
    excerpt: "Simple steps to incorporate Ayurvedic wisdom into your modern daily life for lasting health benefits.",
    content: "",
    featuredImage: "/images/blog-routine.png",
    author: "Varsha Ayurveda Wellness Team",
    published: true,
    createdAt: "2026-04-05T00:00:00.000Z",
    updatedAt: "2026-04-05T00:00:00.000Z"
  }
];

const formatBlogDate = (dateStr: string | Date | undefined) => {
  if (!dateStr) return 'Apr 12, 2026';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Apr 12, 2026';
  }
};

export const HomePage: React.FC = () => {
  const { settings } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const displayCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodData, catData, blogData] = await Promise.all([
          productService.getProducts({ featured: true }),
          categoryService.getCategories(),
          blogService.getBlogs()
        ]);
        setProducts(prodData.products || []);
        setCategories(catData || []);
        setBlogs(blogData?.slice(0, 3) || []);
      } catch (err) {
        console.error('Error fetching home page data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const whatsappNum = settings?.whatsappNumber || '919907303284';
  const displayPhone = settings?.phone || '9907303284';
  const heroTagline = settings?.heroTagline || 'Natural Wellness, Rooted in Ayurveda';
  const heroSubtitle = settings?.heroSubtitle || 'Discover thoughtfully crafted Ayurvedic and herbal products designed to support your everyday wellness routine.';

  const trustBadges = [
    {
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#0c4a2d]" viewBox="0 0 24 24" fill="none">
          <path
            d="M4.5 20C4.5 14.5 7.5 6.5 16.5 3.5C16.5 10.5 13.5 18 4.5 20Z"
            fill="currentColor"
          />
          <path
            d="M5 20C7.5 15.5 11.5 12 16.5 9.5"
            stroke="#FAF9F5"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d="M13 13.5C15 10.5 18 9.5 20.5 8.5C20.5 12.5 18.5 16.5 14.5 17.5C13.8 16 13.2 14.7 13 13.5Z"
            fill="currentColor"
          />
        </svg>
      ),
      title: "100% Herbal",
      subtitle: "Pure & Natural",
    },
    {
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#0c4a2d]" viewBox="0 0 24 24" fill="none">
          <path
            d="M13.2 11.5L18.6 4.3C19.1 3.6 20.1 3.5 20.8 4C21.4 4.5 21.6 5.5 21 6.2L16 13"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.5 10.5C3.5 10.5 4 17.5 12 17.5C20 17.5 20.5 10.5 20.5 10.5H3.5Z"
            fill="currentColor"
          />
          <rect x="2.5" y="9" width="19" height="2" rx="1" fill="currentColor" />
          <path
            d="M8.5 17.5H15.5L16.5 20.5H7.5L8.5 17.5Z"
            fill="currentColor"
          />
        </svg>
      ),
      title: "Natural Ingredients",
      subtitle: "Ayurvedic Goodness",
    },
    {
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#0c4a2d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" strokeWidth="2.2" />
        </svg>
      ),
      title: "Safe & Trusted",
      subtitle: "Quality You Can Rely On",
    },
    {
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#0c4a2d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="12" height="9" rx="1" />
          <path d="M14 9h4.5l2.5 3v3h-7V9z" />
          <circle cx="6.5" cy="17.5" r="2" />
          <circle cx="17.5" cy="17.5" r="2" />
          <path d="M8.5 17.5h7" />
          <path d="M2 15h2.5" />
          <path d="M19.5 17.5h1.5" />
        </svg>
      ),
      title: "Easy Ordering",
      subtitle: "Hassle-Free Shopping",
      link: "/shop",
    },
    {
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#0c4a2d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 20.5l1.6-4.8A8 8 0 1 1 20 12a8 8 0 0 1-12.7 6.4L3 20.5z" />
          <path
            d="M8.8 9.5c.3-.6.6-.6 1-.4l1.1.8c.3.2.4.6.2.9l-.4.7c.4.8 1.1 1.5 1.9 1.9l.7-.4c.3-.2.7-.1.9.2l.8 1.1c.2.4.2.7-.4 1-.5.3-1.3.5-2.1.2-1.9-.8-3.4-2.3-4.2-4.2-.3-.8-.1-1.6.2-2.1.2-.2.4-.5.7-.7z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      ),
      title: "WhatsApp Support",
      subtitle: "Get Quick Assistance",
      externalLink: `https://wa.me/${whatsappNum}?text=Hello%20Varsha%20Ayurveda%2C%20I%20need%20assistance`,
    },
  ];

  return (
    <div className="flex flex-col w-full animate-fade-in">
      {/* ===== HERO + TRUST BADGES (100VH FIRST SCREEN VIEWPORT) ===== */}
      <div className="w-full min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-between relative">
        {/* ===== HERO SECTION (FIGMA DESIGN - 1440 OPTIMIZED) ===== */}
        <section
          className="relative w-full flex-1 flex flex-col justify-between overflow-hidden bg-[#eaf4ec] bg-cover bg-bottom bg-no-repeat"
          style={{
            backgroundImage: `url('/images/hero-bg.png')`,
          }}
        >
          <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-10 lg:px-14 flex-1 flex flex-col lg:flex-row items-center justify-between relative z-10 pt-24 sm:pt-28 lg:pt-24 xl:pt-28 pb-4 lg:pb-0">

            {/* Left Content Column */}
            <div className="w-full lg:w-[47%] xl:w-[45%] py-4 lg:py-6 text-center lg:text-left flex flex-col items-center lg:items-start justify-center z-20">

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[48px] 2xl:text-[52px] font-serif font-bold text-[#0c4328] leading-[1.15] tracking-tight mb-4">
                <span className="inline-block relative">
                  Natural Wellness,
                  {/* Decorative Leaf Accent matching Figma */}
                  <span className="inline-block ml-2.5 align-middle -mt-1 text-[#439648]">
                    <svg width="38" height="38" viewBox="0 0 36 36" fill="none" className="inline-block w-8 h-8 sm:w-9 sm:h-9 lg:w-9 lg:h-9">
                      <path d="M15 4C15 4 20.5 8.5 18.5 15.5C16.5 22 9.5 23.5 9.5 23.5C9.5 23.5 8.5 16.5 12 11C15 5.5 15 4 15 4Z" fill="#3ea043" />
                      <path d="M19.5 14C19.5 14 26.5 13 28.5 17C30.5 21 27.5 25 27.5 25C27.5 25 22.5 24 20.5 20C18.5 16 19.5 14 19.5 14Z" fill="#75ba5a" />
                      <path d="M8.5 23.5C13.5 21.5 18.5 18 22.5 13.5" stroke="#256b2a" strokeWidth="1.75" strokeLinecap="round" />
                    </svg>
                  </span>
                  {/* Subtle curved underline swoosh under Natural Wellness */}
                  <svg className="w-full h-3 text-[#3ea043]/60 absolute -bottom-1 left-0 pointer-events-none" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                    <path d="M2 9C60 3 140 3 198 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </span>
                <br />
                <span className="block mt-1">Rooted in Ayurveda</span>
              </h1>

              {/* Subheading */}
              <p className="text-sm sm:text-base lg:text-[15px] xl:text-[16px] text-[#374151] font-normal leading-relaxed max-w-[460px] mb-6 lg:mb-8 text-center lg:text-left">
                {heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-5 w-full">
                <Link
                  to="/shop"
                  className="bg-[#0c4a2d] hover:bg-[#083821] text-white px-7 sm:px-8 py-3 sm:py-3.5 rounded-full font-semibold text-sm sm:text-base inline-flex items-center gap-2.5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Shop Now</span>
                  <span className="text-lg">→</span>
                </Link>
                <Link
                  to="/shop"
                  className="bg-white hover:bg-emerald-50/50 text-[#0c4a2d] border-2 border-[#0c4a2d] px-7 sm:px-8 py-3 sm:py-3.5 rounded-full font-semibold text-sm sm:text-base inline-flex items-center transition-all duration-300 shadow-xs hover:shadow-sm"
                >
                  Explore Products
                </Link>
              </div>
            </div>

            {/* Right Product Image Column (Fully visible on table without clipping) */}
            <div className="w-full lg:w-[53%] xl:w-[55%] h-full flex items-end justify-center lg:justify-end self-end z-20 mt-4 lg:mt-0">
              <div className="relative w-full max-w-[620px] lg:max-w-[700px] xl:max-w-[780px] 2xl:max-w-[840px] h-full flex items-end justify-center lg:justify-end">
                <img
                  src="/images/hero-product.png"
                  alt="Varsha Ayurveda Herbal Products"
                  className="w-full h-auto max-h-[380px] sm:max-h-[440px] md:max-h-[480px] lg:max-h-[calc(100vh-230px)] xl:max-h-[560px] 2xl:max-h-[620px] object-contain object-bottom select-none pointer-events-none drop-shadow-sm transition-all duration-300"
                />
              </div>
            </div>

          </div>
        </section>

        {/* ===== TRUST BADGES BAR ===== */}
        <section className="bg-[#FAF8F5] border-y border-[#ECE7DE] py-3.5 sm:py-4 xl:py-4.5 shrink-0 relative z-20">
          <div className="container mx-auto px-4 xl:px-12">
            <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-y-4 gap-x-4 lg:gap-0">
              {trustBadges.map((badge, idx) => {
                const itemBody = (
                  <div className="flex items-center gap-3 sm:gap-3.5 flex-1 min-w-[190px] sm:min-w-[210px] lg:min-w-0 justify-start lg:justify-center px-1 lg:px-3 group transition-all duration-200">
                    {/* Outer circle border with dark green ring */}
                    <div className="w-11 h-11 sm:w-12 sm:h-12 xl:w-[48px] xl:h-[48px] rounded-full border-[1.8px] border-[#0c4a2d] bg-white flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-2xs">
                      {badge.icon}
                    </div>

                    {/* Text labels */}
                    <div className="text-left">
                      <h4 className="font-bold text-[13.5px] sm:text-[14px] xl:text-[14.5px] text-[#0c4a2d] leading-tight tracking-tight group-hover:text-[#06301d] transition-colors">
                        {badge.title}
                      </h4>
                      <p className="text-[11px] sm:text-[11.5px] xl:text-[12px] text-[#71717a] font-normal leading-tight mt-0.5 whitespace-nowrap">
                        {badge.subtitle}
                      </p>
                    </div>
                  </div>
                );

                return (
                  <React.Fragment key={idx}>
                    {badge.externalLink ? (
                      <a
                        href={badge.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contents"
                        title={badge.title}
                      >
                        {itemBody}
                      </a>
                    ) : badge.link ? (
                      <Link to={badge.link} className="contents" title={badge.title}>
                        {itemBody}
                      </Link>
                    ) : (
                      itemBody
                    )}

                    {/* Vertical divider line between badges on desktop */}
                    {idx < trustBadges.length - 1 && (
                      <div className="hidden lg:block h-7 w-[1px] bg-[#dfd9ce] flex-shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-16 md:py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-brand-600 font-semibold text-xs tracking-[0.2em] uppercase mb-2 block">
              OUR PRODUCTS
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Shop Our Products</h2>
            <p className="text-gray-500 mt-2 text-sm">Pure Ayurveda. Better Tomorrow.</p>
          </div>

          <div className="flex justify-end mb-6">
            <Link
              to="/shop"
              className="text-brand-800 font-semibold text-sm hover:text-brand-600 transition-colors flex items-center gap-1"
            >
              View All Products <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== SHOP BY CATEGORY BANNER SECTION ===== */}
      <section className="bg-white">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden shadow-xs border border-emerald-950/10 bg-[#eef7f0]">
            {/* Panoramic Botanical Background with Leaf Borders */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/category-banner-bg.jpg"
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover object-center pointer-events-none select-none"
              />
              {/* Soft overlay gradient for optimal legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/10 to-white/40 pointer-events-none" />
            </div>

            {/* Banner Content */}
            <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-10 py-5 sm:py-6 lg:py-8 xl:py-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 sm:gap-6 lg:gap-8">

              {/* Left Column: Heading, Subtitle & Explore All */}
              <div className="flex items-center justify-between lg:flex-col lg:items-start lg:justify-center flex-shrink-0 w-full lg:w-[240px] xl:w-[270px]">
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-[32px] xl:text-[34px] font-serif font-bold text-[#063b20] tracking-tight leading-tight">
                    Shop by Category
                  </h2>
                  <p className="text-xs sm:text-sm lg:text-[15px] text-gray-700 font-normal mt-0.5 lg:mt-1.5 lg:mb-5 leading-snug">
                    Choose what your body needs.
                  </p>
                </div>
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-1.5 bg-[#024424] hover:bg-[#01351c] text-white text-xs lg:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 group active:scale-95 shrink-0"
                >
                  <span>Explore All</span>
                  <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Right Column: 6 Category Cards (3-col on mobile, 6-col on desktop/tablet) */}
              <div className="w-full flex-1">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 xl:gap-3.5">
                  {displayCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/shop?category=${encodeURIComponent(cat.name)}`}
                      className="group bg-white rounded-xl sm:rounded-2xl p-2 sm:p-2.5 lg:p-3 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-emerald-950/5 flex flex-col items-center cursor-pointer"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-full aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden bg-[#faf6ee] flex items-center justify-center p-0.5 sm:p-1 relative border border-gray-100/70 shadow-2xs">
                        {cat.image ? (
                          <img
                            src={getImageUrl(cat.image)}
                            alt={cat.name}
                            className="w-full h-full object-cover rounded-md sm:rounded-lg group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                              const fallback = (e.target as HTMLElement).nextElementSibling;
                              if (fallback) fallback.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <span className={`${cat.image ? 'hidden' : ''} text-xl sm:text-2xl`}>🌿</span>
                      </div>

                      {/* Title */}
                      <span className="text-[11px] sm:text-xs lg:text-[13px] font-bold text-slate-800 text-center mt-1.5 sm:mt-2.5 group-hover:text-brand-800 transition-colors leading-tight px-0.5 line-clamp-2">
                        {cat.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE VARSHA AYURVEDA ===== */}
      <section className="py-8 md:py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
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
              <div className="relative overflow-hidden shadow-xs min-h-[190px] sm:min-h-[210px] md:min-h-[225px] flex items-center bg-[#dff0e4]">
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
                  <Link
                    to="/about"
                    className="inline-flex items-center justify-center bg-[#0c4024] hover:bg-[#124d2e] text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-200 shadow-sm mt-3.5 sm:mt-4 hover:shadow-md"
                  >
                    Learn More
                  </Link>
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
                  <Link
                    to="/blog"
                    className="text-xs sm:text-sm font-semibold text-[#1a5336] hover:text-[#0c4024] flex items-center gap-1.5 transition-colors group"
                  >
                    View All Blogs <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* 3 Blog Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
                  {(blogs.length >= 3 ? blogs.slice(0, 3) : DEFAULT_BLOGS).map(blog => (
                    <Link
                      key={blog.id || blog.slug}
                      to={`/blog/${blog.slug}`}
                      className="group flex flex-col"
                    >
                      <div className="w-full aspect-[16/8.5] rounded-xl overflow-hidden bg-gray-100 shadow-xs">
                        <img
                          src={blog.featuredImage || '/images/blog-wellness.png'}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="pt-2 flex flex-col">
                        <span className="text-[11px] sm:text-xs text-gray-400 font-normal">
                          {formatBlogDate(blog.createdAt)}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#1a5336] transition-colors leading-snug line-clamp-2 mt-0.5">
                          {blog.title}
                        </h4>
                        <span className="text-[11px] sm:text-xs font-semibold text-[#1a5336] group-hover:text-[#0c4024] inline-flex items-center gap-1 mt-1 transition-all">
                          Read More <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (Have Questions? & Follow Us) */}
            <div className="lg:col-span-4 xl:col-span-3 bg-[#edf5ee]/70 lg:bg-[#edf5ee]/60 p-5 sm:p-6 flex flex-col justify-between border border-emerald-100/60 shadow-xs">

              {/* Have Questions? Card */}
              <div className="bg-white/85 border border-[#b8dfc4] p-5 shadow-xs">
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
                  href={`https://wa.me/${whatsappNum}`}
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
                    <span className="text-sm sm:text-base font-bold text-white tracking-wider block mt-1 leading-tight">{displayPhone}</span>
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
                    href={`https://wa.me/${whatsappNum}`}
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
