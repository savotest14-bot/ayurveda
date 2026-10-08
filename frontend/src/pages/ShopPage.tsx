import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingBag, Search, Leaf } from 'lucide-react';
import { ProductCard } from '../components/ProductCard.js';
import { productService } from '../services/productService.js';
import { categoryService } from '../services/categoryService.js';
import { Product, Category } from '../types/index.js';
import { getImageUrl } from '../utils/imageUrl.js';

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  "Ayurvedic Wellness": "/images/cat-ayurvedic-wellness.svg",
  "Herbal Powders": "/images/cat-herbal-powders.jpg",
  "Capsules": "/images/cat-capsules.jpg",
  "Daily Wellness": "/images/cat-daily-wellness.jpg",
  "Energy & Stamina": "/images/cat-energy-stamina.svg",
  "Other Products": "/images/cat-other-products.svg",
};

const DEFAULT_SHOP_CATEGORIES: Category[] = [
  { id: 1, name: "Ayurvedic Wellness", slug: "ayurvedic-wellness", image: "/images/cat-ayurvedic-wellness.svg", active: true, sortOrder: 1 },
  { id: 2, name: "Herbal Powders", slug: "herbal-powders", image: "/images/cat-herbal-powders.jpg", active: true, sortOrder: 2 },
  { id: 3, name: "Capsules", slug: "capsules", image: "/images/cat-capsules.jpg", active: true, sortOrder: 3 },
  { id: 4, name: "Daily Wellness", slug: "daily-wellness", image: "/images/cat-daily-wellness.jpg", active: true, sortOrder: 4 },
  { id: 5, name: "Energy & Stamina", slug: "energy-stamina", image: "/images/cat-energy-stamina.svg", active: true, sortOrder: 5 },
  { id: 6, name: "Other Products", slug: "other-products", image: "/images/cat-other-products.svg", active: true, sortOrder: 6 },
];

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_SHOP_CATEGORIES);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync category from URL if changed
  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    setSelectedCategory(cat);
    const q = searchParams.get('search') || '';
    setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catData = await categoryService.getCategories();
        if (catData && catData.length > 0) {
          setCategories(catData);
        }
      } catch (err) {
        console.error('Error fetching categories', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getProducts({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchQuery.trim() || undefined
        });
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    if (categoryName === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryName);
    }
    setSearchParams(searchParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchParams.set('search', searchQuery.trim());
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-cream min-h-screen animate-fade-in">
      {/* Header Banner */}
      <div
        className="relative text-white py-14 md:py-20 bg-[#0c3c22] bg-cover bg-center bg-no-repeat overflow-hidden shadow-sm"
        style={{ backgroundImage: `url('/images/bannerimg.png')` }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-3 text-white drop-shadow-md">
            Shop All Products
          </h1>
          <p className="text-emerald-100 text-sm md:text-base max-w-xl mx-auto font-medium drop-shadow-xs">
            Explore our complete range of authentic Ayurvedic formulations.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Search Bar & Filter Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          {/* Category Filter Pills with Images */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none w-full lg:w-auto flex-nowrap lg:flex-wrap">
            {/* "All" Filter Button */}
            <button
              onClick={() => handleCategorySelect('All')}
              className={`flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-2xs shrink-0 select-none ${
                selectedCategory === 'All'
                  ? 'bg-[#0c4a2d] text-white shadow-md ring-2 ring-emerald-600/30'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-400 hover:text-brand-800 hover:bg-emerald-50/50'
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                selectedCategory === 'All' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-[#0c4a2d]'
              }`}>
                <Leaf size={14} />
              </div>
              <span>All</span>
            </button>

            {/* Category Pills with Image Thumbnails */}
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              const catImg = getImageUrl(cat.image) || CATEGORY_FALLBACK_IMAGES[cat.name] || '/images/cat-ayurvedic-wellness.svg';

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-2xs shrink-0 select-none ${
                    isSelected
                      ? 'bg-[#0c4a2d] text-white shadow-md ring-2 ring-emerald-600/30'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-400 hover:text-brand-800 hover:bg-emerald-50/50'
                  }`}
                >
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden flex items-center justify-center p-0.5 shrink-0 ${
                    isSelected ? 'bg-white/20' : 'bg-[#FAF8F5] border border-gray-100'
                  }`}>
                    <img
                      src={catImg}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/cat-ayurvedic-wellness.svg';
                      }}
                    />
                  </div>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Search input in shop page */}
          <form onSubmit={handleSearchSubmit} className="w-full lg:w-72 shrink-0">
            <div className="flex items-center bg-white rounded-full px-4 py-2 border border-gray-200 shadow-sm focus-within:border-brand-400">
              <Search size={16} className="text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search herbal products..."
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          </form>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-96 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100 p-8">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-800">No products found</p>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your category filter or search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setSearchParams({});
              }}
              className="mt-4 px-5 py-2.5 bg-brand-800 text-white rounded-lg text-sm font-semibold hover:bg-brand-900 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
