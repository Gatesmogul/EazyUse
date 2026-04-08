import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";

import RNPickerSelect from "react-native-picker-select";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import * as ImagePicker from "expo-image-picker";
import { ImageSourcePropType } from "react-native";

import { auth, db, storage } from "@services/firebase";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import ProfilePlaceholder from "@assets/profile-placeholder.png"; //* ✅ FIXED IMAGE PATH */

export default function EditProfile() {  
const user = auth.currentUser;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  /* ================= FETCH USER ================= */

  useEffect(() => {
    const fetchUser = async () => {

      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {

        const data = snap.data();

        setFullName(data.fullName || "");
        setPhone(data.phone || "");
        setCountry(data.country || "");
        setProfileImage(data.profileImage || null);
      }
    };

    fetchUser();

  }, []);

  /* ================= PROFILE COMPLETION ================= */

  const profileCompletion = useMemo(() => {

    let completed = 0;

    if (fullName) completed++;
    if (phone) completed++;
    if (country) completed++;
    if (profileImage) completed++;

    return Math.floor((completed / 4) * 100);

  }, [fullName, phone, country, profileImage]);

  /* ================= VALIDATION ================= */

  const validate = () => {

    const newErrors: any = {};

    if (!fullName) newErrors.fullName = "Full name is required";
    if (!country) newErrors.country = "Country is required";

    const phoneNumber = parsePhoneNumberFromString(phone || "");

    if (!phoneNumber?.isValid()) {
      newErrors.phone = "Invalid phone number";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ================= PHONE FORMAT ================= */

  const handlePhoneChange = (value: string) => {

    const phoneNumber = parsePhoneNumberFromString(value);

    if (phoneNumber) {
      setPhone(phoneNumber.formatInternational());
    } else {
      setPhone(value);
    }
  };

  /* ================= IMAGE PICK ================= */

  const pickImage = async () => {

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {

    if (!user) return null;

    const blob = await (await fetch(uri)).blob();

    const storageRef = ref(storage, `profile/${user.uid}.jpg`);

    await uploadBytes(storageRef, blob);

    return await getDownloadURL(storageRef);
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {

    if (!validate() || !user) return;

    try {

      setLoading(true);

      let imageUrl = profileImage;

      if (profileImage?.startsWith("file")) {
        imageUrl = await uploadImage(profileImage);
      }

      await updateDoc(doc(db, "users", user.uid), {
        fullName,
        phone,
        country,
        profileImage: imageUrl || "",
        updatedAt: new Date(),
      });

      Alert.alert("Success", "Profile updated");

    } catch {

      Alert.alert("Error updating profile");

    } finally {

      setLoading(false);
    }
  };

  /* ================= IMAGE SOURCE ================= */




 // const imageSource: ImageSourcePropType = profileImage
  // ? { uri: profileImage }
  // : require("@/assets/profile-placeholder.png");


  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>Edit Profile</Text>

      {/* PROFILE IMAGE */}
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={ProfilePlaceholder}
          style={styles.avatar}
        />
      </TouchableOpacity>

      {/* PROFILE COMPLETION */}
      <Text style={styles.completion}>
        Profile Completion: {profileCompletion}%
      </Text>

      {/* FULL NAME */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />

      {errors.fullName && (
        <Text style={styles.error}>
          {errors.fullName}
        </Text>
      )}

      {/* PHONE */}
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={handlePhoneChange}
        keyboardType="phone-pad"
      />

      {errors.phone && (
        <Text style={styles.error}>
          {errors.phone}
        </Text>
      )}

      {/* COUNTRY SELECT */}
      <RNPickerSelect
        onValueChange={(value) => setCountry(value)}
        items={[
          { label: "Nigeria", value: "Nigeria" },
          { label: "United States", value: "USA" },
          { label: "United Kingdom", value: "UK" }
        ]}
        style={pickerStyles}
        placeholder={{
          label: "Select Country",
          value: null
        }}
      />

      {/* SAVE BUTTON */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Save Changes
          </Text>
        )}
      </TouchableOpacity>

    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({

  container: {
    padding: 20,
    backgroundColor: "#F5F7FA"
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignSelf: "center",
    marginBottom: 20
  },

  completion: {
    marginTop: 10,
    fontWeight: "600"
  },

  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginTop: 12
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center"
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700"
  },

  error: {
    color: "red",
    marginTop: 4
  }

});

const pickerStyles = {

  inputIOS: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginTop: 12
  },

  inputAndroid: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginTop: 12
  }

};