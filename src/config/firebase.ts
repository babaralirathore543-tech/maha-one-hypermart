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
} from "firebase/firestore";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";

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

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

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
  getDownloadURL,
};

export type {
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot,
};