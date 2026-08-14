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

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
  weight?: string;
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
}

// ✅ Generate Order Number
const generateOrderNumber = (): string => {
  const date = new Date();
  const prefix = 'MAHA';
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${year}${month}${day}-${random}`;
};

// ✅ Place Order
export const placeOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'orderNumber' | 'orderStatus'>): Promise<{ success: boolean; orderId?: string; orderNumber?: string; error?: string }> => {
  try {
    const orderNumber = generateOrderNumber();
    
    const order: Order = {
      ...orderData,
      orderNumber,
      orderStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'orders'), order);
    
    console.log('✅ Order placed:', orderNumber);
    console.log('📦 Order ID:', docRef.id);
    
    return { 
      success: true, 
      orderId: docRef.id, 
      orderNumber 
    };
  } catch (error: any) {
    console.error('❌ Error placing order:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// ✅ Get User Orders
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

// ✅ Get All Orders (Admin)
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );
    
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

// ✅ Get Single Order
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

// ✅ Get Order by Order Number
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

// ✅ Update Order Status
export const updateOrderStatus = async (orderId: string, status: Order['orderStatus']): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      orderStatus: status,
      updatedAt: new Date()
    });
    
    console.log(`✅ Order status updated to: ${status}`);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error updating order status:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Update Payment Status
export const updatePaymentStatus = async (orderId: string, paymentStatus: Order['paymentStatus']): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      paymentStatus,
      updatedAt: new Date()
    });
    
    console.log(`✅ Payment status updated to: ${paymentStatus}`);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error updating payment status:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Cancel Order
export const cancelOrder = async (orderId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      orderStatus: 'cancelled',
      updatedAt: new Date()
    });
    
    console.log('✅ Order cancelled');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error cancelling order:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Delete Order (Admin)
export const deleteOrder = async (orderId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await deleteDoc(doc(db, 'orders', orderId));
    console.log('✅ Order deleted');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error deleting order:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Get Orders Count
export const getOrdersCount = async (): Promise<number> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'orders'));
    return querySnapshot.size;
  } catch (error) {
    console.error('❌ Error counting orders:', error);
    return 0;
  }
};

// ✅ Get Orders by Status
export const getOrdersByStatus = async (status: Order['orderStatus']): Promise<Order[]> => {
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

// ✅ Get Today's Orders
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
    console.error('❌ Error fetching today\'s orders:', error);
    return [];
  }
};

// ✅ Listen to Orders (Real-time)
export const listenToOrders = (callback: (orders: Order[]) => void) => {
  const q = query(
    collection(db, 'orders'),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const orders: Order[] = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    callback(orders);
  });
};