// services/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Load env variables safely
const firebaseConfig = {
  apiKey: "AIzaSyD2-0k9I5U01uCCi4-my20nZ-wu6-uMaBk",
  authDomain: "eazyuse-5373b.firebaseapp.com",
  projectId: "eazyuse-5373b",
  storageBucket: "eazyuse-5373b.firebasestorage.app",
  messagingSenderId: "73540526574",
  appId: "1:73540526574:web:eeff898c98b60db9b0eeff",
  measurementId: "G-KVPR98XZ9F"
};

// 🔴 Validate config (prevents silent crash)
if (!firebaseConfig.apiKey) {
  console.error("❌ Firebase API Key is missing. Check your .env file.");
}

// ✅ Prevent multiple app initialization (important for Expo)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Core services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;