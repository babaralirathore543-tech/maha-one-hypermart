import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// 🔥 YAHAN APNA CONFIG PASTE KAREIN (jo Firebase Console se mila tha)
const firebaseConfig = {
  apiKey: "AIzaSyC45h2NcwDdvFw3QAVG9qTwYYYs4uLqG2M",
  authDomain: "maha-one-hypermart.firebaseapp.com",
  projectId: "maha-one-hypermart",
  storageBucket: "maha-one-hypermart.firebasestorage.app",
  messagingSenderId: "527233139626",
  appId: "1:527233139626:web:7513f41f6f06b9820f61d3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;