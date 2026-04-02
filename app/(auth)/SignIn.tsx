// app/(auth)/SignIn.tsx

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
import { signInWithEmailAndPassword } from "firebase/auth";

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- SIGN IN ---------------- */

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Navigate to main app
      router.replace("/(tabs)/Home");
    } catch (err: any) {
      console.log(err);
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>

          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to continue using EazyUse
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* EMAIL */}

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

          {/* PASSWORD */}

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={18} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* SIGN IN BUTTON */}

          <Pressable
            style={styles.button}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </Pressable>

          {/* FORGOT PASSWORD */}

          <Pressable onPress={() => router.push("/(auth)/ForgotPassword")}>
            <Text style={styles.link}>Forgot Password?</Text>
          </Pressable>

          {/* SIGN UP REDIRECT */}

          <Pressable onPress={() => router.push("/(auth)/SignUp")}>
            <Text style={styles.link}>
              Don't have an account? Sign Up
            </Text>
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
    fontSize: 28,
    fontWeight: "700",
    color: "#0A2540",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
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
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  link: {
    marginTop: 14,
    textAlign: "center",
    color: "#007BFF",
    fontWeight: "500",
  },

  error: {
    color: "red",
    marginBottom: 10,
  },

}); 
