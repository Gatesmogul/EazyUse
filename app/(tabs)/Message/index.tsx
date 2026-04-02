import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  DocumentData,
} from "firebase/firestore";
import { db, auth } from "../../../backend/services/firebase";

type Chat = {
  id: string;
  name: string;
  lastMessage?: string;
  unreadCount?: number;
  typing?: boolean;
};

const MessageIndex: React.FC = () => {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const chatsRef = collection(db, "users", user.uid, "chats");
    const q = query(chatsRef, orderBy("lastUpdated", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const chatList: Chat[] = snapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;

          return {
            id: doc.id,
            name: data.name || "Unknown",
            lastMessage: data.lastMessage || "",
            unreadCount: data.unreadCount || 0, // 🔥 assume stored in DB
            typing: data.typing || false, // 🔥 assume stored in DB
          };
        });

        setChats(chatList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching chats:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatCard}
      activeOpacity={0.7}
      onPress={() =>
        router.push({
          pathname: "./[chatId]",
          params: { chatId: item.id },
        })
      }
    >
      <View style={styles.avatar}>
        <Ionicons name="chatbubble-ellipses-outline" size={22} color="#fff" />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>

        {item.typing ? (
          <Text style={styles.typing}>Typing...</Text>
        ) : (
          <Text style={styles.message} numberOfLines={1}>
            {item.lastMessage || "No messages yet"}
          </Text>
        )}
      </View>

      {item.unreadCount! > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Messages" }} />

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : chats.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubble-outline" size={70} color="#ccc" />
          <Text style={styles.emptyText}>No conversations yet</Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default MessageIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  loader: {
    marginTop: 50,
  },

  list: {
    padding: 16,
  },

  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
  },

  textContainer: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },

  message: {
    fontSize: 13,
    color: "#666",
    marginTop: 3,
  },

  typing: {
    fontSize: 13,
    color: "#3498db",
    marginTop: 3,
    fontStyle: "italic",
  },

  badge: {
    backgroundColor: "#E74C3C",
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    marginTop: 10,
    fontSize: 15,
    color: "#999",
  },
});