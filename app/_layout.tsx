// app/_layout.tsx
import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { onAuthStateChanged, User } from "firebase/auth";
import { ActivityIndicator, View } from "react-native";

// Import your Firebase auth instance
import { auth } from "../backend/services/firebase";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  /**
   * AUTHENTICATION LISTENER
   * Listens for changes in the user's sign-in state (login, logout, or session restore)
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (initializing) setInitializing(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Show a loading screen while Firebase checks if a session exists
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
        {!user ? (
          /* If user is null, only the (auth) group is accessible.
             This effectively hides the (tabs) and prevents the tab bar from rendering.
          */
          <Stack.Screen 
            name="(auth)" 
            options={{ 
              headerShown: false,
              // Disallow swiping back to the app from login
              gestureEnabled: false 
            }} 
          />
        ) : (
          /* Once 'user' is populated, the app switches to (tabs).
          */
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
              gestureEnabled: false 
            }} 
          />
        )}

        {/* The index screen. If this is a splash screen, it stays here. 
           If it's a landing page that shouldn't show after login, 
           consider moving it inside the (auth) block.
        */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}