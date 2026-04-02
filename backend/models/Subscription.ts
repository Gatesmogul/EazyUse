// models/Subscription.ts
import { DataTypes } from "sequelize";

export const Subscription = sequelize.define("Subscription", {
  id: { type: DataTypes.UUID, primaryKey: true },
  professionalId: DataTypes.UUID,
  plan: DataTypes.STRING, // basic, pro, elite
  status: { type: DataTypes.STRING, defaultValue: "active" }, // active, canceled, expired
  startDate: DataTypes.DATE,
  endDate: DataTypes.DATE,
});
