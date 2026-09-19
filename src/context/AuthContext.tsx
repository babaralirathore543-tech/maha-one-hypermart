// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

// ✅ Direct imports from firebase/auth
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';

// ✅ Direct imports from firebase/firestore
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';

// ✅ Only auth + db from your config
import { auth, db } from '../config/firebase';

// ============================================================
// TYPES
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
  user: FirebaseUser | null;
  appUser: AppUser | null;
  userId: string | null;
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
  updateUserRole: (
    uid: string,
    role: 'admin' | 'seller' | 'customer'
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================
// PROVIDER
// ============================================================
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // ─────────────────────────────────────────────
  // Fetch app user
  // ─────────────────────────────────────────────
  const fetchAppUser = async (
    firebaseUser: FirebaseUser
  ): Promise<AppUser | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

      if (userDoc.exists()) {
        const data = userDoc.data();
        let role: AppUser['role'] = data.role || 'customer';

        // Fallback: seller collection check
        if (!data.role) {
          try {
            const sellerSnap = await getDoc(doc(db, 'sellers', firebaseUser.uid));
            if (
              sellerSnap.exists() &&
              sellerSnap.data().verificationStatus === 'approved'
            ) {
              role = 'seller';
            }
          } catch {
            /* ignore */
          }
        }

        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email || data.email || null,
          displayName:
            firebaseUser.displayName ||
            data.name ||
            data.displayName ||
            null,
          photoURL: firebaseUser.photoURL || data.photoURL || null,
          role,
          status: data.status || 'active',
          phoneNumber: data.phoneNumber || null,
          createdAt: data.createdAt || new Date().toISOString(),
        };
      }

      // Default
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
    } catch (error) {
      console.error('❌ Error fetching app user:', error);
      return null;
    }
  };

  // ─────────────────────────────────────────────
  // Auth state listener
  // ─────────────────────────────────────────────
  useEffect(() => {
    let unsubDoc: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userData = await fetchAppUser(currentUser);
        setAppUser(userData);
        setLoading(false);

        // Live updates for role/status changes
        unsubDoc = onSnapshot(
          doc(db, 'users', currentUser.uid),
          (snap) => {
            if (snap.exists()) {
              const data = snap.data();
              setAppUser((prev) =>
                prev
                  ? {
                      ...prev,
                      role: data.role || prev.role,
                      status: data.status || prev.status,
                      displayName:
                        data.name || data.displayName || prev.displayName,
                      photoURL: data.photoURL || prev.photoURL,
                      phoneNumber: data.phoneNumber || prev.phoneNumber,
                    }
                  : prev
              );
            }
          },
          (err) => console.warn('users doc listener error:', err)
        );
      } else {
        setUser(null);
        setAppUser(null);
        setLoading(false);
        if (unsubDoc) {
          unsubDoc();
          unsubDoc = undefined;
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubDoc) unsubDoc();
    };
  }, []);

  // ─────────────────────────────────────────────
  // Refresh user
  // ─────────────────────────────────────────────
  const refreshUser = async () => {
    const current = auth.currentUser;
    if (!current) {
      setAppUser(null);
      return;
    }
    const userData = await fetchAppUser(current);
    setAppUser(userData);
  };

  // ─────────────────────────────────────────────
  // Update role
  // ─────────────────────────────────────────────
  const updateUserRole = async (
    uid: string,
    role: 'admin' | 'seller' | 'customer'
  ) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        role,
        updatedAt: new Date().toISOString(),
      });
      setAppUser((prev) => (prev ? { ...prev, role } : null));
    } catch (error) {
      console.error('❌ Error updating role:', error);
      throw error;
    }
  };

  // ─────────────────────────────────────────────
  // Register
  // ─────────────────────────────────────────────
  const register = async (
    email: string,
    password: string,
    name?: string
  ) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const firebaseUser = userCredential.user;

    await setDoc(doc(db, 'users', firebaseUser.uid), {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: name || firebaseUser.displayName || '',
      displayName: name || firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || '',
      role: 'customer',
      status: 'active',
      createdAt: new Date().toISOString(),
      wishlist: [],
      orders: [],
    });

    setAppUser({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: name || firebaseUser.displayName || null,
      photoURL: firebaseUser.photoURL,
      role: 'customer',
      status: 'active',
      phoneNumber: null,
      createdAt: new Date().toISOString(),
    });
  };

  // ─────────────────────────────────────────────
  // Login
  // ─────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // ─────────────────────────────────────────────
  // Login with Google
  // ─────────────────────────────────────────────
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const firebaseUser = userCredential.user;

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || '',
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
        role: 'customer',
        status: 'active',
        createdAt: new Date().toISOString(),
        wishlist: [],
        orders: [],
      });
    }
  };

  // ─────────────────────────────────────────────
  // Logout
  // ─────────────────────────────────────────────
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setAppUser(null);
  };

  // ─────────────────────────────────────────────
  // Computed
  // ─────────────────────────────────────────────
  const userId = user?.uid || null;
  const isAdmin = appUser?.role === 'admin';
  const isSeller = appUser?.role === 'seller';
  const isCustomer =
    appUser?.role === 'customer' || (!appUser?.role && !!user);
  const isAuthenticated = !!appUser && appUser.status === 'active';

  const value: AuthContextType = {
    user,
    appUser,
    userId,
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

  // ✅ ALWAYS render children
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
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