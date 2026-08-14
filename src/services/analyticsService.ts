import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  getCountFromServer
} from 'firebase/firestore';

export interface AnalyticsEvent {
  userId?: string;
  eventType: 'page_view' | 'product_view' | 'add_to_cart' | 'remove_from_cart' | 
              'purchase' | 'wishlist_add' | 'wishlist_remove' | 'search' | 
              'login' | 'register' | 'logout';
  timestamp: Date;
  data: any;
}

export interface AnalyticsSummary {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  popularProducts: any[];
  dailyVisits: number;
  conversionRate: number;
}

// ✅ Track event
export const trackEvent = async (
  eventType: AnalyticsEvent['eventType'],
  userId?: string,
  data?: any
): Promise<void> => {
  try {
    await addDoc(collection(db, 'analytics'), {
      userId: userId || 'anonymous',
      eventType,
      timestamp: new Date(),
      data: data || {}
    });
    console.log(`📊 Event tracked: ${eventType}`);
  } catch (error) {
    console.error('❌ Tracking failed:', error);
  }
};

// ✅ Track page view
export const trackPageView = async (page: string, userId?: string): Promise<void> => {
  await trackEvent('page_view', userId, { page });
};

// ✅ Track product view
export const trackProductView = async (productId: string, userId?: string): Promise<void> => {
  await trackEvent('product_view', userId, { productId });
};

// ✅ Track add to cart
export const trackAddToCart = async (
  productId: string,
  productName: string,
  price: number,
  userId?: string
): Promise<void> => {
  await trackEvent('add_to_cart', userId, { productId, productName, price });
};

// ✅ Track remove from cart
export const trackRemoveFromCart = async (
  productId: string,
  productName: string,
  userId?: string
): Promise<void> => {
  await trackEvent('remove_from_cart', userId, { productId, productName });
};

// ✅ Track wishlist add
export const trackWishlistAdd = async (
  productId: string,
  productName: string,
  userId?: string
): Promise<void> => {
  await trackEvent('wishlist_add', userId, { productId, productName });
};

// ✅ Track wishlist remove
export const trackWishlistRemove = async (
  productId: string,
  productName: string,
  userId?: string
): Promise<void> => {
  await trackEvent('wishlist_remove', userId, { productId, productName });
};

// ✅ Track purchase
export const trackPurchase = async (
  orderId: string,
  totalAmount: number,
  items: any[],
  userId?: string
): Promise<void> => {
  await trackEvent('purchase', userId, { 
    orderId, 
    totalAmount, 
    items: items.length 
  });
};

// ✅ Track login
export const trackLogin = async (userId: string): Promise<void> => {
  await trackEvent('login', userId);
};

// ✅ Track register
export const trackRegister = async (userId: string): Promise<void> => {
  await trackEvent('register', userId);
};

// ✅ Track logout
export const trackLogout = async (userId: string): Promise<void> => {
  await trackEvent('logout', userId);
};

// ✅ Track search
export const trackSearch = async (query: string, results: number, userId?: string): Promise<void> => {
  await trackEvent('search', userId, { query, results });
};

// ✅ Get analytics summary
export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  try {
    // Get total users
    const usersQuery = query(collection(db, 'users'));
    const usersSnapshot = await getCountFromServer(usersQuery);
    const totalUsers = usersSnapshot.data().count;

    // Get orders and revenue
    const ordersQuery = query(collection(db, 'orders'));
    const ordersSnapshot = await getDocs(ordersQuery);
    const orders = ordersSnapshot.docs.map(doc => doc.data());
    const totalOrders = orders.length;
    
    const totalRevenue = orders.reduce((sum, order) => {
      return order.status === 'delivered' ? sum + (order.totalAmount || 0) : sum;
    }, 0);

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get popular products
    const popularProducts = await getPopularProducts();

    // Get daily visits
    const dailyVisits = await getDailyVisits();

    // Calculate conversion rate
    const conversionRate = totalUsers > 0 ? (totalOrders / totalUsers) * 100 : 0;

    return {
      totalUsers,
      totalOrders,
      totalRevenue,
      averageOrderValue,
      popularProducts,
      dailyVisits,
      conversionRate
    };
  } catch (error) {
    console.error('❌ Error getting analytics:', error);
    throw error;
  }
};

// ✅ Get popular products
export const getPopularProducts = async (limitCount: number = 10): Promise<any[]> => {
  try {
    const analyticsQuery = query(
      collection(db, 'analytics'),
      where('eventType', '==', 'purchase'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    
    const snapshot = await getDocs(analyticsQuery);
    const purchases: any[] = [];
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.data && data.data.items) {
        purchases.push(...data.data.items);
      }
    });

    // Count frequency
    const productCount: Record<string, number> = {};
    purchases.forEach((product: any) => {
      const id = product.id || product.productId;
      if (id) {
        productCount[id] = (productCount[id] || 0) + 1;
      }
    });

    // Sort and return top products
    return Object.entries(productCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limitCount)
      .map(([id, count]) => ({ id, count }));
  } catch (error) {
    console.error('❌ Error fetching popular products:', error);
    return [];
  }
};

// ✅ Get daily visits
export const getDailyVisits = async (days: number = 7): Promise<number> => {
  try {
    const date = new Date();
    date.setDate(date.getDate() - days);
    
    const analyticsQuery = query(
      collection(db, 'analytics'),
      where('eventType', '==', 'page_view'),
      where('timestamp', '>=', date)
    );
    
    const snapshot = await getDocs(analyticsQuery);
    return snapshot.size;
  } catch (error) {
    console.error('❌ Error fetching daily visits:', error);
    return 0;
  }
};

// ✅ Track user behavior
export const trackUserBehavior = async (
  userId: string,
  action: string,
  data: any
): Promise<void> => {
  try {
    await addDoc(collection(db, 'user_behavior'), {
      userId,
      action,
      data,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('❌ User behavior tracking failed:', error);
  }
};

// ✅ Get store analytics
export const getStoreAnalytics = async () => {
  try {
    const summary = await getAnalyticsSummary();
    
    // Get recent events
    const eventsQuery = query(
      collection(db, 'analytics'),
      orderBy('timestamp', 'desc'),
      limit(20)
    );
    const eventsSnapshot = await getDocs(eventsQuery);
    const recentEvents = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      summary,
      recentEvents,
      date: new Date()
    };
  } catch (error) {
    console.error('❌ Error fetching store analytics:', error);
    throw error;
  }
};

// ✅ Get user analytics
export const getUserAnalytics = async (userId: string) => {
  try {
    // Get user events
    const eventsQuery = query(
      collection(db, 'analytics'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    const eventsSnapshot = await getDocs(eventsQuery);
    const events = eventsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data
      };
    });

    // Get user orders
    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', userId)
    );
    const ordersSnapshot = await getDocs(ordersQuery);
    const orders = ordersSnapshot.docs.map(doc => doc.data());
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // ✅ FIX: Properly access timestamp with type checking
    let lastActive = null;
    if (events.length > 0) {
      const firstEvent = events[0] as any;
      if (firstEvent.timestamp) {
        lastActive = firstEvent.timestamp;
      }
    }

    return {
      totalEvents: events.length,
      totalOrders: orders.length,
      totalSpent,
      recentEvents: events.slice(0, 10),
      lastActive
    };
  } catch (error) {
    console.error('❌ Error fetching user analytics:', error);
    throw error;
  }
};

// ✅ Get real-time stats
export const getRealtimeStats = async () => {
  try {
    // Active users in last 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const activeQuery = query(
      collection(db, 'analytics'),
      where('timestamp', '>=', thirtyMinutesAgo),
      where('eventType', '==', 'page_view')
    );
    const activeSnapshot = await getDocs(activeQuery);
    const uniqueUsers = new Set();
    activeSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.userId && data.userId !== 'anonymous') {
        uniqueUsers.add(data.userId);
      }
    });

    // Today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrdersQuery = query(
      collection(db, 'orders'),
      where('createdAt', '>=', today)
    );
    const todayOrdersSnapshot = await getDocs(todayOrdersQuery);
    const todayOrders = todayOrdersSnapshot.docs.map(doc => doc.data());
    const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    return {
      activeUsers: uniqueUsers.size,
      todayOrders: todayOrders.length,
      todayRevenue,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('❌ Error fetching realtime stats:', error);
    return {
      activeUsers: 0,
      todayOrders: 0,
      todayRevenue: 0,
      timestamp: new Date()
    };
  }
};