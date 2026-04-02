// EazyUse/app/(tabs)/notifications/index.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { collection, query, orderBy, limit, getDocs, startAfter, QueryDocumentSnapshot, DocumentData, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../../backend/services/firebase";
import { Notification } from "../../../backend/services/types";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const PAGE_SIZE = 20;

const fetchNotifications = async (
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ notifications: Notification[]; lastDoc?: QueryDocumentSnapshot<DocumentData> }> => {
  if (!auth.currentUser) return { notifications: [] };

  const q = lastDoc
    ? query(
        collection(db, "users", auth.currentUser.uid, "notifications"),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      )
    : query(
        collection(db, "users", auth.currentUser.uid, "notifications"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );

  const snapshot = await getDocs(q);

  const notifications = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Notification[];

  const newLastDoc = snapshot.docs[snapshot.docs.length - 1];

  return { notifications, lastDoc: newLastDoc };
};

const NotificationsScreen: React.FC = () => {
  const [notificationsList, setNotificationsList] = useState<Notification[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | undefined>();
  const [refreshing, setRefreshing] = useState(false);

  /* ===============================
     Fetch Notifications with React Query
  ================================= */
  const { refetch, isLoading } = useQuery({
    queryKey: ["notifications", auth.currentUser?.uid],
    queryFn: () => fetchNotifications(),
    staleTime: 1000 * 60, // 1 minute
  });

  /* ===============================
     Real-time Updates (onSnapshot)
  ================================= */
  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, "users", auth.currentUser.uid, "notifications"),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
      setNotificationsList(notifs);
    });

    return () => unsubscribe();
  }, []);

  /* ===============================
     Pull-to-refresh
  ================================= */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const { notifications, lastDoc } = await fetchNotifications();
    setNotificationsList(notifications);
    setLastDoc(lastDoc);
    setRefreshing(false);
  }, []);

  /* ===============================
     Pagination
  ================================= */
  const loadMore = async () => {
    if (!lastDoc) return;
    const { notifications, lastDoc: newLastDoc } = await fetchNotifications(lastDoc);
    setNotificationsList((prev) => [...prev, ...notifications]);
    setLastDoc(newLastDoc);
  };

  /* ===============================
     Render Notification Icon
  ================================= */
  const renderIcon = (type: Notification["type"]) => {
    switch (type) {
      case "task_assigned":
        return <Ionicons name="clipboard-outline" size={24} color="#3498db" />;
      case "proposal_accepted":
        return <MaterialIcons name="check-circle-outline" size={24} color="#2ecc71" />;
      case "message":
        return <Ionicons name="chatbubble-outline" size={24} color="#e67e22" />;
    }
  };

  /* ===============================
     Render Notification Item
  ================================= */
  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity style={[styles.item, { backgroundColor: item.read ? "#f5f5f5" : "#ffffff" }]}>
      {renderIcon(item.type)}
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: item.read ? "normal" : "bold", fontSize: 16 }}>
          {item.title}
        </Text>
        <Text style={{ color: "#555" }}>{item.message}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={{ padding: 16 }}>
        {[...Array(5)].map((_, idx) => (
          <View
            key={idx}
            style={{
              height: 60,
              borderRadius: 8,
              backgroundColor: "#e0e0e0",
              marginBottom: 12,
            }}
          />
        ))}
      </View>
    );
  }

  if (notificationsList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No notifications yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notificationsList}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ paddingBottom: 16 }}
      onEndReached={loadMore}
      onEndReachedThreshold={0.3}
    />
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
