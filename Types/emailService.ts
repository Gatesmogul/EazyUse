// app/Types/emailService.ts
import nodemailer from "nodemailer";

export async function sendPaymentReceipt(
  customerEmail: string,
  amount: number,
  currency: string
) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP_USER or SMTP_PASS is missing in environment variables");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: "no-reply@eazyuse.com",
    to: customerEmail,
    subject: "Payment Receipt - EazyUse",
    html: `
      <h2>Payment Successful</h2>
      <p>Amount: ${amount} ${currency}</p>
    `,
  });
}