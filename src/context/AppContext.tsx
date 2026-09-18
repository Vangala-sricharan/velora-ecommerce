import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Product, CartItem, Order, UserProfile, ToastMessage, OrderStatus, ProductReview } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_REVIEWS } from '../data/reviews';
import { STORAGE_KEYS, getFromStorage, setToStorage, removeFromStorage } from '../utils/storage';

interface AppContextType {
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => boolean;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotals: {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
  };

  // Wishlist
  wishlist: Product[];
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
  moveToCart: (product: Product) => void;
  wishlistCount: number;

  // Products (with Admin capabilities)
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (productOrId: number | Product, updated?: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  updateStock: (id: number, newStock: number) => void;
  getProductById: (id: number) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  resetToDemoData: () => void;

  // Orders
  orders: Order[];
  createOrder: (orderPayload: any) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // User Auth
  currentUser: UserProfile | null;
  user: UserProfile | null;
  login: (email: string, pass?: string, role?: string) => { success: boolean; error?: string };
  register: (fullName: string, email: string, pass?: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  updateUserProfile: (updatedData: Partial<UserProfile>) => void;

  // Reviews
  reviewsMap: Record<number, ProductReview[]>;
  addReview: (productId: number, review: Omit<ProductReview, 'id' | 'date'>) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEMO_DEFAULT_USER: UserProfile = {
  id: 'usr_velora_01',
  fullName: 'Arjun Mehta',
  name: 'Arjun Mehta',
  role: 'customer',
  email: 'arjun.mehta@example.com',
  phone: '+91 98765 43210',
  address: '42, Sunrise Boulevard, Sector 15',
  street: '42, Sunrise Boulevard, Sector 15',
  city: 'Bengaluru',
  state: 'Karnataka',
  pinCode: '560001',
  postalCode: '560001',
  joinedDate: '15 Jan 2026',
};

const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'VEL-9428',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        productId: 1,
        name: 'Pulse X1 Wireless Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        price: 2499,
        quantity: 1,
        subtotal: 2499,
      },
      {
        productId: 12,
        name: 'BrewMate Ceramic Mug',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
        price: 499,
        quantity: 2,
        subtotal: 998,
      },
    ],
    subtotal: 3497,
    discount: 300,
    shipping: 0,
    tax: 160,
    total: 3357,
    customer: {
      fullName: 'Arjun Mehta',
      email: 'arjun.mehta@example.com',
      phone: '+91 98765 43210',
    },
    shippingAddress: {
      address: '42, Sunrise Boulevard, Sector 15',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560001',
    },
    paymentMethod: 'UPI',
    status: 'Delivered',
    estimatedDelivery: 'Delivered on Sep 17, 2026',
  },
  {
    id: 'VEL-7812',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        productId: 3,
        name: 'NovaFit Smartwatch',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
        price: 2999,
        quantity: 1,
        subtotal: 2999,
      },
    ],
    subtotal: 2999,
    discount: 0,
    shipping: 0,
    tax: 150,
    total: 3149,
    customer: {
      fullName: 'Arjun Mehta',
      email: 'arjun.mehta@example.com',
      phone: '+91 98765 43210',
    },
    shippingAddress: {
      address: '42, Sunrise Boulevard, Sector 15',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560001',
    },
    paymentMethod: 'Credit / Debit Card',
    status: 'Shipped',
    estimatedDelivery: 'Expected by tomorrow, 4:00 PM',
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return getFromStorage<boolean>(STORAGE_KEYS.THEME, false);
  });

  useEffect(() => {
    setToStorage(STORAGE_KEYS.THEME, isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = getFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    if (saved && saved.length > 0) return saved;
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    setToStorage(STORAGE_KEYS.PRODUCTS, products);
  }, [products]);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    return getFromStorage<CartItem[]>(STORAGE_KEYS.CART, []);
  });

  useEffect(() => {
    setToStorage(STORAGE_KEYS.CART, cart);
  }, [cart]);

  // Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    return getFromStorage<Product[]>(STORAGE_KEYS.WISHLIST, []);
  });

  useEffect(() => {
    setToStorage(STORAGE_KEYS.WISHLIST, wishlist);
  }, [wishlist]);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
    if (saved && saved.length > 0) return saved;
    return INITIAL_DEMO_ORDERS;
  });

  useEffect(() => {
    setToStorage(STORAGE_KEYS.ORDERS, orders);
  }, [orders]);

  // Current User State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return getFromStorage<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, DEMO_DEFAULT_USER);
  });

  useEffect(() => {
    if (currentUser) {
      setToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
    } else {
      removeFromStorage(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  // Reviews State
  const [reviewsMap, setReviewsMap] = useState<Record<number, ProductReview[]>>(() => {
    return getFromStorage<Record<number, ProductReview[]>>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  });

  useEffect(() => {
    setToStorage(STORAGE_KEYS.REVIEWS, reviewsMap);
  }, [reviewsMap]);

  // Toasts State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (
    title: string,
    description?: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'success'
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Product CRUD
  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newId = Math.max(...products.map((p) => p.id), 0) + 1;
    const newProduct: Product = {
      ...newProdData,
      id: newId,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast('Product added', `${newProduct.name} is now available in the store.`);
  };

  const updateProduct = (productOrId: number | Product, updated?: Partial<Product>) => {
    if (typeof productOrId === 'number') {
      setProducts((prev) =>
        prev.map((p) => (p.id === productOrId ? { ...p, ...updated } : p))
      );
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === productOrId.id ? { ...productOrId } : p))
      );
    }
    showToast('Product updated', 'Product catalog has been refreshed.');
  };

  const deleteProduct = (id: number) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Also remove from cart and wishlist if present
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    setWishlist((prev) => prev.filter((p) => p.id !== id));
    showToast('Product deleted', `${target?.name || 'Item'} has been removed.`, 'info');
  };

  const updateStock = (id: number, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, newStock) } : p))
    );
    showToast('Stock updated', `Inventory count modified to ${newStock}.`, 'info');
  };

  const getProductById = (id: number): Product | undefined => {
    return products.find((p) => p.id === id);
  };

  const getProductBySlug = (slug: string): Product | undefined => {
    return products.find((p) => p.slug === slug || p.id.toString() === slug);
  };

  // Cart Operations
  const addToCart = (product: Product, quantity = 1): boolean => {
    // Check available stock
    const currentItem = cart.find((item) => item.product.id === product.id);
    const currentQtyInCart = currentItem ? currentItem.quantity : 0;
    const availableStock = product.stock;

    if (availableStock <= 0) {
      showToast('Out of Stock', `${product.name} is currently unavailable.`, 'warning');
      return false;
    }

    if (currentQtyInCart + quantity > availableStock) {
      showToast(
        'Stock Limit Reached',
        `Only ${availableStock} units available for ${product.name}.`,
        'warning'
      );
      return false;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    showToast('Added to cart', `${product.name} has been added to your bag.`);
    return true;
  };

  const removeFromCart = (productId: number) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      showToast('Removed from cart', `${item.product.name} was removed.`, 'info');
    }
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    const item = cart.find((i) => i.product.id === productId);
    if (!item) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (quantity > item.product.stock) {
      showToast(
        'Stock Limit Reached',
        `Maximum available stock is ${item.product.stock}.`,
        'warning'
      );
      return;
    }

    setCart((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartTotals = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    // Free shipping if subtotal >= 1000 or empty, else 99
    const shipping = subtotal >= 1000 || subtotal === 0 ? 0 : 99;
    // 5% standard demo tax / GST
    const tax = subtotal > 0 ? Math.round(subtotal * 0.05) : 0;
    // Estimated bundle discount
    const discount = 0;
    const total = subtotal - discount + shipping + tax;

    return {
      subtotal,
      discount,
      shipping,
      tax,
      total,
    };
  }, [cart]);

  // Wishlist Operations
  const isInWishlist = (productId: number): boolean => {
    return wishlist.some((p) => p.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      showToast('Removed from wishlist', `${product.name} removed from saved items.`, 'info');
    } else {
      setWishlist((prev) => [product, ...prev]);
      showToast('Added to wishlist', `${product.name} saved for later.`);
    }
  };

  const removeFromWishlist = (productId: number) => {
    const target = wishlist.find((p) => p.id === productId);
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
    if (target) {
      showToast('Removed from wishlist', `${target.name} removed from saved items.`, 'info');
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    showToast('Wishlist cleared', 'All saved items removed.', 'info');
  };

  const moveToCart = (product: Product) => {
    const added = addToCart(product, 1);
    if (added) {
      removeFromWishlist(product.id);
    }
  };

  const wishlistCount = wishlist.length;

  const resetToDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_DEMO_ORDERS);
    setReviewsMap(INITIAL_REVIEWS);
    setCart([]);
    setWishlist([]);
    setCurrentUser(DEMO_DEFAULT_USER);
    setIsDarkMode(false);
    setToStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setToStorage(STORAGE_KEYS.ORDERS, INITIAL_DEMO_ORDERS);
    setToStorage(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    setToStorage(STORAGE_KEYS.CURRENT_USER, DEMO_DEFAULT_USER);
    removeFromStorage(STORAGE_KEYS.CART);
    removeFromStorage(STORAGE_KEYS.WISHLIST);
    removeFromStorage(STORAGE_KEYS.RECENTLY_VIEWED);
    removeFromStorage(STORAGE_KEYS.NOTIFICATIONS);
    removeFromStorage(STORAGE_KEYS.COUPONS);
    removeFromStorage(STORAGE_KEYS.ADMIN_STATE);
    removeFromStorage(STORAGE_KEYS.THEME);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
    }
    showToast('Demo data restored', 'This will restore VELORA to its original demo state.');
  };

  // Order Operations
  const createOrder = (orderPayload: any): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `VEL-${randomSuffix}`;
    const orderDate = new Date().toISOString();

    const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const estimatedDelivery = `Expected delivery by ${deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })}`;

    const orderItems = orderPayload.items || cart.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      image: item.product.image,
      price: item.product.price,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity,
      product: item.product,
    }));

    const calculatedSubtotal = orderPayload.subtotal ?? cartTotals.subtotal;
    const calculatedShipping =
      orderPayload.shippingCost ??
      orderPayload.deliveryCost ??
      orderPayload.shipping ??
      cartTotals.shipping;
    const calculatedDiscount = orderPayload.discount ?? 0;
    const calculatedTax = orderPayload.tax ?? Math.round(calculatedSubtotal * 0.05);
    const calculatedTotal =
      orderPayload.total ??
      orderPayload.totalAmount ??
      calculatedSubtotal - calculatedDiscount + calculatedShipping + calculatedTax;

    const customerInfo = orderPayload.customer || {
      fullName:
        orderPayload.shippingAddress?.fullName ||
        currentUser?.fullName ||
        'Valued Customer',
      email:
        orderPayload.shippingAddress?.email ||
        currentUser?.email ||
        'customer@example.com',
      phone:
        orderPayload.shippingAddress?.phone ||
        currentUser?.phone ||
        '+91 98765 43210',
    };

    const newOrder: Order = {
      ...orderPayload,
      id: orderId,
      date: orderDate,
      createdAt: orderDate,
      items: orderItems,
      subtotal: calculatedSubtotal,
      discount: calculatedDiscount,
      shipping: calculatedShipping,
      shippingCost: calculatedShipping,
      tax: calculatedTax,
      total: calculatedTotal,
      totalAmount: calculatedTotal,
      customer: customerInfo,
      shippingAddress: orderPayload.shippingAddress || {
        fullName: customerInfo.fullName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: '42, Sunrise Boulevard, Sector 15',
        street: '42, Sunrise Boulevard, Sector 15',
        city: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '560001',
        postalCode: '560001',
      },
      paymentMethod: orderPayload.paymentMethod || 'UPI',
      deliveryMethod: orderPayload.deliveryMethod || 'standard',
      status: 'Order Placed',
      estimatedDelivery,
    };

    // Deduct stock from products
    setProducts((prev) =>
      prev.map((prod) => {
        const itemOrdered = orderItems.find((i: any) => i.productId === prod.id);
        if (itemOrdered) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - itemOrdered.quantity),
          };
        }
        return prod;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);

    // Clear user cart
    clearCart();

    showToast('Order placed successfully', `Order #${newOrder.id} has been recorded.`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    showToast('Order status updated', `Order #${orderId} marked as ${status}.`, 'info');
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((o) => o.id.toLowerCase() === orderId.toLowerCase());
  };

  // User Authentication
  const login = (email: string, pass = 'password123', role = 'customer'): { success: boolean; error?: string } => {
    if (!email) {
      return { success: false, error: 'Email is required.' };
    }
    const isSpecialAdmin = email.toLowerCase().includes('admin') || role === 'admin';
    const fullName = isSpecialAdmin ? 'Admin Manager' : email.split('@')[0].replace('.', ' ').toUpperCase() || 'Demo Shopper';

    const demoUser: UserProfile = {
      id: `usr_${Date.now()}`,
      fullName,
      name: fullName,
      role: isSpecialAdmin ? 'admin' : 'customer',
      email,
      phone: '+91 98765 43210',
      address: '42, Sunrise Boulevard, Sector 15',
      street: '42, Sunrise Boulevard, Sector 15',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560001',
      postalCode: '560001',
      joinedDate: 'Sep 2026',
    };

    setCurrentUser(demoUser);
    showToast('Welcome back', `Signed in as ${demoUser.fullName}`);
    return { success: true };
  };

  const register = (
    fullName: string,
    email: string,
    pass = 'password123'
  ): { success: boolean; error?: string } => {
    if (!fullName.trim()) return { success: false, error: 'Full name is required.' };
    if (!email.trim()) return { success: false, error: 'Email is required.' };

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      fullName: fullName.trim(),
      name: fullName.trim(),
      role: 'customer',
      email: email.trim(),
      phone: '+91 98765 43210',
      address: '',
      street: '',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560001',
      postalCode: '560001',
      joinedDate: 'Today',
    };

    setCurrentUser(newUser);
    showToast('Account created', `Welcome to VELORA, ${newUser.fullName}!`);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Signed out', 'You have been safely signed out.', 'info');
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    showToast('Profile updated', 'Your personal details have been saved.');
  };

  // Reviews
  const addReview = (productId: number, reviewData: Omit<ProductReview, 'id' | 'date'>) => {
    const newRev: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now',
    };
    setReviewsMap((prev) => {
      const existing = prev[productId] || [];
      return {
        ...prev,
        [productId]: [newRev, ...existing],
      };
    });
    // Update product review count and average rating
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const currentCount = p.reviewCount || 0;
          const newCount = currentCount + 1;
          const newRating = Number((((p.rating * currentCount) + reviewData.rating) / newCount).toFixed(1));
          return {
            ...p,
            reviewCount: newCount,
            rating: newRating,
          };
        }
        return p;
      })
    );
    showToast('Review submitted', 'Thank you for your feedback!');
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        getProductById,
        getProductBySlug,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartTotals,
        wishlist,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        moveToCart,
        wishlistCount,
        resetToDemoData,
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        currentUser,
        user: currentUser,
        login,
        register,
        logout,
        updateProfile,
        updateUserProfile: updateProfile,
        reviewsMap,
        addReview,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
