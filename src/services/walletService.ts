import { db, doc, getDoc, updateDoc } from '../config/firebase';
// ❌ collection, addDoc, getDocs, query, where - remove kar diye (use nahi ho rahe)

export interface Transaction {
  id: string;
  type: 'credit' | 'debit' | 'transfer';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  date: Date;
  reference?: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  currency: string;
  transactions: Transaction[];
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Get User Wallet
export const getWallet = async (userId: string) => {
  try {
    const walletRef = doc(db, 'wallets', userId);
    const walletSnap = await getDoc(walletRef);
    
    if (walletSnap.exists()) {
      return walletSnap.data() as Wallet;
    }
    
    // ✅ Create new wallet if not exists
    const newWallet = {
      userId,
      balance: 0,
      currency: 'PKR',
      transactions: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await updateDoc(walletRef, newWallet);
    return newWallet;
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return null;
  }
};

// ✅ Add Money
export const addMoney = async (userId: string, amount: number, description: string = 'Added money') => {
  try {
    const walletRef = doc(db, 'wallets', userId);
    const walletSnap = await getDoc(walletRef);
    
    if (!walletSnap.exists()) {
      throw new Error('Wallet not found');
    }
    
    const wallet = walletSnap.data() as Wallet;
    const newBalance = wallet.balance + amount;
    
    // ✅ Add transaction
    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      type: 'credit',
      amount,
      description,
      status: 'completed',
      date: new Date()
    };
    
    await updateDoc(walletRef, {
      balance: newBalance,
      transactions: [...wallet.transactions, transaction],
      updatedAt: new Date()
    });
    
    return { success: true, newBalance, transaction };
  } catch (error) {
    console.error('Error adding money:', error);
    return { success: false, error };
  }
};

// ✅ Withdraw Money
export const withdrawMoney = async (userId: string, amount: number, description: string = 'Withdrawal') => {
  try {
    const walletRef = doc(db, 'wallets', userId);
    const walletSnap = await getDoc(walletRef);
    
    if (!walletSnap.exists()) {
      throw new Error('Wallet not found');
    }
    
    const wallet = walletSnap.data() as Wallet;
    
    if (wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }
    
    const newBalance = wallet.balance - amount;
    
    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      type: 'debit',
      amount,
      description,
      status: 'completed',
      date: new Date()
    };
    
    await updateDoc(walletRef, {
      balance: newBalance,
      transactions: [...wallet.transactions, transaction],
      updatedAt: new Date()
    });
    
    return { success: true, newBalance, transaction };
  } catch (error) {
    console.error('Error withdrawing money:', error);
    return { success: false, error };
  }
};

// ✅ Transfer Money
export const transferMoney = async (fromUserId: string, toUserId: string, amount: number) => {
  try {
    if (fromUserId === toUserId) {
      throw new Error('Cannot transfer to yourself');
    }
    
    // ✅ Withdraw from sender
    const withdrawResult = await withdrawMoney(fromUserId, amount, `Transfer to ${toUserId}`);
    if (!withdrawResult.success) {
      throw new Error('Failed to withdraw from sender');
    }
    
    // ✅ Add to receiver
    const addResult = await addMoney(toUserId, amount, `Transfer from ${fromUserId}`);
    if (!addResult.success) {
      // ✅ Rollback if fails
      await addMoney(fromUserId, amount, 'Rollback transfer');
      throw new Error('Failed to add to receiver');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error transferring money:', error);
    return { success: false, error };
  }
};

// ✅ Get Transaction History
export const getTransactionHistory = async (userId: string) => {
  try {
    const wallet = await getWallet(userId);
    return wallet?.transactions || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

// ✅ Get Wallet Balance
export const getBalance = async (userId: string) => {
  try {
    const wallet = await getWallet(userId);
    return wallet?.balance || 0;
  } catch (error) {
    console.error('Error fetching balance:', error);
    return 0;
  }
};