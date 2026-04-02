// app/index.tsx

import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Redirect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

const AUTH_ROUTES: { name: string; icon: IoniconName; route: string }[] = [
  { name: "Sign In", icon: "log-in-outline", route: "/(auth)/SignIn" },
  { name: "Sign Up", icon: "person-add-outline", route: "/(auth)/SignUp" },
  { name: "Forgot Password", icon: "key-outline", route: "/(auth)/ForgotPassword" },
];

export default function Index() {
  const router = useRouter();

  // ✅ Redirect immediately to tabs
  return <Redirect href="/(tabs)" />;

 
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* HERO */}
        <View style={styles.hero}>
          <Ionicons name="wallet-outline" size={64} color="#1D4ED8" />
          <Text style={styles.title}>Welcome to EazyUse</Text>
          <Text style={styles.subtitle}>
            Secure fintech solutions at your fingertips.
          </Text>
        </View>

        {/* AUTH BUTTONS */}
        <View style={styles.grid}>
          {AUTH_ROUTES.map((item, index) => (
            <Pressable
              key={index}
              style={styles.card}
              onPress={() => router.push(item.route)}
            >
              <Ionicons name={item.icon} size={28} color="#1D4ED8" />
              <Text style={styles.cardText}>{item.name}</Text>
            </Pressable>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  scrollContent: {
    paddingBottom: 40,
  },

  hero: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 10,
    color: "#111827",
  },

  subtitle: {
    textAlign: "center",
    marginTop: 10,
    color: "#6B7280",
    fontSize: 14,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 20,
    marginTop: 30,
  },

  card: {
    width: "40%",
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
  },

  cardText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
});