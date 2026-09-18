import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory, OrderStatus } from '../types';
import { formatPrice, formatDate } from '../utils/format';
import { CATEGORIES_DATA } from '../data/categories';
import {
  ShieldCheck,
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  X,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const {
    products,
    orders,
    user,
    login,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    resetToDemoData,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Product Edit/Add Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Electronics' as ProductCategory,
    price: 999,
    originalPrice: 1299,
    stock: 25,
    shortDescription: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    badge: 'New Arrival',
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount ?? order.total ?? 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Electronics',
      price: 1499,
      originalPrice: 1999,
      stock: 20,
      shortDescription: 'Premium modern design with exceptional reliability.',
      description: 'Engineered with premium materials, precision craftsmanship, and durable hardware.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      badge: 'New Arrival',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      stock: p.stock,
      shortDescription: p.shortDescription,
      description: p.description,
      image: p.image,
      badge: p.badge || '',
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      showToast('Validation Error', 'Product name is required.', 'warning');
      return;
    }

    const discountPercentage =
      productForm.originalPrice > productForm.price
        ? Math.round(((productForm.originalPrice - productForm.price) / productForm.originalPrice) * 100)
        : 0;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...productForm,
        discountPercentage,
      });
      showToast('Product Updated', `"${productForm.name}" updated successfully.`);
    } else {
      const slug = productForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      addProduct({
        ...productForm,
        slug: slug || `product-${Date.now()}`,
        images: [productForm.image],
        rating: 4.8,
        reviewCount: 1,
        discountPercentage,
        isFeatured: true,
        specifications: {
          Category: productForm.category,
          Warranty: '1 Year Brand Warranty',
          Origin: 'Curated by VELORA',
        },
      });
      showToast('Product Created', `"${productForm.name}" added to catalog.`);
    }
    setIsProductModalOpen(false);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the catalogue?`)) {
      deleteProduct(id);
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  const filteredOrders = orders.filter((o) => {
    const q = orderSearch.toLowerCase();
    const customerName = o.shippingAddress?.fullName || o.customer?.fullName || '';
    return (
      o.id.toLowerCase().includes(q) ||
      customerName.toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8" id="admin-page">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Store Administration Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            VELORA Control Panel
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time management for catalog products, inventory stock, and customer orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Reset catalog and orders to default demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          {user?.role !== 'admin' && (
            <button
              onClick={() => login('admin@velora.store', 'Admin Manager', 'admin')}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
            >
              Sign In as Admin
            </button>
          )}
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {formatPrice(totalRevenue)}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block">
            Across {totalOrders} recorded transactions
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {totalOrders}
          </div>
          <span className="text-[11px] text-blue-600 font-semibold block">
            Processed via LocalStorage
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Catalogue Items</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {totalProducts}
          </div>
          <span className="text-[11px] text-slate-500 font-medium block">
            {outOfStockCount > 0 ? `${outOfStockCount} out of stock` : 'All items active'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Inventory Alerts</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {lowStockCount + outOfStockCount}
          </div>
          <span className="text-[11px] text-amber-600 font-medium block">
            {lowStockCount} low stock / {outOfStockCount} zero stock
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-xs sm:text-sm font-bold transition-all relative ${
            activeTab === 'overview'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Store Overview
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-xs sm:text-sm font-bold transition-all relative ${
            activeTab === 'products'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Product Management ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs sm:text-sm font-bold transition-all relative ${
            activeTab === 'orders'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Order Fulfillment ({orders.length})
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders in Admin */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Customer Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Manage All
                </button>
              </div>

              <div className="space-y-3">
                {orders.slice(0, 4).map((o) => (
                  <div
                    key={o.id}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{o.id}</span>
                        <span className="text-slate-400">• {o.shippingAddress?.fullName || o.customer?.fullName}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">{formatDate(o.date || o.createdAt || '')}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-slate-900 dark:text-white block">{formatPrice(o.totalAmount ?? o.total ?? 0)}</span>
                      <span className="text-[10px] uppercase font-bold text-blue-600">{o.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Inventory Stock Watch</h3>
                <button
                  onClick={() => setActiveTab('products')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  View Catalog
                </button>
              </div>

              <div className="space-y-3">
                {products
                  .filter((p) => p.stock <= 5)
                  .slice(0, 4)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl border border-amber-100 dark:border-amber-950/60 bg-amber-50/40 dark:bg-amber-950/20 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">{p.name}</h4>
                          <span className="text-slate-400 text-[11px]">{p.category}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-amber-600 dark:text-amber-400 block">
                          {p.stock === 0 ? 'Out of stock' : `${p.stock} units left`}
                        </span>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="text-[11px] text-blue-600 hover:underline font-semibold"
                        >
                          Update Stock
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search products by title or category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Stock</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block truncate max-w-xs">{p.name}</span>
                          <span className="text-[11px] text-slate-400">ID: {p.id} • Rating: {p.rating}★</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600 dark:text-slate-300">{p.category}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{formatPrice(p.price)}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-semibold ${
                          p.stock <= 0 ? 'text-rose-600' : p.stock <= 5 ? 'text-amber-600' : 'text-emerald-600'
                        }`}
                      >
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-600 dark:text-slate-300"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 text-slate-400"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-6">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search orders by ID, name, status..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Update Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">{o.id}</td>
                    <td className="py-3 px-3 text-slate-500">{formatDate(o.date || o.createdAt || '')}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-900 dark:text-white block">{o.shippingAddress?.fullName || o.customer?.fullName}</span>
                      <span className="text-[11px] text-slate-400">{o.shippingAddress?.city}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{o.items.length} item(s)</td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{formatPrice(o.totalAmount ?? o.total ?? 0)}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                          o.status.toLowerCase().includes('cancel')
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : o.status.toLowerCase().includes('deliver')
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : o.status.toLowerCase().includes('out for delivery')
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            : o.status.toLowerCase().includes('ship')
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                            : o.status.toLowerCase().includes('process')
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={`/orders/${o.id}`}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                  >
                    {CATEGORIES_DATA.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Best Seller"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Stock Units *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={productForm.shortDescription}
                  onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Demo Data Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Reset Demo Data
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                This will restore VELORA to its original demo state.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-500 dark:text-slate-400 space-y-1.5 border border-slate-100 dark:border-slate-800">
              <div className="font-semibold text-slate-700 dark:text-slate-200">The following will be reset:</div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                <li>24 Original catalog products & stock</li>
                <li>Shopping cart & saved wishlist</li>
                <li>Customer order records & statuses</li>
                <li>Notifications & recently viewed history</li>
                <li>Demo user profile and theme</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToDemoData();
                  setIsResetModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-md shadow-rose-600/20"
              >
                Reset Demo Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
