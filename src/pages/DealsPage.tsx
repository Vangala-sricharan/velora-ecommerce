import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/common/ProductCard';
import { formatPrice } from '../utils/format';
import { Tag, Sparkles, Copy, Check, Clock, Flame } from 'lucide-react';

export const DealsPage: React.FC = () => {
  const { products, showToast } = useApp();
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [minDiscount, setMinDiscount] = useState<number>(0);

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCoupon(true);
    showToast('Promo code copied!', `Apply code "${code}" at checkout for instant savings.`);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  const dealProducts = products
    .filter((p) => p.discountPercentage >= minDiscount)
    .sort((a, b) => b.discountPercentage - a.discountPercentage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10" id="deals-page">
      {/* Deals Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-950 via-indigo-950 to-slate-950 text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-rose-900/40">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-500/30">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Exclusive Flash Reductions</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Deals you&apos;ll want to grab.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Discover curated limited-time discounts across top electronics, everyday wardrobe staples, wellness tech, and sports essentials.
          </p>

          {/* Coupon Code Pill */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
              <Tag className="w-4 h-4 text-rose-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-300 font-semibold uppercase">Demo Coupon</span>
                <span className="font-mono font-black text-sm tracking-wider text-white">VELORA10</span>
              </div>
              <button
                onClick={() => handleCopyCode('VELORA10')}
                className="ml-2 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                title="Copy promo code"
              >
                {copiedCoupon ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{copiedCoupon ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300 bg-black/30 px-3.5 py-2 rounded-xl border border-white/10">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Offers refresh weekly</span>
            </div>
          </div>
        </div>
      </div>

      {/* Discount Tier Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Special Pricing ({dealProducts.length} Offers)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Every marked item includes manufacturer warranty and standard return protection.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 shrink-0">
            Discount:
          </span>
          {[
            { label: 'All Deals', value: 0 },
            { label: '30%+ Off', value: 30 },
            { label: '33%+ Off', value: 33 },
          ].map((tier) => (
            <button
              key={tier.value}
              onClick={() => setMinDiscount(tier.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                minDiscount === tier.value
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dealProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
