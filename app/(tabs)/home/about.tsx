import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LineChart, BarChart } from "react-native-chart-kit";
import LiveTicker from "../../../components/LiveTicker";

const screenWidth = Dimensions.get("window").width;

type Testimonial = {
  name: string;
  text: string;
};

export default function About() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const testimonials: Testimonial[] = [
    { name: "GlobalTech Inc.", text: "EazyUse transformed how we manage international contractors." },
    { name: "FinEdge UK", text: "Payments and task management in one ecosystem? Game changer." },
    { name: "NovaScale Canada", text: "Borderless collaboration has never been this seamless." },
  ];

  useEffect(() => {
    // Fade in effect
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Testimonial rotation
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <LinearGradient colors={["#0A2540", "#007BFF"]} style={styles.hero}>
        <Text style={styles.heroTitle}>EazyUse</Text>
        <Text style={styles.heroSubtitle}>Infrastructure for Borderless Work</Text>
      </LinearGradient>

      {/* Platform Growth Line Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Platform Growth</Text>
        <LineChart
          data={{
            labels: ["2021", "2022", "2023", "2024", "2025"],
            datasets: [{ data: [1, 3, 5, 8, 10] }],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="$"
          yAxisSuffix="M"
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Revenue Bar Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Revenue Processed</Text>
        <BarChart
          data={{
            labels: ["Q1", "Q2", "Q3", "Q4"],
            datasets: [{ data: [50, 90, 140, 250] }],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="$"
          yAxisSuffix="M"
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>

      {/* Testimonials Carousel */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What Enterprises Say</Text>
        <Animated.View style={[styles.testimonialCard, { opacity: fadeAnim }]}>
          <Text style={styles.testimonialText}>
            "{testimonials[testimonialIndex].text}"
          </Text>
          <Text style={styles.testimonialAuthor}>
            — {testimonials[testimonialIndex].name}
          </Text>
        </Animated.View>
      </View>

      {/* Company Timeline */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Journey</Text>
        {[
          { year: "2021", text: "EazyUse founded with a vision for global fintech infrastructure." },
          { year: "2023", text: "Expanded operations across 50+ countries." },
          { year: "2025", text: "Reached 10M+ users and $250M+ processed revenue." },
        ].map((item) => (
          <View key={item.year} style={styles.timelineItem}>
            <Text style={styles.timelineYear}>{item.year}</Text>
            <Text style={styles.timelineText}>{item.text}</Text>
          </View>
        ))}
      </View>

      {/* Global Offices */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Global Presence</Text>
        <View style={styles.mapCard}>
          <Text style={styles.mapText}>
            🌍 Offices in New York | London | Lagos | Toronto | Singapore | Germany | Netherlands | France | UAE | China
          </Text>
        </View>
      </View>

      {/* CEO Message */}
      <View style={styles.ceoCard}>
        <Text style={styles.sectionTitle}>Message from the CEO</Text>
        <Text style={styles.description}>
          “We are building more than a fintech product — we are building the
          operating system for global collaboration. EazyUse eliminates
          complexity so enterprises and professionals can scale without borders.”
        </Text>
        <Text style={styles.ceoName}>— Adekunle Gates</Text>
      </View>

      {/* Live Ticker */}
      <View style={{ marginVertical: 20 }}>
        <LiveTicker />
      </View>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#FFFFFF",
  backgroundGradientTo: "#FFFFFF",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
  labelColor: () => "#64748B",
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F9" },
  hero: { paddingVertical: 60, paddingHorizontal: 20 },
  heroTitle: { fontSize: 32, fontWeight: "bold", color: "#FFF" },
  heroSubtitle: { fontSize: 16, color: "#E0F2FF", marginTop: 10 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#0A2540", marginBottom: 15 },
  chart: { borderRadius: 16 },
  testimonialCard: { backgroundColor: "#FFF", padding: 20, borderRadius: 16, elevation: 5 },
  testimonialText: { fontSize: 16, color: "#334155" },
  testimonialAuthor: { marginTop: 10, fontWeight: "bold", color: "#007BFF" },
  timelineItem: { marginBottom: 15 },
  timelineYear: { fontWeight: "bold", color: "#007BFF" },
  timelineText: { color: "#334155" },
  mapCard: { backgroundColor: "#FFF", padding: 20, borderRadius: 16, elevation: 5 },
  mapText: { fontSize: 16, color: "#334155" },
  ceoCard: { margin: 20, padding: 20, backgroundColor: "#FFF", borderRadius: 16, elevation: 5 },
  description: { fontSize: 16, color: "#334155", lineHeight: 24 },
  ceoName: { marginTop: 15, fontWeight: "bold", color: "#0A2540" },
});