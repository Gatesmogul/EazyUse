import React, { useState, useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { onAuthStateChanged, User } from "firebase/auth";
import { ActivityIndicator, View } from "react-native"

// Path alias updated for consistency
import { auth } from "../backend/services/firebase";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  // Professional Protection Logic
  useEffect(() => {
    if (initializing) return;

    // Check if the user is currently in the (auth) group
    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // If not logged in and trying to access tabs, redirect to login
      router.replace("/(auth)/SignIn");
    } else if (user && inAuthGroup) {
      // If logged in and trying to access auth screens, redirect to tabs
      router.replace("/(tabs)");
    }
  }, [user, initializing, segments]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        {/* We define the stacks, but the useEffect above handles the jumping */}
        <Stack.Screen name="(auth)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="index" />
      </Stack>
    </QueryClientProvider>
  );
}