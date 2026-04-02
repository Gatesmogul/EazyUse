import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../../../backend/services/firebase";

interface User {
  id: string;
  fullName: string;
  email: string;
  country: string;
  role: "professional" | "customer" | "business";
  profileImage?: string;
  kycStatus: "verified" | "pending" | "unverified";
}

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  /* ===============================
     🔥 FETCH USER PROFILE
  ================================= */
  const fetchUser = async () => {
    try {
      setLoading(true);

      const currentUser = auth.currentUser;

      if (!currentUser) {
        router.replace("../(auth)/SignIn");
        return;
      }

      const res = await fetch("https://api.eazyuse.com/user/profile", {
        headers: {
          Authorization: `Bearer ${await currentUser.getIdToken()}`,
        },
      });

      const data = await res.json();

      setUser(data);
    } catch (error) {
      console.error("Profile fetch error:", error);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     🔥 UPLOAD PROFILE IMAGE
  ================================= */
  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permission required to access gallery");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (!result.canceled && user) {
        setUploading(true);

        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();

        const storageRef = ref(storage, `profiles/${user.id}.jpg`);

        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);

        await fetch("https://api.eazyuse.com/user/update-profile-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: downloadURL }),
        });

        setUser({ ...user, profileImage: downloadURL });

        Alert.alert("Success", "Profile image updated");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ===============================
     🔥 LOGOUT
  ================================= */
  const logout = async () => {
    try {
      await auth.signOut();
      router.replace("../(auth)/SignIn");
    } catch (error) {
      Alert.alert("Error", "Logout failed");
    }
  };

  /* ===============================
     🔥 LOADING STATE
  ================================= */
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loaderContainer}>
        <Text>No profile found</Text>
      </View>
    );
  }

  /* ===============================
     🔥 UI
  ================================= */
  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{
              uri:
                user.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={styles.avatar}
          />
          {uploading && (
            <ActivityIndicator style={styles.uploading} size="small" />
          )}
        </TouchableOpacity>

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user.fullName}</Text>

            {user.kycStatus === "verified" && (
              <Ionicons
                name="checkmark-circle"
                size={18}
                color="#16A34A"
              />
            )}
          </View>

          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.role}>{user.role.toUpperCase()}</Text>

          <Text
            style={[
              styles.kyc,
              user.kycStatus === "verified"
                ? styles.verified
                : user.kycStatus === "pending"
                ? styles.pending
                : styles.unverified,
            ]}
          >
            KYC: {user.kycStatus.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* EDIT */}
      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => router.push("./edit")}
      >
        <Text style={styles.editText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* SETTINGS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Security</Text>

        <TouchableOpacity style={styles.item}>
          <Text>Change Password</Text>
          <Ionicons name="chevron-forward" size={18} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Text>Two-Factor Authentication</Text>
          <Ionicons name="chevron-forward" size={18} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.item, { borderBottomWidth: 0 }]}
          onPress={logout}
        >
          <Text style={{ color: "#DC2626" }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ===============================
   STYLES
================================ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FB", padding: 16 },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  uploading: {
    position: "absolute",
    top: 35,
    left: 35,
  },

  info: {
    marginLeft: 15,
    flex: 1,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },

  email: {
    color: "#666",
    marginTop: 4,
  },

  role: {
    marginTop: 4,
    color: "#2563EB",
    fontWeight: "600",
  },

  kyc: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
  },

  verified: { color: "#16A34A" },
  pending: { color: "#F59E0B" },
  unverified: { color: "#DC2626" },

  editBtn: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },

  editText: {
    color: "#fff",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },

  sectionTitle: {
    fontWeight: "600",
    marginBottom: 10,
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});