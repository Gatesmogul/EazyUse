// backend/stripeWebhook.ts
import express, { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { sendPaymentReceipt } from "Types/emailService";

dotenv.config();

const app = express();

/* ================== Validate ENV variables ================== */
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

if (!STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY in environment variables");
}

if (!STRIPE_WEBHOOK_SECRET) {
  throw new Error("Missing STRIPE_WEBHOOK_SECRET in environment variables");
}

/* ================== Initialize Stripe ================== */
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2026-02-25.clover",
});

/* ================== Webhook Endpoint ================== */
app.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"];

    if (!signature || typeof signature !== "string") {
      return res.status(400).send("Missing Stripe signature");
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Webhook verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
      return res.status(400).send("Webhook verification failed");
    }

    /* ================== Handle Successful Payment ================== */
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      console.log("✅ Payment succeeded:", paymentIntent.id);

      // Extract customer email from Stripe object
      const customerEmail =
        paymentIntent.receipt_email || paymentIntent.metadata?.customerEmail;

      if (customerEmail) {
        try {
          await sendPaymentReceipt(
            customerEmail,
            (paymentIntent.amount_received || paymentIntent.amount || 0) / 100,
            (paymentIntent.currency || "USD").toUpperCase()
          );

          console.log("📧 Receipt email sent to:", customerEmail);
        } catch (emailError: unknown) {
          if (emailError instanceof Error) {
            console.error("Failed to send receipt email:", emailError.message);
          }
        }
      }

      // TODO:
      // 1. Update transaction in your database
      // 2. Mark payment as successful
      // 3. Credit wallet balance
    }

    res.json({ received: true });
  }
);

/* ================== Start Server ================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Stripe webhook server running on port ${PORT}`);
});