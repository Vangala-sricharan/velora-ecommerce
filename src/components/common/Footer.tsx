import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, ArrowRight, Heart, Mail, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const { showToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Invalid Email', 'Please provide a valid email address.', 'warning');
      return;
    }
    setIsSubscribed(true);
    showToast('Subscribed', "You're subscribed for demo purposes.");
    setNewsletterEmail('');
  };

  return (
    <footer
      id="main-footer"
      className="bg-slate-900 text-slate-400 dark:bg-slate-950 border-t border-slate-800 pt-16 pb-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1 & 2: Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg">
                V
              </div>
              <span className="text-2xl font-black tracking-wider text-white uppercase font-sans">
                VELORA
              </span>
            </Link>
            <p className="text-sm text-slate-300 font-medium">
              &quot;Shop smarter. Live better.&quot;
            </p>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              A modern multi-category e-commerce platform designed for a seamless and intuitive
              shopping experience. Crafted with precision for everyday essentials, electronics, fashion, and lifestyle.
            </p>

            <div className="pt-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Stay ahead of the deals
              </h4>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-1 shrink-0"
                >
                  {isSubscribed ? <Check className="w-4 h-4" /> : 'Subscribe'}
                </button>
              </form>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Demo authentication & local state. No spam ever.
              </p>
            </div>
          </div>

          {/* Col 3: Shop */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-white transition-colors">
                  Daily Deals
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Electronics" className="hover:text-white transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Fashion" className="hover:text-white transition-colors">
                  Fashion & Streetwear
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Sports%20%26%20Fitness" className="hover:text-white transition-colors">
                  Sports & Fitness
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Categories */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop?category=Home%20%26%20Living" className="hover:text-white transition-colors">
                  Home & Living
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Accessories" className="hover:text-white transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Beauty%20%26%20Personal%20Care" className="hover:text-white transition-colors">
                  Beauty & Personal Care
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition-colors">
                  Browse All Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Support & Company */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  User Dashboard
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 VELORA. Personal Portfolio Project.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">All prices displayed in Indian Rupees (₹)</span>
            <span className="text-slate-600">•</span>
            <span>Client-side SPA with LocalStorage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
