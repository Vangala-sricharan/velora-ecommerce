import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CATEGORIES_DATA } from '../data/categories';
import { DEMO_HOME_REVIEWS } from '../data/reviews';
import { ProductCard } from '../components/common/ProductCard';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Zap,
  Tag,
  Star,
  CheckCircle2,
  Mail,
  Clock,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, showToast } = useApp();
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Flash Sale Demo Countdown (2 hours, 45 minutes, 30 seconds default)
  const INITIAL_FLASH_SECONDS = 2 * 3600 + 45 * 60 + 30;
  const [flashSeconds, setFlashSeconds] = useState<number>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('velora_flash_timer') : null;
    return saved !== null ? Number(saved) : INITIAL_FLASH_SECONDS;
  });

  useEffect(() => {
    if (flashSeconds <= 0) return;
    const timer = setInterval(() => {
      setFlashSeconds((prev) => {
        const next = Math.max(0, prev - 1);
        try {
          localStorage.setItem('velora_flash_timer', String(next));
        } catch {
          // ignore
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [flashSeconds]);

  const resetFlashTimer = () => {
    setFlashSeconds(INITIAL_FLASH_SECONDS);
    try {
      localStorage.setItem('velora_flash_timer', String(INITIAL_FLASH_SECONDS));
    } catch {
      // ignore
    }
    showToast('Demo Timer Reset', 'Flash sale timer has been reset for demo purposes.', 'info');
  };

  const hours = Math.floor(flashSeconds / 3600);
  const minutes = Math.floor((flashSeconds % 3600) / 60);
  const seconds = flashSeconds % 60;
  const isFlashEnded = flashSeconds <= 0;

  // Trending products
  const trendingProducts = products.filter((p) => p.isTrending || p.badge === 'Trending').slice(0, 4);
  // Best seller products
  const bestSellers = products.filter((p) => p.isBestSeller || p.badge === 'Best Seller').slice(0, 4);
  // Deals products (highest discount)
  const dealsProducts = [...products]
    .sort((a, b) => b.discountPercentage - a.discountPercentage)
    .slice(0, 4);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address', undefined, 'warning');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed', "You're subscribed for demo purposes.");
    setNewsletterEmail('');
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16" id="home-page">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-slate-900/40 dark:via-slate-950 dark:to-slate-950 pt-8 sm:pt-14 pb-12 sm:pb-16 border-b border-slate-100 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>The Modern Online Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.15]">
                Everything you want. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300">
                  All in one place.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                Discover thoughtfully selected products, everyday essentials, and great deals with a seamless shopping experience.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/shop"
                  id="hero-shop-now-btn"
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm sm:text-base transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/deals"
                  id="hero-explore-deals-btn"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm sm:text-base border border-slate-200 dark:border-slate-800 transition-all flex items-center gap-2"
                >
                  <Tag className="w-4 h-4 text-rose-500" />
                  <span>Explore Deals</span>
                </Link>
              </div>

              {/* Quick confidence points */}
              <div className="pt-4 flex flex-wrap gap-5 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free delivery over ₹1,000
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 24 Curated Essentials
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant Local Storage
                </span>
              </div>
            </div>

            {/* Right Visual Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80"
                  alt="Pulse X1 Headphones"
                  className="w-full h-80 sm:h-96 object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    Featured Spotlight
                  </span>
                  <h3 className="text-xl font-bold mt-1">Pulse X1 Wireless Headphones</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <span className="text-2xl font-black text-white">₹2,499</span>
                      <span className="text-xs text-slate-300 line-through ml-2">₹3,499</span>
                    </div>
                    <Link
                      to="/product/pulse-x1-wireless-headphones"
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold transition-colors"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES (6 CATEGORIES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="featured-categories-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Explore Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Featured Categories
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            Browse All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES_DATA.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
              className="group flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 hover:shadow-lg transition-all duration-300 cursor-pointer text-left"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                {cat.tagline}
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                  Explore
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TRENDING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="trending-products-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>What&apos;s Hot</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Trending Products
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            View Entire Shop <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="best-sellers-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Best Sellers
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            See More Top Picks <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. FLASH SALE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="flash-sale-section">
        <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-indigo-900/40">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-current text-rose-400" />
                <span>Lightning Specials</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Flash Sale
              </h2>
              <p className="text-slate-300 text-sm sm:text-base">
                Limited-time demo deals.
              </p>
              <div className="text-[11px] text-slate-400 font-medium pt-1">
                *UI / Demo countdown for preview purposes. No real commercial deadline.
              </div>
            </div>

            {/* Countdown / Ended state */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {isFlashEnded ? (
                <div className="flex items-center gap-3 bg-rose-950/60 border border-rose-800/80 px-4 py-3 rounded-2xl">
                  <span className="text-sm font-bold text-rose-300">
                    Flash sale ended
                  </span>
                  <button
                    type="button"
                    onClick={resetFlashTimer}
                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Demo Timer</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl w-16 h-16 border border-white/15">
                      <span className="text-xl sm:text-2xl font-black font-mono">
                        {String(hours).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-blue-200">Hours</span>
                    </div>
                    <span className="text-xl font-bold text-white/60">:</span>
                    <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl w-16 h-16 border border-white/15">
                      <span className="text-xl sm:text-2xl font-black font-mono">
                        {String(minutes).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-blue-200">Mins</span>
                    </div>
                    <span className="text-xl font-bold text-white/60">:</span>
                    <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl w-16 h-16 border border-white/15 text-rose-400">
                      <span className="text-xl sm:text-2xl font-black font-mono">
                        {String(seconds).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-rose-200">Secs</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={resetFlashTimer}
                    title="Reset demo timer"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {dealsProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.slug}`)}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                      {p.category}
                    </span>
                    <h4 className="text-sm font-semibold text-white truncate group-hover:text-blue-200 transition-colors">
                      {p.name}
                    </h4>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-bold text-white">₹{p.price.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-slate-400 line-through">₹{p.originalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/80 text-white font-black text-[10px]">
                    {p.discountPercentage}% OFF
                  </span>
                  <span className="text-blue-300 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Claim Deal <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY VELORA? (4 Feature Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="why-velora-section">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            The VELORA Standard
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Why Velora?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Built from the ground up to deliver a modern, dependable e-commerce experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 text-left space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Secure Shopping</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Safe demo checkout flow, simulated payment options, and transparent local storage data persistence.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 text-left space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Fast Delivery</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Expedited dispatch simulation with real-time order tracking and free shipping on all orders over ₹1,000.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 text-left space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Easy Returns</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Hassle-free 14-day policy simulation. Manage and review your orders smoothly right from your profile dashboard.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 text-left space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quality Products</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every item in our 24-product catalogue is specified with genuine materials, weights, and detailed metrics.
            </p>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS (DEMO CONTENT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="customer-reviews-section">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <span>Verified Customer Reviews</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Loved by Shoppers Across India
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            *Demo feedback demonstrating verified shopper interactions and product satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEMO_HOME_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col justify-between text-left shadow-xs"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-2">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {rev.name}
                  </span>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>
                {rev.productPurchased && (
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium block truncate mt-0.5">
                    Purchased {rev.productPurchased}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. NEWSLETTER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="newsletter-section">
        <div className="rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center max-w-3xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-500/20">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
            Stay ahead of the deals.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            Subscribe for early bird drops, seasonal promotions, and curated product releases delivered straight to your inbox.
          </p>

          <form onSubmit={handleNewsletter} className="mt-6 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shrink-0 shadow-xs"
            >
              {subscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
          <p className="text-[11px] text-slate-500 mt-2">
            Demo subscription. Stored locally without external trackers.
          </p>
        </div>
      </section>
    </div>
  );
};
