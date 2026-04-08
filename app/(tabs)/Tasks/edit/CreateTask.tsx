import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Platform,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@services/firebase";
import  {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

type TaskStatus = "Pending" | "In Progress" | "Completed";

const CreateTask: React.FC = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [taskName, setTaskName] = useState("");
  const [status, setStatus] = useState<TaskStatus>("Pending");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const [showPicker, setShowPicker] = useState<
    "start" | "end" | "due" | null
  >(null);

  const calculateProgress = () => {
    if (status === "Completed") return 100;
    if (status === "In Progress") return 60;
    return 20;
  };

  const handleCreateTask = async () => {
    if (!taskName || !startDate || !dueDate) {
      Alert.alert("Error", "Please complete all required fields.");
      return;
    }

    try {
      await addDoc(collection(db, "tasks"), {
        taskName,
        status,
        startDate: Timestamp.fromDate(startDate),
        endDate: endDate ? Timestamp.fromDate(endDate) : null,
        dueDate: Timestamp.fromDate(dueDate),
        progress: calculateProgress(),
        createdAt: Timestamp.now(),
      });

      Alert.alert("Success", "Task created successfully.");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create task.");
    }
  };

  const renderDatePicker = () => {
  if (!showPicker) return null;

  const currentDate =
    showPicker === "start"
      ? startDate ?? new Date()
      : showPicker === "end"
      ? endDate ?? new Date()
      : dueDate ?? new Date();

  return (
    <DateTimePicker
      value={currentDate}
      mode="date"
      display="default"
      onChange={(
        event: DateTimePickerEvent,
        date?: Date
      ) => {
        setShowPicker(null);

        // If user cancels picker
        if (event.type === "dismissed") return;

        if (!date) return;

        if (showPicker === "start") setStartDate(date);
        if (showPicker === "end") setEndDate(date);
        if (showPicker === "due") setDueDate(date);
      }}
    />
  );
};
  return (
    <>
      <Stack.Screen options={{ title: "Create Task" }} />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: isDark ? "#000" : "#f5f7fa" },
        ]}
      >
        <Text style={[styles.header, { color: isDark ? "#fff" : "#111" }]}>
          Create Task
        </Text>

        {/* Task Name */}
        <View style={styles.row}>
          <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>
            Task Name
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? "#111" : "#fff",
                color: isDark ? "#fff" : "#000",
              },
            ]}
            placeholder="Enter task name"
            placeholderTextColor={isDark ? "#777" : "#aaa"}
            value={taskName}
            onChangeText={setTaskName}
          />
        </View>

        {/* Status */}
        <View style={styles.row}>
          <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>
            Status
          </Text>
          <TouchableOpacity
            style={styles.statusButton}
            onPress={() =>
              setStatus(
                status === "Pending"
                  ? "In Progress"
                  : status === "In Progress"
                  ? "Completed"
                  : "Pending"
              )
            }
          >
            <Text style={styles.statusText}>{status}</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.row}>
          <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>
            Progress
          </Text>
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${calculateProgress()}%` },
              ]}
            />
          </View>
          <Text style={{ marginTop: 5, color: "#3498db" }}>
            {calculateProgress()}%
          </Text>
        </View>

        {/* Date Grid */}
        <View style={styles.gridRow}>
          <TouchableOpacity
            style={styles.dateBox}
            onPress={() => setShowPicker("start")}
          >
            <Text style={styles.dateLabel}>Start Date</Text>
            <Text>{startDate?.toDateString() || "Select"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateBox}
            onPress={() => setShowPicker("end")}
          >
            <Text style={styles.dateLabel}>End Date</Text>
            <Text>{endDate?.toDateString() || "Select"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.dateBoxFull}
          onPress={() => setShowPicker("due")}
        >
          <Text style={styles.dateLabel}>Due Date</Text>
          <Text>{dueDate?.toDateString() || "Select"}</Text>
        </TouchableOpacity>

        {renderDatePicker()}

        {/* Submit */}
        <TouchableOpacity style={styles.button} onPress={handleCreateTask}>
          <Text style={styles.buttonText}>Create Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default CreateTask;

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1 },
  header: { fontSize: 26, fontWeight: "700", marginBottom: 20 },
  row: { marginBottom: 20 },
  label: { fontSize: 14, marginBottom: 6, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
  },
  statusButton: {
    backgroundColor: "#3498db20",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  statusText: { color: "#3498db", fontWeight: "600" },
  progressContainer: {
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: 10,
    backgroundColor: "#3498db",
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dateBox: {
    width: "48%",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dateBoxFull: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  dateLabel: { fontSize: 12, color: "#555", marginBottom: 4 },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
