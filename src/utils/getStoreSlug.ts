// src/utils/getStoreSlug.ts
import { db, collection, query, where, getDocs, limit } from '../config/firebase';

/**
 * Fetch a seller's store slug by their userId.
 * Returns null if no store exists for this seller.
 *
 * Caches results in memory to avoid repeated queries.
 */
const slugCache = new Map<string, string | null>();

export async function getStoreSlug(sellerId: string): Promise<string | null> {
  if (!sellerId) return null;
  if (sellerId === 'admin') return null; // Admin products have no store

  // Check cache
  if (slugCache.has(sellerId)) {
    return slugCache.get(sellerId) ?? null;
  }

  try {
    const q = query(
      collection(db, 'stores'),
      where('sellerId', '==', sellerId),
      limit(1)
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      slugCache.set(sellerId, null);
      return null;
    }

    const data = snap.docs[0].data();
    const slug = data?.slug || null;

    slugCache.set(sellerId, slug);
    return slug;
  } catch (error) {
    console.error('Error fetching store slug:', error);
    slugCache.set(sellerId, null);
    return null;
  }
}

/**
 * Get full public store URL.
 * Returns null if seller has no store.
 */
export async function getStoreUrl(sellerId: string): Promise<string | null> {
  const slug = await getStoreSlug(sellerId);
  if (!slug) return null;
  return `${window.location.origin}/store/${slug}`;
}

/**
 * Clear cache (useful after seller updates store).
 */
export function clearStoreSlugCache(sellerId?: string) {
  if (sellerId) {
    slugCache.delete(sellerId);
  } else {
    slugCache.clear();
  }
}