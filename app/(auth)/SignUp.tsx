// app/(auth)/SignUp.tsx

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

import { auth, db } from "../../backend/services/firebase";
import {
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function SignUp() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "professional">("customer");

  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- VALIDATION ---------------- */
  const isValidEmail = (email: string) =>
    /\S+@\S+\.\S+/.test(email);

  /* ---------------- SIGN UP ---------------- */
  const handleSignUp = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Enter a valid email");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ✅ Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCredential.user;

      // ✅ Save user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        fullName,
        email,
        role,
        createdAt: serverTimestamp(),
        kycStatus: "unverified",
        profileImage: "",
      });

      // ✅ Navigate to app
      router.replace("/(tabs)/Home");

    } catch (err: any) {
      console.log(err);

      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Email already in use");
          break;
        case "auth/invalid-email":
          setError("Invalid email");
          break;
        case "auth/weak-password":
          setError("Weak password");
          break;
        default:
          setError("Signup failed. Try again.");
      }
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

          {/* HEADER */}
          <Text style={styles.title}>Create Account 🚀</Text>
          <Text style={styles.subtitle}>
            Join EazyUse and get started
          </Text>

          {/* ERROR */}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* FULL NAME */}
          <View style={styles.inputBox}>
            <Ionicons name="person-outline" size={18} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                setError("");
              }}
            />
          </View>

          {/* EMAIL */}
          <View style={styles.inputBox}>
            <Ionicons name="mail-outline" size={18} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError("");
              }}
            />
          </View>

          {/* PASSWORD */}
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={18} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={secure}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError("");
              }}
            />
            <Pressable onPress={() => setSecure(!secure)}>
              <Ionicons
                name={secure ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#6B7280"
              />
            </Pressable>
          </View>

          {/* ROLE SELECTION */}
          <View style={styles.roleContainer}>
            <Pressable
              style={[
                styles.roleBtn,
                role === "customer" && styles.activeRole,
              ]}
              onPress={() => setRole("customer")}
            >
              <Text
                style={[
                  styles.roleText,
                  role === "customer" && styles.activeRoleText,
                ]}
              >
                Customer
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.roleBtn,
                role === "professional" && styles.activeRole,
              ]}
              onPress={() => setRole("professional")}
            >
              <Text
                style={[
                  styles.roleText,
                  role === "professional" && styles.activeRoleText,
                ]}
              >
                Professional
              </Text>
            </Pressable>
          </View>

          {/* SIGN UP BUTTON */}
          <Pressable
            style={[
              styles.button,
              loading && { opacity: 0.6 },
            ]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </Pressable>

          {/* LOGIN LINK */}
          <Pressable onPress={() => router.push("/(auth)/SignIn")}>
            <Text style={styles.link}>
              Already have an account? Sign In
            </Text>
          </Pressable>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F6F8" },

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    elevation: 4,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0A2540",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 14,
  },

  input: { flex: 1, padding: 12 },

  roleContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 10,
  },

  roleBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
  },

  activeRole: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  roleText: { color: "#374151", fontWeight: "500" },

  activeRoleText: { color: "#fff" },

  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  link: {
    marginTop: 14,
    textAlign: "center",
    color: "#2563EB",
    fontWeight: "500",
  },

  error: {
    color: "#DC2626",
    marginBottom: 10,
  },
});