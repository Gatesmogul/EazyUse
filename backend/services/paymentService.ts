import Stripe from "stripe";
import axios from "axios";
import { prisma } from "../models/prismaClient";
import { User } from "../models/User";

/**
 * Validate ENV
 */
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;

if (!STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

/**
 * Initialize Stripe
 */
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2026-02-25.clover",
});

/**
 * Create Stripe Checkout Session
 */
export const createStripePayment = async (
  user: User,
  amount: number,
  currency: string
) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency,
          product_data: { name: "EazyUse Service Payment" },
          unit_amount: amount * 100, // convert to kobo/cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/wallet/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/wallet/failed`,
    customer_email: user.email,
  });

  return session;
};

/**
 * Verify Paystack Payment
 */
export const verifyPaystackPayment = async (reference: string) => {
  const res = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  return res.data;
};

/**
 * Record Transaction
 */
export const recordTransaction = async (
  userId: string,
  amount: number,
  currency: string,
  provider: string,
  reference: string
) => {
  return prisma.transaction.create({
    data: {
      userId,
      amount,
      currency,
      provider,
      reference,
      status: "pending",
    },
  });
};