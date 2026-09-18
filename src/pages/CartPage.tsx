import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/format';
import { CartItem } from '../types';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  ArrowLeft,
  Check,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, showToast } = useApp();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');

  // Cart Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = discountPercent > 0 ? Math.round((subtotal * discountPercent) / 100) : 0;
  const shipping = subtotal >= 1000 || subtotal === 0 ? 0 : 99;
  const tax = subtotal > 0 ? Math.round((subtotal - discountAmount) * 0.05) : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping + tax);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    if (promoCode.trim().toUpperCase() === 'VELORA10') {
      setDiscountPercent(10);
      setAppliedCode('VELORA10');
      showToast('Promo Code Applied', '10% discount applied to your order.');
      setPromoCode('');
    } else {
      showToast('Invalid Promo Code', 'Try using demo code "VELORA10".', 'warning');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center space-y-5" id="cart-empty-state">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Your cart is empty.
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Explore our collections to discover premium tech, fashion essentials, and lifestyle products.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/20"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8" id="cart-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {cart.reduce((t, i) => t + i.quantity, 0)} item(s) in your bag
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Main Grid: Items Left + Summary Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(({ product, quantity }: CartItem) => {
            const itemSubtotal = product.price * quantity;
            return (
              <div
                key={product.id}
                id={`cart-item-${product.id}`}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 shadow-xs"
              >
                {/* Product Thumbnail */}
                <Link
                  to={`/product/${product.slug}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-800"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {product.category}
                  </span>
                  <Link
                    to={`/product/${product.slug}`}
                    className="block font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate hover:text-blue-600 transition-colors"
                  >
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-slate-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  {/* Quantity */}
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 overflow-hidden">
                    <button
                      onClick={() => updateCartQuantity(product.id, quantity - 1)}
                      className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[80px]">
                    <span className="text-xs text-slate-400 block sm:hidden">Total:</span>
                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {formatPrice(itemSubtotal)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    aria-label={`Remove ${product.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Right Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Order Summary
            </h2>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
                Have a coupon?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. VELORA10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium uppercase placeholder-slate-400 uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                >
                  Apply
                </button>
              </div>
              {appliedCode && (
                <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded-lg">
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Coupon &quot;{appliedCode}&quot; (10% off)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setDiscountPercent(0);
                      setAppliedCode('');
                    }}
                    className="text-slate-400 hover:text-slate-600 text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Breakdown Calculations */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount</span>
                  <span className="font-semibold">-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {shipping === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400">
                  Add {formatPrice(1000 - subtotal)} more for free shipping!
                </p>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Estimated GST / Tax (5%)</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatPrice(tax)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  Grand Total
                </span>
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Safe demo checkout flow</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
