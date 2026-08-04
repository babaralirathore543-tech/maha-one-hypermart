import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  doc, 
  updateDoc
} from 'firebase/firestore';

export interface Order {
  id?: string;
  userId: string;
  userEmail: string;
  items: any[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt?: Date;
}

// ✅ Create Order
export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Order created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating order:', error);
    throw error;
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
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    throw error;
  }
};

// ✅ Get All Orders (Admin)
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error('❌ Error fetching all orders:', error);
    throw error;
  }
};

// ✅ Update Order Status (Admin)
export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date()
    });
    console.log(`✅ Order ${orderId} status updated to ${status}`);
  } catch (error) {
    console.error('❌ Error updating order:', error);
    throw error;
  }
};

// ✅ Get Single Order by ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        id: docSnap.id, 
        ...data
      } as Order;
    }
    return null;
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    throw error;
  }
};