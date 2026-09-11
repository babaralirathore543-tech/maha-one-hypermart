import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { 
  auth, 
  db 
} from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// ============================================================
// TYPES — Extended for Multi-Vendor
// ============================================================
interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'admin' | 'seller' | 'customer';
  status: 'active' | 'inactive' | 'suspended';
  phoneNumber?: string | null;
  createdAt?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;           // Firebase user
  appUser: AppUser | null;             // App user with role
  loading: boolean;
  isAdmin: boolean;
  isSeller: boolean;
  isCustomer: boolean;
  isAuthenticated: boolean;
  register: (email: string, password: string, name?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUserRole: (uid: string, role: 'admin' | 'seller' | 'customer') => Promise<void>;
}

// ============================================================
// CONTEXT
// ============================================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================
// PROVIDER
// ============================================================
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // FETCH USER ROLE FROM FIRESTORE
  // ============================================================
  const fetchAppUser = async (firebaseUser: FirebaseUser): Promise<AppUser | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email || data.email || null,
          displayName: firebaseUser.displayName || data.name || data.displayName || null,
          photoURL: firebaseUser.photoURL || data.photoURL || null,
          role: data.role || 'customer',
          status: data.status || 'active',
          phoneNumber: data.phoneNumber || null,
          createdAt: data.createdAt || new Date().toISOString(),
        };
      } else {
        // Default: customer role
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email || null,
          displayName: firebaseUser.displayName || null,
          photoURL: firebaseUser.photoURL || null,
          role: 'customer',
          status: 'active',
          phoneNumber: null,
          createdAt: new Date().toISOString(),
        };
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  };

  // ============================================================
  // REFRESH USER
  // ============================================================
  const refreshUser = async () => {
    if (!user) {
      setAppUser(null);
      return;
    }

    const userData = await fetchAppUser(user);
    setAppUser(userData);
  };

  // ============================================================
  // UPDATE USER ROLE
  // ============================================================
  const updateUserRole = async (uid: string, role: 'admin' | 'seller' | 'customer') => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        role,
        updatedAt: new Date().toISOString(),
      });
      
      // Refresh user data
      await refreshUser();
      console.log('✅ User role updated to:', role);
    } catch (error) {
      console.error('❌ Error updating user role:', error);
      throw error;
    }
  };

  // ============================================================
  // AUTH STATE CHANGED LISTENER
  // ============================================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      
      if (currentUser) {
        setUser(currentUser);
        const userData = await fetchAppUser(currentUser);
        setAppUser(userData);
      } else {
        setUser(null);
        setAppUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ============================================================
  // REGISTER — Updated with role support
  // ============================================================
  const register = async (email: string, password: string, name?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Create user document with role: customer (default)
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: name || firebaseUser.displayName || '',
        displayName: name || firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
        role: 'customer',           // ✅ Default role
        status: 'active',           // ✅ Default status
        createdAt: new Date().toISOString(),
        wishlist: [],
        orders: []
      });

      console.log('✅ User registered successfully!');
    } catch (error: any) {
      console.error('❌ Registration error:', error.message);
      throw error;
    }
  };

  // ============================================================
  // LOGIN
  // ============================================================
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ User logged in successfully!');
    } catch (error: any) {
      console.error('❌ Login error:', error.message);
      throw error;
    }
  };

  // ============================================================
  // LOGIN WITH GOOGLE — Updated with role support
  // ============================================================
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      // Check if user exists, if not create with role: customer
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          role: 'customer',           // ✅ Default role
          status: 'active',           // ✅ Default status
          createdAt: new Date().toISOString(),
          wishlist: [],
          orders: []
        });
      }

      console.log('✅ Google login successful!');
    } catch (error: any) {
      console.error('❌ Google login error:', error.message);
      throw error;
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setAppUser(null);
      console.log('✅ User logged out');
    } catch (error: any) {
      console.error('❌ Logout error:', error.message);
      throw error;
    }
  };

  // ============================================================
  // COMPUTED VALUES
  // ============================================================
  const isAdmin = appUser?.role === 'admin';
  const isSeller = appUser?.role === 'seller';
  const isCustomer = appUser?.role === 'customer' || (!appUser?.role && !!user);
  const isAuthenticated = !!appUser && appUser.status === 'active';

  // ============================================================
  // CONTEXT VALUE
  // ============================================================
  const value: AuthContextType = {
    user,
    appUser,
    loading,
    isAdmin,
    isSeller,
    isCustomer,
    isAuthenticated,
    register,
    login,
    loginWithGoogle,
    logout,
    refreshUser,
    updateUserRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ============================================================
// HOOK
// ============================================================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};