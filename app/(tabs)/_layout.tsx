import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0A84FF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
        },
      }}
    >
      {/* 1. PRIMARY TABS (Visible) */}
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color, size }) => <Ionicons name="wallet" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Profile/index" // Assuming your main profile page is index
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />

      {/* 2. HIDDEN SCREENS (Regular screens inside this folder but NOT in the tab bar) */}
      
      <Tabs.Screen
        name="Profile/edit"
        options={{
          href: null, // This hides the icon from the bottom bar
        }}
      />
      <Tabs.Screen
        name="Payments/details"
        options={{
          href: null, // Hidden
        }}
      />
      <Tabs.Screen
        name="Settings/index"
        options={{
          href: null, // Hidden (usually accessed via a button on the Profile page)
        }}
      />
      
      {/* Add href: null to any other screens from your screenshot 
          that shouldn't be main bottom-bar icons */}
      <Tabs.Screen name="Message" options={{ href: null }} />
      <Tabs.Screen name="Professionals" options={{ href: null }} />
      <Tabs.Screen name="Notifications" options={{ href: null }} />
      <Tabs.Screen name="Payments" options={{ href: null }} />

    </Tabs>
  );
}