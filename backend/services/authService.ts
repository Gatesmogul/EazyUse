import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "backend/services/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

/* ===============================
   🔥 Types
================================= */

export type UserRole = "business" | "freelancer";

export interface AppUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  role: UserRole;
  createdAt: any;
}

/* ===============================
   🔥 Email/Password Sign Up
================================= */

export const signUpWithEmail = async (
  email: string,
  password: string,
  role: UserRole,
  displayName?: string
): Promise<AppUser> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const userData: AppUser = {
    uid: user.uid,
    email: user.email,
    displayName: displayName || user.displayName || null,
    role,
    createdAt: new Date(),
  };

  // Save to Firestore
  await setDoc(doc(db, "users", user.uid), userData);

  return userData;
};

/* ===============================
   🔥 Email/Password Sign In
================================= */

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<AppUser | null> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const docSnap = await getDoc(doc(db, "users", user.uid));
  if (!docSnap.exists()) return null;

  return docSnap.data() as AppUser;
};

/* ===============================
   🔥 Google Sign-In
================================= */

export const signInWithGoogle = async (): Promise<AppUser | null> => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;

  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    const userData: AppUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: "freelancer", // default role for Google sign-in
      createdAt: new Date(),
    };
    await setDoc(docRef, userData);
    return userData;
  }

  return docSnap.data() as AppUser;
};

/* ===============================
   🔥 Sign Out
================================= */

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

/* ===============================
   🔥 Password Reset
================================= */

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

/* ===============================
   🔥 Auth State Listener
================================= */

export const onAuthStateChangedListener = (
  callback: (user: AppUser | null) => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        callback(docSnap.data() as AppUser);
      } else {
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

/* ===============================
   🔥 Get Current User
================================= */

export const getCurrentUser = async (): Promise<AppUser | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  const docSnap = await getDoc(doc(db, "users", user.uid));
  if (!docSnap.exists()) return null;

  return docSnap.data() as AppUser;
};
