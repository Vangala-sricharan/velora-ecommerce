export const STORAGE_KEYS = {
  CART: 'velora_cart',
  WISHLIST: 'velora_wishlist',
  USERS: 'velora_users',
  CURRENT_USER: 'velora_current_user',
  ORDERS: 'velora_orders',
  PRODUCTS: 'velora_products',
  THEME: 'velora_theme',
  ADMIN_STATE: 'velora_admin_state',
  REVIEWS: 'velora_reviews',
  NOTIFICATIONS: 'velora_notifications',
  RECENTLY_VIEWED: 'velora_recently_viewed',
  COUPONS: 'velora_coupons',
} as const;

export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing to localStorage key "${key}":`, error);
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error);
  }
}
