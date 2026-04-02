import { api } from "./api";

export const releaseEscrow = async (transactionId: string) => {
  try {
    const response = await api.post("/api/release-escrow", {
      transactionId,
    });

    return response.data;
  } catch (error) {
    console.error("Escrow error:", error);
    throw error;
  }
};