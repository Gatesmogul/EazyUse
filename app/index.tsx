import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../backend/services/firebase";

/**
 * app/index.tsx
 * This is the entry point of the app. 
 * Its only job is to check the user's session and redirect them.
 */
export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Listen for the auth state just once to handle the initial redirect
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in, send them to the main app
        router.replace("/(tabs)");
      } else {
        // No user, send them to the sign-in screen
        router.replace("/(auth)/SignIn");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {/* A simple loader to show while the redirect logic processes. 
          This prevents any flashes of the wrong UI.
      */}
      <ActivityIndicator size="large" color="#007BFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});