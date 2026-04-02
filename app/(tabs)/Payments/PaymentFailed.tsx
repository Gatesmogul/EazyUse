import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function InvestorDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Investor Metrics</Text>

      <LineChart
        data={{
          labels: ["2022", "2023", "2024", "2025"],
          datasets: [{ data: [10, 30, 55, 85] }],
        }}
        width={screenWidth - 40}
        height={220}
        yAxisLabel="$"       // ✅ Added for TypeScript safety
        yAxisSuffix="M"
        chartConfig={{
          backgroundGradientFrom: "#0A2540",
          backgroundGradientTo: "#007BFF",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
          labelColor: () => "#FFF",
        }}
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#001F3F",
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
});
