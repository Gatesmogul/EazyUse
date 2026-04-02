import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../backend/services/firebase";

const { width } = Dimensions.get("window");
const ICON_SIZE = 50;
const ITEM_SPACING = 24;

type HomeFile = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: "./About";
  taskId?: string;
};

const staticFiles: HomeFile[] = [
  {
    id: "about",
    title: "About",
    description: "Learn more about the app and company",
    icon: "information-circle-outline",
    route: "./About",
  },
];

const HomeIndex: React.FC = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<HomeFile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const snapshot = await getDocs(collection(db, "tasks"));
      const taskFiles: HomeFile[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title || "Untitled Task",
        description: doc.data().description || "No description",
        icon: "clipboard-outline",
        taskId: doc.id,
      }));
      setTasks(taskFiles);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handlePress = (item: HomeFile) => {
    if (item.taskId) {
      router.push({ pathname: "./[taskId]", params: { taskId: item.taskId } });
    } else if (item.route) {
      router.push(item.route);
    }
  };

  const renderItem = ({ item }: { item: HomeFile }) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
      ]}
      onPress={() => handlePress(item)}
    >
      <Ionicons name={item.icon} size={ICON_SIZE} color="#3498db" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Home" }} />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#3498db"
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={[...staticFiles, ...tasks]}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default HomeIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  loader: {
    marginTop: 50,
  },
  listContainer: {
    padding: ITEM_SPACING,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  textContainer: {
    marginLeft: 16,
    flexShrink: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});