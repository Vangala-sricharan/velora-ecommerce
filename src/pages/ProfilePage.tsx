import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice, formatDate } from '../utils/format';
import { Order } from '../types';
import {
  User,
  Mail,
  Shield,
  MapPin,
  Package,
  Calendar,
  LogOut,
  Edit2,
  Check,
  ArrowRight,
  Truck,
  Heart,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, logout, orders, wishlist, updateUserProfile, showToast } = useApp();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Please Sign In</h2>
        <p className="text-sm text-slate-500">Log in to view your profile, saved addresses, and previous orders.</p>
        <Link
          to="/login"
          className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Validation Error', 'Name and email are required.', 'warning');
      return;
    }
    updateUserProfile({ name: name.trim(), email: email.trim() });
    setIsEditing(false);
  };

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10" id="profile-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Account Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your personal profile, delivery locations, and view purchase history.
          </p>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: User Card & Quick Links */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-blue-500/20">
                {(user.fullName || user.name || 'U').charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                    {user.fullName || user.name || 'User'}
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 uppercase">
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Member since {user.joinedDate}</p>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-xl font-bold text-slate-900 dark:text-white block">
                  {orders.length}
                </span>
                <span className="text-[11px] text-slate-500">Total Orders</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-xl font-bold text-slate-900 dark:text-white block">
                  {wishlist.length}
                </span>
                <span className="text-[11px] text-slate-500">Wishlist Items</span>
              </div>
            </div>

            {/* Admin Console Shortcut if admin */}
            {user.role === 'admin' && (
              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    Administrator
                  </span>
                </div>
                <Link
                  to="/admin"
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  Admin Panel <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Recent Orders & Saved Address */}
        <div className="lg:col-span-8 space-y-6">
          {/* Recent Orders Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Recent Orders
                </h3>
              </div>
              <Link
                to="/orders"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View All ({orders.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order: Order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                          {order.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
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
                      <p className="text-xs text-slate-500">
                        {formatDate(order.date || order.createdAt || new Date().toISOString())} • {order.items.length} item(s)
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {formatPrice(order.totalAmount ?? order.total)}
                      </span>
                      <Link
                        to={`/order-confirmation/${order.id}`}
                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-blue-600 hover:bg-slate-100 transition-colors"
                      >
                        Receipt
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 space-y-2">
                <p className="text-xs">You haven&apos;t placed any orders yet.</p>
                <Link to="/shop" className="text-xs font-bold text-blue-600 hover:underline">
                  Start Shopping
                </Link>
              </div>
            )}
          </div>

          {/* Saved Address Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Default Delivery Address
                </h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                Primary
              </span>
            </div>

            <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
              <p className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</p>
              <p>Flat 402, Lotus Heights, MG Road</p>
              <p>Bengaluru, Karnataka - 560001, India</p>
              <p className="text-slate-500 pt-1">Contact: +91 98765 43210</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
