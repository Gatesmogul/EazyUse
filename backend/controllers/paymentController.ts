import { Request, Response } from "express";
import {
   createStripePayment, 
   verifyPaystackPayment,
    recordTransaction 
  } from "backend/services/paymentService";
import { getUserById } from "../backend/models/User";

export const createPayment = async (req: Request, res: Response) => {
  const { userId, amount, currency, provider } = req.body;

  const user = await getUserById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  try {
    if (provider === "stripe") {
      const session = await createStripePayment(user, amount, currency);
      await recordTransaction(userId, amount, currency, "stripe", session.id);
      return res.status(200).json({ session });
    } else if (provider === "paystack") {
      // Paystack flow handled on frontend inline
      return res.status(200).json({ message: "Paystack ready" });
    } else {
      return res.status(400).json({ message: "Invalid provider" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Payment failed" });
  }
};
