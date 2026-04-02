import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  collection,
  doc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../backend/services/firebase";
import * as ImagePicker from "expo-image-picker";

/* ===============================
   USER (Replace with Firebase Auth)
================================ */
const currentUser = { id: "user123", name: "Ade Developer" };

/* ===============================
   TYPES
================================ */
type Message = {
  id: string;
  text?: string;
  senderId: string;
  senderName: string;
  createdAt: any;
  readBy?: string[];
  reactions?: Record<string, string>;
  attachments?: { type: "image"; url: string }[];
  replyTo?: Message;
};

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  /* ===============================
     🔥 REALTIME MESSAGES
  ================================= */
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];

      setMessages(msgs);

      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });

    return () => unsubscribe();
  }, [chatId]);

  /* ===============================
     🔥 TYPING INDICATOR
  ================================= */
  useEffect(() => {
    if (!chatId) return;
    const chatRef = doc(db, "chats", chatId);

    const unsub = onSnapshot(chatRef, (snap) => {
      setTypingUsers(snap.data()?.typing || {});
    });

    return () => unsub();
  }, [chatId]);

  const updateTyping = async (typing: boolean) => {
    if (!chatId) return;
    const chatRef = doc(db, "chats", chatId);

    await updateDoc(chatRef, { [`typing.${currentUser.id}`]: typing });
  };

  /* ===============================
     🔥 SEND MESSAGE WITH REPLY
  ================================= */
  const handleSend = async () => {
    if (!newMessage.trim() || !chatId) return;

    const messageRef = collection(db, "chats", chatId, "messages");

    const payload: any = {
      text: newMessage,
      senderId: currentUser.id,
      senderName: currentUser.name,
      createdAt: serverTimestamp(),
      readBy: [currentUser.id],
    };

    if (replyingTo) payload.replyTo = replyingTo;

    await addDoc(messageRef, payload);

    await updateDoc(doc(db, "users", currentUser.id, "chats", chatId), {
      lastMessage: newMessage,
      lastUpdated: serverTimestamp(),
      typing: false,
    });

    setNewMessage("");
    setReplyingTo(null);
  };

  /* ===============================
     🔥 IMAGE PICKER
  ================================= */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length && chatId) {
      const uri = result.assets[0].uri;

      await addDoc(collection(db, "chats", chatId, "messages"), {
        senderId: currentUser.id,
        senderName: currentUser.name,
        createdAt: serverTimestamp(),
        attachments: [{ type: "image", url: uri }],
        readBy: [currentUser.id],
      });
    }
  };

  /* ===============================
     🔥 REACTIONS
  ================================= */
  const addReaction = async (msgId: string) => {
    if (!chatId) return;
    const msgRef = doc(db, "chats", chatId, "messages", msgId);

    await updateDoc(msgRef, { [`reactions.${currentUser.id}`]: "❤️" });
  };

  /* ===============================
     🔥 RENDER MESSAGE
  ================================= */
  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.senderId === currentUser.id;

    return (
      <Pressable
        onPress={() => addReaction(item.id)}
        onLongPress={() => !isMe && setReplyingTo(item)}
      >
        <View style={[styles.message, isMe ? styles.myMessage : styles.theirMessage]}>
          {!isMe && <Text style={styles.sender}>{item.senderName}</Text>}

          {item.replyTo && (
            <View style={styles.replyContainer}>
              <Text style={styles.replySender}>{item.replyTo.senderName}</Text>
              {item.replyTo.text && <Text style={styles.replyText}>{item.replyTo.text}</Text>}
            </View>
          )}

          {item.text && <Text style={isMe ? styles.myText : styles.theirText}>{item.text}</Text>}

          {item.attachments?.map((att, i) => (
            <Image key={i} source={{ uri: att.url }} style={styles.image} />
          ))}

          {item.reactions && <Text style={styles.reactions}>{Object.values(item.reactions).join(" ")}</Text>}
        </View>
      </Pressable>
    );
  };

  const typingText = Object.keys(typingUsers).some(
    (uid) => uid !== currentUser.id && typingUsers[uid]
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
      />

      {typingText && <Text style={styles.typing}>Someone is typing...</Text>}

      {/* REPLY PREVIEW */}
      {replyingTo && (
        <View style={styles.replyingTo}>
          <Text style={styles.replyingText}>Replying to {replyingTo.senderName}: "{replyingTo.text || "Media"}"</Text>
          <Pressable onPress={() => setReplyingTo(null)}>
            <Text style={{ fontWeight: "bold", marginLeft: 8 }}>✕</Text>
          </Pressable>
        </View>
      )}

      {/* INPUT */}
      <View style={styles.inputContainer}>
        <Pressable onPress={pickImage}>
          <Text style={{ fontSize: 20 }}>📎</Text>
        </Pressable>

        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={(text) => {
            setNewMessage(text);
            updateTyping(text.length > 0);
          }}
        />

        <Pressable style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ===============================
   STYLES
================================ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FB" },

  message: {
    padding: 10,
    borderRadius: 12,
    marginVertical: 5,
    maxWidth: "75%",
  },

  myMessage: { backgroundColor: "#2563EB", alignSelf: "flex-end" },
  theirMessage: { backgroundColor: "#E5E7EB", alignSelf: "flex-start" },

  myText: { color: "#fff" },
  theirText: { color: "#111" },

  sender: { fontSize: 12, fontWeight: "600", marginBottom: 3 },
  reactions: { marginTop: 4 },

  image: { width: 150, height: 150, borderRadius: 10, marginTop: 5 },

  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 12,
    marginHorizontal: 8,
  },

  sendBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 20,
  },

  sendText: { color: "#fff", fontWeight: "600" },
  typing: { fontStyle: "italic", paddingLeft: 12, color: "#666" },

  replyContainer: {
    backgroundColor: "#d1d5db",
    padding: 6,
    borderRadius: 8,
    marginBottom: 5,
  },
  replySender: { fontWeight: "bold", fontSize: 12 },
  replyText: { fontSize: 12 },

  replyingTo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#2563EB",
  },
  replyingText: { fontStyle: "italic", color: "#333" },
});