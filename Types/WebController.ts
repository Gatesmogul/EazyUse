export const requestWithdrawal = async (userId, amount) => {
  const wallet = await Wallet.findOne({ where: { userId } });

  if (wallet.balance < amount) {
    throw new Error("Insufficient balance");
  }

  await sequelize.transaction(async (t) => {
    await wallet.decrement(
      { balance: amount },
      { transaction: t }
    );

    await Withdrawal.create(
      { userId, amount },
      { transaction: t }
    );
  });
};
