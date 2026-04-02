import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useRouter } from "expo-router";

export default function PaymentSuccess() {
  const router = useRouter();
  const scale = useSharedValue(0);

  const transactionId = "TRX-" + Date.now();
  const amount = "₦50,000.00";

  useEffect(() => {
    scale.value = withSpring(1);

    const timer = setTimeout(() => {
      router.replace("../Dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const generatePDF = async () => {
    const html = `
      <html>
        <body>
          <h2>Payment Receipt</h2>
          <p><strong>Transaction ID:</strong> ${transactionId}</p>
          <p><strong>Amount:</strong> ${amount}</p>
          <p><strong>Status:</strong> Successful</p>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  const shareReceipt = async () => {
    await Share.share({
      message: `Payment Successful!\nTransaction ID: ${transactionId}\nAmount: ${amount}`,
    });
  };

  const sendEmailReceipt = async () => {
    // Call backend API to send email
    await fetch("https://your-backend.com/send-receipt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId, amount }),
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.checkContainer, animatedStyle]}>
        <Svg width={120} height={120} viewBox="0 0 120 120">
          <Circle cx="60" cy="60" r="50" stroke="#22C55E" strokeWidth="8" fill="none" />
          <Path
            d="M40 65 L55 80 L85 45"
            stroke="#22C55E"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>

      <Text style={styles.title}>Payment Successful</Text>
      <Text style={styles.amount}>{amount}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Transaction ID</Text>
        <Text style={styles.value}>{transactionId}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={generatePDF}>
        <Text style={styles.buttonText}>Download Receipt (PDF)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={shareReceipt}>
        <Text style={styles.secondaryText}>Share Receipt</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={sendEmailReceipt}>
        <Text style={styles.secondaryText}>Email Receipt</Text>
      </TouchableOpacity>

      <Text style={styles.redirect}>Redirecting in 5 seconds...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  checkContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  amount: {
    fontSize: 28,
    fontWeight: "800",
    color: "#22C55E",
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    width: "100%",
    marginVertical: 15,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
    width: "100%",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
  },
  secondaryButton: {
    marginTop: 10,
  },
  secondaryText: {
    color: "#2563EB",
    fontWeight: "600",
  },
  redirect: {
    marginTop: 20,
    fontSize: 13,
    color: "#6B7280",
  },
});
