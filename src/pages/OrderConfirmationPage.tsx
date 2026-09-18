import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice, formatDate } from '../utils/format';
import { Order, CartItem } from '../types';
import { OrderTimeline } from '../components/common/OrderTimeline';
import {
  CheckCircle2,
  Package,
  Calendar,
  Truck,
  MapPin,
  CreditCard,
  Printer,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId, id } = useParams<{ orderId?: string; id?: string }>();
  const { orders } = useApp();
  const navigate = useNavigate();

  const targetId = id || orderId;
  const order = orders.find((o: Order) => o.id === targetId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Order Not Found</h2>
        <p className="text-sm text-slate-500">We could not find the order with ID {targetId}.</p>
        <Link to="/shop" className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8" id="order-confirmation-page">
      {/* Success Celebration Card */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
          Order Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
          Thank you for your order!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          We&apos;ve sent an order confirmation and tracking details to <strong>{order.customer?.email || order.shippingAddress?.email || 'your email'}</strong>.
        </p>
      </div>

      {/* Main Order Receipt Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-8 print:border-none print:shadow-none">
        {/* Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Order Number</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">
              {order.id}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Date Placed</span>
            <span className="font-semibold text-slate-900 dark:text-white text-xs mt-0.5 block">
              {formatDate(order.date || order.createdAt || new Date().toISOString())}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Estimated Arrival</span>
            <span className="font-semibold text-slate-900 dark:text-white text-xs mt-0.5 block">
              {order.estimatedDelivery}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Payment Status</span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 text-xs mt-0.5">
              Paid ({order.paymentMethod.toUpperCase()})
            </span>
          </div>
        </div>

        {/* Live Order Tracking Timeline */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
          <OrderTimeline
            status={order.status}
            orderDate={order.date || order.createdAt}
            estimatedDelivery={order.estimatedDelivery}
          />
        </div>

        {/* Shipping & Delivery Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Shipping Destination</span>
            </div>
            <p className="font-medium text-slate-800 dark:text-slate-200">{order.shippingAddress.fullName || order.customer?.fullName}</p>
            <p className="text-slate-500">{order.shippingAddress.street || order.shippingAddress.address}</p>
            <p className="text-slate-500">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode || order.shippingAddress.pinCode}</p>
            <p className="text-slate-500">Phone: {order.shippingAddress.phone || order.customer?.phone}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <Truck className="w-3.5 h-3.5 text-blue-600" />
              <span>Delivery Service</span>
            </div>
            <p className="font-medium text-slate-800 dark:text-slate-200">
              {order.deliveryMethod === 'express' ? 'Express Priority Courier' : 'Standard Surface Shipping'}
            </p>
            <p className="text-slate-500">Status: <span className="font-semibold text-blue-600 uppercase">{order.status}</span></p>
            <p className="text-slate-500">Carrier: BlueDart / Delhivery Express</p>
          </div>
        </div>

        {/* Product Items Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Purchased Items ({order.items.length})
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {order.items.map((item) => (
              <div key={item.productId} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{item.name}</h4>
                    <p className="text-xs text-slate-400">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatPrice(item.subtotal || item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 max-w-xs ml-auto space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {(order.shippingCost ?? order.shipping) === 0 ? 'FREE' : formatPrice(order.shippingCost ?? order.shipping)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Tax (5% GST)</span>
            <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(order.tax)}</span>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline text-sm">
            <span className="font-bold text-slate-900 dark:text-white">Total Paid</span>
            <span className="text-xl font-black text-blue-600 dark:text-blue-400">{formatPrice(order.totalAmount ?? order.total)}</span>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <div className="flex items-center gap-2">
            <Link
              to="/orders"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              View Order History
            </Link>
            <Link
              to="/shop"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
