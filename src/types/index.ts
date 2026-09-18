export type ProductCategory =
  | 'Electronics'
  | 'Fashion'
  | 'Home & Living'
  | 'Accessories'
  | 'Beauty & Personal Care'
  | 'Sports & Fitness';

export interface ProductReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  productPurchased?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  stock: number;
  badge?: string; // 'Best Seller' | 'Trending' | 'Hot Deal' | 'New Arrival'
  specifications: Record<string, string>;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  featured?: boolean;
  trending?: boolean;
  bestSeller?: boolean;
  deal?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderCustomerInfo {
  fullName: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  street?: string;
  city: string;
  state: string;
  pinCode?: string;
  postalCode?: string;
  country?: string;
}

export type DeliveryOption = 'standard' | 'express';

export type PaymentMethod =
  | 'UPI'
  | 'Credit / Debit Card'
  | 'Cash on Delivery'
  | 'Net Banking'
  | 'card'
  | 'upi'
  | 'cod'
  | 'netbanking';

export type OrderStatus =
  | 'Order Placed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'processing'
  | 'confirmed'
  | 'shipped'
  | 'delivered';

export interface Order {
  id: string; // e.g. "VEL-8921"
  date: string;
  createdAt?: string;
  items: {
    productId: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
    subtotal: number;
    product?: Product;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  shippingCost?: number;
  tax: number;
  total: number;
  totalAmount?: number;
  deliveryMethod?: DeliveryOption | string;
  customer: OrderCustomerInfo;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  estimatedDelivery: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  name?: string;
  email: string;
  role?: 'customer' | 'admin' | string;
  phone?: string;
  address?: string;
  street?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  postalCode?: string;
  joinedDate: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

export interface FilterOptions {
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  searchQuery: string;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'discount';
}
