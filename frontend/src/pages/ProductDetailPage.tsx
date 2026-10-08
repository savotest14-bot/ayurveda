import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Heart, ShieldCheck, Leaf, ArrowRight,
  MessageCircle, Plus, Minus, CheckCircle, Package, AlertCircle
} from 'lucide-react';
import { productService } from '../services/productService.js';
import { useCart } from '../context/CartContext.js';
import { useSettings } from '../context/SettingsContext.js';
import { ProductCard } from '../components/ProductCard.js';
import { Product } from '../types/index.js';
import { getImageUrl } from '../utils/imageUrl.js';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { settings } = useSettings();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'usage'>('benefits');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const prod = await productService.getProductBySlug(slug);
        setProduct(prod);

        const initialImg = prod.images?.find(i => i.isPrimary)?.url || prod.images?.[0]?.url || '/images/mushroom-powder.png';
        setSelectedImage(initialImg);
        setQuantity(1);

        // Fetch related products
        const related = await productService.getProducts({
          category: prod.category?.name
        });
        setRelatedProducts(related.products?.filter((p: Product) => p.id !== prod.id).slice(0, 4) || []);
      } catch (err) {
        console.error('Failed to load product detail', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-brand-800 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Loading herbal formulation...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <AlertCircle size={48} className="mx-auto text-gray-400 mb-3" />
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The requested Ayurvedic product does not exist or has been removed.</p>
        <Link to="/shop" className="px-6 py-3 bg-brand-800 text-white rounded-xl font-bold hover:bg-brand-900 transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const whatsappNum = settings?.whatsappNumber || '919907303284';
  const handleWhatsAppInquiry = () => {
    const text = `🌿 Hello Varsha Ayurveda! I am interested in purchasing:\n\n*${product.name}*\nPrice: ₹${product.price} (Qty: ${quantity})\n\nPlease provide availability and delivery information. Thank you!`;
    const url = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-cream min-h-screen py-10 animate-fade-in">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-brand-800 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-brand-800 transition-colors">Shop</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link to={`/shop?category=${encodeURIComponent(product.category.name)}`} className="hover:text-brand-800 transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-800 font-medium truncate">{product.name}</span>
        </div>

        {/* Main Product Layout */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Images Section */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square bg-cream rounded-2xl p-8 flex items-center justify-center border border-gray-100 overflow-hidden group">
              <img
                src={getImageUrl(selectedImage)}
                alt={product.name}
                className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/mushroom-powder.png';
                }}
              />
              {discountPercent > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                  {discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    className={`w-20 h-20 rounded-xl bg-cream border-2 p-1 flex-shrink-0 overflow-hidden transition-all ${
                      selectedImage === img.url ? 'border-brand-800 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={getImageUrl(img.url)} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Purchase Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1 rounded-full mb-3">
                <Leaf size={12} /> {product.category?.name || '100% Herbal formulation'}
              </div>

              <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3 leading-tight">
                {product.name}
              </h1>

              {product.weight && (
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Package size={14} className="text-brand-600" /> Net Quantity: <span className="text-gray-700 font-bold">{product.weight}</span>
                </p>
              )}

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mb-6 border-b border-gray-100 pb-5">
                <span className="text-3xl font-bold text-brand-900">₹{product.price}</span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-gray-400 line-through">₹{product.compareAtPrice}</span>
                    <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                      Save ₹{product.compareAtPrice! - product.price} ({discountPercent}%)
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                    <CheckCircle size={16} /> In Stock ({product.stock} units available)
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
                    <AlertCircle size={16} /> Currently Out of Stock
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-bold text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-50 text-gray-600"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center text-sm font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 hover:bg-gray-50 text-gray-600"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  disabled={product.stock <= 0}
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 bg-brand-800 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-brand-900 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
                <button
                  disabled={product.stock <= 0}
                  onClick={handleBuyNow}
                  className="flex-1 bg-white text-brand-800 border-2 border-brand-800 font-bold py-3.5 px-6 rounded-xl hover:bg-brand-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  Buy Now <ArrowRight size={18} />
                </button>
              </div>

              <button
                onClick={handleWhatsAppInquiry}
                className="w-full bg-whatsapp text-white font-bold py-3 px-6 rounded-xl hover:bg-whatsapp-dark transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
              >
                <MessageCircle size={18} /> Quick Order / Ask on WhatsApp
              </button>
            </div>

            {/* Assurance Badges */}
            <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-6 mt-6 text-center text-xs text-gray-600">
              <div className="flex flex-col items-center gap-1">
                <Leaf className="text-brand-700" size={20} />
                <span className="font-semibold text-gray-800">100% Herbal</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="text-brand-700" size={20} />
                <span className="font-semibold text-gray-800">Quality Verified</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Package className="text-brand-700" size={20} />
                <span className="font-semibold text-gray-800">Direct Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Ingredients, Benefits & Usage */}
        <div className="mt-12 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
          <div className="flex border-b border-gray-200 gap-6 md:gap-10 mb-6">
            <button
              onClick={() => setActiveTab('benefits')}
              className={`pb-3 font-serif font-bold text-base md:text-lg transition-colors relative ${
                activeTab === 'benefits' ? 'text-brand-900 border-b-2 border-brand-800' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              Key Benefits
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`pb-3 font-serif font-bold text-base md:text-lg transition-colors relative ${
                activeTab === 'ingredients' ? 'text-brand-900 border-b-2 border-brand-800' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`pb-3 font-serif font-bold text-base md:text-lg transition-colors relative ${
                activeTab === 'usage' ? 'text-brand-900 border-b-2 border-brand-800' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              How to Use
            </button>
          </div>

          <div className="text-sm md:text-base text-gray-600 leading-relaxed min-h-[120px]">
            {activeTab === 'benefits' && (
              <div className="space-y-3">
                {product.benefits ? (
                  product.benefits.split(';').map((b, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle size={18} className="text-brand-700 flex-shrink-0 mt-0.5" />
                      <span>{b.trim()}</span>
                    </div>
                  ))
                ) : (
                  <p>Promotes everyday balance, natural vitality, and metabolic health.</p>
                )}
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div>
                <p className="font-semibold text-gray-900 mb-2">Ayurvedic Composition:</p>
                <p className="bg-cream p-4 rounded-xl border border-brand-100 text-gray-700">
                  {product.ingredients || "Traditional classical herbal extract blend without artificial preservatives."}
                </p>
              </div>
            )}

            {activeTab === 'usage' && (
              <div>
                <p className="font-semibold text-gray-900 mb-2">Recommended Regimen:</p>
                <p className="bg-cream p-4 rounded-xl border border-brand-100 text-gray-700">
                  {product.usage || "Take as directed on packaging or consult an Ayurvedic physician."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-8">
              Similar Herbal Formulations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
