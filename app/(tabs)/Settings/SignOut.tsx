// File: app/(tabs)/Settings/SignOut.tsx
import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Button, ActivityIndicator } from "react-native-paper";
import { auth } from "@services/firebase"; // firebase auth service

import LottieView from "lottie-react-native";
// import successAnimationData from "@/assets/animations/success.json";
// import failureAnimationData from "@/assets/animations/failure.json";

const { width } = Dimensions.get("window");

const SignOut: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "failure">("idle");

  const successAnimation = useRef<LottieView>(null);
  const failureAnimation = useRef<LottieView>(null);

  // Device name for logging purposes
  const deviceName = Platform.OS === "web" ? "Web Browser" : "Mobile Device";

  const handleSignOut = async () => {
    setLoading(true);
    setStatus("idle");

    try {
      await auth.signOut(); // Firebase sign out
      setStatus("success");
      successAnimation.current?.play();

      setTimeout(() => {
        router.replace("../(auth)/SignIn");
      }, 3000); // auto-navigate after 3s
    } catch (error) {
      console.error("Sign out error:", error);
      setStatus("failure");
      failureAnimation.current?.play();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Sign Out" }} />

      <View style={styles.content}>
        {status === "idle" && (
          <>
            <Text style={styles.title}>Are you ready to log out?</Text>
            <Text style={styles.subtitle}>
              Logging out will end your session on this device.
            </Text>

            {loading ? (
              <ActivityIndicator size="large" color="#3498db" style={{ marginTop: 24 }} />
            ) : (
              <>
                <Button
                  mode="contained"
                  onPress={handleSignOut}
                  style={styles.signOutButton}
                  contentStyle={{ paddingVertical: 12 }}
                >
                  Sign Out
                </Button>

                <Button
                  mode="outlined"
                  onPress={() => router.back()}
                  style={styles.cancelButton}
                  contentStyle={{ paddingVertical: 12 }}
                >
                  Cancel
                </Button>
              </>
            )}
          </>
        )}

        {status === "success" && (
          <View style={styles.animationContainer}>
            {/* <LottieView
              ref={successAnimation}
              source={successAnimationData}
              autoPlay
              loop={false}
              style={styles.lottie}
            /> */}
            <Text style={styles.successText}>
              Sign Out Successful! 👋{"\n"}We look forward to having you again.
            </Text>
          </View>
        )}

        {status === "failure" && (
          <View style={styles.animationContainer}>
            {/* <LottieView
              ref={failureAnimation}
              source={failureAnimationData}
              autoPlay
              loop={false}
              style={styles.lottie}
            /> */}
            <Text style={styles.failureText}>
              Oops! Something went wrong. Please try again.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default SignOut;

// ================= STYLES =================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  signOutButton: {
    width: "80%",
    marginBottom: 16,
    backgroundColor: "#e74c3c",
  },
  cancelButton: {
    width: "80%",
    borderColor: "#3498db",
  },
  animationContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  lottie: {
    width: width * 0.5,
    height: width * 0.5,
  },
  successText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2ecc71",
    marginTop: 16,
    textAlign: "center",
  },
  failureText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e74c3c",
    marginTop: 16,
    textAlign: "center",
  },
});