import { DataTypes } from "sequelize";

export const Transaction = sequelize.define("Transaction", {
  id: { type: DataTypes.UUID, primaryKey: true },
  userId: DataTypes.UUID,
  amount: DataTypes.FLOAT,
  currency: DataTypes.STRING,
  provider: DataTypes.STRING, // stripe or paystack
  reference: { type: DataTypes.STRING, unique: true },
  status: DataTypes.STRING,
});
