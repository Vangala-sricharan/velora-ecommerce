import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES_DATA } from '../data/categories';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { ArrowRight, Layers, ShoppingBag } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { products } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" id="categories-page">
      {/* Header Banner */}
      <div className="max-w-3xl mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          <Layers className="w-3.5 h-3.5" />
          <span>Curated Departments</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
          Explore Categories
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          From cutting-edge audio and smart electronics to mindful living accessories and athletic performance gear, discover every collection designed for modern lifestyles.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CATEGORIES_DATA.map((category) => {
          const categoryProducts = products.filter((p) => p.category === category.name);

          return (
            <div
              key={category.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Category Cover Image */}
              <div className="relative aspect-video sm:aspect-4/3 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex flex-col justify-end p-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                    {categoryProducts.length} Curated Items
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-0.5">
                    {category.name}
                  </h2>
                </div>
              </div>

              {/* Description & Item Previews */}
              <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    {category.tagline}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Quick Product Pill Thumbnails */}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Featured in this category:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {categoryProducts.slice(0, 3).map((p) => (
                        <span
                          key={p.id}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate max-w-[180px]"
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Explore Action Button */}
                <button
                  onClick={() => navigate(`/shop?category=${encodeURIComponent(category.name)}`)}
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-800 hover:text-white dark:text-slate-200 dark:hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Explore {category.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
