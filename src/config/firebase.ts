// src/config/firebase.ts
import { initializeApp } from "firebase/app";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
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
  arrayRemove,
  serverTimestamp,          // ✅ ADD THIS
} from "firebase/firestore";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";

// ✅ App Check — reCAPTCHA Enterprise
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";

// ✅ Firebase AI Logic
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

import type {
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZ18pYTFh87y3y7PNkiVvqK3SIiQYbU1Q",
  authDomain: "mahaone-hypermart.firebaseapp.com",
  projectId: "mahaone-hypermart",
  storageBucket: "mahaone-hypermart.firebasestorage.app",
  messagingSenderId: "419627062846",
  appId: "1:419627062846:web:12e8e08781a43cc8ac636f",
  measurementId: "G-PP4SZ8HFQ9",
};

const app = initializeApp(firebaseConfig);

// ✅ App Check — DEBUG MODE (development only)

if (import.meta.env.DEV) {
  // @ts-ignore
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

// ✅ App Check initialize — reCAPTCHA Enterprise
initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(
    "6LejB7ktAAAAADhaoLndVS0tXbwgCZNT-tgwugUZ"  // 👈 yahan apni site key paste karo
  ),
  isTokenAutoRefreshEnabled: true,
});

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// ✅ AI Logic initialize
const ai = getAI(app, { backend: new GoogleAIBackend() });

// ✅ Store Builder Model (Gemini)
const storeBuilderModel = getGenerativeModel(ai, {
  model: "gemini-3.6-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.7,
  },
});

export {
  app,
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
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
  serverTimestamp,          // ✅ EXPORT THIS
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  ai,
  storeBuilderModel,
};

export type {
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot,
};