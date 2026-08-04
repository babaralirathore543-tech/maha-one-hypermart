import { 
  db, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  getDoc 
} from '../config/firebase';

// ✅ Get Wishlist Count
export const getWishlistCount = async (userId: string) => {
  try {
    if (!userId || userId === 'guest') {
      return 0;
    }

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

// ✅ Add to Wishlist
export const addToWishlist = async (userId: string, productId: string) => {
  try {
    if (!userId || userId === 'guest') {
      throw new Error('Please login to add items to wishlist');
    }

    // ✅ Check if product exists
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      throw new Error('Product not found!');
    }

    // ✅ Add to wishlist
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      wishlist: arrayUnion(productId)
    });
    
    console.log('✅ Added to wishlist:', productId);
    return { success: true, message: 'Added to wishlist' };
  } catch (error: any) {
    console.error('❌ Error adding to wishlist:', error);
    return { success: false, message: error.message };
  }
};

// ✅ Remove from Wishlist
export const removeFromWishlist = async (userId: string, productId: string) => {
  try {
    if (!userId || userId === 'guest') {
      throw new Error('Please login to remove items from wishlist');
    }

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      wishlist: arrayRemove(productId)
    });
    
    console.log('✅ Removed from wishlist:', productId);
    return { success: true, message: 'Removed from wishlist' };
  } catch (error: any) {
    console.error('❌ Error removing from wishlist:', error);
    return { success: false, message: error.message };
  }
};

// ✅ Check if product is in wishlist
export const isInWishlist = async (userId: string, productId: string) => {
  try {
    if (!userId || userId === 'guest') {
      return false;
    }

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

// ✅ Get User's Wishlist with Product Details
export const getWishlistWithDetails = async (userId: string) => {
  try {
    if (!userId || userId === 'guest') {
      return [];
    }

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return [];
    }
    
    const wishlistIds = userSnap.data().wishlist || [];
    
    if (wishlistIds.length === 0) {
      return [];
    }
    
    // ✅ Fetch all products in wishlist
    const products = [];
    for (const id of wishlistIds) {
      const productRef = doc(db, 'products', id);
      const productSnap = await getDoc(productRef);
      
      if (productSnap.exists()) {
        products.push({
          id: productSnap.id,
          ...productSnap.data()
        });
      }
    }
    
    return products;
  } catch (error) {
    console.error('❌ Error fetching wishlist:', error);
    return [];
  }
};

// ✅ Clear Wishlist
export const clearWishlist = async (userId: string) => {
  try {
    if (!userId || userId === 'guest') {
      throw new Error('Please login to clear wishlist');
    }

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      wishlist: []
    });
    
    console.log('✅ Wishlist cleared');
    return { success: true, message: 'Wishlist cleared' };
  } catch (error: any) {
    console.error('❌ Error clearing wishlist:', error);
    return { success: false, message: error.message };
  }
};