//app/(tabs)/Home/[taskId].tsx
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  Modal,
  TextInput,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../../backend/services/firebase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/* ================================
   🔥 FAKE AUTH ROLE (Replace later)
================================ */

type Role = "business" | "freelancer";
const currentUser = {
  id: "user123",
  name: "Ade Developer",
  role: "freelancer" as Role,
};

/* ================================
   🔥 SCREEN
================================ */

export default function TaskDetails() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const queryClient = useQueryClient();

  const [proposalModal, setProposalModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [proposals, setProposals] = useState<any[]>([]);

  /* ================================
     🔥 Fetch Task (React Query)
  ================================= */

  const { data: task, refetch, isRefetching } = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const snap = await getDoc(doc(db, "tasks", taskId!));
      return snap.data();
    },
  });

  /* ================================
     🔥 Real-time Proposal Listener
  ================================= */

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "tasks", taskId!, "proposals"),
      (snapshot) => {
        const liveProposals = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProposals(liveProposals);
      }
    );

    return () => unsub();
  }, [taskId]);

  /* ================================
     🔥 Optimistic Bookmark Mutation
  ================================= */

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      const taskRef = doc(db, "tasks", taskId!);

      const alreadyBookmarked =
        task?.bookmarks?.includes(currentUser.id);

      await updateDoc(taskRef, {
        bookmarks: alreadyBookmarked
          ? arrayRemove(currentUser.id)
          : arrayUnion(currentUser.id),
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["task", taskId] });

      const previous = queryClient.getQueryData(["task", taskId]);

      queryClient.setQueryData(["task", taskId], (old: any) => ({
        ...old,
        bookmarks: old.bookmarks?.includes(currentUser.id)
          ? old.bookmarks.filter((id: string) => id !== currentUser.id)
          : [...(old.bookmarks || []), currentUser.id],
      }));

      return { previous };
    },
    onError: (_, __, context: any) => {
      queryClient.setQueryData(["task", taskId], context.previous);
    },
  });

  /* ================================
     🔥 Submit Proposal
  ================================= */

  const submitProposal = async () => {
    await addDoc(
      collection(db, "tasks", taskId!, "proposals"),
      {
        freelancerId: currentUser.id,
        freelancerName: currentUser.name,
        coverLetter,
        bidAmount: Number(bidAmount),
        createdAt: new Date(),
      }
    );

    setProposalModal(false);
    setCoverLetter("");
    setBidAmount("");
  };

  /* ================================
     🔥 Escrow Payment Integration (Stripe-ready)
  ================================= */

  const handleEscrowPayment = async () => {
    // This would call backend:
    // POST /create-escrow-intent
    // Return Stripe client secret
    alert("Escrow payment flow initiated (Connect Stripe backend).");
  };

  if (!task) return null;

  const isBookmarked =
    task.bookmarks?.includes(currentUser.id);

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
          />
        }
      >
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.budget}>${task.budget}</Text>

        <Text style={styles.proposalCount}>
          {proposals.length} Live Proposals
        </Text>

        {/* Role-based visibility */}
        {currentUser.role === "business" && (
          <>
            <Text style={styles.sectionTitle}>
              Applicants
            </Text>
            {proposals.map((p) => (
              <View key={p.id} style={styles.card}>
                <Text>{p.freelancerName}</Text>
                <Text>Bid: ${p.bidAmount}</Text>

                <Pressable
                  style={styles.escrowButton}
                  onPress={handleEscrowPayment}
                >
                  <Text style={{ color: "#fff" }}>
                    Fund Escrow
                  </Text>
                </Pressable>
              </View>
            ))}
          </>
        )}

        {currentUser.role === "freelancer" &&
          task.status === "Open" && (
            <Pressable
              style={styles.primaryButton}
              onPress={() => setProposalModal(true)}
            >
              <Text style={{ color: "#fff" }}>
                Submit Proposal
              </Text>
            </Pressable>
          )}

        <Pressable
          onPress={() => bookmarkMutation.mutate()}
        >
          <Text style={styles.bookmark}>
            {isBookmarked ? "★ Saved" : "☆ Save"}
          </Text>
        </Pressable>
      </ScrollView>

      {/* Proposal Modal */}
      <Modal visible={proposalModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.sectionTitle}>
            Submit Proposal
          </Text>

          <TextInput
            placeholder="Your cover letter"
            value={coverLetter}
            onChangeText={setCoverLetter}
            style={styles.input}
            multiline
          />

          <TextInput
            placeholder="Your bid amount"
            value={bidAmount}
            onChangeText={setBidAmount}
            style={styles.input}
            keyboardType="numeric"
          />

          <Pressable
            style={styles.primaryButton}
            onPress={submitProposal}
          >
            <Text style={{ color: "#fff" }}>
              Submit
            </Text>
          </Pressable>

          <Pressable onPress={() => setProposalModal(false)}>
            <Text style={{ marginTop: 20 }}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

/* ================================
   🔥 STYLES
================================ */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "700" },
  budget: { fontSize: 18, marginVertical: 10 },
  proposalCount: { fontWeight: "600", marginBottom: 16 },
  sectionTitle: { fontWeight: "700", marginTop: 20 },
  card: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  escrowButton: {
    backgroundColor: "#16a34a",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  bookmark: {
    marginTop: 20,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginTop: 15,
    borderRadius: 8,
  },
});
