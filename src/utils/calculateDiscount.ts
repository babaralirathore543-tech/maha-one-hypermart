// src/utils/calculateDiscount.ts

/**
 * Calculate discount percentage from oldPrice and price.
 *
 * Examples:
 *   oldPrice = 200, price = 100 → 50
 *   oldPrice = 200, price = 200 → 0
 *   oldPrice = 200, price = 250 → 0 (no negative discount)
 *   oldPrice = 0                → 0
 */
export function calculateDiscount(
  oldPrice: number | null | undefined,
  price: number | null | undefined
): number {
  const oldP = Number(oldPrice) || 0;
  const currP = Number(price) || 0;

  if (oldP <= 0) return 0;
  if (currP >= oldP) return 0;
  if (currP <= 0) return 100;

  const discount = ((oldP - currP) / oldP) * 100;
  return Math.round(discount); // whole number
}

/**
 * Get a display-friendly discount label.
 * Returns null if no discount.
 */
export function getDiscountLabel(
  oldPrice: number | null | undefined,
  price: number | null | undefined
): string | null {
  const pct = calculateDiscount(oldPrice, price);
  return pct > 0 ? `-${pct}%` : null;
}