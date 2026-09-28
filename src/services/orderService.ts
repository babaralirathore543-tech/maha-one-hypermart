// src/services/orderService.ts
import { 
  db, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  getDoc,
  onSnapshot
} from '../config/firebase';

import {
  calculateOrderCommission,
  calculateSellerNetEarnings,
  getCommissionRate,
  COMMISSION_CONFIG,
} from '../config/commission';

// ============================================================
// TYPES
// ============================================================
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
  weight?: string;
  category?: string; // ✅ Commission calculation ke liye
}

export interface Order {
  id?: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;

  // ✅ Commission fields
  commission: number;         // Total commission
  commissionRate: number;     // Rate at time of order (12)
  netEarnings: number;        // subtotal - commission
  commissionStatus: 'pending' | 'released' | 'reversed';

  paymentMethod: 'cod' | 'jazzcash' | 'card' | 'bank';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
}

// ============================================================
// GENERATE ORDER NUMBER
// ============================================================
const generateOrderNumber = (): string => {
  const date = new Date();
  const prefix = 'MAHA';
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  // ✅ 6 digits — collision risk minimize
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${prefix}-${year}${month}${day}-${random}`;
};

// ============================================================
// ✅ PLACE ORDER — with AUTO COMMISSION
// ============================================================
export const placeOrder = async (
  orderData: Omit<
    Order,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'orderNumber'
    | 'orderStatus'
    | 'commission'
    | 'commissionRate'
    | 'netEarnings'
    | 'commissionStatus'
  >
): Promise<{
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  commission?: number;
  netEarnings?: number;
  error?: string;
}> => {
  try {
    const orderNumber = generateOrderNumber();

    // ✅ AUTO-CALCULATE COMMISSION
    const items = orderData.items || [];
    const commission = calculateOrderCommission(
      items.map((item) => ({
        price: item.price,
        quantity: item.quantity,
        category: item.category,
      }))
    );

    const commissionRate = getCommissionRate(); // Default 12
    const netEarnings = calculateSellerNetEarnings(orderData.subtotal, commission);

    // ✅ Final order object
    const order: Order = {
      ...orderData,
      orderNumber,
      orderStatus: 'pending',

      // ✅ Commission fields
      commission,
      commissionRate,
      netEarnings,
      commissionStatus: 'pending', // Released only when delivered

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'orders'), order);

    console.log('✅ Order placed:', orderNumber);
    console.log('📦 Order ID:', docRef.id);
    console.log('💰 Commission:', commission, `(${commissionRate}%)`);
    console.log('💵 Net Earnings:', netEarnings);

    return {
      success: true,
      orderId: docRef.id,
      orderNumber,
      commission,
      netEarnings,
    };
  } catch (error: any) {
    console.error('❌ Error placing order:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ============================================================
// ✅ UPDATE ORDER STATUS — with commission logic
// ============================================================
export const updateOrderStatus = async (
  orderId: string,
  status: Order['orderStatus']
): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, 'orders', orderId);

    // ✅ Commission status based on order status
    const commissionStatus =
      status === COMMISSION_CONFIG.COMMISSION_RELEASED_ON
        ? 'released'
        : status === COMMISSION_CONFIG.COMMISSION_REVERSED_ON
        ? 'reversed'
        : 'pending';

    const updateData: Record<string, any> = {
      orderStatus: status,
      commissionStatus,
      updatedAt: new Date(),
    };

    // ✅ Track timestamps
    if (status === 'delivered') updateData.deliveredAt = new Date();
    if (status === 'cancelled') updateData.cancelledAt = new Date();

    await updateDoc(docRef, updateData);

    console.log(`✅ Order status → ${status}, commission → ${commissionStatus}`);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error updating order status:', error);
    return { success: false, error: error.message };
  }
};

// ============================================================
// ✅ GET COMMISSION SUMMARY — for admin dashboard
// ============================================================
export const getCommissionSummary = async (): Promise<{
  totalCommission: number;
  pendingCommission: number;
  releasedCommission: number;
  reversedCommission: number;
  totalOrders: number;
}> => {
  try {
    const q = query(collection(db, 'orders'));
    const snap = await getDocs(q);

    let totalCommission = 0;
    let pendingCommission = 0;
    let releasedCommission = 0;
    let reversedCommission = 0;

    snap.forEach((doc) => {
      const data = doc.data();
      const commission = data.commission || 0;

      totalCommission += commission;

      const status = data.commissionStatus || 'pending';
      if (status === 'released') releasedCommission += commission;
      else if (status === 'reversed') reversedCommission += commission;
      else pendingCommission += commission;
    });

    return {
      totalCommission,
      pendingCommission,
      releasedCommission,
      reversedCommission,
      totalOrders: snap.size,
    };
  } catch (error) {
    console.error('❌ Error fetching commission summary:', error);
    return {
      totalCommission: 0,
      pendingCommission: 0,
      releasedCommission: 0,
      reversedCommission: 0,
      totalOrders: 0,
    };
  }
};

// ============================================================
// ✅ GET SELLER COMMISSION — for seller earnings page
// ============================================================
export const getSellerCommission = async (
  sellerId: string
): Promise<{
  totalCommission: number;
  pendingCommission: number;
  releasedCommission: number;
  grossSales: number;
  netEarnings: number;
  pendingEarnings: number;
  availableBalance: number;
}> => {
  try {
    const q = query(
      collection(db, 'sellerOrders'),
      where('sellerId', '==', sellerId)
    );
    const snap = await getDocs(q);

    let totalCommission = 0;
    let pendingCommission = 0;
    let releasedCommission = 0;
    let grossSales = 0;

    snap.forEach((doc) => {
      const data = doc.data();
      const commission = data.commission || 0;
      const subtotal = data.subtotal || 0;

      totalCommission += commission;
      grossSales += subtotal;

      if (data.commissionStatus === 'released') {
        releasedCommission += commission;
      } else if (data.commissionStatus !== 'reversed') {
        pendingCommission += commission;
      }
    });

    const netEarnings = grossSales - totalCommission;
    const availableBalance = releasedCommission > 0
      ? grossSales - releasedCommission  // Simplified
      : 0;

    return {
      totalCommission,
      pendingCommission,
      releasedCommission,
      grossSales,
      netEarnings,
      pendingEarnings: grossSales - releasedCommission,
      availableBalance,
    };
  } catch (error) {
    console.error('❌ Error fetching seller commission:', error);
    return {
      totalCommission: 0,
      pendingCommission: 0,
      releasedCommission: 0,
      grossSales: 0,
      netEarnings: 0,
      pendingEarnings: 0,
      availableBalance: 0,
    };
  }
};

// ============================================================
// EXISTING FUNCTIONS (unchanged, but include for completeness)
// ============================================================

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    return orders;
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    return [];
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    return orders;
  } catch (error) {
    console.error('❌ Error fetching all orders:', error);
    return [];
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order;
    }
    return null;
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    return null;
  }
};

export const getOrderByNumber = async (orderNumber: string): Promise<Order | null> => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('orderNumber', '==', orderNumber)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Order;
    }
    return null;
  } catch (error) {
    console.error('❌ Error fetching order by number:', error);
    return null;
  }
};

export const updatePaymentStatus = async (
  orderId: string,
  paymentStatus: Order['paymentStatus']
): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      paymentStatus,
      updatedAt: new Date(),
    });
    console.log(`✅ Payment status updated to: ${paymentStatus}`);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error updating payment status:', error);
    return { success: false, error: error.message };
  }
};

export const cancelOrder = async (
  orderId: string
): Promise<{ success: boolean; error?: string }> => {
  return updateOrderStatus(orderId, 'cancelled');
};

export const deleteOrder = async (
  orderId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await deleteDoc(doc(db, 'orders', orderId));
    console.log('✅ Order deleted');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error deleting order:', error);
    return { success: false, error: error.message };
  }
};

export const getOrdersCount = async (): Promise<number> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'orders'));
    return querySnapshot.size;
  } catch (error) {
    console.error('❌ Error counting orders:', error);
    return 0;
  }
};

export const getOrdersByStatus = async (
  status: Order['orderStatus']
): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('orderStatus', '==', status),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    return orders;
  } catch (error) {
    console.error('❌ Error fetching orders by status:', error);
    return [];
  }
};

export const getTodaysOrders = async (): Promise<Order[]> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const q = query(
      collection(db, 'orders'),
      where('createdAt', '>=', today),
      where('createdAt', '<', tomorrow),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    return orders;
  } catch (error) {
    console.error("❌ Error fetching today's orders:", error);
    return [];
  }
};

export const listenToOrders = (callback: (orders: Order[]) => void) => {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const orders: Order[] = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    callback(orders);
  });
};