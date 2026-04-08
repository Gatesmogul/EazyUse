import React from "react";
import { Redirect } from "expo-router";

/**
 * app/index.tsx
 * The root index acts as a pass-through. 
 * Navigation logic is centralized in the root _layout.tsx.
 */
export default function Index() {
  // Redirect to the entry gate. 
  // Root _layout.tsx will override this if a user is already logged in.
  return <Redirect href="/(auth)/SignIn" />;
}