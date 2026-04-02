import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../../../backend/services/firebase";
type Message = {
  id: string;
  senderId: string;
  text: string;
  createdAt: any; // Firestore timestamp
};

const MessageThread: React.FC = () => {
  const searchParams = useLocalSearchParams();
const professionalId = searchParams.professionalId as string | undefined;
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  // Handle missing professionalId
  if (!professionalId) {
    return (
      <View style={styles.center}>
        <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>
          No professional selected.
        </Text>
      </View>
    );
  }

  const messagesRef = collection(db, "messages", professionalId, "thread");

  // Real-time messages listener
  useEffect(() => {
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Message, "id">),
      }));
      setMessages(msgs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [professionalId]);

  // Send message
  const sendMessage = useCallback(async () => {
    if (!input.trim() || !auth.currentUser) return;

    await addDoc(messagesRef, {
      text: input.trim(),
      senderId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });
    setInput("");
  }, [input]);

  // Render each message
  const renderItem = ({ item }: { item: Message }) => {
    const isSender = item.senderId === auth.currentUser?.uid;
    return (
      <View
        style={[
          styles.messageContainer,
          isSender ? styles.senderMessage : styles.receiverMessage,
          {
            backgroundColor: isDarkMode
              ? isSender
                ? "#0f172a"
                : "#1e293b"
              : isSender
              ? "#3498db"
              : "#e5e5ea",
          },
        ]}
      >
        <Text style={{ color: isDarkMode ? "#fff" : isSender ? "#fff" : "#000" }}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#0f172a" : "#fff" }]}>
      <Stack.Screen
        options={{
          title: "Chat",
          headerRight: () => (
            <TouchableOpacity onPress={() => alert("Payment modal triggered")}>
              <Ionicons
                name="card-outline"
                size={28}
                color={isDarkMode ? "#fff" : "#3498db"}
              />
            </TouchableOpacity>
          ),
        }}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: isDarkMode ? "#1e293b" : "#f2f2f2" },
          ]}
        >
          <TextInput
            style={[styles.input, { color: isDarkMode ? "#fff" : "#000" }]}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default MessageThread;

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  messageContainer: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
    maxWidth: "75%",
  },
  senderMessage: { alignSelf: "flex-end" },
  receiverMessage: { alignSelf: "flex-start" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    margin: 8,
    borderRadius: 12,
  },
  input: { flex: 1, paddingVertical: 10, paddingHorizontal: 16, fontSize: 16 },
  sendButton: { backgroundColor: "#3498db", padding: 12, borderRadius: 24, marginLeft: 8 },
});
