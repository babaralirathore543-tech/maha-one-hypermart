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
  serverTimestamp,
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

// ⚠️ APP CHECK DISABLED TEMPORARILY FOR DEVELOPMENT
// import {
//   initializeAppCheck,
//   ReCaptchaEnterpriseProvider,
// } from "firebase/app-check";

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

// ⚠️ APP CHECK DISABLED FOR DEVELOPMENT
// Baad mein enable karna ho toh uncomment karo

// if (import.meta.env.DEV) {
//   // @ts-ignore
//   self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
// }
//
// initializeAppCheck(app, {
//   provider: new ReCaptchaEnterpriseProvider(
//     "6LejB7ktAAAAADhaoLndVS0tXbwgCZNT-tgwugUZ"
//   ),
//   isTokenAutoRefreshEnabled: true,
// });

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// ============================================================
// AI LOGIC — SAFE DYNAMIC IMPORT
// ============================================================
let ai: any = null;
let storeBuilderModel: any = null;

import("firebase/ai")
  .then(({ getAI, getGenerativeModel, GoogleAIBackend }) => {
    try {
      ai = getAI(app, { backend: new GoogleAIBackend() });
      storeBuilderModel = getGenerativeModel(ai, {
        model: "gemini-2.0-flash",
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });
      console.log("✅ AI Logic initialized");
    } catch (err) {
      console.warn("⚠️ AI Logic init failed:", err);
    }
  })
  .catch((err) => {
    console.warn("⚠️ firebase/ai not available:", err);
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
  serverTimestamp,
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