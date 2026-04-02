import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
import * as Network from "expo-network";
import { logFraudActivity, checkFailedLogins } from "backend/services/fraudService";
import { auth } from "backend/services/firebase";
import { signOut } from "firebase/auth";

// Web-compatible device name
const deviceName = Platform.OS === "web" ? "Web Browser" : Device.modelName;

const SettingsIndex: React.FC = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setCurrentUser(user));
    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    if (!currentUser) return;

    try {
      const suspicious = await checkFailedLogins(currentUser.uid);
      if (suspicious) {
        Alert.alert(
          "Suspicious activity detected",
          "Multiple failed login attempts detected. Your account is temporarily locked. Contact support."
        );

        const ip = await Network.getIpAddressAsync();

        await logFraudActivity({
          userId: currentUser.uid,
          type: "login",
          description: "Blocked logout due to suspicious activity",
          ip: ip || undefined,
          device: deviceName || undefined,
        });

        return;
      }

      await signOut(auth);
      router.push("/(auth)/SignIn"); // use absolute route
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Could not sign out. Try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Settings" }} />

      <Text style={styles.sectionTitle}>Account</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/Profile/Edit")}
      >
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={[styles.buttonText, { color: "#e74c3c" }]}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Security & Privacy</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/Settings/Biometric")}
      >
        <Text style={styles.buttonText}>Enable Biometric Authentication</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/Settings/Session")}
      >
        <Text style={styles.buttonText}>Manage Active Sessions</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/Settings/Deactivate")}
      >
        <Text style={[styles.buttonText, { color: "#e74c3c" }]}>
          Deactivate Account
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/Settings/DataExport")}
      >
        <Text style={styles.buttonText}>Export My Data (GDPR)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/Settings/FraudLogs")}
      >
        <Text style={styles.buttonText}>View Security Activity Log</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SettingsIndex;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 12,
    color: "#2c3e50",
  },
  button: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: { fontSize: 16, fontWeight: "600", color: "#3498db" },
});