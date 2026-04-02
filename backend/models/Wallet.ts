import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class Wallet extends Model {
  public id!: number;
  public userId!: string;
  public balance!: number;
}

Wallet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "Wallet",
  }
);