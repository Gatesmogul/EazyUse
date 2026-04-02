// app/(auth)/ForgotPassword.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { auth } from "../../backend/services/firebase";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /* ---------------- RESET PASSWORD ---------------- */

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await sendPasswordResetEmail(auth, email.trim());

      setSuccess(true);

      // redirect after success
      setTimeout(() => {
        router.replace("/(auth)/SignIn");
      }, 2500);

    } catch (err: any) {
      console.log(err);

      if (err.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else {
        setError("Unable to send reset email");
      }

    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SUCCESS SCREEN ---------------- */

  if (success) {
    return (
      <SafeAreaView style={styles.successContainer}>
        <Ionicons name="checkmark-circle" size={90} color="#22C55E" />

        <Text style={styles.successTitle}>Email Sent</Text>

        <Text style={styles.successText}>
          A password reset link has been sent to your email.
        </Text>

      </SafeAreaView>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >

        <View style={styles.card}>

          <Ionicons
            name="lock-open-outline"
            size={60}
            color="#007BFF"
            style={{ alignSelf: "center", marginBottom: 10 }}
          />

          <Text style={styles.title}>Forgot Password</Text>

          <Text style={styles.subtitle}>
            Enter your email to receive a password reset link.
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* EMAIL INPUT */}

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={18} color="#6B7280" />

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* RESET BUTTON */}

          <Pressable
            style={styles.button}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send Reset Link</Text>
            )}
          </Pressable>

          {/* BACK TO SIGN IN */}

          <Pressable
            style={styles.linkContainer}
            onPress={() => router.replace("/(auth)/SignIn")}
          >
            <Text style={styles.linkText}>Back to Sign In</Text>
          </Pressable>

        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 4,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0A2540",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: "#FFF",
  },

  input: {
    flex: 1,
    padding: 12,
  },

  button: {
    backgroundColor: "#007BFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  linkContainer: {
    marginTop: 16,
    alignItems: "center",
  },

  linkText: {
    color: "#007BFF",
    fontWeight: "500",
  },

  error: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },

  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
  },

  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
    color: "#0A2540",
  },

  successText: {
    marginTop: 10,
    fontSize: 15,
    textAlign: "center",
    color: "#6B7280",
  },

});