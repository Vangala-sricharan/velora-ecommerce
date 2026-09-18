/**
 * Formats a number to Indian Rupee currency format (e.g., ₹299, ₹1,499, ₹12,999)
 */
export function formatPrice(amount: number): string {
  if (isNaN(amount)) return '₹0';
  const rounded = Math.round(amount);
  return `₹${rounded.toLocaleString('en-IN')}`;
}

/**
 * Calculates discount percentage
 */
export function calculateDiscount(price: number, originalPrice: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * Format standard date
 */
export function formatDate(isoOrDateString: string): string {
  try {
    const date = new Date(isoOrDateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoOrDateString;
  }
}
