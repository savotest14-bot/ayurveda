import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types/index.js';
import { useCart } from '../context/CartContext.js';
import { getImageUrl } from '../utils/imageUrl.js';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const primaryImage = product.images?.find(i => i.isPrimary)?.url || product.images?.[0]?.url || '/images/mushroom-powder.png';
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const handleBuyNow = () => {
    addToCart(product, 1);
    navigate('/checkout');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col group h-full">
      {/* Image Container with Link */}
      <Link
        to={`/shop/${product.slug}`}
        className="relative aspect-square bg-cream p-5 flex items-center justify-center overflow-hidden block"
      >
        <img
          src={getImageUrl(primaryImage)}
          alt={product.name}
          className="object-contain h-full w-full transform group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/mushroom-powder.png';
          }}
        />

        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
            {discountPercent}% OFF
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/shop/${product.slug}`}>
          <h3 className="text-base font-bold text-gray-900 mb-1 leading-snug hover:text-brand-800 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {product.shortDescription || product.description}
        </p>

        <div className="flex items-center gap-2 mb-4 mt-auto">
          <span className="text-xl font-bold text-brand-900">₹{product.price}</span>
          {hasDiscount && (
            <>
              <span className="text-sm text-gray-400 line-through">₹{product.compareAtPrice}</span>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                {discountPercent}% OFF
              </span>
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-brand-800 text-white font-semibold py-2.5 rounded-lg hover:bg-brand-900 transition-colors flex justify-center items-center gap-1.5 text-sm"
          >
            <ShoppingCart size={15} /> Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-white text-brand-800 border border-brand-800 font-semibold py-2.5 rounded-lg hover:bg-brand-50 transition-colors text-sm"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};
