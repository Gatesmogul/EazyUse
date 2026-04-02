import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function ProcessingPayment() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      return router.replace("../PaymentSuccess"); // or PaymentFailed
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2563EB" />
      <Text style={styles.text}>Processing your payment...</Text>
      <Text style={styles.subText}>
        Please wait while we confirm your transaction securely.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  subText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});
