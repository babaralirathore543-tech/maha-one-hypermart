// src/config/commission.ts

// ============================================================
// MAHA ONE — COMMISSION CONFIG
// Single source of truth for all commission calculations
// ============================================================

export const COMMISSION_CONFIG = {
  /**
   * Default commission rate (percentage of product subtotal).
   * Change ONLY this value to update commission everywhere.
   */
  DEFAULT_RATE: 12,

  /**
   * Per-category override (optional).
   * Agar kisi category pe different rate chahiye, yahan set karo.
   * e.g. Cakes pe 10%, Fashion pe 15%
   */
  CATEGORY_RATES: {
    // fashion: 15,
    // cakes: 10,
    // herbal: 10,
  } as Record<string, number>,

  /**
   * Minimum commission per order (Rs.).
   * Small orders pe bhi thodi earning ho.
   */
  MIN_COMMISSION_PER_ORDER: 10,

  /**
   * Jab tak order 'delivered' nahi hota,
   * tab tak commission 'pending' rahegi.
   */
  COMMISSION_RELEASED_ON: 'delivered',

  /**
   * Order cancel hone pe commission reverse ho jaayegi.
   */
  COMMISSION_REVERSED_ON: 'cancelled',
};

// ============================================================
// HELPERS
// ============================================================

/**
 * Category ke hisaab se commission rate nikalo.
 * Override nahi hai toh default use karo.
 */
export function getCommissionRate(category?: string): number {
  if (category && COMMISSION_CONFIG.CATEGORY_RATES[category]) {
    return COMMISSION_CONFIG.CATEGORY_RATES[category];
  }
  return COMMISSION_CONFIG.DEFAULT_RATE;
}

/**
 * Ek product ka commission calculate karo.
 */
export function calculateProductCommission(
  price: number,
  quantity: number,
  category?: string
): number {
  const rate = getCommissionRate(category);
  const total = price * quantity;
  const commission = (total * rate) / 100;
  return Math.round(commission * 100) / 100;
}

/**
 * Pooray order ka commission.
 * Order items ke `subtotal` pe commission lagao (shipping pe nahi).
 */
export function calculateOrderCommission(orderItems: Array<{
  price: number;
  quantity: number;
  category?: string;
}>): number {
  let totalCommission = 0;

  for (const item of orderItems) {
    totalCommission += calculateProductCommission(
      item.price,
      item.quantity,
      item.category
    );
  }

  return Math.max(
    Math.round(totalCommission * 100) / 100,
    COMMISSION_CONFIG.MIN_COMMISSION_PER_ORDER
  );
}

/**
 * Seller ki net earnings = subtotal - commission
 */
export function calculateSellerNetEarnings(
  subtotal: number,
  commission: number
): number {
  return Math.max(0, Math.round((subtotal - commission) * 100) / 100);
}

/**
 * Human-readable commission rate (for UI display)
 */
export function getCommissionRateDisplay(category?: string): string {
  return `${getCommissionRate(category)}%`;
}