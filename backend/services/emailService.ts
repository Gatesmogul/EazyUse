
if (event.type === "payment_intent.succeeded") {
  await sendEmail({
    to: customerEmail,
    subject: "Payment Receipt - EazyUse",
    html: "<h3>Payment Successful</h3>",
  });
}
