import React from "react";
import { Stack } from "expo-router";

/**
 * AuthLayout
 * This layout handles the navigation stack for unauthenticated users.
 * It is nested inside the root Stack, ensuring that the Tab Bar 
 * from the (tabs) group never appears here.
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        // Hide headers globally for the auth flow to use custom UI
        headerShown: false,
        // 'fade' or 'slide_from_right' are standard for auth transitions
        animation: "fade",
        // Closes keyboard automatically when navigating between auth screens
        keyboardHandlingEnabled: true,
      }}
    >
      {/* Ensure these 'name' props match your filenames exactly. 
        If your files are 'SignIn.tsx', use 'SignIn'.
        If they are 'sign-in.tsx', use 'sign-in'.
      */}
      <Stack.Screen 
        name="SignIn" 
        options={{
          title: "Sign In",
        }} 
      />
      <Stack.Screen 
        name="SignUp" 
        options={{
          title: "Create Account",
        }} 
      />
      <Stack.Screen 
        name="ForgotPassword" 
        options={{
          title: "Reset Password",
          presentation: "modal", // Optional: makes forgot password pop up as a sheet
        }} 
      />
    </Stack>
  );
}