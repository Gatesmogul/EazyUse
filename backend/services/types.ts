// EazyUse/services/types.ts


export type NotificationType = "task_assigned" | "proposal_accepted" | "message";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  targetId?: string; // taskId or chatId
  read: boolean;
  createdAt: any; // Firestore timestamp
}
