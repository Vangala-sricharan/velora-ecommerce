import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/format';
import { ShippingAddress, PaymentMethod, DeliveryOption, CartItem } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  Building2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Sparkles,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, user, createOrder, showToast } = useApp();
  const navigate = useNavigate();

  // If cart is empty, redirect
  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Cart is empty</h2>
        <p className="text-sm text-slate-500">Please add items to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm">
          Return to Shop
        </Link>
      </div>
    );
  }

  // Stepper state: 1 = Shipping, 2 = Delivery & Payment, 3 = Review & Place Order
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: user?.name || 'Aarav Patel',
    email: user?.email || 'aarav.patel@example.com',
    phone: '+91 98765 43210',
    street: 'Flat 402, Lotus Heights, MG Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560001',
    country: 'India',
  });

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryOption>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardDetails, setCardDetails] = useState({ number: '4532 •••• •••• 8921', expiry: '08/28', cvv: '•••' });
  const [upiId, setUpiId] = useState('aarav@okhdfcbank');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Financials
  const subtotal = cart.reduce((acc: number, item: CartItem) => acc + item.product.price * item.quantity, 0);
  const deliveryCost = deliveryMethod === 'express' ? 149 : subtotal >= 1000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + deliveryCost + tax;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (!shipping.fullName || !shipping.email || !shipping.street || !shipping.city || !shipping.postalCode) {
        showToast('Incomplete Address', 'Please fill in all required shipping fields.', 'warning');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    setTimeout(() => {
      const newOrder = createOrder({
        shippingAddress: shipping,
        paymentMethod: paymentMethod,
        deliveryMethod: deliveryMethod,
        deliveryCost: deliveryCost,
        discount: 0,
      });

      setIsPlacingOrder(false);
      showToast('Order Placed Successfully!', `Order #${newOrder.id} has been created.`);
      navigate(`/order-confirmation/${newOrder.id}`);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" id="checkout-page">
      {/* Checkout Progress Stepper */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-slate-200 dark:bg-slate-800 -z-10" />

          {[
            { step: 1, title: 'Shipping Address' },
            { step: 2, title: 'Delivery & Payment' },
            { step: 3, title: 'Review & Confirm' },
          ].map((s) => (
            <div
              key={s.step}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                currentStep === s.step
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : currentStep > s.step
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">
                {currentStep > s.step ? '✓' : s.step}
              </span>
              <span className="hidden sm:inline">{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT: Active Step Forms */}
        <div className="lg:col-span-8">
          {/* STEP 1: Shipping Address */}
          {currentStep === 1 && (
            <form onSubmit={handleNextStep} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Shipping Details</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Enter the delivery destination in India.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={shipping.fullName}
                    onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    PIN / Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={shipping.postalCode}
                    onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Street Address / House / Flat *
                  </label>
                  <input
                    type="text"
                    required
                    value={shipping.street}
                    onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={shipping.state}
                    onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-md shadow-blue-500/20"
                >
                  <span>Continue to Delivery & Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Delivery & Payment Options */}
          {currentStep === 2 && (
            <form onSubmit={handleNextStep} className="space-y-6">
              {/* Delivery Options */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span>Choose Delivery Option</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    onClick={() => setDeliveryMethod('standard')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      deliveryMethod === 'standard'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          Standard Shipping
                        </span>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {subtotal >= 1000 ? 'FREE' : '₹99'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Delivered within 3 to 5 business days.</p>
                    </div>
                  </label>

                  <label
                    onClick={() => setDeliveryMethod('express')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      deliveryMethod === 'express'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Express Air Delivery
                        </span>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">₹149</span>
                      </div>
                      <p className="text-xs text-slate-500">Priority dispatch, delivered in 24–48 hours.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Method (Simulated) */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-500" />
                      <span>Simulated Payment Method</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      *Demo checkout simulation. No real money will be charged.
                    </p>
                  </div>
                </div>

                {/* Method selector pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                    { id: 'upi', label: 'Instant UPI', icon: QrCode },
                    { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
                    { id: 'netbanking', label: 'Net Banking', icon: Building2 },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold flex flex-col gap-2 transition-all ${
                          paymentMethod === m.id
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-blue-600" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Conditional details */}
                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Simulated Card Information
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="text-[11px] text-slate-500 block mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-mono bg-white dark:bg-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500 block mb-1">Expiry</label>
                        <input
                          type="text"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-mono bg-white dark:bg-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Virtual Payment Address (UPI ID)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@upi"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-mono bg-white dark:bg-slate-900"
                    />
                    <p className="text-[11px] text-slate-500">Supports GPay, PhonePe, Paytm, BHIM</p>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300">
                    Pay in cash or through UPI QR code upon arrival at your doorstep.
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                    Supports HDFC Bank, ICICI Bank, State Bank of India, Axis Bank, and Kotak.
                  </div>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Address</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-md shadow-blue-500/20"
                >
                  <span>Review Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Order Review */}
          {currentStep === 3 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Review Your Order</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Verify items, shipping location, and total before placing the demo order.
                </p>
              </div>

              {/* Shipping Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                  <span>Ship to:</span>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Change
                  </button>
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{shipping.fullName} • {shipping.phone}</p>
                <p className="text-slate-600 dark:text-slate-400">{shipping.street}, {shipping.city}, {shipping.state} - {shipping.postalCode}</p>
                <p className="text-slate-500 pt-1 font-medium">Method: {deliveryMethod === 'express' ? 'Express Delivery (24-48h)' : 'Standard Delivery'}</p>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Purchased Items</h4>
                {cart.map(({ product, quantity }: CartItem) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h5 className="font-bold text-slate-900 dark:text-white">{product.name}</h5>
                        <p className="text-slate-400">Qty: {quantity} × {formatPrice(product.price)}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {isPlacingOrder ? (
                    <span>Processing Demo Order...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Place Order ({formatPrice(totalAmount)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-5 sticky top-24">
            <h3 className="font-bold text-base text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Payment Summary
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((t: number, i: CartItem) => t + i.quantity, 0)} items)</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {deliveryCost === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatPrice(deliveryCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (5% GST)</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(tax)}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline text-sm">
                <span className="font-bold text-slate-900 dark:text-white">Grand Total</span>
                <span className="text-xl font-black text-blue-600 dark:text-blue-400">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 space-y-1">
              <p className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Simulated Portfolio Checkout</span>
              </p>
              <p>All items and receipts are stored locally in your browser storage.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
