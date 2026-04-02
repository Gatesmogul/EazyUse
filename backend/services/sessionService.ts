import { getAuth, signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
export const logoutAllDevices = async (userId: string) => {
  const auth = getAuth();

  // Update session version to invalidate other sessions
  await updateDoc(doc(db, "users", userId), {
    sessionVersion: Date.now(),
  });

  await signOut(auth);
};