// app/(tabs)/index.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>

          <Text style={styles.title}>
            Welcome to EazyUse! 👋
          </Text>

          <Text style={styles.subtitle}>
            This is the main dashboard of the EazyUse app.
            From here you can access payments, messaging,
            tasks, professionals, wallet services and more.
          </Text>

          <Text style={styles.info}>
            Use the navigation tabs to explore different
            features of the platform.
          </Text>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.08,
  },

  container: {
    width: "100%",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: height * 0.02,
  },

  subtitle: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    marginBottom: height * 0.02,
    lineHeight: 22,
  },

  info: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },

});