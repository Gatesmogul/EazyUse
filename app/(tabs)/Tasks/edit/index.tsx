import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "backend/services/firebase";
import { useRouter } from "expo-router";

interface Task {
  id: string;
  taskName: string;
  status: string;
  progress: number;
  priority: "Low" | "Medium" | "High";
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData: Task[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Task, "id">),
      }));

      setTasks(taskData);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: isDark ? "#111" : "#fff" },
      ]}
      onPress={() =>
        router.push({
          pathname: "../(tabs)/Tasks/[taskId]",
          params: { taskId: item.id },
        })
      }
    >
      <Text
        style={[
          styles.title,
          { color: isDark ? "#fff" : "#000" },
        ]}
      >
        {item.taskName}
      </Text>

      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${item.progress}%` },
          ]}
        />
      </View>

      <Text style={{ marginTop: 6 }}>
        {Math.round(item.progress)}%
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000" : "#f5f7fa" },
      ]}
    >
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default TaskList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "#ddd",
    borderRadius: 6,
    marginTop: 8,
    overflow: "hidden",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#3498db",
  },
});
