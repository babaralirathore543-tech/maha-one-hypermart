// src/utils/generateSku.ts
import { db, collection, query, where, getDocs } from '../config/firebase';

/**
 * Generate a unique SKU for a product.
 *
 * Format: {CATEGORY_PREFIX}-{YYYYMMDD}-{4-digit-counter}
 * Example: MOF-20250918-0001, MDF-20250918-0002
 *
 * - Counter resets per day per category
 * - Collision-safe (queries Firestore for existing SKUs)
 * - If collision (rare), increments counter until free
 */
export async function generateSku(
  categoryPrefix: string,
  options: { maxRetries?: number } = {}
): Promise<string> {
  const { maxRetries = 50 } = options;

  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const datePart = `${yyyy}${mm}${dd}`;

  // Prefix in uppercase, sanitized
  const prefix = (categoryPrefix || 'MOH').toUpperCase().replace(/[^A-Z0-9]/g, '');

  // Find the highest existing counter for this prefix + date
  const basePattern = `${prefix}-${datePart}-`;

  let nextCounter = 1;
  try {
    // Query products where sku starts with basePattern
    // Note: Firestore has no "startsWith" — we fetch SKUs in a range
    const q = query(
      collection(db, 'products'),
      where('sku', '>=', basePattern),
      where('sku', '<=', basePattern + '\uf8ff')
    );
    const snap = await getDocs(q);

    const existingCounters: number[] = [];
    snap.forEach((docSnap) => {
      const sku = docSnap.data()?.sku as string | undefined;
      if (sku && sku.startsWith(basePattern)) {
        const counterStr = sku.slice(basePattern.length);
        const num = parseInt(counterStr, 10);
        if (!Number.isNaN(num)) existingCounters.push(num);
      }
    });

    if (existingCounters.length > 0) {
      nextCounter = Math.max(...existingCounters) + 1;
    }
  } catch (err) {
    console.warn('⚠️ Could not scan existing SKUs, falling back to counter 1:', err);
  }

  // Try to find a free counter (rare collision safety)
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const candidate = `${basePattern}${String(nextCounter + attempt).padStart(4, '0')}`;

    try {
      const q = query(
        collection(db, 'products'),
        where('sku', '==', candidate)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        return candidate;
      }
    } catch (err) {
      // If query fails, just return the candidate — validation can be done at write time
      return candidate;
    }
  }

  // Fallback: append a random suffix if all retries failed
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${datePart}-${random}`;
}