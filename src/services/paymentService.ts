import { db } from '../config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

export interface PaymentDetails {
  orderId: string;
  userId: string;
  amount: number;
  method: 'jazzcash' | 'easypaisa' | 'stripe' | 'cod';
  status: 'pending' | 'success' | 'failed' | 'refunded';
  transactionId?: string;
  paymentDate?: Date;
}

// ✅ Process JazzCash Payment
export const processJazzCashPayment = async (
  orderId: string,
  userId: string,
  amount: number,
  phoneNumber: string
): Promise<PaymentDetails> => {
  try {
    // 🔥 In production: Call JazzCash API with phoneNumber
    console.log(`📱 Processing JazzCash payment for phone: ${phoneNumber}`);
    
    // Mock payment response
    const mockPayment: PaymentDetails = {
      orderId,
      userId,
      amount,
      method: 'jazzcash',
      status: 'success',
      transactionId: `JC${Date.now()}`,
      paymentDate: new Date()
    };

    // Update order with payment
    await updateOrderPayment(orderId, mockPayment);
    
    console.log('✅ JazzCash payment processed:', mockPayment);
    return mockPayment;
  } catch (error) {
    console.error('❌ JazzCash payment failed:', error);
    throw error;
  }
};

// ✅ Process EasyPaisa Payment
export const processEasyPaisaPayment = async (
  orderId: string,
  userId: string,
  amount: number,
  phoneNumber: string
): Promise<PaymentDetails> => {
  try {
    // 🔥 In production: Call EasyPaisa API with phoneNumber
    console.log(`📱 Processing EasyPaisa payment for phone: ${phoneNumber}`);
    
    const mockPayment: PaymentDetails = {
      orderId,
      userId,
      amount,
      method: 'easypaisa',
      status: 'success',
      transactionId: `EP${Date.now()}`,
      paymentDate: new Date()
    };

    await updateOrderPayment(orderId, mockPayment);
    
    console.log('✅ EasyPaisa payment processed:', mockPayment);
    return mockPayment;
  } catch (error) {
    console.error('❌ EasyPaisa payment failed:', error);
    throw error;
  }
};

// ✅ Process COD (Cash on Delivery)
export const processCODPayment = async (
  orderId: string,
  userId: string,
  amount: number
): Promise<PaymentDetails> => {
  try {
    const payment: PaymentDetails = {
      orderId,
      userId,
      amount,
      method: 'cod',
      status: 'pending',
      paymentDate: new Date()
    };

    await updateOrderPayment(orderId, payment);
    
    console.log('✅ COD order placed:', payment);
    return payment;
  } catch (error) {
    console.error('❌ COD payment failed:', error);
    throw error;
  }
};

// ✅ Update order payment status
export const updateOrderPayment = async (
  orderId: string,
  payment: PaymentDetails
): Promise<void> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      paymentStatus: payment.status,
      paymentMethod: payment.method,
      transactionId: payment.transactionId || '',
      paymentDate: payment.paymentDate || new Date(),
      status: payment.status === 'success' ? 'confirmed' : 'pending'
    });
    console.log(`✅ Order ${orderId} payment updated`);
  } catch (error) {
    console.error('❌ Error updating payment:', error);
    throw error;
  }
};

// ✅ Get payment by order ID
export const getPaymentByOrderId = async (
  orderId: string
): Promise<PaymentDetails | null> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      const data = orderSnap.data();
      return {
        orderId: orderId,
        userId: data.userId || '',
        amount: data.totalAmount || 0,
        method: data.paymentMethod || 'cod',
        status: data.paymentStatus || 'pending',
        transactionId: data.transactionId || '',
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : undefined
      };
    }
    return null;
  } catch (error) {
    console.error('❌ Error fetching payment:', error);
    throw error;
  }
};

// ✅ Verify payment (for JazzCash/EasyPaisa webhook)
export const verifyPayment = async (
  transactionId: string,
  orderId: string
): Promise<boolean> => {
  try {
    // 🔥 In production: Call payment gateway API to verify
    console.log(`🔍 Verifying payment ${transactionId} for order ${orderId}`);
    
    const isValid = true;
    
    if (isValid) {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        paymentStatus: 'success',
        status: 'confirmed'
      });
      console.log(`✅ Payment ${transactionId} verified for order ${orderId}`);
    }
    
    return isValid;
  } catch (error) {
    console.error('❌ Payment verification failed:', error);
    return false;
  }
};

// ✅ Refund payment
export const refundPayment = async (
  orderId: string,
  transactionId: string
): Promise<boolean> => {
  try {
    console.log(`💳 Processing refund for transaction ${transactionId}`);
    
    const refundSuccess = true;
    
    if (refundSuccess) {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        paymentStatus: 'refunded',
        status: 'refunded'
      });
      console.log(`✅ Payment ${transactionId} refunded for order ${orderId}`);
    }
    
    return refundSuccess;
  } catch (error) {
    console.error('❌ Refund failed:', error);
    return false;
  }
};

// ✅ Get supported payment methods
export const getPaymentMethods = async (): Promise<string[]> => {
  return ['jazzcash', 'easypaisa', 'cod'];
};

// ✅ Validate payment method
export const validatePaymentMethod = (method: string): boolean => {
  const validMethods = ['jazzcash', 'easypaisa', 'stripe', 'cod'];
  return validMethods.includes(method);
};