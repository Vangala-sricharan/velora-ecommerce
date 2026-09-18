import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/common/ProductCard';
import { Product } from '../types';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, clearWishlist, addToCart, removeFromWishlist, showToast } = useApp();

  const handleMoveAllToCart = () => {
    if (wishlist.length === 0) return;
    let movedCount = 0;
    wishlist.forEach((p: Product) => {
      if (p.stock > 0) {
        addToCart(p, 1);
        removeFromWishlist(p.id);
        movedCount++;
      }
    });
    if (movedCount > 0) {
      showToast('Moved to Cart', `${movedCount} wishlist item(s) transferred to your cart.`);
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center space-y-5" id="wishlist-empty-state">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 flex items-center justify-center mx-auto text-rose-500">
          <Heart className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Your wishlist is empty.
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Save your favorite products as you browse so you can easily purchase them later.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/20"
        >
          <span>Explore Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8" id="wishlist-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {wishlist.length} item(s) saved for later
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMoveAllToCart}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Move In-Stock to Cart</span>
          </button>
          <button
            onClick={clearWishlist}
            className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
