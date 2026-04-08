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

// Firebase Imports - Updated to use the professional path alias
import { auth } from "@services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

/**
 * Clean & Professional SignIn Component
 */
export default function SignIn() {
  const router = useRouter();

  // State Management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Logic: Handle Firebase Authentication
   */
  const handleSignIn = async () => {
    // 1. Basic Validation
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 2. Authenticate with Firebase
      await signInWithEmailAndPassword(auth, email.trim(), password);

      /** * 3. Navigation
       * Using replace ensures the Login screen is removed from the history stack.
       */
      router.replace("/(tabs)"); 
      
    } catch (err: any) {
      console.error("Sign-in error:", err.code);
      
      // Professional error mapping
      const friendlyError = err.code === "auth/invalid-credential" 
        ? "Invalid email or password. Please try again."
        : "An error occurred. Please check your connection.";
        
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue using EazyUse</Text>
          </View>

          {/* ERROR FEEDBACK */}
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color="#DC2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* EMAIL INPUT */}
          <View style={[styles.inputContainer, error && styles.inputError]}>
            <Ionicons name="mail-outline" size={20} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError(""); 
              }}
            />
          </View>

          {/* PASSWORD INPUT */}
          <View style={[styles.inputContainer, error && styles.inputError]}>
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError("");
              }}
            />
          </View>

          {/* SIGN IN ACTION */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              loading && styles.buttonDisabled,
            ]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </Pressable>

          {/* FOOTER NAVIGATION */}
          <View style={styles.footer}>
            <Pressable onPress={() => router.push("/(auth)/ForgotPassword")}>
              <Text style={styles.link}>Forgot Password?</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/(auth)/SignUp")}>
              <Text style={styles.footerText}>
                Don't have an account? <Text style={styles.link}>Sign Up</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 4,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF1F2",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: "#FECDD3",
  },
  errorText: {
    color: "#BE123C",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#F8FAFC",
  },
  inputError: {
    borderColor: "#FDA4AF",
    backgroundColor: "#FFF1F2",
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    marginLeft: 12,
    fontSize: 16,
    color: "#1E293B",
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    backgroundColor: "#94A3B8",
    shadowOpacity: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
    gap: 18,
  },
  footerText: {
    fontSize: 14,
    color: "#64748B",
  },
  link: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "700",
  },
});