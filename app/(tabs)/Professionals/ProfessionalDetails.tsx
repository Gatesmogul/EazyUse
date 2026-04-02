// app/(tabs)/Professionals/ProfessionalDetails.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type Professional = {
  id: string;
  name: string;
  country: string;
  sector: string;
  rating: number;
  reviews: number;
  online: boolean;
  price: number;
  availability: string[];
};

// Mock data
const mockProfessionals: Professional[] = [
  {
    id: "1",
    name: "David Johnson",
    country: "Nigeria",
    sector: "Legal",
    rating: 4.9,
    reviews: 120,
    online: true,
    price: 150,
    availability: ["Mon", "Wed", "Fri"],
  },
  {
    id: "2",
    name: "Sophia Lee",
    country: "UK",
    sector: "Accounting",
    rating: 4.7,
    reviews: 89,
    online: false,
    price: 200,
    availability: ["Tue", "Thu"],
  },
];

/* ---------------- PROFESSIONAL DETAILS ---------------- */
export const ProfessionalDetails = ({ professional }: { professional: Professional }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{professional.name}</Text>
      <Text>Country: {professional.country}</Text>
      <Text>Sector: {professional.sector}</Text>
      <Text>Rating: {professional.rating} ({professional.reviews} reviews)</Text>
      <Text>Price: ${professional.price}</Text>
      <Text>Availability: {professional.availability.join(", ")}</Text>
      <Text>Status: {professional.online ? "Online" : "Offline"}</Text>
    </View>
  );
};

/* ---------------- PROFESSIONALS LIST ---------------- */
export const Professionals = () => {
  const router = useRouter();

  const handlePress = (professional: Professional) => {
    router.push({
      pathname: "/app/(tabs)/Professionals/ProfessionalDetails",
      params: { id: professional.id, name: professional.name },
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mockProfessionals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.sector}</Text>
            <Text>{item.country}</Text>
            <Ionicons
              name={item.online ? "ellipse" : "ellipse-outline"}
              size={16}
              color={item.online ? "green" : "gray"}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  card: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
});