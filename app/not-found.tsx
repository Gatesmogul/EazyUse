import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";

const NotFoundPage: React.FC = () => {
  return (
    <>
      {/* Optional: set custom header for 404 */}
      <Stack.Screen options={{ title: "Page Not Found" }} />
      
      <View style={styles.container}>
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>Oops! The page you are looking for does not exist.</Text>

        <TouchableOpacity style={styles.button} onPress={() => {
          // Navigate back to home/root
          // Expo Router navigation using "router"
          import("expo-router").then(({ useRouter }) => {
            const router = useRouter();
            router.replace("/");
          });
        }}>
          <Text style={styles.buttonText}>Go Back Home</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default NotFoundPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fefefe",
  },
  title: {
    fontSize: 96,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  subtitle: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginVertical: 16,
  },
  button: {
    marginTop: 24,
    backgroundColor: "#3498db",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
