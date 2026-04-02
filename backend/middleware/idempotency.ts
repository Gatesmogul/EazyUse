const existing = await Transaction.findOne({
  where: { reference: paymentIntent.id },
});

if (existing) {
  return res.status(200).send("Already processed");
}
