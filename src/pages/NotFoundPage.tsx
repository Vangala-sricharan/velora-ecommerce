import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5" id="not-found-page">
      <div className="text-6xl font-black text-blue-600">404</div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Page Not Found</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        The page you are looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="pt-2 flex justify-center gap-3">
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Home</span>
        </Link>
        <Link
          to="/shop"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Browse Shop</span>
        </Link>
      </div>
    </div>
  );
};
