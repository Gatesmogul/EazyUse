import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { auth, db } from "backend/services/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
}

export default function Reviews() {
  const user = auth.currentUser;
  const professionalId = user?.uid;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [ratingBreakdown, setRatingBreakdown] = useState<number[]>([0, 0, 0, 0, 0]);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH REVIEWS ================= */

  const fetchReviews = async () => {
    if (!professionalId) return;

    const q = query(
      collection(db, "reviews"),
      where("professionalId", "==", professionalId)
    );

    const snapshot = await getDocs(q);

    const fetched: Review[] = [];
    let total = 0;
    let breakdown = [0, 0, 0, 0, 0];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      total += data.rating;
      breakdown[data.rating - 1]++;

      fetched.push({
        id: docSnap.id,
        reviewerId: data.reviewerId,
        reviewerName: data.reviewerName,
        rating: data.rating,
        comment: data.comment,
        isVerifiedPurchase: data.isVerifiedPurchase,
      });
    });

    setReviews(fetched);
    setAverageRating(fetched.length ? total / fetched.length : 0);
    setRatingBreakdown(breakdown.reverse()); // 5⭐ first
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  /* ================= CHECK VERIFIED PAYMENT ================= */

  const hasSuccessfulPayment = async () => {
    if (!user) return false;

    const q = query(
      collection(db, "payments"),
      where("professionalId", "==", professionalId),
      where("customerId", "==", user.uid),
      where("status", "==", "success")
    );

    const snapshot = await getDocs(q);
    return !snapshot.empty;
  };

  /* ================= PREVENT DUPLICATE REVIEW ================= */

  const hasReviewed = async () => {
    if (!user) return false;

    const q = query(
      collection(db, "reviews"),
      where("professionalId", "==", professionalId),
      where("reviewerId", "==", user.uid)
    );

    const snapshot = await getDocs(q);
    return !snapshot.empty;
  };

  /* ================= SUBMIT / UPDATE ================= */

  const submitReview = async () => {
    if (!user || rating === 0) {
      Alert.alert("Please select a rating");
      return;
    }

    const verified = await hasSuccessfulPayment();

    if (!verified) {
      Alert.alert("You can only review after successful payment.");
      return;
    }

    if (!editingReviewId && (await hasReviewed())) {
      Alert.alert("You already submitted a review.");
      return;
    }

    try {
      if (editingReviewId) {
        await updateDoc(doc(db, "reviews", editingReviewId), {
          rating,
          comment,
        });
        setEditingReviewId(null);
      } else {
        await addDoc(collection(db, "reviews"), {
          professionalId,
          reviewerId: user.uid,
          reviewerName: user.displayName || "Anonymous",
          rating,
          comment,
          isVerifiedPurchase: true,
          createdAt: serverTimestamp(),
        });
      }

      setRating(0);
      setComment("");
      fetchReviews();
    } catch {
      Alert.alert("Error submitting review");
    }
  };

  /* ================= DELETE REVIEW ================= */

  const deleteReviewHandler = async (id: string) => {
    Alert.alert("Delete Review?", "This cannot be undone.", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "reviews", id));
          fetchReviews();
        },
      },
    ]);
  };

  /* ================= STAR RENDER ================= */

  const renderStars = (selected: number, interactive = false) => (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          disabled={!interactive}
          onPress={() => setRating(star)}
        >
          <Text
            style={[
              styles.star,
              star <= selected && styles.starSelected,
            ]}
          >
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  /* ================= UI ================= */

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Professional Reviews</Text>

      {/* SUMMARY */}
      <View style={styles.summaryCard}>
        <Text style={styles.average}>
          {averageRating.toFixed(1)} / 5.0
        </Text>
        {renderStars(Math.round(averageRating))}
        <Text>{reviews.length} Reviews</Text>

        {/* Rating Breakdown */}
        {ratingBreakdown.map((count, index) => (
          <Text key={index}>
            {5 - index}⭐ — {count}
          </Text>
        ))}
      </View>

      {/* Review Form */}
      <View style={styles.reviewBox}>
        {renderStars(rating, true)}

        <TextInput
          style={styles.input}
          placeholder="Write your review..."
          multiline
          value={comment}
          onChangeText={setComment}
        />

        <TouchableOpacity style={styles.button} onPress={submitReview}>
          <Text style={styles.buttonText}>
            {editingReviewId ? "Update Review" : "Submit Review"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Reviews List */}
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <Text style={styles.reviewer}>
              {item.reviewerName}{" "}
              {item.isVerifiedPurchase && (
                <Text style={styles.verified}>✔ Verified</Text>
              )}
            </Text>

            {renderStars(item.rating)}

            <Text>{item.comment}</Text>

            {item.reviewerId === user?.uid && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  onPress={() => {
                    setEditingReviewId(item.id);
                    setRating(item.rating);
                    setComment(item.comment);
                  }}
                >
                  <Text style={styles.edit}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => deleteReviewHandler(item.id)}
                >
                  <Text style={styles.delete}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F7FA" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 15 },
  summaryCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  average: { fontSize: 28, fontWeight: "700" },
  starRow: { flexDirection: "row", marginVertical: 5 },
  star: { fontSize: 22, color: "#D1D5DB", marginHorizontal: 3 },
  starSelected: { color: "#FBBF24" },
  reviewBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    minHeight: 80,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700" },
  reviewCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  reviewer: { fontWeight: "600" },
  verified: { color: "green", fontWeight: "600" },
  actionRow: { flexDirection: "row", marginTop: 10 },
  edit: { marginRight: 15, color: "#2563EB" },
  delete: { color: "red" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});
