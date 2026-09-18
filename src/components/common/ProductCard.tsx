import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/format';
import { Star, Heart, ShoppingBag, Check, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const isSaved = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    setIsAdding(true);
    addToCart(product, 1);
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => navigate(`/product/${product.slug}`)}
      className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Badges / Top Indicators */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.badge && (
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-blue-600 text-white shadow-xs">
            {product.badge}
          </span>
        )}
        {product.discountPercentage > 0 && (
          <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-rose-500 text-white shadow-xs">
            {product.discountPercentage}% OFF
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        id={`product-wishlist-btn-${product.id}`}
        onClick={handleToggleWishlist}
        aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-transform duration-200 hover:scale-110 active:scale-95 shadow-sm ${
          isSaved
            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400'
            : 'bg-white/80 text-slate-600 hover:text-slate-950 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:text-white'
        }`}
      >
        <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
      </button>

      {/* Product Image Stage */}
      <div className="relative w-full aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
        )}
        <img
          src={imageError ? fallbackImage : product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Stock status overlay if out of stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-lg bg-slate-900/90 text-slate-200 text-xs font-bold uppercase tracking-wider border border-slate-700">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-blue-600 dark:text-blue-400">
            {product.category}
          </span>
          {isLowStock && (
            <span className="text-amber-600 dark:text-amber-400 font-medium text-[11px] flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Only {product.stock} left
            </span>
          )}
        </div>

        <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-snug line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed">
          {product.shortDescription}
        </p>

        {/* Rating & Review Count */}
        <div className="flex items-center gap-1.5 mt-2.5 mb-3">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="ml-1 text-xs font-bold text-slate-800 dark:text-slate-200">
              {product.rating}
            </span>
          </div>
          <span className="text-slate-400 text-xs">({product.reviewCount})</span>
        </div>

        {/* Price & Action Button */}
        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-950 dark:text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through font-normal">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            id={`product-add-btn-${product.id}`}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={`Add ${product.name} to cart`}
            className={`p-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center shrink-0 ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                : isAdding
                ? 'bg-emerald-600 text-white scale-95'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow-md'
            }`}
          >
            {isAdding ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
