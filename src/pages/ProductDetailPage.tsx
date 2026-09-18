import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/format';
import { ProductCard } from '../components/common/ProductCard';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  Plus,
  Minus,
  MessageSquarePlus,
  AlertCircle,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    products,
    getProductBySlug,
    getProductById,
    addToCart,
    toggleWishlist,
    isInWishlist,
    reviewsMap,
    addReview,
    showToast,
  } = useApp();

  const product = id
    ? getProductBySlug(id) || (!isNaN(Number(id)) ? getProductById(Number(id)) : undefined)
    : undefined;

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');

  // Review Form state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product, id]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Product Not Found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The requested product could not be located in our catalog.
        </p>
        <Link
          to="/shop"
          className="inline-flex px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const reviews = reviewsMap[product.id] || [];

  // Related products from same category, excluding current
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Frequently bought together (complementary item from catalog)
  const bundleProduct = products.find(
    (p) => p.id !== product.id && (p.category === product.category || p.id === ((product.id % 24) + 1))
  );

  const handleAddBundleToCart = () => {
    if (!bundleProduct) return;
    addToCart(product, 1);
    addToCart(bundleProduct, 1);
    showToast('Bundle Added to Cart', `Added ${product.name} and ${bundleProduct.name} to your cart.`);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    const added = addToCart(product, quantity);
    if (added) {
      navigate('/checkout');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) {
      showToast('Incomplete Review', 'Please enter your name and comments.', 'warning');
      return;
    }
    addReview(product.id, {
      name: reviewerName.trim(),
      rating: reviewerRating,
      comment: reviewerComment.trim(),
      productPurchased: product.name,
    });
    setReviewerName('');
    setReviewerComment('');
    setShowReviewModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12" id="product-detail-page">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-blue-600 dark:hover:text-blue-400">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          to={`/shop?category=${encodeURIComponent(product.category)}`}
          className="hover:text-blue-600 dark:hover:text-blue-400"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main Showcase: Gallery Left + Info Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* LEFT: Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Stage */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-blue-600 text-white shadow-sm">
                {product.badge}
              </span>
            )}
            {product.discountPercentage > 0 && (
              <span className="absolute top-4 right-4 px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-500 text-white shadow-sm">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImage === imgUrl
                      ? 'border-blue-600 shadow-md scale-95'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Product Info & Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full">
                {product.category}
              </span>

              <div className="flex items-center gap-1.5 text-xs">
                {isOutOfStock ? (
                  <span className="text-rose-600 dark:text-rose-400 font-bold">Out of stock</span>
                ) : isLowStock ? (
                  <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Only {product.stock} units remaining
                  </span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} units)
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating Stars & Reviews */}
            <div className="flex items-center gap-3">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                  {product.rating}
                </span>
              </div>
              <span className="text-slate-400 text-xs">•</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {product.reviewCount} verified reviews
              </button>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-950 dark:text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-base text-slate-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md">
                    Save {formatPrice(product.originalPrice - product.price)} ({product.discountPercentage}%)
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Action Zone: Quantity + Add to Cart + Buy Now + Wishlist */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Quantity:
                </span>
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-slate-400">
                  Max: {product.stock}
                </span>
              </div>
            )}

            {/* Buttons Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 py-3.5 px-6 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Buy Now</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                aria-label="Save to wishlist"
                className={`p-3.5 rounded-xl border transition-colors flex items-center justify-center ${
                  isSaved
                    ? 'border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Assurance Badges */}
            <div className="pt-4 grid grid-cols-3 gap-2 text-center text-slate-500 dark:text-slate-400 text-xs">
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Free Shipping &gt; ₹1k</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Genuine</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>14-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Specifications & Reviews */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'specs'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Product Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'reviews'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Customer Reviews ({reviews.length})
          </button>
        </div>

        {activeTab === 'specs' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Technical Details & Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                >
                  <span className="font-semibold text-slate-500 dark:text-slate-400">{key}</span>
                  <span className="font-medium text-slate-900 dark:text-white text-right ml-2">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Shopper Feedback
              </h3>
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>Write a Review</span>
              </button>
            </div>

            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {rev.name}
                      </span>
                      <span className="text-xs text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-500">No customer reviews yet for this product.</p>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
                >
                  Be the first to write a review!
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Frequently Bought Together */}
      {bundleProduct && (
        <div className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-6" id="frequently-bought-together">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Bundle & Save
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              Frequently Bought Together
            </h2>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full lg:w-auto">
                {/* Main Item */}
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-100 dark:border-slate-800"
                  />
                  <div className="max-w-[150px] sm:max-w-[190px]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">This Item</span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">{product.name}</h4>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">{formatPrice(product.price)}</span>
                  </div>
                </div>

                <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>

                {/* Bundle Item */}
                <Link
                  to={`/product/${bundleProduct.slug}`}
                  className="flex items-center gap-3 group"
                >
                  <img
                    src={bundleProduct.image}
                    alt={bundleProduct.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-100 dark:border-slate-800 group-hover:opacity-90 transition-opacity"
                  />
                  <div className="max-w-[150px] sm:max-w-[190px]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Frequently Paired</span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">{bundleProduct.name}</h4>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">{formatPrice(bundleProduct.price)}</span>
                  </div>
                </Link>
              </div>

              {/* Price and CTA */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 gap-4">
                <div className="text-left sm:text-right">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Combined Bundle Total:</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {formatPrice(product.price + bundleProduct.price)}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {formatPrice(product.originalPrice + bundleProduct.originalPrice)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddBundleToCart}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Both to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* You May Also Like */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-6" id="you-may-also-like">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Recommended For You
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                You May Also Like
              </h2>
            </div>
            <Link
              to={`/shop?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View all in {product.category}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Write a Demo Review
            </h3>
            <p className="text-xs text-slate-500">
              Your review for &quot;{product.name}&quot; will be saved to local storage.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewerRating(star)}
                      className="p-1 text-amber-500"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= reviewerRating ? 'fill-current' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Your Comments
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="What did you like or dislike about this product?"
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
