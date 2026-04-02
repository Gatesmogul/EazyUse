await Wallet.increment(
  { balance: amount },
  { where: { userId: professionalId } }
);
