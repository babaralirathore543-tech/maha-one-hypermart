import { initializeApp } from "firebase/app";
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from "firebase/storage";
import { 
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDoc,
  onSnapshot,
  setDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { 
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth";

// ✅ Types ko alag se import karein
import type { 
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot
} from "firebase/firestore";

// ⚠️ Apna Firebase Config yahan paste karein
const firebaseConfig = {
  apiKey: "AIzaSyC45h2NcwDdvFw3QAVG9qTwYYYs4uLqG2M",
  authDomain: "maha-one-hypermart.firebaseapp.com",
  projectId: "maha-one-hypermart",
  storageBucket: "maha-one-hypermart.firebasestorage.app",
  messagingSenderId: "527233139626",
  appId: "1:527233139626:web:7513f41f6f06b9820f61d3",
  measurementId: "G-WCDFS8XQTF"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Services
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// ✅ Export Services (Values)
export { 
  app,
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  db,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  setDoc,
  arrayUnion,
  arrayRemove,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL
};

// ✅ Export Types
export type { 
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot
};