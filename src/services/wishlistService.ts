// src/services/wishlistService.ts
import {
  db,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from '../config/firebase';

import {
  collection,
  query,
  where,
  getDocs,
  documentId,
} from 'firebase/firestore';

// ============================================================
// GET WISHLIST COUNT
// ============================================================
export const getWishlistCount = async (userId: string): Promise<number> => {
  try {
    if (!userId || userId === 'guest') return 0;

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const wishlist = userSnap.data().wishlist || [];
      return wishlist.length;
    }
    return 0;
  } catch (error) {
    console.error('❌ Error getting wishlist count:', error);
    return 0;
  }
};

// ============================================================
// ADD TO WISHLIST
// ============================================================
export const addToWishlist = async (
  userId: string,
  productId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!userId || userId === 'guest') {
      throw new Error('Please login to add items to wishlist');
    }

    // ✅ Verify product exists
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      throw new Error('Product not found!');
    }

    // ✅ Add to user's wishlist array
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      wishlist: arrayUnion(productId),
    });

    console.log('✅ Added to wishlist:', productId);
    return { success: true, message: 'Added to wishlist' };
  } catch (error: any) {
    console.error('❌ Error adding to wishlist:', error);
    return { success: false, message: error.message };
  }
};

// ============================================================
// REMOVE FROM WISHLIST
// ============================================================
export const removeFromWishlist = async (
  userId: string,
  productId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!userId || userId === 'guest') {
      throw new Error('Please login to remove items from wishlist');
    }

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      wishlist: arrayRemove(productId),
    });

    console.log('✅ Removed from wishlist:', productId);
    return { success: true, message: 'Removed from wishlist' };
  } catch (error: any) {
    console.error('❌ Error removing from wishlist:', error);
    return { success: false, message: error.message };
  }
};

// ============================================================
// CHECK IF IN WISHLIST
// ============================================================
export const isInWishlist = async (
  userId: string,
  productId: string
): Promise<boolean> => {
  try {
    if (!userId || userId === 'guest') return false;

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const wishlist = userSnap.data().wishlist || [];
      return wishlist.includes(productId);
    }
    return false;
  } catch (error) {
    console.error('❌ Error checking wishlist:', error);
    return false;
  }
};

// ============================================================
// GET WISHLIST WITH PRODUCT DETAILS (optimized)
// ============================================================
export const getWishlistWithDetails = async (userId: string) => {
  try {
    if (!userId || userId === 'guest') return [];

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return [];

    const wishlistIds: string[] = userSnap.data().wishlist || [];
    if (wishlistIds.length === 0) return [];

    // ✅ Firestore 'in' query supports max 30 IDs — chunk it
    const chunks: string[][] = [];
    for (let i = 0; i < wishlistIds.length; i += 30) {
      chunks.push(wishlistIds.slice(i, i + 30));
    }

    const products: any[] = [];

    for (const chunk of chunks) {
      const q = query(
        collection(db, 'products'),
        where(documentId(), 'in', chunk)
      );
      const snap = await getDocs(q);
      snap.forEach((d) => {
        products.push({ id: d.id, ...d.data() });
      });
    }

    // ✅ Preserve wishlist order
    const productMap = new Map(products.map((p) => [p.id, p]));
    return wishlistIds.map((id) => productMap.get(id)).filter(Boolean);
  } catch (error) {
    console.error('❌ Error fetching wishlist:', error);
    return [];
  }
};

// ============================================================
// CLEAR WISHLIST
// ============================================================
export const clearWishlist = async (
  userId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!userId || userId === 'guest') {
      throw new Error('Please login to clear wishlist');
    }

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      wishlist: [],
    });

    console.log('✅ Wishlist cleared');
    return { success: true, message: 'Wishlist cleared' };
  } catch (error: any) {
    console.error('❌ Error clearing wishlist:', error);
    return { success: false, message: error.message };
  }
};