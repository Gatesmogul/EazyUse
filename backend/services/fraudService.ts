import { collection, addDoc, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

interface FraudLog {
  userId: string;
  type: "login" | "transaction" | "profileChange";
  description: string;
  ip?: string;
  device?: string;
  createdAt: Timestamp;
}

/**
 * Logs a suspicious activity for fraud monitoring
 */
export const logFraudActivity = async (log: Omit<FraudLog, "createdAt">) => {
  await addDoc(collection(db, "fraudLogs"), {
    ...log,
    createdAt: Timestamp.now(),
  });
};

/**
 * Checks for multiple failed login attempts in last X minutes
 */
export const checkFailedLogins = async (userId: string, threshold = 5, minutes = 15) => {
  const q = query(
    collection(db, "fraudLogs"),
    where("userId", "==", userId),
    where("type", "==", "login")
  );

  const snapshot = await getDocs(q);
  const now = Timestamp.now().toDate();
  const recentFailures = snapshot.docs.filter((doc) => {
    const data = doc.data();
    const createdAt = data.createdAt.toDate();
    return (now.getTime() - createdAt.getTime()) / 60000 <= minutes; // minutes difference
  });

  return recentFailures.length >= threshold;
};
