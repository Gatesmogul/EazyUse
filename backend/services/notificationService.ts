// EazyUse/services/notificationService.ts
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
  startAfter,
} from "firebase/firestore";
import { db, auth } from "./firebase"; // fixed relative path
import { Notification } from "./types"; // fixed relative path

/* ===============================
   🔥 Pagination size
================================= */
const PAGE_SIZE = 20;

/* ===============================
   🔥 Fetch Notifications
================================= */
export const fetchNotifications = async (
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ notifications: Notification[]; lastDoc?: QueryDocumentSnapshot<DocumentData> }> => {
  if (!auth.currentUser) return { notifications: [] };

  const notificationsRef = collection(db, "users", auth.currentUser.uid, "notifications");

  const q = lastDoc
    ? query(notificationsRef, orderBy("createdAt", "desc"), startAfter(lastDoc), limit(PAGE_SIZE))
    : query(notificationsRef, orderBy("createdAt", "desc"), limit(PAGE_SIZE));

  const snapshot = await getDocs(q);

  const notifications = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Notification[];

  const newLastDoc = snapshot.docs[snapshot.docs.length - 1];

  return { notifications, lastDoc: newLastDoc };
};
