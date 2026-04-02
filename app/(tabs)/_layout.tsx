// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#0A84FF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
        },

        tabBarIcon: ({ color, size }) => {
          let iconName: any = "home";

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;

            case "Message":
              iconName = "chatbubble";
              break;

            case "Wallet":
              iconName = "wallet";
              break;

            case "Payments":
              iconName = "card";
              break;

            case "Professionals":
              iconName = "people";
              break;

            case "Tasks":
              iconName = "list";
              break;

            case "Notifications":
              iconName = "notifications";
              break;

            case "Profile":
              iconName = "person";
              break;

            case "Settings":
              iconName = "settings";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Home" options={{ title: "Home" }} />
      <Tabs.Screen name="Message" options={{ title: "Messages" }} />
      <Tabs.Screen name="Wallet" options={{ title: "Wallet" }} />
      <Tabs.Screen name="Payments" options={{ title: "Payments" }} />
      <Tabs.Screen name="Professionals" options={{ title: "Professionals" }} />
      <Tabs.Screen name="Tasks" options={{ title: "Tasks" }} />
      <Tabs.Screen name="Notifications" options={{ title: "Notifications" }} />
      <Tabs.Screen name="Profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="Settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}