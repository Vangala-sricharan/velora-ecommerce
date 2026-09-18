import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/common/ProductCard';
import { ProductCategory, Product } from '../types';
import { CATEGORIES_DATA } from '../data/categories';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Check,
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { products } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params
  const urlCategory = searchParams.get('category') || 'All';
  const urlSearch = searchParams.get('search') || '';

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [searchQuery, setSearchQuery] = useState<string>(urlSearch);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Sync state with URL params if changed
  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category') || 'All');
    }
    if (searchParams.get('search')) {
      setSearchQuery(searchParams.get('search') || '');
    }
  }, [searchParams]);

  // Compute filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // Search query filter (name, category, description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesShort = product.shortDescription.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesDesc && !matchesShort) {
          return false;
        }
      }

      // Price filter
      if (product.price > maxPrice) {
        return false;
      }

      // Rating filter
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }

      // Stock availability filter
      if (inStockOnly && product.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return b.discountPercentage - a.discountPercentage;
      if (sortBy === 'newest') return b.id - a.id;
      // Default: featured
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, maxPrice, minRating, inStockOnly, sortBy]);

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMaxPrice(5000);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  const handleCategorySelect = (catName: string) => {
    setSelectedCategory(catName);
    if (catName === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catName);
    }
    setSearchParams(searchParams);
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    searchQuery.trim() !== '' ||
    maxPrice < 5000 ||
    minRating > 0 ||
    inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" id="shop-page">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Marketplace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Shop all products
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {/* Quick search input */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, spec, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Active filters:
            </span>
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                Category: {selectedCategory}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-blue-900"
                  onClick={() => handleCategorySelect('All')}
                />
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                Search: &quot;{searchQuery}&quot;
                <X
                  className="w-3 h-3 cursor-pointer hover:text-blue-900"
                  onClick={() => setSearchQuery('')}
                />
              </span>
            )}
            {maxPrice < 5000 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                Under ₹{maxPrice.toLocaleString('en-IN')}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-blue-900"
                  onClick={() => setMaxPrice(5000)}
                />
              </span>
            )}
            {minRating > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                {minRating}★ & above
                <X
                  className="w-3 h-3 cursor-pointer hover:text-blue-900"
                  onClick={() => setMinRating(0)}
                />
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                In Stock Only
                <X
                  className="w-3 h-3 cursor-pointer hover:text-blue-900"
                  onClick={() => setInStockOnly(false)}
                />
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 ml-1 inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Left Filter Panel */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span>Filters</span>
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Categories
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategorySelect('All')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedCategory === 'All'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[11px] text-slate-400">{products.length}</span>
                </button>

                {CATEGORIES_DATA.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.name)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedCategory === cat.name
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[11px] text-slate-400">
                      {products.filter((p) => p.category === cat.name).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Max Price
                </h4>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  ₹{maxPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>₹500</span>
                <span>₹5,000</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Minimum Rating
              </h4>
              <div className="space-y-1">
                {[
                  { label: 'All Ratings', value: 0 },
                  { label: '4.7 ★ and above', value: 4.7 },
                  { label: '4.5 ★ and above', value: 4.5 },
                  { label: '4.0 ★ and above', value: 4.0 },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setMinRating(item.value)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      minRating === item.value
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{item.label}</span>
                    {minRating === item.value && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded-md text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span>In Stock items only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Right Product Grid Section */}
        <main className="lg:col-span-3 space-y-6">
          {/* Sorting Dropdown Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Showing <strong>{filteredProducts.length}</strong> items
            </span>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="shop-sort-select" className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Sort by:
              </label>
              <select
                id="shop-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="featured">Featured Picks</option>
                <option value="newest">Newest Additions</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>

          {/* Product Grid or Empty State */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                No products found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                We couldn&apos;t find any products matching your current filters or query. Try resetting or adjusting your search parameters.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
              >
                Clear Search & Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Modal Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 space-y-6 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Filter Products
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategorySelect(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
              >
                <option value="All">All Categories ({products.length})</option>
                {CATEGORIES_DATA.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                <span>Max Price</span>
                <span>₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* In stock */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded-sm text-blue-600 w-4 h-4"
                />
                <span>In Stock only</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  handleClearFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
