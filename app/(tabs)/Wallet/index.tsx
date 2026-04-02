import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: "success" | "pending" | "failed";
}

export default function WalletScreen() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    const res = await fetch("https://api.eazyuse.com/wallet");
    const data = await res.json();
    setBalance(data.balance);
    setTransactions(data.transactions);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EazyUse Wallet</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
      </View>

      <TouchableOpacity
        style={styles.payButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.payText}>Pay Professional</Text>
      </TouchableOpacity>

      <Text style={styles.historyTitle}>Recent Transactions</Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.txCard}>
            <Text>{item.currency} {item.amount}</Text>
            <Text>{item.status}</Text>
          </View>
        )}
      />

      <PaymentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

function PaymentModal({ visible, onClose }: any) {
  const router = useRouter();
  const [currency, setCurrency] = useState("USD");

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Choose Payment Option</Text>

        <TouchableOpacity
          style={styles.option}
          onPress={() =>
            router.push({
              pathname: "../checkout/stripe",
              params: { currency },
            })
          }
        >
          <Text>Pay Now (Stripe)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() =>
            router.push({
              pathname: "../checkout/paystack",
              params: { currency },
            })
          }
        >
          <Text>Pay Now (Paystack)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text>Pay Later (Generate Invoice)</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose}>
          <Text style={{ color: "red", marginTop: 20 }}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F9FAFB" },
  title: { fontSize: 22, fontWeight: "700" },
  balanceCard: {
    backgroundColor: "#111827",
    padding: 20,
    borderRadius: 15,
    marginVertical: 20,
  },
  balanceLabel: { color: "#9CA3AF" },
  balanceAmount: { color: "#fff", fontSize: 28, fontWeight: "800" },
  payButton: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  payText: { color: "#fff", fontWeight: "600" },
  historyTitle: { marginTop: 30, fontWeight: "600" },
  txCard: {
    padding: 15,
    backgroundColor: "#fff",
    marginTop: 10,
    borderRadius: 10,
  },
  modalContainer: { flex: 1, padding: 20 },
  option: {
    padding: 15,
    backgroundColor: "#F3F4F6",
    marginTop: 15,
    borderRadius: 10,
  },
});
