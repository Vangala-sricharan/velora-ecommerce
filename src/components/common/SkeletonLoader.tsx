import React from 'react';

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-4 animate-pulse"
        >
          <div className="w-full aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3" />
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-full" />
          <div className="pt-2 flex justify-between items-center">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3" />
            <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
      <div className="space-y-4">
        <div className="w-full aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="flex gap-3">
          <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
      <div className="space-y-5">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4" />
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-4/5" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3" />
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-md w-full" />
        <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
      </div>
    </div>
  );
};
