// app/_layout.tsx

import React from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {

  return (
    <QueryClientProvider client={queryClient}>
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >

      {/* Authentication Screens */}
      <Stack.Screen name="(auth)" />

      {/* Main Application Screens */}
      <Stack.Screen name="(tabs)" />

      {/* Root Index Screen */}
      <Stack.Screen name="index" />

    </Stack>
    </QueryClientProvider>

  );

}