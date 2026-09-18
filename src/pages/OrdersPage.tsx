import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice, formatDate } from '../utils/format';
import { OrderStatus, Order, CartItem, Product } from '../types';
import { OrderTimeline } from '../components/common/OrderTimeline';
import {
  Package,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Printer,
  ShoppingBag,
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { orders, products, addToCart, showToast } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleReorder = (order: Order) => {
    let addedCount = 0;
    order.items.forEach((item) => {
      const prod = products.find((p: Product) => p.id === item.productId) || item.product;
      if (prod) {
        addToCart(prod, item.quantity);
        addedCount += item.quantity;
      }
    });
    showToast('Items Added to Cart', `${addedCount} item(s) from order ${order.id} re-added.`);
  };

  const filteredOrders = orders.filter((o: Order) => {
    if (selectedStatus === 'all') return true;
    return o.status === selectedStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8" id="orders-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Order History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track, review, or reorder past purchases. Stored locally in your browser.
          </p>
        </div>

        {/* Filter by status */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: 'All Orders', value: 'all' },
            { label: 'Processing', value: 'processing' },
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Shipped', value: 'shipped' },
            { label: 'Delivered', value: 'delivered' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setSelectedStatus(f.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedStatus === f.value
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order: Order) => {
            const isExpanded = !!expandedOrders[order.id];

            return (
              <div
                key={order.id}
                id={`order-card-${order.id}`}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4"
              >
                {/* Top Summary Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                          {order.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                            order.status.toLowerCase() === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : order.status.toLowerCase() === 'shipped'
                              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 mt-0.5 block">
                        Placed on {formatDate(order.date || order.createdAt || new Date().toISOString())} • Est. Arrival {order.estimatedDelivery}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Total Paid</span>
                      <span className="text-base font-bold text-slate-900 dark:text-white">
                        {formatPrice(order.totalAmount ?? order.total)}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Items preview */}
                <div className="space-y-3">
                  {order.items.map((item) => {
                    const prod = products.find((p: Product) => p.id === item.productId) || item.product;
                    return (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between py-1.5 text-xs sm:text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || prod?.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800"
                          />
                          <div>
                            <Link
                              to={prod ? `/product/${prod.slug}` : `/shop`}
                              className="font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors"
                            >
                              {item.name}
                            </Link>
                            <span className="text-xs text-slate-400 block">
                              Qty: {item.quantity} × {formatPrice(item.price)}
                            </span>
                          </div>
                        </div>

                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatPrice(item.subtotal || item.price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Expanded Details Panel */}
                {isExpanded && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <OrderTimeline
                        status={order.status}
                        orderDate={order.date || order.createdAt}
                        estimatedDelivery={order.estimatedDelivery}
                      />
                    </div>

                    <div className="text-xs grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block mb-1">
                          Shipping Address
                        </span>
                        <p className="text-slate-600 dark:text-slate-400">{order.shippingAddress.fullName || order.customer?.fullName}</p>
                        <p className="text-slate-600 dark:text-slate-400">{order.shippingAddress.street || order.shippingAddress.address}</p>
                        <p className="text-slate-600 dark:text-slate-400">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode || order.shippingAddress.pinCode}</p>
                      </div>

                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block mb-1">
                          Payment & Shipping
                        </span>
                        <p className="text-slate-600 dark:text-slate-400">Payment: {order.paymentMethod.toUpperCase()}</p>
                        <p className="text-slate-600 dark:text-slate-400">Shipping: {order.deliveryMethod === 'express' ? 'Express Air Courier' : 'Standard Delivery'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      Track Order & Receipt <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <button
                    onClick={() => handleReorder(order)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Reorder All Items</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
          <Package className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            No orders found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            You don&apos;t have any orders matching the &quot;{selectedStatus}&quot; filter.
          </p>
          <Link
            to="/shop"
            className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};
