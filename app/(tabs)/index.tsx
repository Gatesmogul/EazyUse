// app/index.tsx

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  // Track which auth screen to navigate to
  const [step, setStep] = useState(0);

  useEffect(() => {
    const routes = [
      "/(auth)/SignUp",
      "/(auth)/SignIn",
      "/(auth)/ForgotPassword",
    ];

    // Show splash for a short time, then redirect
    const timer = setTimeout(() => {
      router.replace(routes[step]);
    }, 2500); // 2.5 seconds flash

    return () => clearTimeout(timer);
  }, [step]);

  // Cycle through routes (optional continuous loop)
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 8000); // change route every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>EazyUse</Text>

        <Text style={styles.message}>
          You are welcome to EazyUse app. From here you can access payments,
          messaging, tasks, professionals, wallet services and more.
        </Text>

        <ActivityIndicator size="large" color="#1D4ED8" style={styles.loader} />
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    elevation: 4,
    width: "100%",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1D4ED8",
    marginBottom: 15,
  },

  message: {
    fontSize: 15,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 22,
  },

  loader: {
    marginTop: 25,
  },
});