import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  increment,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

/* ===============================
   🔥 Types
================================= */

export type TaskStatus = "open" | "in_progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: TaskStatus;
  createdBy: string;
  proposalCount: number;
  createdAt: any;
}

export interface Proposal {
  id: string;
  userId: string;
  coverLetter: string;
  bidAmount: number;
  createdAt: any;
}

/* ===============================
   🔥 Create Task
================================= */

export const createTask = async (data: Omit<Task, "id" | "proposalCount" | "createdAt">) => {
  const docRef = await addDoc(collection(db, "tasks"), {
    ...data,
    proposalCount: 0,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

/* ===============================
   🔥 Get Single Task
================================= */

export const getTaskById = async (taskId: string): Promise<Task | null> => {
  const docRef = doc(db, "tasks", taskId);
  const snap = await getDoc(docRef);

  if (!snap.exists()) return null;

  return { id: snap.id, ...snap.data() } as Task;
};

/* ===============================
   🔥 Cursor-Based Pagination
================================= */

export const getTasksPaginated = async (
  pageSize: number,
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  status?: TaskStatus
) => {
  let q = query(
    collection(db, "tasks"),
    orderBy("createdAt", "desc"),
    limit(pageSize)
  );

  if (status && status !== "open") {
    q = query(
      collection(db, "tasks"),
      where("status", "==", status),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );
  }

  if (lastDoc) {
    q = query(
      collection(db, "tasks"),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(pageSize)
    );
  }

  const snapshot = await getDocs(q);

  const tasks: Task[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Task[];

  return {
    tasks,
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
  };
};

/* ===============================
   🔥 Real-Time Task Listener
================================= */

export const listenToTask = (
  taskId: string,
  callback: (task: Task | null) => void
) => {
  const unsub = onSnapshot(doc(db, "tasks", taskId), (snap) => {
    if (!snap.exists()) {
      callback(null);
      return;
    }

    callback({ id: snap.id, ...snap.data() } as Task);
  });

  return unsub;
};

/* ===============================
   🔥 Submit Proposal
================================= */

export const submitProposal = async (
  taskId: string,
  userId: string,
  coverLetter: string,
  bidAmount: number
) => {
  const proposalRef = collection(db, "tasks", taskId, "proposals");

  await addDoc(proposalRef, {
    userId,
    coverLetter,
    bidAmount,
    createdAt: serverTimestamp(),
  });

  // 🔥 increment proposal count atomically
  await updateDoc(doc(db, "tasks", taskId), {
    proposalCount: increment(1),
  });
};

/* ===============================
   🔥 Real-Time Proposal Listener
================================= */

export const listenToProposals = (
  taskId: string,
  callback: (proposals: Proposal[]) => void
) => {
  const q = query(
    collection(db, "tasks", taskId, "proposals"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const proposals = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Proposal[];

    callback(proposals);
  });
};

/* ===============================
   🔥 Bookmark Task
================================= */

export const bookmarkTask = async (taskId: string, userId: string) => {
  const bookmarkRef = doc(db, "tasks", taskId, "bookmarks", userId);

  await updateDoc(bookmarkRef, {
    createdAt: serverTimestamp(),
  }).catch(async () => {
    // if doc doesn't exist
    await addDoc(collection(db, "tasks", taskId, "bookmarks"), {
      userId,
      createdAt: serverTimestamp(),
    });
  });
};

/* ===============================
   🔥 Remove Bookmark
================================= */

export const removeBookmark = async (taskId: string, userId: string) => {
  const bookmarkRef = doc(db, "tasks", taskId, "bookmarks", userId);
  await deleteDoc(bookmarkRef);
};

/* ===============================
   🔥 Escrow Payment Hook
================================= */

export const initiateEscrowPayment = async (
  taskId: string,
  amount: number,
  payerId: string
) => {
  // This is where you integrate Stripe / Paystack / Flutterwave
  // For now we just mark escrow as funded

  await updateDoc(doc(db, "tasks", taskId), {
    escrowFunded: true,
    escrowAmount: amount,
    escrowPayer: payerId,
    escrowFundedAt: serverTimestamp(),
  });
};
