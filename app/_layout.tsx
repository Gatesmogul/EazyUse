import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { onAuthStateChanged, User } from "firebase/auth";
import { ActivityIndicator, View } from "react-native";

// Import your Firebase auth instance
import { auth } from "../backend/services/firebase";

// Initialize the Query Client outside the component
const queryClient = new QueryClient();

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  // 1. Loader: Keep this inside the component but BEFORE the return
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        {/* The Conditional Switch: 
          This is what removes the tab icons from the sign-in screen.
        */}
        {!user ? (
          <Stack.Screen 
            name="(auth)" 
            options={{ 
              headerShown: false,
              gestureEnabled: false 
            }} 
          />
        ) : (
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
              gestureEnabled: false 
            }} 
          />
        )}

        {/* IMPORTANT: Remove "index" from here if your app/index.tsx 
          is just a redirector. If you keep it here, ensure it 
          doesn't contain a <Tabs /> component.
        */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}